/* eslint-disable no-undef */
const express = require("express");
const app = express();
const port =  5000;
const cors = require("cors");
const fs = require("fs");
app.use(cors());
app.use(express.json());
const crud = require("./lib/data");
const path = require("path");
//get routes
app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/users", (req, res) => {
  const mydata = req.body;

  fs.readFile("./.database/users/user.json", "utf-8", (error, data) => {
    if (error) {
      console.log(error);
      return;
    }
    const userdata = JSON.parse(data);
    userdata.user.push(mydata);
    fs.writeFileSync("./.database/users/user.json", JSON.stringify(userdata));
  });
});
//post route
app.post("/posts", (req, res) => {
  const postData = req.body;
  fs.readFile("./.database/posts/posts.json", "utf-8", (error, data) => {
    if (error) {
      console.log(error);
      return;
    }
    const userdata = JSON.parse(data);
    userdata.posts.push(postData);
    fs.writeFileSync("./.database/posts/posts.json", JSON.stringify(userdata));
  });
});

app.post("/searchlist", (req, res) => {
  const mydata = req.body;
  fs.readFile(
    "./.database/searchlist/searchlist.json",
    "utf-8",
    (error, data) => {
      if (error) {
        console.log(error);
        return;
      }
      const userdata = JSON.parse(data);
      userdata.search.push(mydata);
      fs.writeFileSync(
        "./.database/searchlist/searchlist.json",
        JSON.stringify(userdata)
      );
    }
  );
});
// post users route

//get users route
app.get("/users", (req, res) => {
  crud.read("./.database/users/user.json", (err, data) => {
    res.send(data);
  });
});
app.get("/searchlist", (req, res) => {
  crud.read("./.database/searchlist/searchlist.json", (err, data) => {
    const actualData = JSON.parse(data).search;
    res.send(actualData);
  });
});
//get post route

app.get("/posts", (req, res) => {
  crud.read("./.database/posts/posts.json", (err, data) => {
    if (!err) {
      res.send(JSON.parse(data).posts);
    }
  });
});

app.get("/posts/:id", (req, res) => {
  const id = req.params.id;
  crud.read("./.database/posts/posts.json", (err, data) => {
    if (!err) {
      const actualData = JSON.parse(data).posts;
      const foundPost = actualData.find((post) => post.batch == id);
      if (!foundPost) {
        console.log("no posts found");
      }
      res.send(foundPost);
    }
  });
});

// read all dir for user end
app.listen(port, () => {
  console.log("server running...");
});
