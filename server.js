const express = require('express');
const app = express();
const db = require('./src/db/connection')

const cors = require('cors');

const port = 5000;

const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use(cookieParser());

// console.log(groceries)
//         console.log(restaurant)
//         console.log(barCafe)
//         console.log(rent)
//         console.log(utilities)
//         console.log(insurance)
//         console.log(fuel)
//         console.log(entertaiment)
//         console.log(communication)
//         console.log(total)

app.post('/createExpenses', (req, res) => {
  console.log('hey from server');

  const {
    userID,
    id,
    groceries,
    restaurant,
    barCafe,
    rent,
    utilities,
    insurance,
    fuel,
    entertaiment,
    communication,
    total,
  } = req.body;

  console.log(req.body);

const q = 'INSERT INTO expenses_table (userid,budgetid,groceries,restaurant,barcafe,rent,utilities,insurance,fuel,entertaiment,communication,totalexpenses) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)



});

await db.query(q,[userID,id,groceries,restaurant,barcafe,rent,utilities,insurance,fuel,entertaiment,communication,total],(err,data) => {

  if(err){
console.log('failed to add to database',err);
return;
  }

  console.log(data);



})

app.listen(port, (req, res) => {
  console.log(`server is listening on port ${port}`);
});
