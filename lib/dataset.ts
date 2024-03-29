import { Model, ModelSchema } from './model';
import _dataset from '@/data/all.json';

export const MODELS: Model[] = ModelSchema.array().parse(_dataset);
