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
    <div className='max-w-screen-md'>
      <div>
        <ModelPlot customModel={customModel} models={models} />
      </div>
      <div className='p-4'>
        <CustomModelEditor model={customModel} setModel={setCustomModel} />
      </div>
    </div>
  );
}
