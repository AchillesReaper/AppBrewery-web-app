import express from "express";
import {dirname} from 'path'
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

const __dirname = dirname(fileURLToPath(import.meta.url))

function logger(req, res, next){
    console.log('Request method: ', req.method);
    console.log('Request URL: ', req.url);
    next()

}

app.use(logger);

app.get("/", (req, res) => {
  // res.send("Hello");
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
