import express from "express";
import { dirname } from 'path';
import { fileURLToPath } from "url";


const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

function bandNameGenerator(req, res, next){
    const bandName = `${req.body.street} ${req.body.pet} 🤩`
    res.send(`<h1>Your band name is:</h1><h2>${bandName}</h2>`)
    next()
}

app.use(express.urlencoded({ extended: true }));
app.use('/submit', bandNameGenerator)


app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})

// app.post('/submit', (req, res) => {
//     console.log(req.body);
// })

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
