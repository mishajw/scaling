import {
  FLOP_FROM_TOKENS_AND_PARAMS,
  Inference,
  constructInferInput,
} from '@/lib/inferences';
import Model from '@/lib/model';
import { siFormat, siParse } from '@/lib/numberFormat';
import { PARAMETERS } from '@/lib/parameters';
import { useState } from 'react';

interface Props {
  model: Model;
  setModel: (model: Model) => void;
}

export default function CustomModelEditor({ model, setModel }: Props) {
  return (
    <div>
      <div className='text-lg'>Custom model</div>
      <div className='flex flex-col'>
        <Field field={'flops'} model={model} setModel={setModel} />
        <Field field={'numParams'} model={model} setModel={setModel} />
        <Field field={'numTokens'} model={model} setModel={setModel} />
      </div>
    </div>
  );
}

function Field<T extends keyof Model>({
  field,
  model,
  setModel,
}: {
  field: T;
  model: Model;
  setModel: (model: Model) => void;
}) {
  const parameterSpec = PARAMETERS[field]!;
  return (
    <div className='flex flex-row'>
      <div>{parameterSpec.name}</div>
      <div>
        <Input
          value={model[field]}
          setValue={value => setModel({ ...model, [field]: value })}
        />
        {parameterSpec.inferences.map(inference => {
          return (
            <Infer model={model} setModel={setModel} inference={inference} />
          );
        })}
        {model[field] !== parameterSpec.default && (
          <Default field={field} model={model} setModel={setModel} />
        )}
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
  const [tempValue, setTempValue] = useState<string | undefined>(undefined);
  if (
    value !== undefined &&
    tempValue !== undefined &&
    siParse(tempValue) !== undefined &&
    siParse(tempValue) !== value
  ) {
    setTempValue(undefined);
  }
  return (
    <input
      className={`border-2 ${tempValue === undefined ? '' : 'bg-red-200'}`}
      onChange={e => {
        const valueNumber = siParse(e.target.value);
        if (valueNumber !== undefined) {
          setValue(valueNumber);
        }
        setTempValue(e.target.value);
      }}
      value={tempValue ?? (value !== undefined ? siFormat(value) : '')}
    />
  );
}

function Infer<T extends keyof Model>({
  model,
  setModel,
  inference,
}: {
  model: Model;
  setModel: (model: Model) => void;
  inference: Inference<any, T>;
}) {
  const inferInput = constructInferInput(model, inference.requires);
  const inferredValue = inferInput ? inference.infer(inferInput) : undefined;
  return (
    <div>
      <SetValueButton
        value={inferredValue}
        field={inference.field}
        model={model}
        setModel={setModel}
      />
      <span className='text-sm ml-2'>
        inferred from&nbsp;
        {inference.requires.map(requirement => (
          <ValueTag field={requirement} value={model[requirement]} />
        ))}
      </span>
    </div>
  );
}

function Default<T extends keyof Model>({
  field,
  model,
  setModel,
}: {
  field: T;
  model: Model;
  setModel: (model: Model) => void;
}) {
  const parameterSpec = PARAMETERS[field]!;
  return (
    <div>
      <SetValueButton
        value={parameterSpec.default}
        field={field}
        model={model}
        setModel={setModel}
      />
      <span className='text-sm'>&nbsp;from default</span>
    </div>
  );
}

function ValueTag<T extends keyof Model, ValueT>({
  field,
  value,
}: {
  field: T;
  value: ValueT | undefined;
}) {
  const parameterSpec = PARAMETERS[field]!;
  return (
    <span className='rounded m-1 p-1 bg-green-200'>
      {parameterSpec.name}=<Value value={value} />
    </span>
  );
}

function SetValueButton<T extends keyof Model>({
  value,
  field,
  model,
  setModel,
}: {
  value: number | undefined;
  field: keyof Model;
  model: Model;
  setModel: (model: Model) => void;
}) {
  return (
    <button
      disabled={value === undefined}
      className={`rounded px-1 ${value !== undefined ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      onClick={() => setModel({ ...model, [field]: value })}
    >
      &#x2196; <Value value={value} />
    </button>
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
