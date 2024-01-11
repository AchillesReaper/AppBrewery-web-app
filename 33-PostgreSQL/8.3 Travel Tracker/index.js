import express from "express";
import pg from 'pg'

const app = express();
const port = 3000;


const db = new pg.Client({
  host: 'localhost',
  port: '5433',
  user: 'postgres',
  password: '1234',
  database: 'world'
})

db.connect()
let visited_countries = []


app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", async (req, res) => {

  const result = await db.query("SELECT country_code FROM visited_countries");
  console.log(result.rows);

  let countries = result.rows.map((row) => row.country_code)
  console.log(countries);


  res.render("index.ejs", { countries: countries, total: countries.length });

  db.end();
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
