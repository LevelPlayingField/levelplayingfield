/* @flow */

import React from 'react';
import Link from '../../components/Link';
import { Container, Row, Col } from '../../components/Grid';
import MDSearch from 'react-icons/lib/io/android-search';
import s from './Search.scss';

export default class SearchInput extends React.Component {
  static contextTypes = {
    history: React.PropTypes.any.isRequired,
  };

  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this);
    this.state = {
      query: props.query,
    }
  }

  handleChange(e) {
    const query = e.target.value;

    this.setState({ query });
    this.props.onChange(query);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.query != nextProps.query) {
      this.setState({ query: nextProps.query });
    }
  }

  setUrl() {
    const { history } = this.context;

    history.push(`/search?q=${encodeURIComponent(this.refs.input.value)}`, {
      search_query: this.refs.input.value,
    });
  }

  render() {
    const { query } = this.state;

    return (
      <Row centerMd centerLg>
        <Col sm={12} md={8} lg={6}>
          <input
            className={s.searchField}
            onChange={this.handleChange}
            onBlur={() => this.setUrl()}
            value={query}
            ref="input"
          />
          <MDSearch className={s.searchIcon}/>
        </Col>
      </Row>
    );
  }
}