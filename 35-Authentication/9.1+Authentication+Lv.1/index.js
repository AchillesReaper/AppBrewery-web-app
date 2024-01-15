import express from "express"
import pg from "pg"

const app = express();
const port = 3000;

const db = new pg.Client({
    host: 'localhost',
    port: '5433',
    database: 'authentication',
    user: 'postgres',
    password: '1234'
});

db.connect();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('home.ejs')
});

app.get('/register', (req, res) => {
    res.render('register.ejs')
});

app.get('/login', (req, res) => {
    res.render('login.ejs')
});


app.post('/register', async (req, res) => {
    const email = req.body.username;
    const psw = req.body.password;

    let data = await db.query('SELECT email FROM users WHERE email = $1', [email])
    if (data.rowCount > 0) {
        res.send('<h1>this email is registered</h1>')
    } else {
        if (psw) {
            try {
                await db.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, psw]);
                res.render('secrets.ejs')
            } catch (err) {
                res.send(`${err}`)
            }
        } else {
            res.send('<h1>password field is empty</h1>')
        }
    }
});

app.post('/login', async (req, res) => {
    const email = req.body.username;
    const psw = req.body.password;

    let data = await db.query("SELECT email, password FROM users WHERE email = $1", [email])
    if (data.rowCount == 1) {
        if (psw === data.rows[0].password) {
            res.render("secrets.ejs")
        } else {
            res.send('<h1>user or password wrong</h1>')
        }
    } else {
        res.send('<h1>user or password wrong</h1>')
    }

});



app.listen(port, () => {
    console.log(`server running on http://localhotst:${port}`);
});