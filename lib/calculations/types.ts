import { ModelFieldType, ModelFields } from '../model';

export type CalculationType =
  | 'flops'
  | 'open-ai-loss'
  | 'open-ai-compute-split'
  | 'training-time';

export interface Calculation<
  FieldT extends ModelFieldType,
  RequiresT extends ModelFieldType,
> {
  type: CalculationType;
  fieldType: FieldT;
  requires: RequiresT[];
  calculate: (fields: RemoveUndefined<Pick<ModelFields, RequiresT>>) => number;
}

type RemoveUndefined<T> = {
  [P in keyof T]-?: Exclude<T[P], undefined>;
};

export function calculate<T extends ModelFieldType>(
  modelFields: ModelFields,
  calculation: Calculation<any, T>
): number | undefined {
  const inputs: any = {};
  for (const field of calculation.requires) {
    const value = modelFields[field];
    if (value === undefined) {
      return undefined;
    }
    inputs[field] = value;
  }
  return calculation.calculate(inputs as RemoveUndefined<Pick<ModelFields, T>>);
}
