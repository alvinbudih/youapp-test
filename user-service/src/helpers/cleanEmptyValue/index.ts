import { isEmpty, omitBy } from 'lodash';

export function cleanEmptyValue(data: any) {
  return omitBy(data, isEmpty);
}
