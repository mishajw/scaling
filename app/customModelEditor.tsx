import {
  ModelField,
  ModelFieldType,
  ModelFields,
  ModelValueType,
} from '@/lib/model';
import { siFormat } from '@/lib/numberFormat';
import { FIELD_SPECS } from '@/lib/fields';
import { useState } from 'react';
import NumberInput from './numberInput';
import Link from './link';
import { Calculation, calculate } from '@/lib/calculations/types';
import { CalculationLink } from './calculationDescriptions';
import FieldDescription from './fieldDescription';

interface Props {
  fields: ModelFields;
  setFields: (fields: ModelFields) => void;
}

export default function CustomModelEditor({ fields, setFields }: Props) {
  return (
    <div className='grid grid-cols-3'>
      <Field field={'flops'} fields={fields} setFields={setFields} />
      <Field field={'numParams'} fields={fields} setFields={setFields} />
      <Field field={'numTokens'} fields={fields} setFields={setFields} />
      <Field field={'lossNats'} fields={fields} setFields={setFields} />
      <Field field={'trainingTimeDays'} fields={fields} setFields={setFields} />
      <Field field={'flopsPerSecond'} fields={fields} setFields={setFields} />
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
  const fieldSpec = FIELD_SPECS[field]!;
  const fieldValue = fields[field];
  return (
    <div className='contents'>
      <div className='m-2'>
        <div className='text-lg'>{fieldSpec.name}</div>
        <FieldDescription type={field} />
      </div>
      <div className='m-2 col-span-2'>
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
          {fieldSpec.calculations.map((calculation, i) => (
            <Calculate
              key={i}
              fields={fields}
              setFields={setFields}
              calculation={calculation}
            />
          ))}
          <Default fieldType={field} fields={fields} setFields={setFields} />
        </div>
      </div>
    </div>
  );
}

function Calculate<T extends ModelFieldType>({
  fields,
  setFields: setModel,
  calculation,
}: {
  fields: ModelFields;
  setFields: (model: ModelFields) => void;
  calculation: Calculation<any, T>;
}) {
  const calculatedValue = calculate(fields, calculation);
  return (
    <div className='m-1'>
      <SetValueButton
        value={calculatedValue}
        field={calculation.fieldType}
        fields={fields}
        setFields={setModel}
        canConflict={true}
      />
      <span className='text-sm'>
        {' '}
        from <CalculationLink type={calculation.type} />
        &nbsp;with
        {calculation.requires.map((requirement, i) => (
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
  const fieldSpec = FIELD_SPECS[fieldType]!;
  if (fieldSpec.default === undefined) {
    return undefined;
  }
  return (
    <div className='m-1'>
      <SetValueButton
        value={fieldSpec.default}
        field={fieldType}
        fields={fields}
        setFields={setFields}
        canConflict={false}
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
  const fieldSpec = FIELD_SPECS[field]!;
  return (
    <span className='whitespace-nowrap rounded m-1 p-1 bg-green-200'>
      {fieldSpec.name}=<Value field={value} />
    </span>
  );
}

function SetValueButton<T extends ModelFieldType>({
  value,
  field,
  fields: fields,
  setFields,
  canConflict,
}: {
  value: ModelValueType | undefined;
  field: T;
  fields: ModelFields;
  setFields: (model: ModelFields) => void;
  canConflict: boolean;
}) {
  let color: string;
  if (canConflict && hasConflict(value, fields[field]?.value)) {
    color = 'bg-orange-500';
  } else if (canConflict && !hasConflict(value, fields[field]?.value)) {
    color = 'bg-blue-500 text-white';
  } else {
    color = 'bg-gray-200';
  }
  return (
    <button
      disabled={value === undefined}
      className={`rounded px-1 ${color}`}
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

function hasConflict(
  value1: ModelValueType | undefined,
  value2: ModelValueType | undefined
): boolean {
  console.log('a', value1, value2);
  if (
    typeof value1 !== 'number' ||
    typeof value2 !== 'number' ||
    value1 === undefined ||
    value2 === undefined ||
    value1 === 0
  ) {
    return value1 !== value2;
  }
  console.log(value1, value2);
  return Math.abs((value1 - value2) / value1) > 0.001;
}
