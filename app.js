//require express, body-parser, pg(to work with postgreSQL)
const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg");

let isDataBaseCreated = false;//to check if Data Base already created
let isTableCreated = false;//to check if table already created

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));//use folder "public" to store .css and .js files

//if Data Base and table if is not created yet then create
if (dataBaseCreated === false && tableCreated === false) {
  createDataBase();
  createTable();
}

//handling get request to the "/" route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");//send index.html
});

//handling POST request from index.html
app.post(process.env.port || "/", (req, res) => {
  let sortIdent = req.body.identifierInput;//get identifier 
  let sortedArray = req.body.arrayOutput.split(",");//sorted array as string, return an array and store the array 
  console.log(sortIdent, sortedArray);//log variables to ensure that all works well

  //insert pares of elemnts of the array and identifier into data base table 
  for (let i = 0; i < sortedArray.length; i++) {
    inserData(+sortedArray[i], sortIdent);
  }
  res.sendFile(__dirname + "/fetch.html");//send fetch.html

});

//handling POST request from fetch.html
app.post("/fetch", (req, res) => {
  
  let result = [];//new empty array to store results of the query
  let identifier = req.body.identifierInput;//get identifier value
  
  //new connect to the Data Base
  const pool = new pg.Pool({
      user: 'postgres',
      host: '127.0.0.1',
      database: 'sortings',
      password: 'qazwsx',
      port: '5432'}
  );

  //select values from the table with needed identifier
  pool.query("select value from values where identifier = '" + identifier +"' order by value;",
      (err, results) => {
      //if there is an error, show it
      if (err) {
        console.log(err);
      }
      console.log(results);
      result = results.rows;//store selected values
      pool.end();
  });

  res.write("<h1>Here is your sorting</h1>");
  res.send(result);//show selectes values
})

//create new Data Base
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

//create new table
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

//insert data to created database
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

//running the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
