import {
  FLOP_FROM_TOKENS_AND_PARAMS,
  Inference,
  constructInferInput,
} from '@/lib/inferences';
import Model from '@/lib/model';
import { siFormat, siParse } from '@/lib/numberFormat';
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
        <div>
          <Input
            value={model.flops}
            setValue={value => setModel({ ...model, flops: value })}
          />
          <Infer model={model} inference={FLOP_FROM_TOKENS_AND_PARAMS} />
        </div>
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
  const [state, setState] = useState<{
    tempValue: string | undefined;
    isValid: boolean;
  }>({ tempValue: value?.toString(), isValid: true });
  return (
    <input
      className={`border-2 ${state.isValid ? '' : 'bg-red-200'}`}
      onChange={e => {
        const valueNumber = siParse(e.target.value);
        console.log(valueNumber);
        setState({
          tempValue: e.target.value,
          isValid: valueNumber !== undefined,
        });
        if (valueNumber !== undefined) {
          setValue(valueNumber);
        }
      }}
      value={state.tempValue}
    />
  );
}

function Infer<T extends keyof Model>({
  model,
  inference,
}: {
  model: Model;
  inference: Inference<any, T>;
}) {
  const inferInput = constructInferInput(model, inference.requires);
  const inferredValue = inferInput ? inference.infer(inferInput) : undefined;

  return (
    <div>
      <button className='bg-blue-500 text-white rounded px-1'>
        Set to <Value value={inferredValue} />
      </button>
      <span className='text-sm ml-2'>
        based on&nbsp;
        {inference.requires.map(requirement => {
          return (
            <span>
              {requirement}=<Value value={model[requirement]} />
              &nbsp;
            </span>
          );
        })}
      </span>
    </div>
  );
}

function Value<T>({ value }: { value: T | undefined }) {
  if (value !== undefined && value !== null) {
    if (typeof value === 'number') {
      return <span>{siFormat(value)}</span>;
    } else {
      return <span>{value.toString()}</span>;
    }
  } else {
    return <span className='bg-red-400'>???</span>;
  }
}
