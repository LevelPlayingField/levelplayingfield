/* @flow */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './Grid.scss';

type Props = {
  fluid?: bool,
  className?: string,
};

function Container({ fluid = false, className, ...props }: Props) {
  return (
    <div className={cx(s.container, fluid && s.containerFluid, className)} {...props}/>
  );
}

export default withStyles(s)(Container);
