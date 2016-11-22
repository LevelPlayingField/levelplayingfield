/* @flow */

import React from 'react';
import LawFirmDetails from './LawFirmDetails';
import AttorneyDetails from './AttorneyDetails';
import GeneralPartyDetails from './GeneralPartyDetails';
import type { PartyType } from './';

function PartyDetails({ party }: {party:PartyType}) {
  switch (party.type) {
    case 'Law Firm':
      return <LawFirmDetails party={party}/>;
    case 'Attorney':
      return <AttorneyDetails party={party}/>;
    default:
      return <GeneralPartyDetails party={party}/>;
  }
}

export default PartyDetails;
