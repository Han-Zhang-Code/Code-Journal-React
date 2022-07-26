require('dotenv/config');
const pg = require('pg');
const path = require('path');
const express = require('express');
const errorMiddleware = require('./error-middleware');
const db = new pg.Pool({ // eslint-disable-line
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();
const publicPath = path.join(__dirname, 'public');

if (process.env.NODE_ENV === 'development') {
  app.use(require('./dev-middleware')(publicPath));
} else {
  app.use(express.static(publicPath));
}
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ hello: 'world' });
});

app.post('/api/code', (req, res, next) => {

  const sql = `
    insert into "code-journal"("html","css","javascript","title","imageUrl","description")
    values ($1,$2,$3,'','','')
    returning *
  `;
  const codeArray = [req.body.html, req.body.css, req.body.javascript];
  db.query(sql, codeArray).then(result => {
    res.status(200).json(result.rows[0]);
  }).catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
