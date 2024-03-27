import Model from './model';

export interface Inference<
  FieldT extends keyof Model,
  RequiresT extends keyof Model,
> {
  field: FieldT;
  requires: RequiresT[];
  infer: (model: RemoveUndefined<Pick<Model, RequiresT>>) => number;
}
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
    return model.numTokens * model.numParams;
  },
};
