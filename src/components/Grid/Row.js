/* @flow */
/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import cx from 'classnames';
import s from './Grid.scss';

class Row extends React.Component {
  props: {
    centerSm?: ?bool,
    centerMd?: ?bool,
    centerLg?: ?bool,
    className?: any,
  };

  render() {
    const { className = null, centerSm, centerMd, centerLg, ...props } = this.props;
    const extraClasses = [];

    if (centerSm) {
      extraClasses.push(s.centerSm);
    }
    if (centerMd) {
      extraClasses.push(s.centerMd);
    }
    if (centerLg) {
      extraClasses.push(s.centerLg);
    }

    return (
      <div className={cx(s.row, ...extraClasses, className)} {...props}/>
    );
  }
}


export default Row;
