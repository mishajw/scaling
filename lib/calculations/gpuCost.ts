import { getDefaultAutoSelectFamilyAttemptTimeout } from 'net';
import { GPU_TYPES, GpuType } from '../gpu';
import { ModelFieldType } from '../model';
import { assertNever } from '../util';
import { Calculation, CalculationType } from './types';

const type: CalculationType = 'gpu-cost';

// cost = $/gpu/day * #gpus * days

export function gpuCost<T extends ModelFieldType>(
  fieldType: T & ('costDollars' | 'gpuCount' | 'trainingTimeDays')
): Calculation<T, any> {
  switch (fieldType) {
    case 'costDollars':
      return {
        type,
        fieldType,
        requires: ['gpuType', 'gpuCount', 'trainingTimeDays'],
        calculate: fields => {
          const gpuCostPerDollarsPerHour =
            GPU_TYPES[fields.gpuType.value as GpuType]!.costDollarsPerHour;
          const trainingTimeHours = fields.trainingTimeDays.value * 24;
          return (
            gpuCostPerDollarsPerHour * fields.gpuCount.value * trainingTimeHours
          );
        },
      };
    case 'gpuCount':
      return {
        type,
        fieldType,
        requires: ['gpuType', 'costDollars', 'trainingTimeDays'],
        calculate: fields => {
          const gpuCostPerDollarsPerHour =
            GPU_TYPES[fields.gpuType.value as GpuType]!.costDollarsPerHour;
          const trainingTimeHours = fields.trainingTimeDays.value * 24;
          return (
            fields.costDollars.value /
            (gpuCostPerDollarsPerHour * trainingTimeHours)
          );
        },
      };
    case 'trainingTimeDays':
      return {
        type,
        fieldType,
        requires: ['gpuType', 'costDollars', 'gpuCount'],
        calculate: fields => {
          const gpuCostPerDollarsPerHour =
            GPU_TYPES[fields.gpuType.value as GpuType]!.costDollarsPerHour;
          const trainingTimeHours =
            fields.costDollars.value /
            (gpuCostPerDollarsPerHour * fields.gpuCount.value);
          return trainingTimeHours / 24;
        },
      };
    default:
      assertNever(fieldType);
  }
}
