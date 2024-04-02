import { ModelFieldType } from '../model';
import { assertNever } from '../util';
import { Calculation, CalculationType } from './types';

const type: CalculationType = 'gpu-cost';

export function gpuCost<T extends ModelFieldType>(
  fieldType: T & ('costDollars' | 'gpuCount' | 'trainingTimeDays')
): Calculation<T, any> {
  switch (fieldType) {
    case 'costDollars':
      return {
        type,
        fieldType,
        requires: ['gpuCostDollarsPerHour', 'gpuCount', 'trainingTimeDays'],
        calculate: fields => {
          const trainingTimeHours = fields.trainingTimeDays.value * 24;
          return (
            fields.gpuCostDollarsPerHour.value *
            fields.gpuCount.value *
            trainingTimeHours
          );
        },
      };
    case 'gpuCount':
      return {
        type,
        fieldType,
        requires: ['costDollars', 'trainingTimeDays', 'gpuCostDollarsPerHour'],
        calculate: fields => {
          const trainingTimeHours = fields.trainingTimeDays.value * 24;
          return (
            fields.costDollars.value /
            (fields.gpuCostDollarsPerHour.value * trainingTimeHours)
          );
        },
      };
    case 'trainingTimeDays':
      return {
        type,
        fieldType,
        requires: ['gpuCostDollarsPerHour', 'costDollars', 'gpuCount'],
        calculate: fields => {
          const trainingTimeHours =
            fields.costDollars.value /
            (fields.gpuCostDollarsPerHour.value * fields.gpuCount.value);
          return trainingTimeHours / 24;
        },
      };
    default:
      assertNever(fieldType);
  }
}
