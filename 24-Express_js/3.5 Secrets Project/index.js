//To see how the final website should work, run "node solution.js".
//Make sure you have installed all the dependencies with "npm i".
//The password is ILoveProgramming
import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url))


function passwordCheck(req, res, next) {
    console.log('req url');
    console.log('psw check invoked');
    const pswInput = req.body.password;
    console.log('psw: ', pswInput);
    if (pswInput === 'ILoveProgramming') {
        res.sendFile(__dirname + "/public/secret.html");
    } else {
        res.sendFile(__dirname + '/public/index.html')
    }
    next();
}

app.use(express.urlencoded({ extended: true }))
app.use('/check', passwordCheck)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
    console.log(__dirname);
})

app.post('/check', () => {

})

app.listen(port, () => {
    console.log(`listening to port ${port}`);
})