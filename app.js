import express from "express";
import bodyParser from "body-parser";
import animalsRouter from "./routers/animalsRouter.js";
import cors from "cors";
import usersRouter from "./routers/usersRouter.js";
import mongoose from "mongoose";
import "dotenv/config";


const app = express();

app.use(cors({
    origin: process.env.UI_URL,
}));

app.use(bodyParser.json());

app.use("/animals", animalsRouter);//might be able to get rid of

app.use("/users", usersRouter);//use this for animals

mongoose.connect(process.env.DB_CONNECTION_STRING).then(()=> {
        console.log("Successfully connected to DB");
        const port = process.env.PORT ?? 3000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((e) => console.error(`unable to connect to DB with error: ${e} `));

