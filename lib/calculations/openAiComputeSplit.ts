import { ModelFieldType } from '../model';
import { assertNever } from '../util';
import { Calculation, CalculationType } from './types';

const type: CalculationType = 'open-ai-compute-split';

export function openAiComputeSplit<T extends ModelFieldType>(
  fieldType: T & ('numParams' | 'numTokens')
): Calculation<T, any> {
  switch (fieldType) {
    case 'numParams':
      return {
        type,
        fieldType,
        requires: ['flops'],
        calculate: fields => {
          return 9e-7 * Math.pow(fields.flops.value, 0.7);
        },
      };
    case 'numTokens':
      return {
        type,
        fieldType,
        requires: ['flops'],
        calculate: fields => {
          const numParams = 9e-7 * Math.pow(fields.flops.value, 0.7);
          return fields.flops.value / numParams / 6;
        },
      };
    default:
      assertNever(fieldType);
  }
}
