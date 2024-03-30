import { flopsCalculation } from './calculations/flops';
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
    default: 1e20,
    calculations: [flopsCalculation('flops'), trainingTime('flops')],
  },
  numParams: {
    name: '# params',
    valueType: 'number',
    default: 1e9,
    calculations: [
      flopsCalculation('numParams'),
      openAiComputeSplit('numParams'),
    ],
  },
  numTokens: {
    name: '# tokens',
    valueType: 'number',
    default: 1e12,
    calculations: [
      flopsCalculation('numTokens'),
      openAiComputeSplit('numTokens'),
    ],
  },
  lossNats: {
    name: 'Loss',
    valueType: 'number',
    default: 1.96,
    calculations: [openAiLoss('lossNats')],
  },
  trainingTimeDays: {
    name: 'Training time (days)',
    valueType: 'number',
    default: undefined,
    calculations: [trainingTime('trainingTimeDays')],
  },
  flopsPerSecond: {
    name: 'FLOP/S',
    valueType: 'number',
    default: undefined,
    calculations: [trainingTime('flopsPerSecond')],
  },
  gpuType: {
    name: 'GPU type',
    valueType: 'gpu-type',
    default: 'NVIDIA A100',
    calculations: [],
  },
};
