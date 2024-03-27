import loadEpochAi from '@/lib/loadEpochAi';
import ModelPlot from './modelPlot';

export default async function Home() {
  const epochAi = await loadEpochAi();
  return (
    <div>
      <ModelPlot models={epochAi} />
    </div>
  );
}
