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
    <div>
      <div>
        <ModelPlot customModel={customModel} models={models} />
      </div>
      <div>
        <CustomModelEditor model={customModel} setModel={setCustomModel} />
      </div>
    </div>
  );
}
