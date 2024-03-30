import { Inference, constructInferInput } from '@/lib/inferences';
import {
  ModelField,
  ModelFieldType,
  ModelFields,
  ModelValueType,
} from '@/lib/model';
import { siFormat } from '@/lib/numberFormat';
import { PARAMETERS } from '@/lib/parameters';
import { useState } from 'react';
import NumberInput from './numberInput';
import { INFERENCE_IDS, INFERENCE_TITLES } from './methodDescriptions';
import Link from './link';

interface Props {
  fields: ModelFields;
  setFields: (fields: ModelFields) => void;
}

export default function CustomModelEditor({ fields, setFields }: Props) {
  return (
    <div className='grid grid-cols-4'>
      <Field field={'flops'} fields={fields} setFields={setFields} />
      <Field field={'numParams'} fields={fields} setFields={setFields} />
      <Field field={'numTokens'} fields={fields} setFields={setFields} />
    </div>
  );
}

function Field<T extends ModelFieldType>({
  field,
  fields,
  setFields,
}: {
  field: T;
  fields: ModelFields;
  setFields: (fields: ModelFields) => void;
}) {
  const parameterSpec = PARAMETERS[field]!;
  const fieldValue = fields[field];
  return (
    <div className='contents'>
      <div className='m-2'>{parameterSpec.name}</div>
      <div className='m-2 col-span-3'>
        <NumberInput
          value={fieldValue?.value as number | undefined}
          setValue={value => {
            setFields({
              ...fields,
              [field]: { ...fields[field], value },
            });
          }}
        />
        <div className='ml-4'>
          {parameterSpec.inferences.map((inference, i) => (
            <Infer
              key={i}
              fields={fields}
              setFields={setFields}
              inference={inference}
            />
          ))}
          <Default fieldType={field} fields={fields} setFields={setFields} />
        </div>
      </div>
    </div>
  );
}

function Infer<T extends ModelFieldType>({
  fields,
  setFields: setModel,
  inference,
}: {
  fields: ModelFields;
  setFields: (model: ModelFields) => void;
  inference: Inference<any, T>;
}) {
  const inferInput = constructInferInput(fields, inference.requires);
  const inferredValue = inferInput ? inference.infer(inferInput) : undefined;
  return (
    <div className='m-1'>
      <SetValueButton
        value={inferredValue}
        field={inference.field}
        fields={fields}
        setFields={setModel}
      />
      <span className='text-sm'>
       {' '}from{' '}
        <Link href={'#' + INFERENCE_IDS[inference.explanation]} target='_self'>
          {INFERENCE_TITLES[inference.explanation]}
        </Link>
        &nbsp;with
        {inference.requires.map((requirement, i) => (
          <ValueTag key={i} field={requirement} value={fields[requirement]} />
        ))}
      </span>
    </div>
  );
}

function Default<T extends ModelFieldType>({
  fieldType,
  fields,
  setFields,
}: {
  fieldType: T;
  fields: ModelFields;
  setFields: (model: ModelFields) => void;
}) {
  const parameterSpec = PARAMETERS[fieldType]!;
  return (
    <div className='m-1'>
      <SetValueButton
        value={parameterSpec.default}
        field={fieldType}
        fields={fields}
        setFields={setFields}
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
  fields: fields,
  setFields: setFields,
}: {
  value: ModelValueType | undefined;
  field: T;
  fields: ModelFields;
  setFields: (model: ModelFields) => void;
}) {
  return (
    <button
      disabled={value === undefined}
      className={`rounded px-1 ${value !== undefined ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      onClick={() =>
        setFields({
          ...fields,
          [field]: { value, source: 'manual' },
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
