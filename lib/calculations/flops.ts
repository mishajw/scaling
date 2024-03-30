import { Calculation, CalculationType } from './types';

const type: CalculationType = 'flops';

export function flopsCalculation<T extends 'flops' | 'numParams' | 'numTokens'>(
  fieldType: T
): Calculation<T, any> {
  switch (fieldType) {
    case 'flops':
      return {
        type,
        fieldType,
        requires: ['numTokens', 'numParams'],
        calculate: fields => {
          return fields.numTokens.value * fields.numParams.value * 6;
        },
      };
    case 'numTokens':
      return {
        type,
        fieldType,
        requires: ['flops', 'numParams'],
        calculate: fields => {
          return fields.flops.value / (fields.numParams.value * 6);
        },
      };
    case 'numParams':
      return {
        type,
        fieldType,
        requires: ['flops', 'numTokens'],
        calculate: fields => {
          return fields.flops.value / (fields.numTokens.value * 6);
        },
      };
    default:
      assertNever(fieldType);
  }
}
