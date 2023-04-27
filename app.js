const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Task, List } = require("./mongodb.js");

const app = express();

app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

//Creating Document

const task1 = new Task({
  work: "Make a Coffee",
  status: "notchecked",
});

const task2 = new Task({
  work: "Sign in to Office",
  status: "notchecked",
});

const defaultTask = [task1, task2];

app.get("/", (req, res) => {
  Task.find({},(err, docs) => {
    if (!err) {
      console.log(docs);
      if (docs.length === 0) {
          Task.insertMany(defaultTask,(err,docs)=>{
            if(!err){
              res.redirect("/");
            }else{
              console.log(err)
            }
          });
      } else {
        let activetasks = docs.filter((a) => {
          return a.status === "notchecked";
        });

        let finishedtasks = docs.filter((a) => {
          return a.status === "checked";
        });
        res.render("index", {
          listTitle: "Today",
          alltasks: docs,
          activetasks: activetasks,
          finishedtasks: finishedtasks,
        });
      }
    } else {
      console.log(err);
    }
  });
});

//CustomList Creation
app.get("/add/:id", (req, res) => {
  const parameter = req.params.id;

  List.findOne({ listTitle: parameter }, function (err, docs) {
    if (!err) {
      if (!docs) {
        const list1 = new List({
          listTitle: parameter,
          items: defaultTask,
        });

        list1.save();

        res.redirect("/add/" + parameter);
      } else {
        let array = docs.items;

        let activetasks = array.filter((a) => {
          return a.status === "notchecked";
        });

        let finishedtasks = array.filter((a) => {
          return a.status === "checked";
        });

        res.render("index", {
          listTitle: parameter,
          alltasks: array,
          activetasks: activetasks,
          finishedtasks: finishedtasks,
        });
      }
    }
  });
});

app.post("/", (req, res) => {
  const listType = req.body.add;

  const newtask = new Task({
    work: req.body.newtask,
    status: "notchecked",
  });

  if (listType === "Today") {
    newtask.save();
    res.redirect("/");
  } else {
    List.findOne({ listTitle: listType }, function (err, docs) {
      if (!err) {
        docs.items.push(newtask);
        docs.save();
        res.redirect("/add/" + listType);
      }
    });
  }
});

app.post("/delete", (req, res) => {
  const checkboxId = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "Today") {
    Task.findOneAndUpdate(
      { _id: checkboxId },
      { status: "checked" },
      null,
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/");
        }
      }
    );
  } else {
    List.findOne({ listTitle: listName }, function (err, docs) {
      if (!err) {
        docs.items.map((obj) => {
          if (obj._id == checkboxId) {
            obj.status = "checked";
          }
        });

        docs.save();
        // i don't know why but it is not applying css only in once redirect but it worked after dual refresh
        let count = 1;
        for (let i = 0; i < count; i++) {
          res.redirect("/add/" + listName);
        }
      }
    });
  }
});

app.listen(3003, () => {
  console.log(`The app is running at http://localhost:3003`);
});
