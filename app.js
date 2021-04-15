//require express, body parser, pg
const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg");


const app = express();



app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));//use "public" folder to get CSS and JS 

//send file index.html as response to a get request to route "/"
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//answers POST request from first form
app.post("/", (req, res) => {
  //get values from the page with body-parse
  let sortIdent = req.body.identifierInput;
  let sortedArray = req.body.arrayInput.split(",");

  //insert values from the sorted array to data base
  for (let i = 0; i < sortedArray.length; i++) {
    inserData(+sortedArray[i], sortIdent);
  }
  //send index.html again as response to POST request
  res.sendFile(__dirname + "/index.html");

});

//answers POST request from second form
app.post("/fetch", (req, res) => {

  let fetchedArray = []
  let identifier = req.body.identifierInput;//get identifier value from page
  const pool = new pg.Pool({
      user: 'postgres',
      host: '127.0.0.1',
      database: 'sortings',
      password: 'qazwsx',
      port: '5432'}
  );

  //get values from data base with SQL query using identifier
  pool.query("select value from values where identifier = '" + identifier +"' order by value;",
      (err, results) => {
      if (err) {
        console.log(err);
      }
      console.log(results);
      fetchedArray = getValues(results.rows);//get values from results.rows and store in in array
      res.send(fetchedArray);//send sorted array(here i'm stucked now, because
                            //i don't know for now how to send back an HTML webpage
                            //with array values that i get from the database
                            //i think i need to use res.render()
      pool.end();
  });

})

//insert data to a data base using SQL query
function inserData(value1, value2) {
  const pool = new pg.Pool({
      user: 'postgres',
      host: '127.0.0.1',
      database: 'sortings',
      password: 'qazwsx',
      port: '5432'}
  );

  pool.query("insert into values (value, identifier) values (" + value1 + "," + "'" + value2 + "');",
(err, res) => {
  console.log(err, res);
  pool.end();
})
}

//get values of an array from the array of objects(results.rows)
function getValues(arrayOfObj) {
  let result = [];
  for (let i = 0; i < arrayOfObj.length; i++) {
    result[i] = arrayOfObj[i].value;
  }
  return result;
}

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
