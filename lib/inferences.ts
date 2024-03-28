import Model from './model';

export interface Inference<
  FieldT extends keyof Model,
  RequiresT extends keyof Model,
> {
  field: FieldT;
  requires: RequiresT[];
  infer: (model: RemoveUndefined<Pick<Model, RequiresT>>) => number;
  explanation: InferenceExplanationType;
}

export type InferenceExplanationType = 'simple-flops';

type RemoveUndefined<T> = {
  [P in keyof T]-?: Exclude<T[P], undefined>;
};

export function constructInferInput<T extends keyof Model>(
  model: Model,
  fields: T[]
): RemoveUndefined<Pick<Model, T>> | undefined {
  const result: any = {};
  for (const field of fields) {
    const value = model[field];
    if (value === undefined) {
      return undefined;
    }
    result[field] = value;
  }

  return result as RemoveUndefined<Pick<Model, T>>;
}

export const FLOP_FROM_TOKENS_AND_PARAMS: Inference<
  'flops',
  'numTokens' | 'numParams'
> = {
  field: 'flops',
  requires: ['numTokens', 'numParams'],
  infer: model => {
    return model.numTokens * model.numParams * 6;
  },
  explanation: 'simple-flops',
};
export const TOKENS_FROM_FLOPS_AND_PARAMS: Inference<
  'numTokens',
  'flops' | 'numParams'
> = {
  field: 'numTokens',
  requires: ['flops', 'numParams'],
  infer: model => {
    return model.flops / (model.numParams * 6);
  },
  explanation: 'simple-flops',
};
export const PARAMS_FROM_FLOPS_AND_TOKENS: Inference<
  'numParams',
  'flops' | 'numTokens'
> = {
  field: 'numParams',
  requires: ['flops', 'numTokens'],
  infer: model => {
    return model.flops / (model.numTokens * 6);
  },
  explanation: 'simple-flops',
};
