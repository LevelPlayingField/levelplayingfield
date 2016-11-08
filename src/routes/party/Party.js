import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Layout from '../../components/Layout';
import s from './Party.css';
import PartyDetails from './PartyDetails';

function Party({ party }) {
  return (
    <Layout>
      <div className={s.root}>
        <div className={s.container}>
          <h1 className={s.title}>
            {party.name}
            <small className={s.titleMuted}>{party.type}</small>
          </h1>

          <PartyDetails party={party}/>
        </div>
      </div>
    </Layout>
  );
}

Party.propTypes = {
  party: PropTypes.any.isRequired,
}
export default withStyles(s)(Party);
