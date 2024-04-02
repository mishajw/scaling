import { z } from 'zod';
import { siParse } from './numberFormat';

export default interface Gpu {
  type: GpuType;
  flopsPerSecond: number;
  costDollarsPerHour: number;
}

export const GpuTypeSchema = z.union([
  z.literal('AMD Instinct MI250X'),
  z.literal('Cerebras CS-2'),
  z.literal('Google TPU v3'),
  z.literal('Google TPU v4'),
  z.literal('Google TPU v4,Google TPU v3'),
  z.literal('NVIDIA A40'),
  z.literal('NVIDIA A100'),
  z.literal('NVIDIA V100'),
  z.literal('NVIDIA A100 SXM4 40 GB'),
  z.literal('NVIDIA A100 SXM4 80 GB'),
  z.literal('NVIDIA A800'),
  z.literal('NVIDIA H100'),
  z.literal('NVIDIA H100 SXM5'),
  z.literal('NVIDIA Tesla V100 DGXS 32 GB'),
  z.literal('NVIDIA Tesla V100 SXM2'),
  z.literal('NVIDIA Tesla V100S PCIe 32 GB'),
]);
export type GpuType = z.infer<typeof GpuTypeSchema>;

export const GPU_TYPES: Partial<Record<GpuType, Gpu>> = {
  'Google TPU v4': {
    type: 'Google TPU v4',
    flopsPerSecond: siParse('275T')!,
    costDollarsPerHour: 2.0286,
  },
  'NVIDIA V100': {
    type: 'NVIDIA V100',
    flopsPerSecond: siParse('119T')!,
    costDollarsPerHour: 0.8,
  },
  'NVIDIA A40': {
    type: 'NVIDIA A40',
    flopsPerSecond: siParse('149T')!,
    costDollarsPerHour: 1.28,
  },
  'NVIDIA A100': {
    type: 'NVIDIA A100',
    flopsPerSecond: siParse('312T')!,
    costDollarsPerHour: 2.21,
  },
  'NVIDIA H100': {
    type: 'NVIDIA H100',
    flopsPerSecond: siParse('989T')!,
    costDollarsPerHour: 4.76,
  },
};
