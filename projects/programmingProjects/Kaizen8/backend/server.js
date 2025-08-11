// ------------------- Load Environment Variables -------------------
require('dotenv').config();

// ------------------- Dependencies -------------------
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 4000;

// ------------------- CORS (Prod + previews) -------------------
const WHITELIST = [
  'http://localhost:5173',
  'https://alissahsu22-github-io-njlq.vercel.app', // your production frontend
  process.env.FRONTEND_ORIGIN,                      // optional override in Render
].filter(Boolean);


const path = require('path');
app.use(
  '/images',
  express.static(path.join(__dirname, 'public', 'images'))
);


// allow *.vercel.app previews (or tighten to your project slug if you prefer)
function isAllowedOrigin(origin) {
  if (!origin) return true; // same-origin/server-to-server
  try {
    const { hostname, protocol } = new URL(origin);
    if (!/^https?:$/.test(protocol)) return false;
    if (WHITELIST.includes(origin)) return true;
    if (hostname.endsWith('.vercel.app')) return true;
    return false;
  } catch {
    return false;
  }
}

app.use((req, res, next) => {
  res.header('Vary', 'Origin'); // important for caches/CDNs
  next();
});

app.use(
  cors({
    origin: (origin, cb) =>
      cb(isAllowedOrigin(origin) ? null : new Error('Not allowed by CORS'), true),
    credentials: true, // keep only if you actually use cookies/auth
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-user'],
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());

// ------------------- Database -------------------
const db = new sqlite3.Database('./db.sqlite');

// ------------------- Email (optional) -------------------
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  const nodemailer = require('nodemailer');
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
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
        ${orderSummary
          .map(
            (item) =>
              `<li>${item.title} × ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</li>`
          )
          .join('')}
      </ul>
      <p><strong>Total:</strong> $${total.toFixed(2)}</p>
      <p>Come again soon!</p>
    `,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error('❌ Email send error:', err);
    else console.log(`✅ Email sent: ${info.response}`);
  });
}

// ------------------- Discount Logic -------------------
function applyDiscountTiers(productId) {
  db.get(`SELECT * FROM products WHERE id = ?`, [productId], (err, product) => {
    if (err || !product) return console.error('❌ Error getting product:', err || 'not found');

    const tiers = JSON.parse(product.discountTiers || '[]');
    const currentSales = product.salesCount || 0;
    const originalPrice = product.originalPrice || product.price;

    let bestDiscount = 0;
    for (const tier of tiers) {
      if (currentSales >= tier.sales && tier.percent > bestDiscount) bestDiscount = tier.percent;
    }

    const newPrice = parseFloat((originalPrice * (1 - bestDiscount / 100)).toFixed(2));
    db.run(`UPDATE products SET price = ? WHERE id = ?`, [newPrice, productId], (e) => {
      if (e) return console.error('❌ Error updating price:', e);
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
    if (user.isAdmin) return next();
    return res.status(403).json({ error: 'Access denied: not admin' });
  } catch {
    return res.status(403).json({ error: 'Invalid user format' });
  }
}

// ------------------- Routes -------------------

// Health
app.get('/', (_req, res) => {
  res.send('Backend is running 🚀');
});

// Verify admin
app.post('/verify-admin', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) return res.json({ success: true });
  return res.status(401).json({ success: false, message: 'Unauthorized' });
});

// Categories (derive from products.category)
app.get('/categories', (_req, res) => {
  console.log('📦 [GET] /categories');

  // Select * so we don't reference a non-existent column in SQL
  db.all(`SELECT * FROM products`, [], (err, rows) => {
    if (err) {
      console.error('❌ DB error loading products:', err.message);
      return res.status(500).json({ error: err.message });
    }

    const set = new Set();

    rows.forEach((r, idx) => {
      // Use either `category` or legacy `categories` if present
      const raw = (r.category ?? r.categories ?? '') || '';
      console.log(`   Row ${idx + 1} raw category:`, raw);

      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach(c => c && set.add(String(c).trim()));
        } else if (typeof parsed === 'string') {
          parsed.split(',').forEach(c => c && set.add(c.trim()));
        }
      } catch {
        String(raw)
          .split(',')
          .map(c => c.trim())
          .filter(Boolean)
          .forEach(c => set.add(c));
      }
    });

    const categoriesArray = Array.from(set).sort((a, b) => a.localeCompare(b));
    console.log('📋 Final categories:', categoriesArray);
    res.json(categoriesArray);
  });
});





// Products
app.get('/products', (_req, res) => {
  db.all(
    `SELECT * FROM products ORDER BY COALESCE(rank, 999999), COALESCE(salesCount,0) DESC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      const BASE_URL = process.env.PUBLIC_BASE_URL || 'https://alissahsu22-github-io.onrender.com';

      const formatted = rows.map((row, index) => {
        // Parse categories
        let category = [];
        try {
          const parsed = JSON.parse(row.category || '[]');
          if (Array.isArray(parsed)) category = parsed;
          else if (typeof parsed === 'string') category = parsed.split(',').map(c => c.trim()).filter(Boolean);
        } catch {
          category = String(row.category || '')
            .split(',')
            .map(c => c.trim())
            .filter(Boolean);
        }

        // Normalize image URL
        let image = row.image || '';
        if (image.startsWith('/public/')) {
          image = image.replace(/^\/public/, ''); // remove /public prefix if present
        }
        if (!/^https?:\/\//i.test(image)) {
          image = `${BASE_URL}${image.startsWith('/') ? '' : '/'}${image}`;
        }

        return {
          ...row,
          image,
          category,
          rank: row.rank || index + 1
        };
      });

      res.json(formatted);
    }
  );
});


