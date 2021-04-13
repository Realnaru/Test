const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg");


const app = express();



app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

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
      database: 'postgres',
      password: 'qazwsx',
      port: '5432'}
  );

  pool.query("select arrayValue from values where identifier = '" + identifier +"' order by arrayValue;",
      (err, results) => {
      if (err) {
        console.log(err);
      }
      console.log(results);
      pool.end();
  });

  res.write("<h1>Here is your sorting</h1>");
})


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
