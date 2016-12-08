/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import 'babel-polyfill';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import expressGraphQL from 'express-graphql';
import morgan from 'morgan';
import React from 'react';
import ReactDOM from 'react-dom/server';
import UniversalRouter from 'universal-router';
import Helmet from 'react-helmet';
import PrettyError from 'pretty-error';
import createMemoryHistory from 'history/createMemoryHistory';
import App from './components/App';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.scss';
import models from './data/models';
import schema from './data/schema';
import routes from './routes';
import assets from './assets'; // eslint-disable-line import/no-unresolved
import { port } from './config'; // eslint-disable-line import/no-unresolved

const app = express();

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('short'));

//
// Register API middleware
// -----------------------------------------------------------------------------
app.use('/graphql', expressGraphQL(req => ({
  schema,
  graphiql: true,
  rootValue: { request: req },
  pretty: process.env.NODE_ENV !== 'production',
})));

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async(req, res, next) => {
  try {
    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const history = createMemoryHistory({ initialEntries: [req.url] });
    const context = { history };

    const route = await UniversalRouter.resolve(routes, {
      path: req.path,
      query: req.query,
    });

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect);
      return;
    }

    const children = ReactDOM.renderToString(<App context={context}>{route.component}</App>);
    const helmet = Helmet.rewind();
    const html = ReactDOM.renderToStaticMarkup(
      <Html
        helmet={helmet}
        script={assets.main.js}
        chunk={assets[route.chunk] && assets[route.chunk].js}
      >
      {children}
      </Html>
    );

    res.status(route.status || 200);
    res.send(`<!doctype html>${html}`);
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.log(pe.render(err)); // eslint-disable-line no-console
  const children = ReactDOM.renderToString(<ErrorPageWithoutStyle error={err}/>);
  const helmet = Helmet.rewind();

  const html = ReactDOM.renderToStaticMarkup(
    <Html helmet={helmet}>{children}</Html>
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
/* eslint-disable no-console */
models.sync()
  .catch(err => console.error(err.stack))
  .then(() => {
    app.listen(port, () => {
      console.log(`The server is running at http://localhost:${port}/`);
    });
  });
