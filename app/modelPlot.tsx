'use client';

import { FieldSource, Model, ModelFieldType, ModelFields } from '@/lib/model';
import { siFormat } from '@/lib/numberFormat';
import { FIELD_SPECS, FieldSpec } from '@/lib/fields';
import dynamic from 'next/dynamic';
import { useState } from 'react';

// @ts-ignore
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface Props {
  customFields: ModelFields;
  models: Model[];
}
interface ModelData {
  releaseDate: Date;
  field: number;
  name: string;
  source: FieldSource;
  citation: string | undefined;
}

export default function ModelPlot({
  customFields: customFields,
  models,
}: Props) {
  return (
    <div className='flex flex-col'>
      <ModelFieldPlot
        field={'flops'}
        customFields={customFields}
        models={models}
      />
      <ModelFieldPlot
        field={'numParams'}
        customFields={customFields}
        models={models}
      />
      <ModelFieldPlot
        field={'numTokens'}
        customFields={customFields}
        models={models}
      />
    </div>
  );
}

function ModelFieldPlot<T extends ModelFieldType>({
  field,
  customFields,
  models,
}: {
  field: T;
  customFields: ModelFields;
  models: Model[];
}) {
  const fieldSpec = FIELD_SPECS[field]!;
  const plotModels = models
    .map(model => ({
      releaseDate: model.fields.releaseDate?.value,
      field: model.fields[field]?.value,
      name: model.name,
      citation: model.fields[field]?.citation,
      source: model.fields[field]?.source,
    }))
    .filter(
      model => model.releaseDate !== undefined && model.field !== undefined
    ) as ModelData[];
  const [focusedModel, setFocusedModel] = useState<ModelData | undefined>(
    undefined
  );
  const [minDate, maxDate] = getMinMaxDates(
    plotModels.map(model => model.releaseDate)
  );
  return (
    <div style={{ width: 600, height: 400 }}>
      <Plot
        // @ts-ignore
        data={[
          {
            x: plotModels.map(model => model.releaseDate),
            y: plotModels.map(model => model.field),
            mode: 'markers',
            type: 'scatter',
            text: plotModels.map(model => model.name),
          },
          {
            x: [minDate, maxDate],
            y: [customFields[field]?.value, customFields[field]?.value],
            mode: 'lines',
            type: 'scatter',
            line: { color: 'orange', dash: 'dash' },
          },
        ]}
        layout={{
          title: fieldSpec.name,
          showlegend: false,
          xaxis: { type: 'date' },
          yaxis: { type: 'log' },
          width: 600,
          height: 400,
          // We set r:80 to make room for plotly's menu.
          margin: { l: 40, r: 80, b: 40, t: 40 },
        }}
        onHover={(event: any) => {
          setFocusedModel(plotModels[event.points[0].pointIndex]);
        }}
        onUnhover={() => {
          setFocusedModel(undefined);
        }}
      />
      <Citation model={focusedModel} fieldSpec={fieldSpec} />
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

function Citation({
  model,
  fieldSpec,
}: {
  model: ModelData | undefined;
  fieldSpec: FieldSpec;
}) {
  return (
    <div
      className={`absolute z-50 border border-gray-400 p-2 rounded max-w-80 bg-white text-sm ${
        model !== undefined ? '' : 'hidden'
      }`}
    >
      <div>
        <b>{model?.name}</b> {fieldSpec.name} = {siFormat(model?.field ?? 0)}.
      </div>
      <div>From {model ? sourceString(model?.source) : ''}.</div>
      {model?.citation && (
        <div>
          Citation:{' '}
          <span className='italic'>{model.citation.replace('\n', '<br>')}</span>
        </div>
      )}
    </div>
  );
}

function sourceString(source: FieldSource): string {
  switch (source) {
    case 'custom':
      return 'Custom';
    case 'scaling':
      return 'Manual';
    case 'epoch':
      return 'Epoch AI';
    default:
      assertNever(source);
  }
}
