

const pool = require("../config/db");

async function getAll() {
  const [rows] = await pool.query(
    "SELECT id, name, price FROM products ORDER BY id"
  );

  return rows;
}

async function getPaginated(page, limit, search = "") {
  const offset = (page - 1) * limit;
  const searchTerm = `%${search}%`;

  const [products] = await pool.execute(
    `SELECT id, name, price
     FROM products
     WHERE name LIKE ?
     ORDER BY id
     LIMIT ? OFFSET ?`,
    [searchTerm, limit, offset]
  );

  const [rows] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM products
     WHERE name LIKE ?`,
    [searchTerm]
  );

  const total = Number(rows[0].total);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    search,
    products
  };
}
async function getById(id) {
  const [rows] = await pool.execute(
    "SELECT id, name, price FROM products WHERE id = ?",
    [id]
  );

  return rows[0] || null;
}



async function create(name, price) {
  const [result] = await pool.execute(
    "INSERT INTO products (name, price) VALUES (?, ?)",
    [name, price]
  );

  return getById(result.insertId);
}

async function update(id, name, price) {
  const product = await getById(id);

  if (!product) {
    return null;
  }

  await pool.execute(
    "UPDATE products SET name = ?, price = ? WHERE id = ?",
    [name, price, id]
  );

  return getById(id);
}

async function remove(id) {
  const product = await getById(id);

  if (!product) {
    return null;
  }

  await pool.execute(
    "DELETE FROM products WHERE id = ?",
    [id]
  );

  return product;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  getPaginated
};
