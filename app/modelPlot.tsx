'use client';

import Model from '@/lib/model';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface Props {
  customModel: Model;
  models: Model[];
}

export default async function ModelPlot({ customModel, models }: Props) {
  const plotModels = models.filter(model => model.flops);
  const [minDate, maxDate] = getMinMaxDates(
    plotModels.map(model => model.releaseDate!)
  );
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
          {
            x: [minDate, maxDate],
            y: [customModel.flops, customModel.flops],
            mode: 'lines',
            type: 'scatter',
            line: { color: 'orange', dash: 'dash' },
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

function getMinMaxDates(dates: Date[]): [Date, Date] {
  const minDate = dates.reduce(
    (min, date) => (date < min ? date : min),
    dates[0]
  );
  const maxDate = dates.reduce(
    (max, date) => (date > max ? date : max),
    dates[0]
  );
  return [minDate, maxDate];
}
