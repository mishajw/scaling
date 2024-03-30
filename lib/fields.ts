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
  },
  numParams: {
    name: '# params',
    valueType: 'number',
    default: undefined,
    calculations: [
      flopsCalculation('numParams'),
      openAiComputeSplit('numParams'),
    ],
  },
  numTokens: {
    name: '# tokens',
    valueType: 'number',
    default: undefined,
    calculations: [
      flopsCalculation('numTokens'),
      openAiComputeSplit('numTokens'),
    ],
  },
  lossNats: {
    name: 'Loss',
    valueType: 'number',
    default: undefined,
    calculations: [openAiLoss('lossNats')],
  },
  trainingTimeDays: {
    name: 'Training time (days)',
    valueType: 'number',
    default: undefined,
    calculations: [
      trainingTime('trainingTimeDays'),
      gpuCost('trainingTimeDays'),
    ],
  },
  flopsPerSecond: {
    name: 'FLOP/S',
    valueType: 'number',
    default: undefined,
    calculations: [trainingTime('flopsPerSecond'), gpuFlops('flopsPerSecond')],
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
  },
  gpuUtilization: {
    name: 'GPU utilization (%)',
    valueType: 'number',
    default: undefined,
    calculations: [gpuFlops('gpuUtilization')],
  },
  costDollars: {
    name: 'Cost ($)',
    valueType: 'number',
    default: undefined,
    calculations: [gpuCost('costDollars')],
  },
};
