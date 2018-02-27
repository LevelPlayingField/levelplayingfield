/* @flow */
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import s from '!!isomorphic-style-loader!css?modules=false!@fortawesome/fontawesome/styles.css';
import { IntlProvider } from 'react-intl';

const ContextType = {
  history: PropTypes.any.isRequired,
};

/**
 * The top-level React component setting context (global) variables
 * that can be accessed from all the child components.
 *
 * https://facebook.github.io/react/docs/context.html
 *
 * Usage example:
 *
 *   const context = {
 *     history: createBrowserHistory(),
 *     store: createStore(),
 *   };
 *
 *   ReactDOM.render(<App context={context}><HomePage /></App>, container);
 */
class App extends React.Component {
  static propTypes = {
    context: PropTypes.shape(ContextType).isRequired,
    children: PropTypes.element.isRequired,
  };

  static childContextTypes = ContextType;

  getChildContext() {
    return this.props.context;
  }

  render() {
    // NOTE: If you need to add or modify header, footer etc. of the app,
    // please do that inside the Layout component.
    return (
      <IntlProvider locale="en">
        <div>
          <Helmet
            title="Level Playing Field"
            htmlAttributes={{
              lang: 'en',
            }}
            meta={[
              { charSet: 'utf-8' },
              { httpEquiv: 'x-ua-compatible', content: 'ie=edge' },
              { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
              { name: 'msapplication-TileColor', content: '$373277' },
              { name: 'msapplication-TileImage', content: '/tile.png' },
            ]}
            link={[
              { rel: 'author', href: 'humans.txt' },
              { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500' },
              { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
              { rel: 'icon', href: '/favicon.png', type: 'image/png' },
              { rel: 'icon', href: '/favicon.ico', type: 'image/vnd.microsoft.icon' },
              { rel: 'apple-touch-icon', href: 'apple-touch-icon.png' },
            ]}
            style={[{ type: 'text/css', cssText: s._getCss() }]}
          />
          {React.Children.only(this.props.children)}
        </div>
      </IntlProvider>
    );
  }

}

export default App;
