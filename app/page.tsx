'use client';

import ModelPlot from './modelPlot';
import { useState } from 'react';
import { ModelFields } from '@/lib/model';
import CustomModelEditor from './customModelEditor';
import { MODELS } from '@/lib/dataset';
import ScaleExplanation from './scaleExplanation';
import CalculationDescriptions from './calculationDescriptions';

export default function PlotView() {
  const [customFields, setCustomFields] = useState<ModelFields>({
    gpuType: {
      value: 'NVIDIA A100',
      source: 'custom',
    },
    gpuUtilization: {
      value: 0.3,
      source: 'custom',
    },
  });
  return (
    <div className='flex flex-col items-center'>
      <div className='m-2 p-2 border-2 max-w-screen-md'>
        <span className='font-bold'>
          A calculator for language model scaling.
        </span>{' '}
        How many FLOPs do you need to train a 13B model? How much does it cost
        to scale to 1T tokens? If the we cap training runs at one yetaflop, how
        many GPUs do you need to break that?
      </div>
      <div className='flex flex-row flex-wrap justify-center items-start'>
        <div className='m-2 p-2 border-2 max-w-screen-sm'>
          <CustomModelEditor
            fields={customFields}
            setFields={setCustomFields}
          />
          <ScaleExplanation />
        </div>
        <div className='m-2 p-2 border-2'>
          <ModelPlot customFields={customFields} models={MODELS} />
        </div>
        <div className='m-2 p-2 border-2 max-w-screen-md'>
          <CalculationDescriptions />
        </div>
      </div>
    </div>
  );
}
