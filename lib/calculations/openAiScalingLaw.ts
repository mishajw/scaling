import { ModelFieldType } from '../model';
import { Calculation, CalculationType } from './types';

const type: CalculationType = 'open-ai-scaling-law';

export function openAiScalingLawCalculation<T extends ModelFieldType>(
  fieldType: T & ('numParams' | 'numTokens' | 'lossNats')
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
    case 'lossNats': {
      return {
        type,
        fieldType,
        requires: ['numParams', 'numTokens'],
        calculate: fields => {
          const alphaNumParams = 0.076;
          const alphaNumTokens = 0.103;
          const criticalNumParams = 6.4e13;
          const criticalNumTokens = 1.8e13;
          return Math.pow(
            Math.pow(
              criticalNumParams / fields.numParams.value,
              alphaNumParams / alphaNumTokens
            ) +
              criticalNumTokens / fields.numTokens.value,
            alphaNumTokens
          );
        },
      };
    }
    default:
      assertNever(fieldType);
  }
}
