require('dotenv/config');
const pg = require('pg');
const path = require('path');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const ClientError = require('./client-error');
const express = require('express');
const errorMiddleware = require('./error-middleware');
const authorizationMiddleware = require('./authorization-middleware');
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

app.post('/api/auth/sign-up', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(400, 'username and password are required fields');
  }
  argon2
    .hash(password)
    .then(hashedPassword => {
      const sql = `
        insert into "users" ("username", "hashedPassword")
        values ($1, $2)
        returning "userId", "username", "createdAt"
      `;
      const params = [username, hashedPassword];
      return db.query(sql, params);
    })
    .then(result => {
      const [user] = result.rows;
      res.status(201).json(user);
    })
    .catch(err => next(err));
});

app.post('/api/auth/sign-in', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(401, 'invalid login');
  }
  const sql = `
    select "userId",
           "hashedPassword"
      from "users"
     where "username" = $1
  `;
  const params = [username];
  db.query(sql, params)
    .then(result => {
      const [user] = result.rows;
      if (!user) {
        throw new ClientError(401, 'invalid login');
      }
      const { userId, hashedPassword } = user;
      return argon2
        .verify(hashedPassword, password)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'invalid login');
          }
          const payload = { userId, username };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.json({ token, user: payload });
        });
    })
    .catch(err => next(err));
});
app.use(authorizationMiddleware);
app.get('/api/hello', (req, res) => {
  res.json({ hello: 'world' });
});

app.post('/api/code', (req, res, next) => {
  const { userId } = req.user;
  const sql = `
    insert into "code-journal"("html","css","javascript","title","imageUrl","description","userId","shared")
    values ($1,$2,$3,$4,$5,$6,$7,'no')
    returning *
  `;
  const codeArray = [req.body.html, req.body.css, req.body.javascript, req.body.title, req.body.imageUrl, req.body.description, userId];
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

app.patch('/api/share/:entryId', (req, res, next) => {
  const entryId = Number(req.params.entryId);
  if (!entryId) {
    throw new ClientError(400, 'entryId must be a positive integer');
  }
  const sql = `
  update "code-journal" set "shared"='yes' where "entryId"=$1 returning *
  `;
  const codeArray = [entryId];
  db.query(sql, codeArray)
    .then(result => {
      if (!result.rows[0]) {
        throw new ClientError(404, `cannot find entry with entryId ${entryId}`);
      }
      res.json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.patch('/api/noshare/:entryId', (req, res, next) => {
  const entryId = Number(req.params.entryId);
  if (!entryId) {
    throw new ClientError(400, 'entryId must be a positive integer');
  }
  const sql = `
  update "code-journal" set "shared"='no' where "entryId"=$1 returning *
  `;
  const codeArray = [entryId];
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
  const { userId } = req.user;
  const sql = `
    select * from "code-journal" where "userId"=$1 or "shared"='yes'
  `;
  const params = [userId];
  db.query(sql, params).then(result => {
    res.status(200).json(result.rows);
  }).catch(err => next(err));
});

app.get('/api/alphabet', (req, res, next) => {
  const { userId } = req.user;
  const sql = `
    select * from "code-journal" where "userId"=$1 or "shared"='yes'
    order by "title"
  `;
  const params = [userId];
  db.query(sql, params).then(result => {
    res.status(200).json(result.rows);
  }).catch(err => next(err));
});

app.get('/api/createTime', (req, res, next) => {
  const { userId } = req.user;
  const sql = `
    select * from "code-journal" where "userId"=$1 or "shared"='yes'
    order by "entryId"
  `;
  const params = [userId];
  db.query(sql, params).then(result => {
    res.status(200).json(result.rows);
  }).catch(err => next(err));
});

app.get('/api/size', (req, res, next) => {
  const { userId } = req.user;
  const sql = `
    select * from "code-journal" where "userId"=$1 or "shared"='yes'
    order by length("javascript")
  `;
  const params = [userId];
  db.query(sql, params).then(result => {
    res.status(200).json(result.rows);
  }).catch(err => next(err));
});

app.get('/api/search/:title', (req, res, next) => {
  const { userId } = req.user;
  const title = req.params.title;
  const sql = `
    select * from "code-journal"
    where ("userId"=$2 or "shared"='yes') and "title" like '%' || $1 || '%'
  `;
  const searchItem = [title, userId];
  db.query(sql, searchItem).then(result => {
    if (!result.rows[0]) {
      throw new ClientError(404, `cannot find entry with title ${searchItem}`);
    }
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
