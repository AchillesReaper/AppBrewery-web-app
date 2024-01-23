import express from 'express';
import session from 'express-session'
import pg from 'pg';
import passport from 'passport';
import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';


const app = express();
const port = 3000;
const saltRounds = 10;


app.use(session({
    secret: "top-gun",
    resave: false,
    saveUninitialized: false
}))

app.get('/setSession', (req, res) => {
    req.session.username = 'john_doe';
    res.send('Session set!');
});

app.get('/getSession', (req, res) => {
    const username = req.session.username || 'Guest';
    res.send(`Hello, ${username}!`);
});


app.listen(port, () => {
    console.log(`Server runs on http://localhost${port}`);
})