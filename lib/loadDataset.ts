import Model from './model';
import { promises as fs } from 'fs';

export default async function loadDataset(): Promise<Model[]> {
  const json = await fs.readFile('data/all.json', 'utf8');
  return JSON.parse(json) as Model[];
}
