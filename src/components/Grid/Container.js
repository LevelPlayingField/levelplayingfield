/* @flow */

import React from 'react';
import cx from 'classnames';
import Helmet from 'react-helmet';
import s from './Grid.scss';

type Props = {
  fluid?: bool,
  className?: string,
};

function Container({ fluid = false, className, children, ...props }: Props) {
  return (
    <div className={cx(s.container, fluid && s.containerFluid, className)} {...props}>
      <Helmet style={[{ type: 'text/css', cssText: s._getCss() }]}/>
      {children}
    </div>
  );
}

export default Container;
