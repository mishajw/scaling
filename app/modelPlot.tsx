'use client';

import { FieldSource, Model, ModelFieldType, ModelFields } from '@/lib/model';
import { siFormat } from '@/lib/numberFormat';
import { FIELD_SPECS, FieldSpec } from '@/lib/fields';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { assertNever } from '@/lib/util';
import { CalculationType, calculate } from '@/lib/calculations/types';
import { CALCULATION_TITLES } from './calculationDescriptions';

// @ts-ignore
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface Props {
  plotField: ModelFieldType;
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

export default function ModelPlot({ plotField, customFields, models }: Props) {
  const fieldSpec = FIELD_SPECS[plotField]!;
  return (
    <div className='flex flex-col'>
      <div className='text-center text-xl'>{fieldSpec.name}</div>
      <ModelFieldPlot
        field={plotField}
        customFields={customFields}
        models={models}
      />
      <VaryRequirementsPlot field={plotField} customFields={customFields} />
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
          title: `Comparing ${fieldSpec.name} with other models`,
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

function VaryRequirementsPlot<T extends ModelFieldType>({
  field,
  customFields,
}: {
  field: T;
  customFields: ModelFields;
}) {
  const fieldSpec = FIELD_SPECS[field]!;

  const maybeRequirementValues = fieldSpec.calculations.flatMap(calculation => {
    return calculation.requires.map((requirement: ModelFieldType) => {
      const requirementSpec = FIELD_SPECS[requirement]!;
      if (requirementSpec.valueType !== 'number') {
        return undefined;
      }
      const min = (customFields[requirement]?.value as number) * 0.1;
      const max = (customFields[requirement]?.value as number) * 2;
      const results = range(10).map(i => {
        const requirementValue = i * (max - min) + min;
        const result = calculate(
          {
            ...customFields,
            [requirement]: { value: requirementValue, source: 'custom' },
          },
          calculation
        );
        return { result, requirementValue };
      });
      if (results.find(({ result }) => result !== undefined) == undefined) {
        return undefined;
      }
      return { calculation: calculation.type, requirement, results };
    });
  });
  const requirementValues = maybeRequirementValues.filter(
    (
      values
    ): values is {
      calculation: CalculationType;
      requirement: ModelFieldType;
      results: {
        result: number;
        requirementValue: number;
      }[];
    } => values !== undefined
  );
  console.log(requirementValues);
  return (
    <div>
      {requirementValues.map(({ calculation, requirement, results }, i) => (
        <div key={i}>
          <Plot
            // @ts-ignore
            data={[
              {
                x: results.map(({ requirementValue }) => requirementValue)!,
                y: results.map(({ result }) => result)!,
                type: 'scatter',
              },
              {
                x: [
                  results[0].requirementValue,
                  results.at(-1)!.requirementValue,
                ],
                y: [customFields[field]?.value, customFields[field]?.value],
                mode: 'lines',
                type: 'scatter',
                line: { color: 'orange', dash: 'dash' },
              },
            ]}
            layout={{
              title: `${CALCULATION_TITLES[calculation]}: <b>${fieldSpec.name}</b> vs. <b>${FIELD_SPECS[requirement]?.name}</b>`,
              showlegend: false,
              xaxis: { title: FIELD_SPECS[requirement]?.name },
              yaxis: { title: fieldSpec.name },
              width: 600,
              height: 200,
              // We set r:80 to make room for plotly's menu.
              margin: { l: 40, r: 80, b: 40, t: 40 },
            }}
          />
        </div>
      ))}
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

function range(n: number): number[] {
  let result = [];
  for (let i = 0; i < n; i++) {
    result.push(i / (n - 1));
  }
  return result;
}
