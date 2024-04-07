var pg = require("pg");

var CONFIG = require("./pgenv");

const to_item = itemRow => {
  return {
    id: parseInt(itemRow["id"]),
    task: itemRow["task"],
    priority: parseInt(itemRow["priority"]),
    date: new Date(itemRow["date"]),
  };
};

const to_user = userRow => {
  return {
    id: parseInt(userRow["id"]),
    first_name: userRow["first_name"],
    last_name: userRow["last_name"],
  };
};

const execute = async query => {
  const client = new pg.Client(CONFIG);
  await client.connect();

  const result = await client.query(query);
  await client.end;
  return result;
};

const get_item = async id => {
  const query = `SELECT * from item where id=${id}`;
  return execute(query).then((res) => {
    if (res.rowCount == 0) {
      throw new Error(`No item was found with id: ${id}`);
    }
    const itemRow = res.rows[0];
    return to_item(itemRow);
  });
};

const get_user = async id => {
  console.log("get user")
  const query = `SELECT * FROM "user" where id=${id}`;
  return execute(query).then((res) => {
    if (res.rowCount == 0) {
      throw new Error(`No user was found with id: ${id}`);
    }
    const userRow = res.rows[0];
    return to_user(userRow);
  });
};

const add_item = item=> {
  const query = `INSERT INTO item (task, priority, date) VALUES ('${item.task}', ${item.priority}, '${item.date}') RETURNING id`;
  return execute(query).then((res) => {
    if (res.rowCount == 0) {
      throw new Error(`Cannot add item ${item}`);
    }
    return res.rows[0]["id"];
  });
};

const add_user = user => {
  const query = `INSERT INTO "user" (first_name, last_name) VALUES ('${user.first_name}', '${user.last_name}') RETURNING id`;
  return execute(query).then((res) => {
    if (res.rowCount == 0) {
      throw new Error(`Cannot add user ${user}`);
    }
    return res.rows[0]["id"];
  });
};

module.exports = { get_item, get_user }