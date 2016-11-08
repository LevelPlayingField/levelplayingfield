/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Layout from '../../components/Layout';
import s from './Home.css';

function Home({ news }) {
  return (
    <Layout>
      <div className={s.root}>
        <div className={s.container}>
          <h1 className={s.title}>Leveling the playing field of consumer arbitration</h1>
          <p className={s.marketing}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid aspernatur beatae consequuntur distinctio doloremque est facere, fugiat iure laudantium nobis officia optio quas, quis ratione reprehenderit suscipit temporibus veritatis voluptate. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda ea fugiat laborum qui quia tempora totam ut voluptas? Aperiam repellendus, voluptate! Eum ipsam nemo nisi quas? Blanditiis corporis est ullam!</p>
          <p className={s.marketing}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A cumque, doloribus earum excepturi fuga in labore molestiae molestias quidem, reiciendis repellendus sapiente soluta sunt tempore tenetur totam ullam voluptates voluptatum!</p>
          <p className={s.marketing}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam asperiores earum facere illum incidunt ipsam itaque laudantium maiores, molestiae numquam sapiente velit voluptatem? Animi in nemo nostrum odio quo quod.</p>
        </div>
      </div>
    </Layout>
  );
}

Home.propTypes = {
};

export default withStyles(s)(Home);
