import { flopsCalculation } from './calculations/flops';
import { openAiComputeSplit } from './calculations/openAiComputeSplit';
import { openAiLoss } from './calculations/openAiLoss';
import { Calculation } from './calculations/types';
import { ModelFieldType } from './model';

export interface FieldSpec {
  name: string;
  default: number | undefined;
  calculations: Calculation<any, any>[];
}

export const FIELD_SPECS: Partial<Record<ModelFieldType, FieldSpec>> = {
  flops: {
    name: 'FLOPs',
    default: 1e20,
    calculations: [flopsCalculation('flops')],
  },
  numParams: {
    name: '# params',
    default: 1e9,
    calculations: [
      flopsCalculation('numParams'),
      openAiComputeSplit('numParams'),
    ],
  },
  numTokens: {
    name: '# tokens',
    default: 1e12,
    calculations: [
      flopsCalculation('numTokens'),
      openAiComputeSplit('numTokens'),
    ],
  },
  lossNats: {
    name: 'Loss',
    default: 1.96,
    calculations: [openAiLoss('lossNats')],
  },
  trainingTimeDays: {
    name: 'Training time (days)',
    default: undefined,
    calculations: [],
  },
};
