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
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import MDSearch from 'react-icons/lib/io/android-search';
import s from './Navigation.scss';
import Link from '../Link';

type Props = {
  className: ?string,
};
type State = {
  query: string,
};

class Navigation extends React.Component {
  props: Props;
  state: State;
  unlisten: () => void;
  static contextTypes = {
    history: React.PropTypes.any.isRequired,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      query: '',
    };
  }

  componentWillMount() {
    this.unlisten = this.context.history.listen((location) => {
      if (location.state && location.state.search_query) {
        this.setState({ query: location.state.search_query });
      }
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  pushUrl() {
    const { history } = this.context;

    history.push(`/search?q=${encodeURIComponent(this.state.query)}`, { search_query: this.state.query });
  }

  render() {
    const { className } = this.props;

    return (
      <div className={cx(s.root, className)} role="navigation">
        <a
          className={s.link}
          href="https://lpf.dntly.com/#/donate"
          target="_blank"
          rel="noopener noreferrer"
        >
          Donate
        </a>
        {/* <Link className={s.link} to="/donate">Donate</Link> */}
        <Link className={s.link} to="/search?q=is:case">Cases</Link>
        <Link className={s.link} to="/search?q=is:party">Parties</Link>

        <label htmlFor="search" className={s.search}>
          <input
            type="search"
            name="search"
            className={s.searchField}
            value={this.state.query}
            onChange={e => this.setState({ query: e.target.value })}
            onBlur={e => e.target.value && this.pushUrl(e)}
            onKeyDown={e => e.keyCode === 13 && this.pushUrl(e)}
          />
          <MDSearch className={s.searchIcon}/>
        </label>
      </div>
    );
  }
}

export default withStyles(s)(Navigation);
