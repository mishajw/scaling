import {
  Inference,
  constructInferInput,
} from '@/lib/inferences';
import Model from '@/lib/model';
import { siFormat, siParse } from '@/lib/numberFormat';
import { PARAMETERS } from '@/lib/parameters';
import { useState } from 'react';
import InferenceExplanation from './inferenceExplanation';
import NumberInput from './numberInput';

interface Props {
  model: Model;
  setModel: (model: Model) => void;
}

export default function CustomModelEditor({ model, setModel }: Props) {
  return (
    <div>
      <div className='text-lg'>Custom model</div>
      <div className='grid grid-cols-3'>
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
    <div className='contents'>
      <div className='m-2'>{parameterSpec.name}</div>
      <div className='m-2 col-span-2'>
        <NumberInput
          value={model[field]}
          setValue={value => setModel({ ...model, [field]: value })}
        />
        <div className='ml-4'>
          {parameterSpec.inferences.map(inference => (
            <Infer model={model} setModel={setModel} inference={inference} />
          ))}
          <Default field={field} model={model} setModel={setModel} />
        </div>
      </div>
    </div>
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
    <div className='m-1'>
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
      <Help>
        <InferenceExplanation type={inference.explanation} />
      </Help>
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
    <div className='m-1'>
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
    <span className='whitespace-nowrap rounded m-1 p-1 bg-green-200'>
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

function Help({ children }: { children: JSX.Element }): JSX.Element {
  const [show, setShow] = useState(false);
  return (
    <span
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      className='cursor-pointer'
    >
      &#9432;
      <span
        className={`absolute bg-white border border-gray-400 p-2 rounded max-w-80 ${
          show ? '' : 'hidden'
        }`}
      >
        {children}
      </span>
    </span>
  );
}
