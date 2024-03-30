import { megatronCalculation } from './calculations/megatron';
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
    calculations: [megatronCalculation('flops')],
  },
  numParams: {
    name: '# params',
    default: 1e9,
    calculations: [megatronCalculation('numParams')],
  },
  numTokens: {
    name: '# tokens',
    default: 1e12,
    calculations: [megatronCalculation('numTokens')],
  },
};
