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


//POST CREATE EXPENSES
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

const q = 'INSERT INTO expenses_table (userid,budgetid,groceries,restaurant,barcafe,rent,utilities,insurance,fuel,entertaiment,communication,totalexpenses) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)'

db.query(q,[userID,id,groceries,restaurant,barcafe,rent,utilities,insurance,fuel,entertaiment,communication,total],(err,data) => {

  if(err){
console.log('failed to add to database',err);
return;
  }

  console.log(data);



})

});



//POST CREATE BUDGET
app.post('/createBudget', (req, res) => {
  console.log('hey from server');

const {
userId,
id,
budgetName,
periodDate,
startDate,
endDate,
totalAmountAllocated
}  = req.body;

const q = 'INSERT INTO budget_table (userid,budgetid,budgetname,perioddate,startdate,enddate,totalamountallocated) VALUES ($1,$2,$3,$4,$5,$6,$7)'

db.query(q,[userID,id,budgetName,periodDate,startDate,endDate,totalAmountAllocated],(err,data) => {

  if(err){
console.log('failed to add to database',err);
return;
  }

  console.log(data);



})

});


//GET BUDGET (EXPENSES)
app.get('/budget/:budgetId', async (req, res) => {
  console.log('hey from server');

  const {budgetId} = req.params;
  console.log(req.params)

const q = `SELECT * FROM expenses_table WHERE budgetid = ${budgetId}`;

  console.log(q)

await db.query(q,(err,data) => {

  if(err){
console.log('failed to add to database',err);
return;
  }

res.json ({data: data.rows[0]});

console.log(data.rows[0]);


})

});






app.listen(port, (req, res) => {
  console.log(`server is listening on port ${port}`);
});
