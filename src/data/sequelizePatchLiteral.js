/* @flow */

import SqlString from 'sequelize/lib/sql-string';

let isPatched = false;

function patchEscape() {
  const origEscape = SqlString.escape;
  const newEscape = function escape(val, ...args) {
    if (typeof val === 'object' && val.val != null) {
      return val.val;
    }

    return origEscape(val, ...args);
  };

  SqlString.escape = newEscape;
}

export default function patchEscapeLiteral() {
  if (!isPatched) {
    isPatched = true;
    patchEscape();
  }
}
