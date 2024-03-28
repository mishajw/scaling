import {
  FLOP_FROM_TOKENS_AND_PARAMS,
  Inference,
  PARAMS_FROM_FLOPS_AND_TOKENS,
  TOKENS_FROM_FLOPS_AND_PARAMS,
} from './inferences';
import { ModelFieldType } from './model';

export interface ParameterSpec {
  name: string;
  default: number;
  inferences: Inference<any, any>[];
}

export const PARAMETERS: Partial<Record<ModelFieldType, ParameterSpec>> = {
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
