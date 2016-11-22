/* @flow */

const CONSUMER = 'Consumer';
const NON_CONSUMER = 'Non Consumer';
const days = (date: number) => date / 1000 / 60 / 60 / 24;

const ConsumerParty = {
  type: 'Consumer',
  name: 'Consumer',
};


function partyType(initiatingParty: ?string) {
  switch (initiatingParty) {
    case 'Non Consumer':
    case 'Business':
      return NON_CONSUMER;
    case 'Consumer':
    case 'Employee':
    case 'Home Owner':
      return CONSUMER;

    case 'Unknown':
    default:
      return null;
  }
}

export {
  CONSUMER,
  NON_CONSUMER,
  ConsumerParty,
  days,
  partyType,
};
