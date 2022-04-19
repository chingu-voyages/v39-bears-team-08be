const express = require('express');
const app = express();

const cors = require('cors');

const port = 3000;

const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

app.use(cookieParser());

app.listen(port, (req, res) => {
  console.log(`server is listening on port ${port}`);
});
