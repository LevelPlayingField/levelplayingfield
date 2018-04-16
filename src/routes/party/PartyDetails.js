/* @flow */

import React from 'react';
import LawFirmDetails from './LawFirmDetails';
import AttorneyDetails from './AttorneyDetails';
import type { PartyType } from './';

function PartyDetails({ party }: {party:PartyType}) {
  switch (party.type) {
    case 'Law Firm':
      return <LawFirmDetails party={party}/>;
    case 'Attorney':
      return <AttorneyDetails party={party}/>;
    default:
      return null;
  }
}

export default PartyDetails;
