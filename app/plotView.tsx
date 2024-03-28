'use client';

import ModelPlot from './modelPlot';
import { useState } from 'react';
import Model from '@/lib/model';
import CustomModelEditor from './customModelEditor';

interface Props {
  models: Model[];
}

export default function PlotView({ models }: Props) {
  const [customModel, setCustomModel] = useState<Model>({
    name: 'Custom',
  });
  return (
    <div className='flex flex-row flex-wrap items-stretch justify-center'>
      <div className='max-w-screen-md max-w-screen-md m-2 p-2 border-2'>
        <ModelPlot customModel={customModel} models={models} />
      </div>
      <div className='max-w-screen-md m-2 p-2 border-2'>
        <CustomModelEditor model={customModel} setModel={setCustomModel} />
      </div>
    </div>
  );
}
