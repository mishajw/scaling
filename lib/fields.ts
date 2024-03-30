import { flopsCalculation } from './calculations/flops';
import { gpuCost } from './calculations/gpuCost';
import { gpuFlops } from './calculations/gpuFlops';
import { openAiComputeSplit } from './calculations/openAiComputeSplit';
import { openAiLoss } from './calculations/openAiLoss';
import { trainingTime } from './calculations/trainingTime';
import { Calculation } from './calculations/types';
import { GpuType } from './gpu';
import { ModelFieldType, ModelValueType } from './model';

// TODO: Make the `default` type depend on the field.
export type FieldSpec = {
  name: string;
  calculations: Calculation<any, any>[];
} & (
  | {
      valueType: 'number';
      default: number | undefined;
      minMax: [number, number];
    }
  | {
      valueType: 'gpu-type';
      default: GpuType | undefined;
    }
);

export const FIELD_SPECS: Partial<Record<ModelFieldType, FieldSpec>> = {
  flops: {
    name: 'FLOPs',
    valueType: 'number',
    default: undefined,
    calculations: [flopsCalculation('flops'), trainingTime('flops')],
    minMax: [1e3, 1e10],
  },
  numParams: {
    name: '# params',
    valueType: 'number',
    default: undefined,
    calculations: [
      flopsCalculation('numParams'),
      openAiComputeSplit('numParams'),
    ],
    minMax: [100e6, 2e12],
  },
  numTokens: {
    name: '# tokens',
    valueType: 'number',
    default: undefined,
    calculations: [
      flopsCalculation('numTokens'),
      openAiComputeSplit('numTokens'),
    ],
    minMax: [1e9, 100e12],
  },
  lossNats: {
    name: 'Loss',
    valueType: 'number',
    default: undefined,
    calculations: [openAiLoss('lossNats')],
    minMax: [1e3, 1e10],
  },
  trainingTimeDays: {
    name: 'Training time (days)',
    valueType: 'number',
    default: undefined,
    calculations: [
      trainingTime('trainingTimeDays'),
      gpuCost('trainingTimeDays'),
    ],
    minMax: [1e3, 1e10],
  },
  flopsPerSecond: {
    name: 'FLOP/S',
    valueType: 'number',
    default: undefined,
    calculations: [trainingTime('flopsPerSecond'), gpuFlops('flopsPerSecond')],
    minMax: [1e3, 1e10],
  },
  gpuType: {
    name: 'GPU type',
    valueType: 'gpu-type',
    default: 'NVIDIA A100',
    calculations: [],
  },
  gpuCount: {
    name: '# GPUs',
    valueType: 'number',
    default: undefined,
    calculations: [gpuFlops('gpuCount'), gpuCost('gpuCount')],
    minMax: [1e3, 1e10],
  },
  gpuUtilization: {
    name: 'GPU utilization (%)',
    valueType: 'number',
    default: undefined,
    calculations: [gpuFlops('gpuUtilization')],
    minMax: [1e3, 1e10],
  },
  costDollars: {
    name: 'Cost ($)',
    valueType: 'number',
    default: undefined,
    calculations: [gpuCost('costDollars')],
    minMax: [1e3, 1e10],
  },
};
