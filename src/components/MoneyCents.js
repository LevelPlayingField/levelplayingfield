import React, { PropTypes } from 'react';
import { FormattedNumber } from 'react-intl';

function MoneyCents({ value, whenNull = null }) {
  if (!value) {
    return whenNull;
  }

  // eslint-disable-next-line react/style-prop-object
  return <FormattedNumber value={value / 100} style="currency" currency="USD"/>;
}

MoneyCents.propTypes = {
  value: PropTypes.number.isRequired,
  whenNull: PropTypes.any,
};

export default MoneyCents;
