import { chinchillaLoss } from './calculations/chinchillaLoss';
import { chinchillaComputeSplit } from './calculations/chinchillaComputeSplit';
import { flopsCalculation } from './calculations/flops';
import { gpuCost } from './calculations/gpuCost';
import { gpuFlops } from './calculations/gpuFlops';
import { trainingTime } from './calculations/trainingTime';
import { Calculation } from './calculations/types';
import { GpuType } from './gpu';
import { ModelFieldType, ModelValueType } from './model';
import { ScalingLawType } from './scalingLaw';

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
  | {
      valueType: 'scaling-law';
      default: ScalingLawType | undefined;
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
      chinchillaComputeSplit('numParams'),
    ],
  },
  numTokens: {
    name: '# tokens',
    valueType: 'number',
    default: undefined,
    calculations: [
      flopsCalculation('numTokens'),
      chinchillaComputeSplit('numTokens'),
    ],
  },
  lossNats: {
    name: 'Loss',
    valueType: 'number',
    default: undefined,
    calculations: [chinchillaLoss('lossNats')],
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
  scalingLaw: {
    name: 'Scaling law',
    valueType: 'scaling-law',
    default: undefined,
    calculations: [],
  },
};
