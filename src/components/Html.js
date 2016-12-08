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

type HelmetProp = {
  toString: () => string,
  toComponent: () => any,
};
type Props = {
  helmet: {
    htmlAttributes: HelmetProp,
    title: HelmetProp,
    base: HelmetProp,
    meta: HelmetProp,
    link: HelmetProp,
    script: HelmetProp,
    noscript: HelmetProp,
    style: HelmetProp,
  },
  title: string,
  description: string,
  style: ?string,
  script: ?string,
  chunk: ?string,
  children: ?string,
};

function Html({ helmet, script, chunk, children }: Props) {
  return (
    <html lang="en" className="no-js" {...helmet.htmlAttributes.toComponent()}>
      <head>
        {helmet.title.toComponent()}
        {helmet.meta.toComponent()}
        {helmet.link.toComponent()}
        {helmet.style.toComponent()}
      </head>
      <body>
        <div id="app" dangerouslySetInnerHTML={{ __html: children }}/>
        {script && <script src={script}/>}
        {chunk && <script src={chunk}/>}
      </body>
    </html>
  );
}

export default Html;
