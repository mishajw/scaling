import { GpuType } from './gpu';

export default interface Model {
  name: string;
  fields: ModelFields;
}

export interface ModelFields {
  // Training details:
  flops?: ModelField<number>;
  numParams?: ModelField<number>;
  sequenceLength?: ModelField<number>;
  numTokens?: ModelField<number>;
  batchSize?: ModelField<number>;
  dataType?: ModelField<DataType>;
  // Cost:
  costDollars?: ModelField<number>;
  trainingTimeDays?: ModelField<number>;
  // GPU stats:
  gpuType?: ModelField<GpuType>;
  gpuCount?: ModelField<number>;
  gpuUtilization?: ModelField<number>;
  // Metadata:
  releaseDate?: ModelField<Date>;
  isOpenWeights?: ModelField<boolean>;
}

export type ModelValueType = number | boolean | Date | GpuType | DataType;

export interface ModelField<T extends ModelValueType> {
  value: T;
  source: 'custom' | 'scaling' | 'epoch';
  citation?: string;
}

export type ModelFieldType = keyof ModelFields;

export type DataType = 'fp16' | 'fp32' | 'bf16';
