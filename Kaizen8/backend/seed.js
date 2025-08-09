const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./db.sqlite')

const products = [
  {
    id: 1,
    title: 'Nishiki Premium Medium Grain Rice 15 lb',
    image: '/images/rice_img.png',
    category: JSON.stringify(['rice']),
    discountTiers: JSON.stringify([
      { sales: 50, percent: 10 },
      { sales: 100, percent: 20 }
    ]),
    originalPrice: 20.99,
    price: 20.99,
    salesCount: 49,
    rank: 1
  },
  {
    id: 2,
    title: 'Lee Kum Kee Premium Soy Sauce 500 ml',
    image: '/images/soySauce_img.png',
    category: JSON.stringify(['condiments', 'sauces']),
    discountTiers: JSON.stringify([
      { sales: 50, percent: 15 }
    ]),
    originalPrice: 30.99,
    price: 30.99,
    salesCount: 40,
    rank: 2
  },
  {
    id: 3,
    title: 'Kadoya Pure Sesame Oil 1656 ml',
    image: '/images/sesameOil_img.png',
    category: JSON.stringify(['condiments', 'sauces', 'oil']),
    discountTiers: JSON.stringify([
      { sales: 15, percent: 10 }
    ]),
    originalPrice: 20.99,
    price: 20.99,
    salesCount: 12,
    rank: 3
  }
]

/**
 * Recalculates price based on discount tiers
 * @param {number} productId
 */
function applyDiscountTiers(productId) {
  db.get(`SELECT * FROM products WHERE id = ?`, [productId], (err, product) => {
    if (err) return console.error('❌ Error getting product:', err);

    const tiers = JSON.parse(product.discountTiers || '[]');
    const currentSales = product.salesCount;
    const originalPrice = product.originalPrice;

    let bestDiscount = 0;

    // Find best applicable discount
    for (const tier of tiers) {
      if (currentSales >= tier.sales && tier.percent > bestDiscount) {
        bestDiscount = tier.percent;
      }
    }

    // Compute new price
    const newPrice = parseFloat(
      (originalPrice * (1 - bestDiscount / 100)).toFixed(2)
    );

    db.run(
      `UPDATE products SET price = ? WHERE id = ?`,
      [newPrice, productId],
      function (updateErr) {
        if (updateErr) return console.error('❌ Error updating price:', updateErr);
        console.log(`✅ Updated product ${productId} to $${newPrice} with ${bestDiscount}% discount.`);
      }
    );
  });
}


db.serialize(() => {
  db.run(`DROP TABLE IF EXISTS products`)
  db.run(`DROP TABLE IF EXISTS categories`)
  db.run(`DROP TABLE IF EXISTS product_categories`)

  db.run(`
   CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  title TEXT,
  price REAL,
  originalPrice REAL,
  salesCount INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 100,
  discountTiers TEXT,
  rank INTEGER,
  image TEXT
)
  `)
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
`)
// db.run(
//   `INSERT INTO orders (email, name, address, orderData, total, timestamp)
//    VALUES (?, ?, ?, ?, ?, ?)`,
//   [email, name, address, JSON.stringify(cartItems), total, timestamp],
//   function (err) {
//     if (err) return console.error('❌ Error saving order:', err);
//     console.log('✅ Order saved with ID', this.lastID);
//   }
// );



  db.run(`
    CREATE TABLE categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE
    )
  `)

  db.run(`
    CREATE TABLE product_categories (
      product_id INTEGER,
      category_id INTEGER,
      FOREIGN KEY (product_id) REFERENCES products(id),
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `)

  const insertProduct = db.prepare(`
    INSERT INTO products (id, title, image, price, originalPrice, salesCount, discountTiers, rank)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const insertCategory = db.prepare(`INSERT OR IGNORE INTO categories (name) VALUES (?)`)
  const linkCategory = db.prepare(`
    INSERT INTO product_categories (product_id, category_id)
    VALUES (?, (SELECT id FROM categories WHERE name = ?))
  `)

  products.forEach(p => {
    insertProduct.run(
      p.id, p.title, p.image, p.price, p.originalPrice, p.salesCount, p.discountTiers, p.rank
    )

    const categories = JSON.parse(p.category)
    categories.forEach(cat => {
      insertCategory.run(cat)
      linkCategory.run(p.id, cat)
    })
  })

  insertProduct.finalize()
  insertCategory.finalize()
  linkCategory.finalize()

  console.log('✅ Seed complete.')
})

db.close()
