'use client';

import ModelPlot from './modelPlot';
import { useState } from 'react';
import { ModelField, ModelFieldType, ModelFields } from '@/lib/model';
import CustomModelEditor from './customModelEditor';
import { MODELS } from '@/lib/dataset';
import ScaleExplanation from './scaleExplanation';
import CalculationDescriptions from './calculationDescriptions';
import Link from './link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FIELD_SPECS } from '@/lib/fields';
import { siFormat, siParse } from '@/lib/numberFormat';

export default function PlotView() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    return params.toString();
  };
  function getFieldValue(field: ModelFieldType): ModelField | undefined {
    const fieldSpec = FIELD_SPECS[field]!;
    const valueRaw = searchParams.get(field);
    if (valueRaw === null) {
      return fieldSpec.default !== undefined
        ? { value: fieldSpec.default, source: 'default' }
        : undefined;
    }
    if (valueRaw === '') {
      return undefined;
    }
    if (fieldSpec.valueType === 'number') {
      const value = siParse(valueRaw);
      if (value === undefined) {
        return undefined;
      }
      return {
        value,
        source: 'custom',
      };
    }
    return {
      // @ts-ignore
      value: valueRaw,
      source: 'custom',
    };
  }

  const [state, setState] = useState<{
    customFields: ModelFields;
    plotField: ModelFieldType;
  }>({
    customFields: Object.fromEntries(
      Object.keys(FIELD_SPECS).map(field => [
        field,
        getFieldValue(field as ModelFieldType),
      ])
    ) as ModelFields,
    plotField: 'flops',
  });

  function setField(field: ModelFieldType, value: ModelField | undefined) {
    setState(state => ({
      ...state,
      customFields: {
        ...state.customFields,
        [field]: value,
      },
    }));
    const valueString = value === undefined ? '' : value.value.toString();
    router.push(pathname + '?' + createQueryString(field, valueString), {
      scroll: false,
    });
  }

  return (
    <div className='flex flex-col items-center'>
      <div className='m-2 p-2 border-2 max-w-screen-md'>
        <div>
          <span className='font-bold'>
            A calculator for language model scaling.
          </span>{' '}
          How many FLOPs do you need to train a 13B model? How much does it cost
          to scale to 1T tokens? If the we cap training runs at one yetaflop,
          how many GPUs do you need to break that?
        </div>
        <div className='mt-4'>
          Usage: Fill in the fields you know, and{' '}
          <span className='bg-orange-500 border-1 rounded px-1 text-white'>
            orange buttons
          </span>{' '}
          will appear on other fields to update where they conflict. You can go
          in any order you want. Feedback, requests, and suggestions are{' '}
          <Link href='https://github.com/mishajw/scaling/issues/new'>
            welcome
          </Link>
          !
        </div>
      </div>
      <div className='flex flex-row flex-wrap justify-center items-start'>
        <div className='m-2 p-2 border-2 max-w-screen-sm'>
          <CustomModelEditor
            fields={state.customFields}
            setField={setField}
            setPlotField={plotField => setState({ ...state, plotField })}
          />
          <ScaleExplanation />
        </div>
        <div className='m-2 p-2 border-2'>
          <ModelPlot
            plotField={state.plotField}
            customFields={state.customFields}
            models={MODELS}
          />
        </div>
        <div className='m-2 p-2 border-2 max-w-screen-md'>
          <CalculationDescriptions />
        </div>
      </div>
    </div>
  );
}
