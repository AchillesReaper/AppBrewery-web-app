import express from 'express';

const app = express()
const port = 3000


app.get('/', (req, res) => {
    const today = new Date();
    const day = today.getDate();
    let type = "weekday"
    let adv = "let's work hard"

    if (day == 0 || day ==6){
        type = 'weekend';
        adv = "let's have fun"
    }

    res.render('index.ejs', {
        dayType: type,
        advice: adv
    })
})

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
})