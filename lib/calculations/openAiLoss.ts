import { ModelFieldType } from '../model';
import { Calculation, CalculationType } from './types';

const type: CalculationType = 'open-ai-loss';

export function openAiLoss<T extends ModelFieldType>(
  fieldType: T & 'lossNats'
): Calculation<T, any> {
  switch (fieldType) {
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
