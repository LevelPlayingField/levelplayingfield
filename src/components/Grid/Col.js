/* @flow */
/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import cx from 'classnames';
import s from './Grid.scss';

type Props = { // TODO: Fix any -> string/number?
  sm?: any,
  md?: any,
  lg?: any,
  className?: string,
}
function Col({ sm, md, lg, className, ...props }: Props) {
  return (
    <div
      className={cx(
        s.col,
        s[`colSm${sm || '12'}`],
        s[`colMd${md || ''}`],
        s[`colLg${lg || ''}`],
        className
      )}
      {...props}
    />
  );
}

export default Col;
