var { AUTHORS_DATA, SALES_ITEM_DATA, BOOK_DATA } = require("./data");

const connect = require("@databases/sqlite");
const { sql } = require("@databases/sqlite");

const db = connect("temp.db");

async function buildDatabase() {
  await createAuthorsTable();
  await createBooksTable();
  await createSaleItemsTable();

  AUTHORS_DATA.forEach(async (datum) => {
    await insertAuthor(datum[0], datum[1], datum[2], datum[3]);
  });

  BOOK_DATA.forEach(async (datum) => {
    await insertBook(datum[0], datum[1], datum[2]);
  });

  SALES_ITEM_DATA.forEach(async (datum) => {
    await insertSaleItem(datum[0], datum[1], datum[2], datum[3], datum[4]);
  });
}

async function createAuthorsTable() {
  await db.query(sql`
        CREATE TABLE IF NOT EXISTS authors (
            id serial PRIMARY KEY,
            name text,
            email text,
            date_of_birth timestamp
        );
    `);
}

async function createBooksTable() {
  await db.query(sql`
        CREATE TABLE IF NOT EXISTS books (
            id serial PRIMARY KEY,
            author_id integer REFERENCES authors (id),
            isbn text
        );
    `);
}

async function createSaleItemsTable() {
  await db.query(sql`
        CREATE TABLE IF NOT EXISTS sale_items (
            id serial PRIMARY KEY,
            book_id integer REFERENCES books (id),
            customer_name text,
            item_price money,
            quantity integer
        );
    `);
}

const insertAuthor = async (id, name, email, date_of_birth) => {
  await db.query(sql`
    INSERT INTO authors (id, name, email, date_of_birth)
      VALUES (${id}, ${name}, ${email}, ${date_of_birth})
      ON CONFLICT (id) DO UPDATE SET
        name=excluded.name,
        email=excluded.email,
        date_of_birth=excluded.date_of_birth;
  `);
};

const insertBook = async (id, author_id, isbn) => {
  await db.query(sql`
    INSERT INTO books (id, author_id, isbn)
      VALUES (${id}, ${author_id}, ${isbn})
      ON CONFLICT (id) DO UPDATE SET
        author_id=excluded.author_id,
        isbn=excluded.isbn;
  `);
};

const insertSaleItem = async (
  id,
  book_id,
  customer_name,
  item_price,
  quantity
) => {
  await db.query(sql`
    INSERT INTO sale_items (id, book_id, customer_name, item_price, quantity)
      VALUES (${id}, ${book_id}, ${customer_name}, ${item_price}, ${quantity})
      ON CONFLICT (id) DO UPDATE SET
        book_id=excluded.book_id,
        customer_name=excluded.customer_name;
        item_price=excluded.item_price,
        quantity=excluded.quantity;
  `);
};

async function getAuthor(name) {
  const results = await db.query(sql`
        SELECT * FROM authors WHERE name=${name};
    `);
  if (results.length) {
    return results[0];
  } else {
    return undefined;
  }
}

async function getTenOldelstAuthors(id) {
  const results = await db.query(sql`
          SELECT * FROM authors
          ORDER BY authors.date_of_birth
          LIMIT 10
      `);
  if (results.length) {
    return results[0];
  } else {
    return undefined;
  }
}

async function getAuthorSalesTotal(name) {
  const results = await db.query(sql`
          SELECT SUM(sale_items.item_price * sale_items.quantity), authors.name 
          FROM authors
          JOIN books ON books.author_id = authors.id
          JOIN sale_items ON books.id = sale_items.book_id
          WHERE authors.name = ${name}
      `);

  return results;
}

async function getTopSellingAuthors(name) {
  const results = await db.query(sql`
          SELECT  authors.name, authors.email, SUM(sale_items.item_price * sale_items.quantity)
          FROM authors
          JOIN books ON books.author_id = authors.id
          JOIN sale_items ON books.id = sale_items.book_id
          GROUP BY authors.name
          ORDER BY SUM(sale_items.item_price * sale_items.quantity) DESC
          LIMIT 10
      `);
  return results;
}

module.exports = {
  getAuthor,
  buildDatabase,
  getTenOldelstAuthors,
  getTopSellingAuthors,
  getAuthorSalesTotal,
};
