import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Debug.scss';

function Debug({ children }) {
  return <div className={s.debug}>{children}</div>;
}

Debug.propTypes = {
  children: PropTypes.element.isRequired,
};

export default withStyles(s)(Debug);
