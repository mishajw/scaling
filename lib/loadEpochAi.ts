import Model from "./model";
import { promises as fs } from 'fs';


export default async function loadEpochAi(): Promise<Model[]> {
  const json = await fs.readFile('data/epoch_ai.json', 'utf8');
  return JSON.parse(json) as Model[];
}