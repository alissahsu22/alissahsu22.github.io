// ------------------- Load Environment Variables -------------------
require('dotenv').config();

// ------------------- Dependencies -------------------
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 4000;

// ------------------- Middleware -------------------
app.use(cors({ origin: '*' })); // Allow all origins (can restrict later)
app.use(express.json());

// ------------------- Database -------------------
const db = new sqlite3.Database('./db.sqlite');

// ------------------- Email Setup -------------------
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  const nodemailer = require('nodemailer');
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // from .env
      pass: process.env.EMAIL_PASS  // from .env
    }
  });
}


function sendReceiptEmail(to, orderSummary, total, timestamp) {
  if (!transporter) return;

  const mailOptions = {
    from: process.env.EMAIL_USER,
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
    if (err) console.error('❌ Email send error:', err);
    else console.log(`✅ Email sent: ${info.response}`);
  });
}

// ------------------- Discount Logic -------------------
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
    db.run(`UPDATE products SET price = ? WHERE id = ?`, [newPrice, productId], (err) => {
      if (err) return console.error('❌ Error updating price:', err);
      console.log(`✅ Product ${productId} now $${newPrice} (${bestDiscount}% off)`);
    });
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

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      name TEXT,
      isAdmin INTEGER DEFAULT 0
    )
  `);
});

// ------------------- Middleware for Admin Check -------------------
function requireAdmin(req, res, next) {
  const userHeader = req.headers['x-user'];
  if (!userHeader) return res.status(403).json({ error: 'No user provided' });

  try {
    const user = JSON.parse(userHeader);
    if (user.isAdmin) next();
    else res.status(403).json({ error: 'Access denied: not admin' });
  } catch (err) {
    res.status(403).json({ error: 'Invalid user format' });
  }
}

// ------------------- Routes -------------------

// Verify admin
app.post('/verify-admin', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
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

// Get orders
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

// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, password], (err, user) => {
    if (err) return res.status(500).json({ success: false, error: 'DB error' });
    if (!user) return res.json({ success: false });
    res.json({ success: true, user });
  });
});

// Signup
app.post('/signup', (req, res) => {
  const { email, password, name } = req.body;
  db.run(`INSERT INTO users (email, password, name) VALUES (?, ?, ?)`, [email, password, name], function (err) {
    if (err) return res.status(400).send('User already exists');
    res.json({ message: 'Signup successful', userId: this.lastID });
  });
});

// Get users
app.get('/users', requireAdmin, (req, res) => {
  db.all(`SELECT id, name, email, password FROM users`, [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

// Create new order
app.post('/orders', (req, res) => {
  const { cartItems, total, name, email, address } = req.body;
  const timestamp = new Date().toISOString();
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  db.run(`
    INSERT INTO orders (name, email, address, orderData, total, timestamp, orderNumber)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, email, address, JSON.stringify(cartItems), total, timestamp, orderNumber],
    function (err) {
      if (err) return res.status(500).send('❌ Failed to save order.');
      cartItems.forEach(item => {
        db.run(
          'UPDATE products SET salesCount = salesCount + ?, stock = stock - ? WHERE id = ?',
          [item.quantity, item.quantity, item.id],
          (err) => {
            if (!err) applyDiscountTiers(item.id);
          }
        );
      });

      db.all(`SELECT id FROM products ORDER BY salesCount DESC`, [], (err, rows) => {
        if (!err) {
          rows.forEach((row, index) => {
            db.run(`UPDATE products SET rank = ? WHERE id = ?`, [index + 1, row.id]);
          });
        }
      });

      sendReceiptEmail(email, cartItems, total, timestamp);
      res.send({ message: '✅ Order saved & email sent', orderNumber, timestamp, name, email, cartItems, total });
    }
  );
});

// Update sales & stock for a specific product
app.post('/order/:id', (req, res) => {
  const productId = req.params.id;
  const { quantity } = req.body;

  db.run(
    `UPDATE products SET salesCount = salesCount + ?, stock = stock - ? WHERE id = ?`,
    [quantity, quantity, productId],
    (err) => {
      if (err) return res.status(500).send('Failed to update product.');
      applyDiscountTiers(productId);
      res.send({ message: `✅ Product ${productId} updated` });
    }
  );
});

// ------------------- Start Server -------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
