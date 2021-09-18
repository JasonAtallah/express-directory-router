# express-directory-router

express-directory-router lets you build your express router using a directory tree with next to no boilerplate and without losing any features from [express](https://github.com/expressjs/express).

Inspired by [Next router](https://github.com/vercel/next.js).

You can find full examples [here](examples)

### Installation

`npm install --save express-directory-router`

### Basic Usage

```
DIRECTORY STRUCTURE
-------------------
* app.js
- routes
  * todos.js
  - todo
    * index.js (index files are used to create root level routes of path, same as creating todo.js)
    * :todoId.js (prefix filename with ":" for dynamic routes)

ROUTES GENERATED
----------------
GET /todos
GET /todo
POST /todo
GET /todo/:todoId
PUT /todo/:todoId
DELETE /todo/:todoId
```

```node
/* app.js */
const express = require('express');
const { createDirRouter } = require('../src/');

const runApp = async () => {
  const app = express();

  // Promised based as it generates routes at runtime
  const routes = await createDirRouter('routes');

  app.use(routes);
  app.listen(3000, () => console.log('Magic happening on port 3000'));
};

runApp();
```

```node
/* routes/todos.js */
exports.get = (req, res, next) => {...}
```

```node
/* routes/todo/index.js */
exports.get = (req, res, next) => {...}
exports.post = (req, res, next) => {...}
```

```node
/* routes/todo/:todoId.js */

// Accepts a single or an array of middleware
exports.get = [(req, res, next) => {...}, (req, res, next) => {...}]
exports.put = (req, res, next) => {...}
exports.delete = (req, res, next) => {...}
```
