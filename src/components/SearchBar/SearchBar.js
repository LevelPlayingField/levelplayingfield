/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import querystring from 'query-string';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/fontawesome-free-solid';
import Helmet from 'react-helmet';
import s from './SearchBar.scss';

type FullLocation = Location & {
  state: { [key: string]: any },
};

type Props = {
  className: ?string,
};
type State = {
  hideField: boolean,
  query: string,
};

class SearchBar extends React.Component {
  props: Props;
  state: State;
  unlisten: () => void;
  static contextTypes = {
    history: PropTypes.any.isRequired,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      hideField: false,
      query: '',
    };
  }

  componentWillMount() {
    this.unlisten = this.context.history.listen(location => this.handleLocation(location));
    this.handleLocation(this.context.history.location);
  }

  componentWillUnmount() {
    if (this.unlisten != null) {
      this.unlisten();
    }
  }

  handleLocation(location: FullLocation) {
    this.setState({ hideField: location.pathname === '/search' });

    if (location.pathname === '/search') {
      if (location.state && location.state.search_query) {
        this.setState({ query: location.state.search_query });
      } else {
        this.setState({ query: querystring.parse(location.search).q });
      }
    }
  }

  pushUrl() {
    const { history } = this.context;

    history.push(`/search?q=${encodeURIComponent(this.state.query)}`, {
      search_query: this.state.query,
    });
  }

  render() {
    const { className } = this.props;

    return (
      <div className={cx(s.root, className)} role="navigation">
        <Helmet style={[{ type: 'text/css', cssText: s._getCss() }]}/>
        {this.state.hideField ? null : (
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
            <FontAwesomeIcon icon={faSearch} size='lg'/>
          </label>
        )}
      </div>
    );
  }
}

export default SearchBar;
