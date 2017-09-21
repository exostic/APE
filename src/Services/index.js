module.exports = {
  auth: {
    module: __dirname + '/auth.js',
    fnName: 'auth',
  },
  log: {
    module: __dirname + '/log.js',
    fnName: 'log',
  },
  query: {
    module: __dirname + '/query.js',
    fnName: 'query',
  },
  parse: {
    module: __dirname + '/parse.js',
    fnName: 'parse',
  },
  wait: {
    module: __dirname + '/wait.js',
    fnName: 'wait',
  },
};
