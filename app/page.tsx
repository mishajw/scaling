import loadDataset from '@/lib/loadDataset';
import PlotView from './plotView';

export default async function Home() {
  const models = await loadDataset();
  return (
    <div>
      <PlotView models={models} />
    </div>
  );
}
