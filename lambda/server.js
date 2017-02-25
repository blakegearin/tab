
import path from 'path';
import {exec} from 'child_process';

import chokidar from 'chokidar';
import cors from 'cors';
import express from 'express';

import lambdas from './lambdas';

const EXPRESS_PORT = 8001;
let appServer;

function startServer(callback) {

  // Shut down the server if it's running.
  if (appServer) {
    appServer.close();
  }

  const app = express();
  app.use(cors());

  app.get('/', (req, res) => {
    res.send({test: 'hi'});
  });


  // Set endpoints for lambda functions.
  console.log(lambdas);

  // TODO: specify get/post
  lambdas.forEach((lambda) => {
    app.get('/' + lambda.name, (req, res) => {
      // TODO: real params
      console.log('Getting!');
      lambda.handler({ params: { id: 3 }})
        .then( response => res.send(response));
    });
  });

  appServer = app.listen(EXPRESS_PORT, () => {
    console.log(
      `Lambda service is now running on http://localhost:${EXPRESS_PORT}`
    );
    if (callback) {
      callback();
    }
  });
}

startServer();
