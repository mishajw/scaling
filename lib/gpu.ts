export default interface Gpu {
  name: string;
  flops: number;
  costDollars: number;
  memoryGb: number;
}

export type GpuType = 'V100' | 'A100' | 'H100';
