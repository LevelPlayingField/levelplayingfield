import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Debug.css';

function Debug({ children }) {
  return ( <div className={s.debug} children={children}/> );
}
Debug.propTypes = {
  children: React.PropTypes.element.isRequired,
};

export default withStyles(s)(Debug)
