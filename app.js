//require express, body-parser, pg
const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg");

let sortings = [];//array to store sorted arrays and identifiers of sortings
let fetchedResult = {};//object to store array and indentifier fetched from database

const app = express(); //initialise app

app.set("view engine", "ejs"); //set ejs as view engine

app.use(bodyParser.urlencoded({
  extended: true
})); //middleware for parsing bodies from URL.

app.use(express.static("public")); //use folder where style.css is located

//answer get request to the "/" route
app.get("/", (req, res) => {
  res.render("sort", {
    //template variables
    sortings: sortings,
    fetchedResult: fetchedResult
  });
});

app.post("/", (req, res) => {
  //get array from first input using body-parser
  //using trim to get rid of spaces before and after
  //then split it into an array of strings
  //then convert each element to number for proper sorting
  let unsortedArray = req.body.arrayInput.trim().split(" ").map(Number);

  let identifier = req.body.identifierInput; //get sorting identifier from second arrayInput
  sortedArray = bubbleSort(unsortedArray); //sort unsorted arrray with bubble sort algorythm

  //save identifier-sorted array pair as an object
  let sorting = {
    "identifier": identifier,
    "sortedArray": sortedArray
  };

  sortings.push(sorting); //push that object into array of objects


  res.redirect("/"); //redirect to initial app.get
});

 //answer request to the /save route (save sorted arrays to the database)
app.post("/save", (req, res) => {

  //insert identifier of sorting and sorted array values to the database
  for (let i = 0; i < sortings.length; i++) {//first loop through array of sorting
    for (let j = 0; j < sortings[i]["sortedArray"].length; j++) {//second loop through array of sorted values
      insertData(sortings[i]["sortedArray"][j], sortings[i]["identifier"]);//insert identifier and values
                                                                           //into the database
    }
  }


});

//answer request to the /fetch route (get values of sorted array and sorting identifier from the database)
app.post("/fetch", (req, res) => {

  let identifier = req.body.identifierFetch; //get identifier value from page

  //new pool to the database
  const pool = new pg.Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'sortings',
    password: 'qazwsx',
    port: '5432'
  });

  //get values from data base with SQL query using identifier
  pool.query("select value from values where identifier = '" + identifier + "' order by value;",
    (err, results) => {
      if (err) {
        console.log(err);
      }
      console.log(results);

      fetchedArray = getValues(results.rows);//save values from results.rows object to the array

      //save results of the query as object with identifier - array
      fetchedResult = {
        "identifier": identifier,
        "fetchedArray": fetchedArray
      }

      res.redirect("/");//redirect to the initial route

      pool.end();
    });

})

//function to sort an array wwith bubble sort algorythm
function bubbleSort(anyArray) {

  for (let i = 0; i < anyArray.length; i++) { //first loop
    for (let j = 0; j < anyArray.length - i - 1; j++) { //second loop
      if (anyArray[j] > anyArray[j + 1]) { //if previous element greater than next
        let temp = anyArray[j]; //change element's places
        anyArray[j] = anyArray[j + 1];
        anyArray[j + 1] = temp;
      }
    }
  }
  return anyArray;

}

//insert data into the databse
function insertData(value1, value2) {
  //new poool to the database
  const pool = new pg.Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'sortings',
    password: 'qazwsx',
    port: '5432'
  });

//query to get values
  pool.query("insert into values (value, identifier) values (" + value1 + "," + "'" + value2 + "');",
    (err, res) => {
      console.log(err, res);
      pool.end();
    })
}

//get array values from an array of object
function getValues(arrayOfObj) {
  let result = [];
  for (let i = 0; i < arrayOfObj.length; i++) {
    result[i] = arrayOfObj[i].value;
  }
  return result;
}

//start server on automatically  choosen port, or port 3000
app.listen(process.env.PORT || 3000, () => console.log("Server started on port 3000"));
