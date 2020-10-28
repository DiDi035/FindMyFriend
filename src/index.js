const express = require("express");
const { v4: uuidv4 } = require("uuid"); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
const methodOverride = require("method-override");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");
})

const PORT = 8000;
app.listen(PORT, () => {
  console.log("Listening to port " + PORT);
});