import { GpuType } from "./gpu";

export default interface Model {
    name: string;
    // Training details:
    flops?: number;
    numParams?: number;
    sequenceLength?: number;
    numTokens?: number;
    batchSize?: number;
    dataType?: DataType;
    // Cost:
    costDollars?: number;
    trainingTimeDays?: number;
    // GPU stats:
    gpuType?: GpuType;
    gpuCount?: number;
    gpuUtilization?: number;
    // Metadata:
    releaseDate?: Date;
    isOpenWeights?: boolean;
}

export type DataType = 'fp16' | 'fp32' | 'bf16';
