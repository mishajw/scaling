'use client';

import Model from '@/lib/model';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface Props {
  models: Model[];
}

export default async function ModelPlot({ models }: Props) {
  const plotModels = models.filter(model => model.flops);
  return (
    <div>
      <Plot
        data={[
          {
            x: plotModels.map(model => model.releaseDate),
            y: plotModels.map(model => model.flops),
            mode: 'markers',
            type: 'scatter',
            text: plotModels.map(model => model.name),
          },
        ]}
        layout={{
          xaxis: { type: 'date' },
          yaxis: { type: 'log' },
        }}
      />
    </div>
  );
}
