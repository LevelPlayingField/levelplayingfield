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
import { analytics } from '../config';

type Props = {
  title: string,
  description: string,
  style: ?string,
  script: ?string,
  chunk: ?string,
  children: ?string,
};

function Html({ title, description, style, script, chunk, children }: Props) {
  return (
    <html className="no-js" lang="en">
      <head>
        <meta charSet="utf-8"/>
        <meta httpEquiv="x-ua-compatible" content="ie=edge"/>
        <title>{title}</title>
        <meta name="description" content={description}/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
        <link rel="apple-touch-icon" href="apple-touch-icon.png"/>
        <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet"/>
        {style && <style id="css" dangerouslySetInnerHTML={{ __html: style }}/>}
      </head>
      <body>
        <div id="app" dangerouslySetInnerHTML={{ __html: children }}/>
        {script && <script src={script}/>}
        {chunk && <script src={chunk}/>}
        {analytics.google.trackingId &&
        <script
          dangerouslySetInnerHTML={{ __html:
                'window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;' +
                `ga('create','${analytics.google.trackingId}','auto');ga('send','pageview')` }}
        />
        }
        {analytics.google.trackingId &&
        <script src="https://www.google-analytics.com/analytics.js" async defer/>
        }
      </body>
    </html>
  );
}

export default Html;
