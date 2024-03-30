import { z } from 'zod';

export default interface Gpu {
  name: string;
  flops: number;
  costDollars: number;
  memoryGb: number;
}

export const GpuTypeSchema = z.union([
  z.literal('AMD Instinct MI250X'),
  z.literal('Cerebras CS-2'),
  z.literal('Google TPU v3'),
  z.literal('Google TPU v4'),
  z.literal('Google TPU v4,Google TPU v3'),
  z.literal('NVIDIA A100'),
  z.literal('NVIDIA V100'),
  z.literal('NVIDIA A100 SXM4 40 GB'),
  z.literal('NVIDIA A100 SXM4 80 GB'),
  z.literal('NVIDIA A800'),
  z.literal('NVIDIA H100 SXM5'),
  z.literal('NVIDIA Tesla V100 DGXS 32 GB'),
  z.literal('NVIDIA Tesla V100 SXM2'),
  z.literal('NVIDIA Tesla V100S PCIe 32 GB'),
]);
export type GpuType = z.infer<typeof GpuTypeSchema>;

export const GPU_TYPES: GpuType[] = [
  'AMD Instinct MI250X',
  'Cerebras CS-2',
  'Google TPU v3',
  'Google TPU v4',
  'Google TPU v4,Google TPU v3',
  'NVIDIA A100',
  'NVIDIA V100',
  'NVIDIA A100 SXM4 40 GB',
  'NVIDIA A100 SXM4 80 GB',
  'NVIDIA A800',
  'NVIDIA H100 SXM5',
  'NVIDIA Tesla V100 DGXS 32 GB',
  'NVIDIA Tesla V100 SXM2',
  'NVIDIA Tesla V100S PCIe 32 GB',
];
