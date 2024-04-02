import { GpuTypeSchema } from './gpu';
import { z } from 'zod';
import { ScalingLawTypeSchema } from './scalingLaw';

const DataTypeSchema = z.union([
  z.literal('fp16'),
  z.literal('fp32'),
  z.literal('bf16'),
]);
const FieldSourceSchema = z.enum(['custom', 'scaling', 'epoch']);

const ModelFieldSchemaFn = <T extends z.ZodTypeAny>(dataType: T) =>
  z.object({
    value: dataType,
    source: FieldSourceSchema,
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
  // Compute:
  flops: ModelFieldSchemaFn(z.coerce.number()).optional(),
  numParams: ModelFieldSchemaFn(z.coerce.number()).optional(),
  numTokens: ModelFieldSchemaFn(z.coerce.number()).optional(),
  lossNats: ModelFieldSchemaFn(z.coerce.number()).optional(),
  // Time:
  flopsPerSecond: ModelFieldSchemaFn(z.coerce.number()).optional(),
  trainingTimeDays: ModelFieldSchemaFn(z.coerce.number()).optional(),
  // GPUs:
  gpuType: ModelFieldSchemaFn(GpuTypeSchema).optional(),
  gpuCount: ModelFieldSchemaFn(z.coerce.number()).optional(),
  gpuUtilization: ModelFieldSchemaFn(z.coerce.number()).optional(),
  // Unused:
  sequenceLength: ModelFieldSchemaFn(z.coerce.number()).optional(),
  batchSize: ModelFieldSchemaFn(z.coerce.number()).optional(),
  dataType: ModelFieldSchemaFn(DataTypeSchema).optional(),
  costDollars: ModelFieldSchemaFn(z.coerce.number()).optional(),
  releaseDate: ModelFieldSchemaFn(z.coerce.date()).optional(),
  isOpenWeights: ModelFieldSchemaFn(z.boolean()).optional(),
  scalingLaw: ModelFieldSchemaFn(ScalingLawTypeSchema).optional(),
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
export type FieldSource = z.infer<typeof FieldSourceSchema>;
