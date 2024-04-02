import { z } from 'zod';

export const ScalingLawTypeSchema = z.enum([
  'chinchilla-1',
  'chinchilla-2',
  'chinchilla-3',
]);
export type ScalingLawType = z.infer<typeof ScalingLawTypeSchema>;
