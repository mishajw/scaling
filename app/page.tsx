import loadEpochAi from '@/lib/loadEpochAi';
import PlotView from './plotView';

export default async function Home() {
  const models = await loadEpochAi();
  return (
    <div>
      <PlotView models={models} />
    </div>
  );
}
