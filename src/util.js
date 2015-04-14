//

import _ from 'lodash';

export function optimisticNumber(val){
  if (!_.isNumber(val)) {
    val = Number(val);
  }
  return !Number.isNaN(val) ? val : void 0;
}
