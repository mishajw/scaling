'use client';

import ModelPlot from './modelPlot';
import { useState } from 'react';
import Model from '@/lib/model';
import CustomModelEditor from './customModelEditor';
import { MODELS } from '@/lib/loadDataset';

export default function PlotView() {
  const [customModel, setCustomModel] = useState<Model>({
    name: 'Custom',
    fields: {},
  });
  return (
    <div className='flex flex-row flex-wrap items-stretch justify-center'>
      <div className='max-w-screen-md m-2 p-2 border-2'>
        <ModelPlot customModel={customModel} models={MODELS} />
      </div>
      <div className='max-w-screen-md m-2 p-2 border-2'>
        <CustomModelEditor model={customModel} setModel={setCustomModel} />
      </div>
    </div>
  );
}
