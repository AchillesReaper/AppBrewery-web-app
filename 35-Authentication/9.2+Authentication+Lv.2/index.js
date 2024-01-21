import express from 'express';
import bcrypt from 'bcrypt';
import pg from 'pg';


const app = express();
const port = 3000;

const saltRounds = 10;


app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

const db = new pg.Client({
  host: 'localhost',
  port: '5433',
  user: 'postgres',
  password: '1234',
  database: 'authentication'
})

db.connect();

app.get('/', (req, res) => {
  res.render('home.ejs')
})

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});


app.post('/register', async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  db.query("SELECT * FROM users WHERE email = $1", [email], (err, result) => {
    // console.log(`result = ${JSON.stringify(result)}`);
    // console.log(`err = ${err}`);
    if (result.rowCount === 0) {
      bcrypt.hash(password, saltRounds, async (errB, hash) => {
        if (errB) {
          console.error("Error hashing password:", errB);
          res.redirect('register.ejs')
        } else {
          console.log(`hased password = ${hash}`);
          await db.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hash])
          res.render('secrets.ejs')
        }
      })
    } else {
      res.send("<h1>Email already exists. Try logging in.</h1>")
    }
  })
});

app.post('/login', async (req, res) => {
  const email = req.body.username;
  const loginPassword = req.body.password;

  db.query('SELECT * FROM users WHERE email = $1', [email], (err, result) => {
    if (err) {
      res.redirect('/login')
    } else {
      const user = result.rows[0]
      const savedHashedPassword = user.password
      bcrypt.compare(loginPassword, savedHashedPassword, (err, result) => {
        if (result){
          res.render('secrets.ejs')
        } else {
          res.send("<h1>Incorrect Password</h1>")
        }
      })
    }
  })
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
})


