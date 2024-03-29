import { GpuType, GpuTypeSchema } from './gpu';

// export default interface Model {
//   name: string;
//   fields: ModelFields;
// }

// export interface ModelFields {
//   // Training details:
//   flops?: ModelField<number>;
//   numParams?: ModelField<number>;
//   sequenceLength?: ModelField<number>;
//   numTokens?: ModelField<number>;
//   batchSize?: ModelField<number>;
//   dataType?: ModelField<DataType>;
//   // Cost:
//   costDollars?: ModelField<number>;
//   trainingTimeDays?: ModelField<number>;
//   // GPU stats:
//   gpuType?: ModelField<GpuType>;
//   gpuCount?: ModelField<number>;
//   gpuUtilization?: ModelField<number>;
//   // Metadata:
//   releaseDate?: ModelField<Date>;
//   isOpenWeights?: ModelField<boolean>;
// }

// export type ModelValueType = number | boolean | Date | GpuType | DataType;

// export interface ModelField<T extends ModelValueType> {
//   value: T;
//   source: 'custom' | 'scaling' | 'epoch';
//   citation?: string;
// }

// export type ModelFieldType = keyof ModelFields;

// export type DataType = 'fp16' | 'fp32' | 'bf16';

import { z } from 'zod';

const DataTypeSchema = z.union([
  z.literal('fp16'),
  z.literal('fp32'),
  z.literal('bf16'),
]);

const ModelFieldSchemaFn = <T extends z.ZodTypeAny>(dataType: T) =>
  z.object({
    value: dataType,
    source: z.enum(['custom', 'scaling', 'epoch']),
    citation: z.string().optional(),
  });
const ModelValueTypeSchema = z.union([
  z.number(),
  z.boolean(),
  z.date(),
  GpuTypeSchema,
  DataTypeSchema,
]);
const ModelFieldSchema = ModelFieldSchemaFn(ModelValueTypeSchema);

const ModelFieldsSchema = z.object({
  flops: ModelFieldSchemaFn(z.coerce.number()).optional(),
  numParams: ModelFieldSchemaFn(z.coerce.number()).optional(),
  sequenceLength: ModelFieldSchemaFn(z.coerce.number()).optional(),
  numTokens: ModelFieldSchemaFn(z.coerce.number()).optional(),
  batchSize: ModelFieldSchemaFn(z.coerce.number()).optional(),
  dataType: ModelFieldSchemaFn(DataTypeSchema).optional(),
  costDollars: ModelFieldSchemaFn(z.coerce.number()).optional(),
  trainingTimeDays: ModelFieldSchemaFn(z.coerce.number()).optional(),
  gpuType: ModelFieldSchemaFn(GpuTypeSchema).optional(),
  gpuCount: ModelFieldSchemaFn(z.coerce.number()).optional(),
  gpuUtilization: ModelFieldSchemaFn(z.coerce.number()).optional(),
  releaseDate: ModelFieldSchemaFn(z.coerce.date()).optional(),
  isOpenWeights: ModelFieldSchemaFn(z.boolean()).optional(),
});

export const ModelSchema = z.object({
  name: z.string(),
  fields: ModelFieldsSchema,
});

export type Model = z.infer<typeof ModelSchema>;
export type ModelFields = z.infer<typeof ModelFieldsSchema>;
export type ModelField = z.infer<typeof ModelFieldSchema>;
export type DataType = z.infer<typeof DataTypeSchema>;
export type ModelFieldType = keyof ModelFields;
export type ModelValueType = z.infer<typeof ModelValueTypeSchema>;
