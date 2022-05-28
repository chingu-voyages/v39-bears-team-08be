const express = require('express');
const app = express();

const db = require('./src/db/connection');
//hash the password and add to the database
const bcrypt = require('bcrypt');
const saltRounds = 10;

const cors = require('cors');

const port = process.env.PORT || 5000;

const cookieParser = require('cookie-parser');
const { query } = require('express');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use(cookieParser());

// =========================== //
// ===== CREATE EXPENSES ==== //
// =========================== //

app.post('/createExpenses', async (req, res) => {
  console.log('hey from server');

  const {
    userID,
    id,
    groceries,
    restaurant,
    barcafe,
    rent,
    utilities,
    insurance,
    fuel,
    entertainment,
    communication,
    total,
  } = req.body;

  const q =
    'INSERT INTO expenses_table (userid,budgetid,groceries,restaurant,barcafe,rent,utilities,insurance,fuel,entertainment,communication,totalexpenses) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)';

  //not finished %100 , we are waiting for userID

  await db.query(
    q,
    [
      userID,
      id,
      groceries,
      restaurant,
      barcafe,
      rent,
      utilities,
      insurance,
      fuel,
      entertainment,
      communication,
      total,
    ],
    (err, data) => {
      if (err) {
        console.log('failed to add to database', err);
        return;
      }

      res.json({ message: 'successfully added to database' });
    }
  );
});

// =========================== //
// ===== UPDATE EXPENSES ==== //
// =========================== //

app.put('/updateExpenses', async (req, res) => {
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
    entertainment,
    communication,
    total,
  } = req.body;

  const q = `UPDATE expenses_table SET groceries = ${groceries},restaurant = ${restaurant},barCafe = ${barCafe},rent = ${rent},utilities = ${utilities},insurance = ${insurance},fuel = ${fuel},entertaiment = ${entertaiment},communication  = ${communication},total = ${total} WHERE budgetid = ${id}`;

  //not finished %100 , we are waiting for userID

  await db.query(q, (err, data) => {
    if (err) {
      console.log('failed to update database', err);
      return;
    }

    res.json({ message: 'successfully updated the database' });
  });
});

// =========================== //
// ===== DELETE EXPENSES ==== //
// =========================== //

app.delete('/deleteExpense/:budgetId', async (req, res) => {
  const { budgetId } = req.params;

  console.log(req.params);

  const q = `DELETE FROM expenses_table WHERE budgetid =${budgetId}`;

  await db.query(q, (err, data) => {
    console.log(err, data);
    if (err) {
      console.log('failed to delete from database', err);
      return;
    }

    res.json({ message: 'successfully deleted from database' });
  });
});

// =========================== //
// ===== CREATE USER ==== //
// =========================== //

app.post('/createUser', (req, res) => {
  console.log('hey from server');

  const { firstName, lastName, email, password } = req.body;
  console.log(req.body);

  bcrypt.hash(password, saltRounds, (err, hashed) => {
    if (err) {
      console.log(err);
      console.log('failed to hash your password');
      return;
    }

    const q = `INSERT INTO user_table (firstname,lastname,email,password) VALUES ($1,$2,$3,$4) RETURNING *`;

    db.query(q, [firstName, lastName, email, hashed], (err, data) => {
      if (err) {
        console.log('failed to add user to database', err);
        return;
      }

      res.json({ data: data.rows[0] });
    });
  });
});
// =========================== //
// ===== CREATE EXPENSES ==== //
// =========================== //

app.post('/createExpenses', (req, res) => {
  console.log('hey from server');

  const {
    userID,
    id,
    groceries,
    restaurant,
    barcafe,
    rent,
    utilities,
    insurance,
    fuel,
    entertaiment,
    communication,
    total,
  } = req.body;

  console.log(req.body);

  const q =
    'INSERT INTO expenses_table (userid,budgetid,groceries,restaurant,barcafe,rent,utilities,insurance,fuel,entertaiment,communication,totalexpenses) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)';

  db.query(
    q,
    [
      userID,
      id,
      groceries,
      restaurant,
      barcafe,
      rent,
      utilities,
      insurance,
      fuel,
      entertaiment,
      communication,
      total,
    ],
    (err, data) => {
      if (err) {
        console.log('failed to add to database', err);
        return;
      }

      console.log(data);
    }
  );
});

