import express from "express";
import bodyParser from "body-parser";
import dummyAnimals from "./dummyData/animals.js";

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res, next) => {
    res.send(dummyAnimals);
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});