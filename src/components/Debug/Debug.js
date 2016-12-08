/* @flow */
import React from 'react';
import Helmet from 'react-helmet';
import s from './Debug.scss';

type Props = {
  children: any,
};

function Debug({ children }: Props) {
  return (
    <div className={s.debug}>
      <Helmet style={[s]}/>
      {children}
    </div>
  );
}

export default Debug;
