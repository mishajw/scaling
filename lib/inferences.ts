import { Model, ModelFieldType, ModelFields } from './model';

export interface Inference<
  FieldT extends ModelFieldType,
  RequiresT extends ModelFieldType,
> {
  field: FieldT;
  requires: RequiresT[];
  infer: (fields: RemoveUndefined<Pick<ModelFields, RequiresT>>) => number;
  explanation: InferenceExplanationType;
}

export type InferenceExplanationType = 'megatron';

type RemoveUndefined<T> = {
  [P in keyof T]-?: Exclude<T[P], undefined>;
};

export function constructInferInput<T extends ModelFieldType>(
  modelFields: ModelFields,
  fieldTypes: T[]
): RemoveUndefined<Pick<ModelFields, T>> | undefined {
  const result: any = {};
  for (const field of fieldTypes) {
    const value = modelFields[field];
    if (value === undefined) {
      return undefined;
    }
    result[field] = value;
  }

  return result as RemoveUndefined<Pick<ModelFields, T>>;
}

export const FLOP_FROM_TOKENS_AND_PARAMS: Inference<
  'flops',
  'numTokens' | 'numParams'
> = {
  field: 'flops',
  requires: ['numTokens', 'numParams'],
  infer: fields => {
    return fields.numTokens.value * fields.numParams.value * 6;
  },
  explanation: 'megatron',
};
export const TOKENS_FROM_FLOPS_AND_PARAMS: Inference<
  'numTokens',
  'flops' | 'numParams'
> = {
  field: 'numTokens',
  requires: ['flops', 'numParams'],
  infer: fields => {
    return fields.flops.value / (fields.numParams.value * 6);
  },
  explanation: 'megatron',
};
export const PARAMS_FROM_FLOPS_AND_TOKENS: Inference<
  'numParams',
  'flops' | 'numTokens'
> = {
  field: 'numParams',
  requires: ['flops', 'numTokens'],
  infer: fields => {
    return fields.flops.value / (fields.numTokens.value * 6);
  },
  explanation: 'megatron',
};
