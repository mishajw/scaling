import { ModelFieldType } from '../model';
import { ScalingLawType } from '../scalingLaw';
import { assertNever } from '../util';
import { Calculation } from './types';

const NUM_PARAMS_EXPONENTS: Record<ScalingLawType, number> = {
  'chinchilla-1': 0.5,
  'chinchilla-2': 0.49,
  'chinchilla-3': 0.46,
};
const NUM_TOKENS_EXPONENTS: Record<ScalingLawType, number> = {
  'chinchilla-1': 0.5,
  'chinchilla-2': 0.51,
  'chinchilla-3': 0.54,
};
const NUM_PARAMS_COEFFICIENTS: Record<ScalingLawType, number> = {
  'chinchilla-1': 0.0891,
  'chinchilla-2': 0.1444,
  'chinchilla-3': 0.498,
};
const NUM_TOKENS_COEFFICIENTS: Record<ScalingLawType, number> = {
  'chinchilla-1': 1.872,
  'chinchilla-2': 1.1541,
  'chinchilla-3': 0.3348,
};

export function chinchillaComputeSplit<T extends ModelFieldType>(
  fieldType: T & ('numParams' | 'numTokens')
): Calculation<T, any> {
  switch (fieldType) {
    case 'numParams': {
      return {
        type: 'chinchilla-compute-split',
        fieldType,
        requires: ['flops'],
        calculate: fields => {
          return (
            NUM_PARAMS_COEFFICIENTS['chinchilla-1'] *
            Math.pow(
              fields.flops.value / 6,
              NUM_PARAMS_EXPONENTS['chinchilla-1']
            )
          );
        },
      };
    }
    case 'numTokens': {
      return {
        type: 'chinchilla-compute-split',
        fieldType,
        requires: ['flops'],
        calculate: fields => {
          return (
            NUM_TOKENS_COEFFICIENTS['chinchilla-1'] *
            Math.pow(
              fields.flops.value / 6,
              NUM_TOKENS_EXPONENTS['chinchilla-1']
            )
          );
        },
      };
    }
    default:
      return assertNever(fieldType);
  }
}
