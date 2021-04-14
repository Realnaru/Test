const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg");
let isDataBaseCreated = false;
let isTableCreated = false;

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

if (dataBaseCreated === false && tableCreated === false) {
  createDataBase();
  createTable();
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post(process.env.port || "/", (req, res) => {
  let sortIdent = req.body.identifierInput;
  let sortedArray = req.body.arrayOutput.split(",");
  console.log(sortIdent, sortedArray);

  for (let i = 0; i < sortedArray.length; i++) {
    inserData(+sortedArray[i], sortIdent);
  }
  res.sendFile(__dirname + "/fetch.html");

});

app.post("/fetch", (req, res) => {

  let identifier = req.body.identifierInput;
  const pool = new pg.Pool({
      user: 'postgres',
      host: '127.0.0.1',
      database: 'sortings',
      password: 'qazwsx',
      port: '5432'}
  );

  pool.query("select value from values where identifier = '" + identifier +"' order by value;",
      (err, results) => {
      if (err) {
        console.log(err);
      }
      console.log(results);
      pool.end();
  });

  res.write("<h1>Here is your sorting</h1>");
  res.send(results.rows);
})

function createDataBase() {
  const pool = new pg.Pool({
      user: 'postgres',
      host: '127.0.0.1',
      database: 'postgres',
      password: 'qazwsx',
      port: '5432'}
  );
  pool.query("CREATE DATABASE sortings;",
(err, res) => {
  console.log(err, res);
  pool.end();
});
  isDataBaseCreated = true;
}

function createTable() {
  const pool = new pg.Pool({
      user: 'postgres',
      host: '127.0.0.1',
      database: 'sortings',
      password: 'qazwsx',
      port: '5432'}
  );
  pool.query("CREATE TABLE values(Id serial primary key, value integer, identifier character varying(255));",
(err, res) => {
  console.log(err, res);
  pool.end();
})
  isTableCreated = true;
}

function inserData(value1, value2) {
  const pool = new pg.Pool({
      user: 'postgres',
      host: '127.0.0.1',
      database: 'sortings',
      password: 'qazwsx',
      port: '5432'}
  );
  pool.query("insert into values (arrayValue, identifier) values (" + value1 + "," + "'" + value2 + "');",
(err, res) => {
  console.log(err, res);
  pool.end();
})
}

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
