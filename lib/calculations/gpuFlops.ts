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
        requires: ['gpuFlopsPerSecond', 'gpuCount', 'gpuUtilization'],
        calculate: fields => {
          return (
            fields.gpuFlopsPerSecond.value *
            fields.gpuCount.value *
            fields.gpuUtilization.value
          );
        },
      };
    case 'gpuCount':
      return {
        type,
        fieldType,
        requires: ['gpuFlopsPerSecond', 'flopsPerSecond', 'gpuUtilization'],
        calculate: fields => {
          return (
            fields.flopsPerSecond.value /
            fields.gpuFlopsPerSecond.value /
            fields.gpuUtilization.value
          );
        },
      };
    case 'gpuUtilization':
      return {
        type,
        fieldType,
        requires: ['gpuFlopsPerSecond', 'flopsPerSecond', 'gpuCount'],
        calculate: fields => {
          return (
            fields.flopsPerSecond.value /
            fields.gpuFlopsPerSecond.value /
            fields.gpuCount.value
          );
        },
      };
    default:
      assertNever(fieldType);
  }
}
