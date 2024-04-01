import { getDefaultAutoSelectFamilyAttemptTimeout } from 'net';
import { GPU_TYPES, GpuType } from '../gpu';
import { ModelFieldType } from '../model';
import { assertNever } from '../util';
import { Calculation, CalculationType } from './types';

const type: CalculationType = 'gpu-flops';

export function gpuFlops<T extends ModelFieldType>(
  fieldType: T & ('flopsPerSecond' | 'gpuCount' | 'gpuUtilization')
): Calculation<T, any> {
  switch (fieldType) {
    case 'flopsPerSecond':
      return {
        type,
        fieldType,
        requires: ['gpuType', 'gpuCount', 'gpuUtilization'],
        calculate: fields => {
          const gpuFlops =
            GPU_TYPES[fields.gpuType.value as GpuType]!.flopsPerSecond;
          return gpuFlops * fields.gpuCount.value * fields.gpuUtilization.value;
        },
      };
    case 'gpuCount':
      return {
        type,
        fieldType,
        requires: ['gpuType', 'flopsPerSecond', 'gpuUtilization'],
        calculate: fields => {
          const gpuFlops =
            GPU_TYPES[fields.gpuType.value as GpuType]!.flopsPerSecond;
          return (
            fields.flopsPerSecond.value / gpuFlops / fields.gpuUtilization.value
          );
        },
      };
    case 'gpuUtilization':
      return {
        type,
        fieldType,
        requires: ['gpuType', 'flopsPerSecond', 'gpuCount'],
        calculate: fields => {
          const gpuFlops =
            GPU_TYPES[fields.gpuType.value as GpuType]!.flopsPerSecond;
          return fields.flopsPerSecond.value / gpuFlops / fields.gpuCount.value;
        },
      };
    default:
      assertNever(fieldType);
  }
}
