const connect = require("@databases/sqlite");
const { sql } = require("@databases/sqlite");

const db = connect("temp.db");

const AUTHORS_DATA = [
  [1, "Toni Morrison", "tMorrison@gmail.com", "1931-2-18"],
  [2, "William Shakespeare", "wShakespeare@gmail.com", "1564-4-26"],
  [3, "Philip Roth", "pRoth@gmail.com", "1933-3-19"],
  [4, "Jane Austen", "jAusten@gmail.com", "1775-12-16"],
  [5, "Lorelai Gilmore", "lGilmore@gmail.com", "1979-3-4"],
  [6, "Zora Neale Hurston", "zHurston@gmail.com", "1891-1-28"],
  [7, "Mary Flannery O'Connor", "mConnor@gmail.com", "1925-3-25"],
  [8, "Agatha Christie", "aChristie@gmail.com", "1890-3-4"],
  [9, "Barbara Cartland", "bCartland@gmail.com", "1901-3-4"],
  [10, "Danielle Steel", "dSteel@gmail.com", "1947-3-4"],
  [11, "Harold Robbins", "hRobbins@gmail.com", "1916-3-4"],
  [12, "J. K. Rowling", "jRowling@gmail.com", "1965-3-4"],
  [13, "Enid Blyton", "eBlyton@gmail.com", "1897-3-4"],
  [14, "Sidney Sheldon", "sSheldon@gmail.com", "1917-3-4"],
  [15, "Eiichiro Oda", "eOda@gmail.com", "1975-3-4"],
  [16, "Gilbert Patten", "gPatten@gmail.com", "1866-3-4"],
];

const BOOK_DATA = [
  [1, 1, "123"],
  [2, 2, "456"],
  [3, 3, "123"],
  [4, 4, "456"],
  [5, 5, "123"],
  [6, 6, "456"],
  [7, 7, "123"],
  [8, 8, "456"],
  [9, 9, "123"],
  [10, 10, "456"],
  [11, 11, "123"],
  [12, 12, "456"],
  [13, 14, "123"],
  [14, 14, "456"],
  [15, 15, "123"],
  [16, 16, "456"],
  [17, 1, "123"],
  [18, 1, "456"],
  [19, 2, "123"],
  [20, 2, "456"],
];

const SALES_ITEM_DATA = [
  [1, 1, "Angela", 10, 1],
  [2, 2, "Angela", 20, 2],
  [3, 3, "Brian", 10, 1],
  [4, 4, "Angela", 15, 1],
  [5, 1, "Angela", 10, 2],
  [6, 2, "Brian", 10, 1],
  [7, 3, "Angela", 20, 1],
  [8, 11, "Angela", 10, 4],
  [9, 20, "Brian", 15, 3],
  [10, 13, "Angela", 10, 1],
  [11, 15, "Angela", 10, 2],
  [12, 16, "Brian", 15, 1],
  [13, 5, "Brian", 10, 1],
  [14, 6, "Brian", 20, 1],
  [15, 7, "Angela", 15, 1],
  [16, 8, "Brian", 10, 1],
  [17, 9, "Angela", 15, 1],
  [18, 10, "Brian", 20, 1],
  [19, 12, "Angela", 15, 1],
  [20, 14, "Angela", 10, 1],
];

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

async function getAuthor(id) {
  const results = await db.query(sql`
        SELECT * FROM authors WHERE id=${id};
    `);
  if (results.length) {
    return results[0];
  } else {
    return undefined;
  }
}

async function getBook(id) {
  const results = await db.query(sql`
          SELECT * FROM books WHERE id=${id};
      `);
  console.log("results", results);
  if (results.length) {
    return results[0];
  } else {
    return undefined;
  }
}

async function getSaleItem(id) {
  const results = await db.query(sql`
          SELECT * FROM sale_items WHERE id=${id};
      `);
  console.log("results", results);
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
  console.log(results);
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

  console.log(results);
  return results;
}

async function getTopSellingAuthors(name) {
  const results = await db.query(sql`
          SELECT SUM(sale_items.item_price * sale_items.quantity), authors.name 
          FROM authors
          JOIN books ON books.author_id = authors.id
          JOIN sale_items ON books.id = sale_items.book_id
          GROUP BY authors.name
          ORDER BY SUM(sale_items.item_price * sale_items.quantity) DESC
          LIMIT 10
      `);
  console.log(results);
  return results;
}

module.exports = {
  getAuthor,
  getBook,
  getSaleItem,
  buildDatabase,
  getTenOldelstAuthors,
  getTopSellingAuthors,
  getAuthorSalesTotal,
};
