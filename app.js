const express = require("express");
const app = express();
const routes = require(__dirname + "/routes/route.js");
const bodyParser = require("body-parser");

// app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use("/home", routes);



app.listen(4000, () => {
    console.log("The server is running on port 4000");
});