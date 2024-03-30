'use client';

import ModelPlot from './modelPlot';
import { useState } from 'react';
import { ModelFields } from '@/lib/model';
import CustomModelEditor from './customModelEditor';
import { MODELS } from '@/lib/dataset';
import { FIELD_SPECS } from '@/lib/fields';
import ScaleExplanation from './scaleExplanation';
import MethodDescriptions from './methodDescriptions';

export default function PlotView() {
  const [customFields, setCustomFields] = useState<ModelFields>({
    flops: { value: FIELD_SPECS['flops']!.default, source: 'custom' },
    numTokens: { value: FIELD_SPECS['numTokens']!.default, source: 'custom' },
    numParams: { value: FIELD_SPECS['numParams']!.default, source: 'custom' },
  });
  return (
    <div className='flex flex-col items-center'>
      <div className='m-2 p-2 border-2 max-w-screen-md'>
        A tool for exploring the relationships between large language model
        attributes. This should help you get a feel for them, for example how
        dataset size and FLOPs are related.
      </div>
      <div className='flex flex-row flex-wrap justify-center items-start'>
        <div>
          <div className='m-2 p-2 border-2'>
            <CustomModelEditor
              fields={customFields}
              setFields={setCustomFields}
            />
          </div>
          <div className='m-2 p-2 border-2'>
            <MethodDescriptions />
            <ScaleExplanation />
          </div>
        </div>
        <div className='m-2 p-2 border-2'>
          <ModelPlot customFields={customFields} models={MODELS} />
        </div>
      </div>
    </div>
  );
}
