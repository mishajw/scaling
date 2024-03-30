import {
  FLOP_FROM_TOKENS_AND_PARAMS,
  Inference,
  PARAMS_FROM_FLOPS_AND_TOKENS,
  TOKENS_FROM_FLOPS_AND_PARAMS,
} from './inferences';
import { ModelFieldType } from './model';

export interface FieldSpec {
  name: string;
  default: number;
  inferences: Inference<any, any>[];
}

export const FIELD_SPECS: Partial<Record<ModelFieldType, FieldSpec>> = {
  flops: {
    name: 'FLOPs',
    default: 1e20,
    // @ts-ignore
    inferences: [FLOP_FROM_TOKENS_AND_PARAMS],
  },
  numParams: {
    name: '# params',
    default: 1e9,
    // @ts-ignore
    inferences: [PARAMS_FROM_FLOPS_AND_TOKENS],
  },
  numTokens: {
    name: '# tokens',
    default: 1e12,
    // @ts-ignore
    inferences: [TOKENS_FROM_FLOPS_AND_PARAMS],
  },
};
