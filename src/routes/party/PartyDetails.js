import React, { PropTypes } from 'react';
import LawFirmDetails from './LawFirmDetails';
import AttorneyDetails from './AttorneyDetails';
import GeneralPartyDetails from './GeneralPartyDetails';

function PartyDetails({ party }) {
  switch (party.type) {
    case 'Law Firm':
      return <LawFirmDetails party={party}/>;
    case 'Attorney':
      return <AttorneyDetails party={party}/>;
    default:
      return <GeneralPartyDetails party={party}/>;
  }
}

PartyDetails.propTypes = {
  party: PropTypes.any.isRequired,
};

export default PartyDetails;