// Orders list
app.get('/orders', (_req, res) => {
  db.all(`SELECT * FROM orders ORDER BY timestamp DESC`, [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    const formatted = rows.map((r) => ({ ...r, orderData: JSON.parse(r.orderData || '[]') }));
    res.json(formatted);
  });
});

// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get(
    `SELECT * FROM users WHERE email = ? AND password = ?`,
    [email, password],
    (err, user) => {
      if (err) return res.status(500).json({ success: false, error: 'DB error' });
      if (!user) return res.json({ success: false });
      return res.json({ success: true, user });
    }
  );
});

// Signup
app.post('/signup', (req, res) => {
  const { email, password, name } = req.body;
  db.run(
    `INSERT INTO users (email, password, name) VALUES (?, ?, ?)`,
    [email, password, name],
    function (err) {
      if (err) return res.status(400).send('User already exists');
      res.json({ message: 'Signup successful', userId: this.lastID });
    }
  );
});

// Users (admin)
app.get('/users', requireAdmin, (_req, res) => {
  db.all(`SELECT id, name, email, password FROM users`, [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

// Create order
app.post('/orders', (req, res) => {
  const { cartItems, total, name, email, address } = req.body;
  const timestamp = new Date().toISOString();
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  db.run(
    `INSERT INTO orders (name, email, address, orderData, total, timestamp, orderNumber)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, email, address, JSON.stringify(cartItems), total, timestamp, orderNumber],
    function (err) {
      if (err) return res.status(500).send('❌ Failed to save order.');

      // Update products
      cartItems.forEach((item) => {
        db.run(
          'UPDATE products SET salesCount = COALESCE(salesCount,0) + ?, stock = COALESCE(stock,0) - ? WHERE id = ?',
          [item.quantity, item.quantity, item.id],
          (e) => {
            if (!e) applyDiscountTiers(item.id);
          }
        );
      });

      // Re-rank by sales
      db.all(`SELECT id FROM products ORDER BY COALESCE(salesCount,0) DESC`, [], (e, rows) => {
        if (!e) {
          rows.forEach((row, idx) => {
            db.run(`UPDATE products SET rank = ? WHERE id = ?`, [idx + 1, row.id]);
          });
        }
      });

      sendReceiptEmail(email, cartItems, total, timestamp);
      res.send({ message: '✅ Order saved & email sent', orderNumber, timestamp, name, email, cartItems, total });
    }
  );
});

// Update single product after add-to-cart
app.post('/order/:id', (req, res) => {
  const productId = req.params.id;
  const { quantity } = req.body;

  db.run(
    `UPDATE products SET salesCount = COALESCE(salesCount,0) + ?, stock = COALESCE(stock,0) - ? WHERE id = ?`,
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
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('CORS whitelist:', WHITELIST);
});
