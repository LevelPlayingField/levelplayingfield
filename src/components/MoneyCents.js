import React from 'react';
import { FormattedNumber } from 'react-intl';

function MoneyCents({ value, whenNull = null }: {value: number, whenNull: ?string}) {
  if (!value) {
    return whenNull ? <div>{whenNull}</div> : null;
  }

  // eslint-disable-next-line react/style-prop-object
  return <FormattedNumber value={value / 100} style="currency" currency="USD"/>;
}

export default MoneyCents;
