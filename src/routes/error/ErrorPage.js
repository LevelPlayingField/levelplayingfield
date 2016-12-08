/* @flow */
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import s from './ErrorPage.scss';

function ErrorPage({ error }: { error: Error }) {
  const helmet = (
    <Helmet
      title="Internal Server Error"
      meta={[{ name: 'description', content: error.toString() }]}
      style={[{ type: 'text/css', cssText: s._getCss() }]}
    />
  );

  if (process.env.NODE_ENV !== 'production') {
    return (
      <div>
        {helmet}
        <h1>{error.name}</h1>
        <p>{error.message}</p>
        <pre>{error.stack}</pre>
      </div>
    );
  }

  return (
    <div>
      {helmet}
      <h1>Error</h1>
      <p>Sorry, a critical error occurred on this page.</p>
    </div>
  );
}

ErrorPage.propTypes = {
  error: PropTypes.object.isRequired,
};

export { ErrorPage as ErrorPageWithoutStyle };
export default ErrorPage;
