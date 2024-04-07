const connect = require("@databases/sqlite");
const { sql } = require("@databases/sqlite");

const db = connect("temp.db");

const authorData = [
    [1, "Toni Morrison", "email.com", "2017-3-4"],
    [2, "Money Morrison", "email.com", "2017-3-4"]
]

const bookData = [
    [1, 1, "123"],
    [2, 1, "456"]
]

const saleItemsData = [
    [1, 1, "Angela", 12, 1],
    [2, 2, "Angela", 12, 2],
   
    [3, 2, "Brian", 12, 1]
]

async function createAuthorsTable(){
    await db.query(sql`
        CREATE TABLE IF NOT EXISTS authors (
            id serial PRIMARY KEY,
            name text,
            email text,
            date_of_birth timestamp
        );
    `);
}

async function createBooksTable(){
    await db.query(sql`
    CREATE TABLE IF NOT EXISTS books (
        id serial PRIMARY KEY,
        author_id integer REFERENCES authors (id),
        isbn text
        );
    `);
}

async function createSaleItemsTable(){
    await db.query(sql`
        CREATE TABLE IF NOT EXISTS authors (
            id serial PRIMARY KEY,
            name text,
            email text,
            date_of_birth timestamp
        );
    `);
}


async function prepare() {


    await createAuthorsTable();
    await createBooksTable();
    // await createSaleItemsTable();


    authorData.forEach(async datum =>{
        await insertAuthor(datum[0], datum[1], datum[2], datum[3])
    })

    bookData.forEach(async datum =>{
        await insertBook(datum[0], datum[1], datum[2])
    })

    // saleItemsData.forEach(async datum =>{
    //     await insertSaleItem(datum[0], datum[1], datum[2], datum[3], datum[4])
    // })
}

const insertAuthor = async(id, name, email, date_of_birth) =>{
    await db.query(sql`
    INSERT INTO authors (id, name, email, date_of_birth)
      VALUES (${id}, ${name}, ${email}, ${date_of_birth})
      ON CONFLICT (id) DO UPDATE SET
        name=excluded.name,
        email=excluded.email,
        date_of_birth=excluded.date_of_birth;
  `);
}

const insertBook = async(id, author_id, isbn) =>{
    await db.query(sql`
    INSERT INTO books (id, author_id, isbn)
      VALUES (${id}, ${author_id}, ${isbn})
      ON CONFLICT (id) DO UPDATE SET
        author_id=excluded.author_id,
        isbn=excluded.isbn;
  `);
}

const insertSaleItem = async(id, book_id, customer_name, item_price, quantity) =>{
    await db.query(sql`
    INSERT INTO sale_items (id, book_id, customer_name, item_price, quantity)
      VALUES (${id}, ${book_id}, ${customer_name}, ${item_price}, ${quantity})
      ON CONFLICT (id) DO UPDATE SET
        book_id=excluded.book_id,
        customer_name=excluded.customer_name;
        item_price=excluded.item_price,
        quantity=excluded.quantity;
  `);
}


// const prepared = prepare();
const createdAuthorsTable = createAuthorsTable()
const createdBooksTable = createBooksTable()
const createdSaleItemsTable = createSaleItemsTable()

async function getAuthor(id) {
  await createdAuthorsTable;
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
    await createdBooksTable;
    const results = await db.query(sql`
          SELECT * FROM books WHERE id=${id};
      `);
      console.log("results", results)
    if (results.length) {
      return results[0];
    } else {
      return undefined;
    }
  }

  async function getSaleItem(id) {
    await createdSaleItemsTable;
    const results = await db.query(sql`
          SELECT * FROM sale_items WHERE id=${id};
      `);
      console.log("results", results)
    if (results.length) {
      return results[0];
    } else {
      return undefined;
    }
  }

module.exports = { getAuthor, getBook, getSaleItem };