// =========================== //
// ===== CREATE BUDGET ==== //
// =========================== //

app.post('/createBudget', (req, res) => {
  console.log('hey from server');

  const {
    userID,
    budgetName,
    periodDate,
    startDate,
    endDate,
    totalAmountAllocated,
  } = req.body;

  const q =
    'INSERT INTO budget_table (userid,budgetname,perioddate,startdate,enddate,totalamountallocated) VALUES ($1,$2,$3,$4,$5,$6) RETURNING budgetid';

  db.query(
    q,
    [userID, budgetName, periodDate, startDate, endDate, totalAmountAllocated],
    (err, data) => {
      if (err) {
        console.log('failed to add budget to database', err);
        return;
      }

      res.json({ data: data.rows[0] });

      console.log('budget added to database');
    }
  );
});

// =========================== //
// ===== GET BUDGET ==== //
// =========================== //

app.get('/budget/:budgetId', async (req, res) => {
  console.log('hey from server');

  const { budgetId } = req.params;
  console.log(req.params);

  const q = `SELECT * FROM expenses_table WHERE budgetid = ${budgetId}`;

  console.log(q);

  await db.query(q, (err, data) => {
    if (err) {
      console.log('failed to add to database', err);
      return;
    }

    let total = 0;

    let i = 0;

    const newResponse = {};

    let amount = 0;

    for (let key in data.rows[0]) {
      if (i >= 5 && i < 14 && data.rows[0][key] !== 0) {
        newResponse[key] = data.rows[0][key];
        total += data.rows[0][key];
        amount++;
      }
      i++;
    }

    console.log({ data: newResponse, totalexpenses: total });

    res.json({ data: newResponse, totalexpenses: total, amount: amount });
  });
});

// =========================== //
// ===== GET BUDGETS (BY NAME) ==== //
// =========================== //

app.get('/budgets/:userID', async (req, res) => {
  console.log('hey from server');

  const { userID } = req.params;
  console.log('line 290:', userID);
  const q = `SELECT budgetname, budgetid, totalamountallocated FROM budget_table WHERE userid = ${userID}`;

  await db.query(q, (err, data) => {
    if (err) {
      console.log('failed to add to database', err);
      return;
    }

    const budgetNames = [];
    for (let i = 0; i < data.rows.length; i++) {
      budgetNames.push([
        data.rows[i].budgetname,
        data.rows[i].budgetid,
        data.rows[i].totalamountallocated,
      ]);
    }
    res.json({ data: budgetNames });

    console.log(budgetNames);
  });
});

// =========================== //
// ===== USER LOGIN ==== //
// =========================== //

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send('incorrect from submition');
  }

  const q = `SELECT * FROM user_table WHERE email = '${email}'`;
  await db.query(q, (err, data) => {
    if (err) {
      console.log('failed to add to database', err);
      return;
    }

    if (data.rows[0].email === email) {
      bcrypt.compare(password, data.rows[0].password, (err, result) => {
        if (result === true) {
          console.log(data.rows[0]);
          console.log('login successful');
          res.json({
            data: {
              userID: data.rows[0].userid,
              firstName: data.rows[0].firstName,
              lastName: data.rows[0].lastName,
              email: data.rows[0].email,
              password: password,
            },
          });
        } else {
          console.log('login failed');
          res.sendStatus(404).json({ message: 'login failed' });
        }
      });
    }
  });
});

app.listen(port, (req, res) => {
  console.log(`server is listening on port ${port}`);
});
