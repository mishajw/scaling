import { z } from 'zod';

export interface ScalingLaw {
  name: string;
}

export const ScalingLawTypeSchema = z.enum([
  'chinchilla-1',
  'chinchilla-2',
  'chinchilla-3',
]);
export type ScalingLawType = z.infer<typeof ScalingLawTypeSchema>;

export const SCALING_LAWS: ScalingLawType[] = [
  'chinchilla-1',
  'chinchilla-2',
  'chinchilla-3',
];
