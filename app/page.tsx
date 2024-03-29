'use client';

import ModelPlot from './modelPlot';
import { useState } from 'react';
import { Model, ModelFields } from '@/lib/model';
import CustomModelEditor from './customModelEditor';
import { MODELS } from '@/lib/dataset';
import { PARAMETERS } from '@/lib/parameters';

export default function PlotView() {
  const [customFields, setCustomFields] = useState<ModelFields>({
    flops: { value: PARAMETERS["flops"]!.default, source: 'custom' },
    numTokens: { value: PARAMETERS["numTokens"]!.default, source: 'custom' },
    numParams: { value: PARAMETERS["numParams"]!.default, source: 'custom' }
  });
  return (
    <div className='flex flex-row flex-wrap justify-center items-start'>
      <div className='m-2 p-2 border-2'>
        <CustomModelEditor fields={customFields} setFields={setCustomFields} />
      </div>
      <div className='m-2 p-2 border-2'>
        <ModelPlot customFields={customFields} models={MODELS} />
      </div>
    </div>
  );
}
