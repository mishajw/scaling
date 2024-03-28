'use client';

import Model from '@/lib/model';
import { PARAMETERS } from '@/lib/parameters';
import dynamic from 'next/dynamic';

// @ts-ignore
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface Props {
  customModel: Model;
  models: Model[];
}

export default function ModelPlot({ customModel, models }: Props) {
  return (
    <div className='flex flex-col' style={{ width: 600 }}>
      <ModelFieldPlot
        field={'flops'}
        customModel={customModel}
        models={models}
      />
      <ModelFieldPlot
        field={'numParams'}
        customModel={customModel}
        models={models}
      />
      <ModelFieldPlot
        field={'numTokens'}
        customModel={customModel}
        models={models}
      />
    </div>
  );
}

function ModelFieldPlot<T extends keyof Model>({
  field,
  customModel,
  models,
}: {
  field: T;
  customModel: Model;
  models: Model[];
}) {
  const parameterSpec = PARAMETERS[field]!;
  const plotModels = models.filter(model => model[field]);
  const [minDate, maxDate] = getMinMaxDates(
    plotModels.map(model => model.releaseDate!)
  );
  return (
    <Plot
      // @ts-ignore
      data={[
        {
          x: plotModels.map(model => model.releaseDate),
          y: plotModels.map(model => model[field]),
          mode: 'markers',
          type: 'scatter',
          text: plotModels.map(model => model.name),
        },
        {
          x: [minDate, maxDate],
          y: [customModel[field], customModel[field]],
          mode: 'lines',
          type: 'scatter',
          line: { color: 'orange', dash: 'dash' },
        },
      ]}
      layout={{
        title: parameterSpec.name,
        showlegend: false,
        xaxis: { type: 'date' },
        yaxis: { type: 'log' },
        width: 600,
        height: 400,
        margin: { l: 40, r: 40, b: 40, t: 40 },
      }}
    />
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
