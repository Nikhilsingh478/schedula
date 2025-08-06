const jsonServer = require('json-server');
const cors = require('cors');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, './db.json'));
const middlewares = jsonServer.defaults();

// Enable CORS for all routes
server.use(cors());

// Use default middlewares (logger, static, cors and others)
server.use(middlewares);

// Use router
server.use(router);

const port = process.env.PORT || 3001;

server.listen(port, '0.0.0.0', () => {
  console.log(`JSON Server is running on port ${port}`);
  console.log(`API available at http://localhost:${port}`);
}); 