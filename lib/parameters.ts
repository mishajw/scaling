import {
  FLOP_FROM_TOKENS_AND_PARAMS,
  Inference,
  PARAMS_FROM_FLOPS_AND_TOKENS,
  TOKENS_FROM_FLOPS_AND_PARAMS,
} from './inferences';
import Model from './model';

export interface ParameterSpec {
  name: string;
  default: number;
  inferences: Inference<any, any>[];
}

export const PARAMETERS: Partial<Record<keyof Model, ParameterSpec>> = {
  flops: {
    name: 'FLOPs',
    default: 1e20,
    inferences: [FLOP_FROM_TOKENS_AND_PARAMS],
  },
  numParams: {
    name: '# params',
    default: 1e9,
    inferences: [PARAMS_FROM_FLOPS_AND_TOKENS],
  },
  numTokens: {
    name: '# tokens',
    default: 1e12,
    inferences: [TOKENS_FROM_FLOPS_AND_PARAMS],
  },
};
