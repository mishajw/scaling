import loadEpochAi from '@/lib/loadEpochAi';
import ModelPlot from './plot';

export default async function Home() {
  const epochAi = await loadEpochAi();
  return (
    <div>
      <ModelPlot models={epochAi} />
    </div>
  );
}
