import { flopsCalculation } from './calculations/flops';
import { openAiScalingLawCalculation } from './calculations/openAiScalingLaw';
import { Calculation } from './calculations/types';
import { ModelFieldType, ModelFields } from './model';

export interface FieldSpec {
  name: string;
  default: number;
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
      openAiScalingLawCalculation('numParams'),
    ],
  },
  numTokens: {
    name: '# tokens',
    default: 1e12,
    calculations: [
      flopsCalculation('numTokens'),
      openAiScalingLawCalculation('numTokens'),
    ],
  },
};
