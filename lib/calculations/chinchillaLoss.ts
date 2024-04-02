import { ModelFieldType } from '../model';
import { assertNever } from '../util';
import { Calculation, CalculationType } from './types';

type ChinchillaApproaches = 1 | 2 | 3;

// These values are only for approach 3.
const E = 1.69;
const A = 406.4;
const B = 410.7;
const ALPHA = 0.34;
const BETA = 0.28;

export function chinchillaLoss<T extends ModelFieldType>(
  fieldType: T & 'lossNats'
): Calculation<T, any> {
  switch (fieldType) {
    case 'lossNats': {
      return {
        type: 'chinchilla-loss',
        fieldType,
        requires: ['numParams', 'numTokens'],
        calculate: fields => {
          return (
            E +
            A / Math.pow(fields.numParams.value, ALPHA) +
            B / Math.pow(fields.numTokens.value, BETA)
          );
        },
      };
    }
    default:
      return assertNever(fieldType);
  }
}
