import { getDefaultAutoSelectFamilyAttemptTimeout } from 'net';
import { GPU_TYPES, GpuType } from '../gpu';
import { ModelFieldType } from '../model';
import { assertNever } from '../util';
import { Calculation, CalculationType } from './types';

const type: CalculationType = 'gpu-attributes';

export function gpuAttributes<T extends ModelFieldType>(
  fieldType: T & ('gpuCostDollarsPerHour' | 'gpuFlopsPerSecond')
): Calculation<T, any> {
  switch (fieldType) {
    case 'gpuCostDollarsPerHour':
      return {
        type,
        fieldType,
        requires: ['gpuType'],
        calculate: fields => {
          return GPU_TYPES[fields.gpuType.value as GpuType]!.costDollarsPerHour;
        },
      };
    case 'gpuFlopsPerSecond':
      return {
        type,
        fieldType,
        requires: ['gpuType'],
        calculate: fields => {
          return GPU_TYPES[fields.gpuType.value as GpuType]!.flopsPerSecond;
        },
      };
    default:
      assertNever(fieldType);
  }
}
