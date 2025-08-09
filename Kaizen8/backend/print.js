// backend/print.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite');

db.serialize(() => {
  const sql = `
    SELECT 
      p.*,
      GROUP_CONCAT(c.name) AS categories
    FROM products p
    LEFT JOIN product_categories pc ON p.id = pc.product_id
    LEFT JOIN categories c ON pc.category_id = c.id
    GROUP BY p.id
    ORDER BY p.salesCount DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching products:', err.message);
      return;
    }

    rows.forEach((row, index) => {
      const categoryList = row.categories ? row.categories.split(',') : [];
      console.log(`\nProduct ${index + 1}:`);
      console.log(`  ID: ${row.id}`);
      console.log(`  Title: ${row.title}`);
      console.log(`  Price: $${row.price}`);
      console.log(`  Sales Count: ${row.salesCount}`);
      console.log(`  Categories: ${categoryList.join(', ')}`);
      console.log(`  Rank: ${index + 1}`);
    });

    db.close();
  });
});
