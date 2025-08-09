require('dotenv').config();

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./db.sqlite');

// ------------------- Email Setup -------------------
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com',       // your Gmail
    pass: 'your_app_password'           // your Gmail app password
  }
});

function sendReceiptEmail(to, orderSummary, total, timestamp) {
  const mailOptions = {
    from: 'your_email@gmail.com',
    to,
    subject: '🧾 Your Kaizen8 Order Receipt',
    html: `
      <h2>🧾 Order Receipt</h2>
      <p>Thank you for your order!</p>
      <p><strong>Order Date:</strong> ${timestamp}</p>
      <ul>
        ${orderSummary.map(item => `<li>${item.title} × ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</li>`).join('')}
      </ul>
      <p><strong>Total:</strong> $${total.toFixed(2)}</p>
      <p>Come again soon!</p>
    `
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('❌ Email send error:', err);
    } else {
      console.log(`✅ Email sent: ${info.response}`);
    }
  });
}

// ------------------- Apply Discounts -------------------
function applyDiscountTiers(productId) {
  db.get(`SELECT * FROM products WHERE id = ?`, [productId], (err, product) => {
    if (err) return console.error('❌ Error getting product:', err);
    const tiers = JSON.parse(product.discountTiers || '[]');
    const currentSales = product.salesCount;
    const originalPrice = product.originalPrice;

    let bestDiscount = 0;
    for (const tier of tiers) {
      if (currentSales >= tier.sales && tier.percent > bestDiscount) {
        bestDiscount = tier.percent;
      }
    }

    const newPrice = parseFloat((originalPrice * (1 - bestDiscount / 100)).toFixed(2));

    db.run(
      `UPDATE products SET price = ? WHERE id = ?`,
      [newPrice, productId],
      (err) => {
        if (err) return console.error('❌ Error updating price:', err);
        console.log(`✅ Product ${productId} now $${newPrice} (${bestDiscount}% off)`);
      }
    );
  });
}

// ------------------- Init DB -------------------
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      title TEXT,
      image TEXT,
      price REAL,
      originalPrice REAL,
      category TEXT,
      discountTiers TEXT,
      salesCount INTEGER,
      stock INTEGER,
      rank INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      address TEXT,
      orderData TEXT,
      total REAL,
      timestamp TEXT,
      orderNumber TEXT
    )
  `);
});

db.run(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    isAdmin INTEGER DEFAULT 0
  )
`);

function requireAdmin(req, res, next) {
  const userHeader = req.headers['x-user']
  if (!userHeader) return res.status(403).json({ error: 'No user provided' })

  try {
    const user = JSON.parse(userHeader)
    if (user.isAdmin) {
      next()
    } else {
      res.status(403).json({ error: 'Access denied: not admin' })
    }
  } catch (err) {
    res.status(403).json({ error: 'Invalid user format' })
  }
}

app.post('/verify-admin', (req, res) => {
  const { password } = req.body

  // Replace with environment variable later
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

  if (password === ADMIN_PASSWORD) {
    res.json({ success: true })
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized' })
  }
})


// ------------------- Routes -------------------

// Get categories
app.get('/categories', (req, res) => {
  const sql = `SELECT DISTINCT c.name FROM categories c ORDER BY c.name ASC`;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(row => row.name));
  });
});

// Get products
app.get('/products', (req, res) => {
  const sql = `
    SELECT p.*, GROUP_CONCAT(c.name) AS categories
    FROM products p
    LEFT JOIN product_categories pc ON p.id = pc.product_id
    LEFT JOIN categories c ON pc.category_id = c.id
    GROUP BY p.id
    ORDER BY p.salesCount DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const formatted = rows.map((row, index) => ({
      ...row,
      category: row.categories ? row.categories.split(',') : [],
      rank: index + 1
    }));

    res.json(formatted);
  });
});

// Get all past orders
app.get('/orders', (req, res) => {
  db.all(`SELECT * FROM orders ORDER BY timestamp DESC`, [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    const formatted = rows.map(r => ({
      ...r,
      orderData: JSON.parse(r.orderData)
    }));
    res.json(formatted);
  });
});

// Save a new order
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Trying login with:', email, password);

  db.get(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, password], (err, user) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ success: false, error: 'DB error' });
    }

    if (!user) {
      console.log('❌ User not found');
      return res.json({ success: false });
    }

    console.log('✅ Login success for', user.email);
    res.json({ success: true, user });
  });
});



app.post('/signup', (req, res) => {
  const { email, password, name } = req.body;
  db.run(`INSERT INTO users (email, password, name) VALUES (?, ?, ?)`, [email, password, name], function (err) {
    if (err) return res.status(400).send('User already exists');
    res.json({ message: 'Signup successful', userId: this.lastID });
  });
});

app.get('/users', (req, res) => {
  db.all(`SELECT id, name, email, password FROM users`, [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});




app.post('/orders', (req, res) => {
  const { cartItems, total, name, email, address } = req.body;
  const timestamp = new Date().toISOString();
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  const stmt = db.prepare(`
    INSERT INTO orders (name, email, address, orderData, total, timestamp, orderNumber)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(name, email, address, JSON.stringify(cartItems), total, timestamp, orderNumber, function (err) {
    if (err) return res.status(500).send('❌ Failed to save order.');
    console.log('✅ Order saved with ID', this.lastID);

    // Update salesCount & stock
    cartItems.forEach(item => {
      db.run(
        'UPDATE products SET salesCount = salesCount + ?, stock = stock - ? WHERE id = ?',
        [item.quantity, item.quantity, item.id],
        (err) => {
          if (err) console.error(`❌ Failed to update product ${item.id}`, err);
          applyDiscountTiers(item.id);
        }
      );
    });

    // Update ranks
    db.all(`SELECT id FROM products ORDER BY salesCount DESC`, [], (err, rows) => {
      if (!err) {
        rows.forEach((row, index) => {
          db.run(`UPDATE products SET rank = ? WHERE id = ?`, [index + 1, row.id]);
        });
      }
    });

    // Send Email
    sendReceiptEmail(email, cartItems, total, timestamp);

    res.send({
      message: '✅ Order saved & email sent', orderNumber, timestamp,
      name,
      email,
      cartItems,
      total,
      timestamp,
      orderNumber
    });
  });

  stmt.finalize();
});

// Update sales and stock for a specific product
app.post('/order/:id', (req, res) => {
  const productId = req.params.id;
  const { quantity } = req.body;

  db.run(
    `UPDATE products SET salesCount = salesCount + ?, stock = stock - ? WHERE id = ?`,
    [quantity, quantity, productId],
    (err) => {
      if (err) {
        console.error(`❌ Error updating product ${productId}`, err);
        return res.status(500).send('Failed to update product.');
      }

      // Apply discount tiers after updating
      applyDiscountTiers(productId);
      res.send({ message: `✅ Product ${productId} updated` });
    }
  );
});

// ------------------- Start Server -------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
