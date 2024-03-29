import { Inference, constructInferInput } from '@/lib/inferences';
import { Model, ModelField, ModelFieldType, ModelValueType } from '@/lib/model';
import { siFormat, siParse } from '@/lib/numberFormat';
import { PARAMETERS } from '@/lib/parameters';
import { useState } from 'react';
import InferenceExplanation from './inferenceExplanation';
import NumberInput from './numberInput';
import ScaleExplanation from './scaleExplanation';

interface Props {
  model: Model;
  setModel: (model: Model) => void;
}

export default function CustomModelEditor({ model, setModel }: Props) {
  return (
    <div>
      <div className='grid grid-cols-4'>
        <Field field={'flops'} model={model} setModel={setModel} />
        <Field field={'numParams'} model={model} setModel={setModel} />
        <Field field={'numTokens'} model={model} setModel={setModel} />
      </div>
      <ScaleExplanation />
    </div>
  );
}

function Field<T extends ModelFieldType>({
  field,
  model,
  setModel,
}: {
  field: T;
  model: Model;
  setModel: (model: Model) => void;
}) {
  const parameterSpec = PARAMETERS[field]!;
  const fieldValue = model.fields[field];
  return (
    <div className='contents'>
      <div className='m-2'>{parameterSpec.name}</div>
      <div className='m-2 col-span-3'>
        <NumberInput
          value={fieldValue?.value}
          setValue={value => {
            setModel({
              ...model,
              fields: {
                ...model.fields,
                [field]: { ...model.fields[field], value },
              },
            });
          }}
        />
        <div className='ml-4'>
          {parameterSpec.inferences.map((inference, i) => (
            <Infer
              key={i}
              model={model}
              setModel={setModel}
              inference={inference}
            />
          ))}
          <Default field={field} model={model} setModel={setModel} />
        </div>
      </div>
    </div>
  );
}

function Infer<T extends ModelFieldType>({
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
        {inference.requires.map((requirement, i) => (
          <ValueTag
            key={i}
            field={requirement}
            value={model.fields[requirement]}
          />
        ))}
      </span>
      <Help>
        <InferenceExplanation type={inference.explanation} />
      </Help>
    </div>
  );
}

function Default<T extends ModelFieldType>({
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

function ValueTag<T extends ModelFieldType>({
  field,
  value,
}: {
  field: T;
  value: ModelField | undefined;
}) {
  const parameterSpec = PARAMETERS[field]!;
  return (
    <span className='whitespace-nowrap rounded m-1 p-1 bg-green-200'>
      {parameterSpec.name}=<Value field={value} />
    </span>
  );
}

function SetValueButton<T extends ModelFieldType>({
  value,
  field,
  model,
  setModel,
}: {
  value: ModelValueType | undefined;
  field: T;
  model: Model;
  setModel: (model: Model) => void;
}) {
  return (
    <button
      disabled={value === undefined}
      className={`rounded px-1 ${value !== undefined ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      onClick={() =>
        setModel({
          ...model,
          fields: { ...model.fields, [field]: { value, source: 'manual' } },
        })
      }
    >
      &#x2196; <Value field={value ? { value, source: 'custom' } : undefined} />
    </button>
  );
}

function Value({ field }: { field: ModelField | undefined }) {
  if (field !== undefined) {
    if (typeof field.value === 'number') {
      return <span>{siFormat(field.value)}</span>;
    } else {
      return <span>{field.toString()}</span>;
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
