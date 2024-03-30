import { assertNever } from '../util';
import { Calculation, CalculationType } from './types';

const type: CalculationType = 'training-time';

export function trainingTime<
  T extends 'flops' | 'flopsPerSecond' | 'trainingTimeDays',
>(fieldType: T): Calculation<T, any> {
  switch (fieldType) {
    case 'flops':
      return {
        type,
        fieldType,
        requires: ['flopsPerSecond', 'trainingTimeDays'],
        calculate: fields => {
          const trainingTimeSeconds =
            fields.trainingTimeDays.value * 24 * 60 * 60;
          return trainingTimeSeconds * fields.flopsPerSecond.value;
        },
      };
    case 'flopsPerSecond':
      return {
        type,
        fieldType,
        requires: ['flops', 'trainingTimeDays'],
        calculate: fields => {
          const trainingTimeSeconds =
            fields.trainingTimeDays.value * 24 * 60 * 60;
          return fields.flops.value / trainingTimeSeconds;
        },
      };
    case 'trainingTimeDays':
      return {
        type,
        fieldType,
        requires: ['flops', 'flopsPerSecond'],
        calculate: fields => {
          const trainingTimeSeconds =
            fields.flops.value / fields.flopsPerSecond.value;
          return trainingTimeSeconds / (24 * 60 * 60);
        },
      };
    default:
      assertNever(fieldType);
  }
}
