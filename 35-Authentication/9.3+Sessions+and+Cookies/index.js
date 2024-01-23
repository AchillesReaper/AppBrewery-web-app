import express from 'express';
import session from 'express-session'
import pg from 'pg';
import passport from 'passport';
import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';


const app = express();
const port = 3000;
const saltRounds = 10;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: "top-gun",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))


//Passport initialization.
app.use(passport.initialize());
//Middleware that will restore login state from a session.
app.use(passport.session())

const db = new pg.Client({
    host: 'localhost',
    port: '5433',
    user: 'postgres',
    password: '1234',
    database: 'authentication'
})

db.connect();

// get request for pages
app.get('/', (req, res) => {
    res.render('home.ejs')
})

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.get("/register", (req, res) => {
    res.render("register.ejs");
});

app.get('/secrets', (req, res) => {
    console.log(`is autheticated? => ${req.isAuthenticated()}`);
    if (req.isAuthenticated()) {
        res.render('secrets.ejs')
    } else {
        res.redirect('/login')
    }
})

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        res.redirect('/')
    })
})

// registering new user
app.post('/register', (req, res) => {
    const email = req.body.username
    const password = req.body.password

    db.query('SELECT * FROM users WHERE email = $1', [email], (err, result) => {
        if (result.rowCount === 0) {
            bcrypt.hash(passport, saltRounds, async (errB, hash) => {
                if (err) {
                    res.send(`${errB}`)
                }
                await db.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, password])
                res.render('secrets.ejs')
            })
        } else {
            res.redirect('/login')
        }
    })
})


// loging in
app.post('/login', passport.authenticate("local", {
    successRedirect: "/secrets",
    failureRedirect: '/login'
}))



passport.use(new Strategy(async (username, password, callback) => {
    console.log(`user name grab by strategy = ${username}`);
    console.log(`password grab by strategy = ${password}`);
    db.query("SELECT * FROM users WHERE email = $1", [username], (err, result) => {
        console.log(`result = ${result}`);
        if (result.rows.length === 0) {
            return callback("user not found")
        } else {
            const user = result.rows[0]
            const storedHashedPassword = user.password

            bcrypt.compare(password, storedHashedPassword, (errB, isPasswordValid) => {
                if (errB) {
                    return callback(errB)
                } else {
                    if (isPasswordValid) {
                        return callback(null, user)
                    } else {
                        return callback(null, false)
                    }
                }
            });
        }
    })

}))


// Registers a function used to serialize user objects into the session.
passport.serializeUser((user, cb) => {
    cb(null, user);
});

// Registers a function used to deserialize user objects out of the session.
passport.deserializeUser((user, cb) => {
    cb(null, user);
});


app.listen(port, () => {
    console.log(`Server runs on http://localhost:${port}`);
})