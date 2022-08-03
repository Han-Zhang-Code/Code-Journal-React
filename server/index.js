require('dotenv/config');
const pg = require('pg');
const path = require('path');
const ClientError = require('./client-error');
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
    values ($1,$2,$3,$4,$5,$6)
    returning *
  `;
  const codeArray = [req.body.html, req.body.css, req.body.javascript, req.body.title, req.body.imageUrl, req.body.description];
  db.query(sql, codeArray).then(result => {
    res.status(200).json(result.rows[0]);
  }).catch(err => next(err));
});

app.patch('/api/code/:entryId', (req, res, next) => {
  const entryId = Number(req.params.entryId);
  if (!entryId) {
    throw new ClientError(400, 'entryId must be a positive integer');
  }
  const sql = `
  update "code-journal" set "html"=$1,"css"=$2,"javascript"=$3,"title"=$4,"imageUrl"=$5,"description"=$6 where "entryId"=$7 returning *
  `;
  const codeArray = [req.body.html, req.body.css, req.body.javascript, req.body.title, req.body.imageUrl, req.body.description, entryId];
  db.query(sql, codeArray)
    .then(result => {
      if (!result.rows[0]) {
        throw new ClientError(404, `cannot find entry with entryId ${entryId}`);
      }
      res.json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.get('/api/code', (req, res, next) => {
  const sql = `
    select * from "code-journal"
  `;
  db.query(sql).then(result => {
    res.status(200).json(result.rows);
  }).catch(err => next(err));
});

app.get('/api/alphabet', (req, res, next) => {
  const sql = `
    select * from "code-journal"
    order by "title"
  `;
  db.query(sql).then(result => {
    res.status(200).json(result.rows);
  }).catch(err => next(err));
});

app.get('/api/code/:entryId', (req, res, next) => {
  const entryId = Number(req.params.entryId);
  if (!entryId) {
    throw new ClientError(400, 'entryId must be a positive integer');
  }
  const sql = `
    select * from "code-journal"
     where "entryId" = $1
  `;
  const params = [entryId];
  db.query(sql, params)
    .then(result => {
      if (!result.rows[0]) {
        throw new ClientError(404, `cannot find entry with entryId ${entryId}`);
      }
      res.json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.delete('/api/code/:entryId', (req, res, next) => {
  const entryId = Number(req.params.entryId);
  if (!entryId) {
    throw new ClientError(400, 'entryId must be a positive integer');
  }
  const sql = `
    delete from "code-journal"
     where "entryId" = $1
  `;
  const params = [entryId];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
