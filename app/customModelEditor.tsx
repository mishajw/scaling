import Model from '@/lib/model';
import { useState } from 'react';

interface Props {
  model: Model;
  setModel: (model: Model) => void;
}

export default function CustomModelEditor({ model, setModel }: Props) {
  return (
    <div>
      <div className='text-lg'>Custom model</div>
      <div className='grid grid-cols-2'>
        <div>FLOPs</div>
        <Input
          value={model.flops}
          setValue={value => setModel({ ...model, flops: value })}
        />
        <div># params</div>
        <Input
          value={model.numParams}
          setValue={value => setModel({ ...model, numParams: value })}
        />
        <div># tokens</div>
        <Input
          value={model.numTokens}
          setValue={value => setModel({ ...model, numTokens: value })}
        />
      </div>
    </div>
  );
}

function Input({
  value,
  setValue,
}: {
  value?: number;
  setValue: (value: number) => void;
}) {
  const [tempValue, setTempValue] = useState<string>(value?.toString() ?? '');
  return (
    <input
      className='border-2'
      type='number'
      onChange={e => {
        setTempValue(e.target.value);
        const valueNumber = Number(e.target.value);
        if (!Number.isNaN(valueNumber)) {
          setValue(valueNumber);
        }
      }}
      value={tempValue}
    />
  );
}
