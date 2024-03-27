import loadEpochAi from '@/lib/loadEpochAi';

interface Props {
  name: string;
  flops: number;
}

export default async function Home(props: Props) {
  const epochAi = await loadEpochAi();
  return (
    <div>
      Scaling:{' '}
      {epochAi.map(model => (
        <div>{JSON.stringify(model)}</div>
      ))}
    </div>
  );
}
