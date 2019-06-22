const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

//port
const port = 3000;

//int app
const app = express();

//mongo dababase location identification
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const url = "mongodb://localhost:27017/todolist";

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//View Setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//Connect to mongodb
MongoClient.connect(url, (err, database) => {
  console.log("MongoDB Connected...");
  if (err) throw err;

  db = database;
  Todos = db.collection("todos");

  //used not to keep connecting the server for every db connection
  app.listen(port, () => {
    console.log("Server running on port " + port);
  });
});

//routers
app.get("/", (req, res, next) => {
  //fetch data from mongodb table 'todos'
  Todos.find({}).toArray((err, todos) => {
    if (err) {
      return console.log(err);
    }
    //console.log(todos);
    //pass to the views
    res.render("index", {
      todos: todos
    });
  });
});

//post request route
app.post("/todo/add", (req, res, next) => {
  //create to do object to add to the mongodb
  const todo = {
    text: req.body.text,
    body: req.body.body
  };

  //Insert the todo object into db
  Todos.insert(todo, (err, result) => {
    if (err) {
      return console.log(err);
    }
    console.log("Todo added..");
    res.redirect("/");
  });
});

//delete request route
app.delete("/todo/delete/:id", (req, res, next) => {
  const query = { _id: ObjectID(req.params.id) };
  Todos.deleteOne(query, (err, response) => {
    if (err) {
      return console.log(err);
    }
    console.log("Todo Removed");
    res.send(200);
  });
});

//get request for edit (update the content from the database)
//routers
app.get("/todo/edit/:id", (req, res, next) => {
  const query = { _id: ObjectID(req.params.id) };

  //fetch data from mongodb table 'todos'
  Todos.find(query).next((err, todo) => {
    if (err) {
      return console.log(err);
    }
    //console.log(todos);
    //pass to the views
    res.render("edit", {
      todo: todo
    });
  });
});

//
//post request route for updating the new input from user as post request
app.post("/todo/edit/:id", (req, res, next) => {
  const query = { _id: ObjectID(req.params.id) };

  //create to do object to add to the mongodb
  const todo = {
    text: req.body.text,
    body: req.body.body
  };

  //Insert the todo object into db
  Todos.updateOne(query, { $set: todo }, (err, result) => {
    if (err) {
      return console.log(err);
    }
    console.log("Todo updated..");
    res.redirect("/");
  });
});
