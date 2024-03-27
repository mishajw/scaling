'use client';

import Model from '@/lib/model';
import dynamic from 'next/dynamic';

// const Plot = require('react-plotly.js');
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface Props {
  models: Model[];
}

export default async function ModelPlot({ models }: Props) {
  return (
    <div>
      {models.length}
      <Plot
        data={[
          {
            x: models.map(model => model.releaseDate),
            y: models.map(model => model.flops),
            mode: 'markers',
            type: 'scatter',
            text: models.map(model => model.name),
          },
        ]}
      ></Plot>
    </div>
  );
}
