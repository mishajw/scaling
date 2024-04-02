import {
  ModelField,
  ModelFieldType,
  ModelFields,
  ModelValueType,
} from '@/lib/model';
import { siFormat } from '@/lib/numberFormat';
import { FIELD_SPECS } from '@/lib/fields';
import NumberInput from './numberInput';
import { Calculation, calculate } from '@/lib/calculations/types';
import { CalculationLink } from './calculationDescriptions';
import FieldDescription from './fieldDescription';
import DropDownInput from './dropDownInput';
import { GPU_TYPES, GpuType } from '@/lib/gpu';
import { SCALING_LAWS, ScalingLawType } from '@/lib/scalingLaw';

interface Props {
  fields: ModelFields;
  setField: (field: ModelFieldType, value: ModelField | undefined) => void;
  setPlotField: (plotField: ModelFieldType) => void;
}

export default function CustomModelEditor({
  fields,
  setField,
  setPlotField,
}: Props) {
  return (
    <div className='grid grid-cols-3'>
      <SectionTitle>Resources</SectionTitle>
      <Field
        field={'costDollars'}
        fields={fields}
        setField={setField}
        setPlotField={setPlotField}
      />
      <Field
        field={'trainingTimeDays'}
        fields={fields}
        setField={setField}
        setPlotField={setPlotField}
      />
      <SectionTitle>GPUs</SectionTitle>
      <Field
        field={'gpuCount'}
        fields={fields}
        setField={setField}
        setPlotField={setPlotField}
      />
      <Field
        field={'gpuType'}
        fields={fields}
        setField={setField}
        setPlotField={setPlotField}
      />
      <Field
        field={'gpuUtilization'}
        fields={fields}
        setField={setField}
        setPlotField={setPlotField}
      />
      <SectionTitle>Perf</SectionTitle>
      <Field
        field={'flopsPerSecond'}
        fields={fields}
        setField={setField}
        setPlotField={setPlotField}
      />
      <Field
        field={'flops'}
        fields={fields}
        setField={setField}
        setPlotField={setPlotField}
      />
      <SectionTitle>Model</SectionTitle>
      <Field
        field={'numParams'}
        fields={fields}
        setField={setField}
        setPlotField={setPlotField}
      />
      <Field
        field={'numTokens'}
        fields={fields}
        setField={setField}
        setPlotField={setPlotField}
      />
      <Field
        field={'lossNats'}
        fields={fields}
        setField={setField}
        setPlotField={setPlotField}
      />
      <Field
        field={'scalingLaw'}
        fields={fields}
        setField={setField}
        setPlotField={setPlotField}
      />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex justify-center font-bold text-xl col-span-3 mt-4'>
      {children}
    </div>
  );
}

function Field<T extends ModelFieldType>({
  field,
  fields,
  setField,
  setPlotField,
}: {
  field: T;
  fields: ModelFields;
  setField: (field: ModelFieldType, value: ModelField | undefined) => void;
  setPlotField: (plotField: ModelFieldType) => void;
}) {
  const fieldSpec = FIELD_SPECS[field]!;
  const fieldValue = fields[field];
  const setValue = (value: ModelValueType | undefined) => {
    if (value === undefined) {
      setField(field, undefined);
    } else {
      setField(field, { ...fields[field], value, source: 'custom' });
    }
  };
  return (
    <div className='contents'>
      <div className='m-2'>
        <div className='flex flex-row items-center'>
          <div className='text-lg'>{fieldSpec.name}</div>
          {fieldSpec.valueType === 'number' && (
            <button
              className='ml-2 text-sm rounded bg-gray-200 px-2'
              onClick={() => setPlotField(field)}
            >
              Plot
            </button>
          )}
        </div>
        <FieldDescription type={field} />
      </div>
      <div className='m-2 col-span-2'>
        {fieldSpec.valueType === 'number' && (
          <NumberInput
            value={fieldValue?.value as number | undefined}
            setValue={setValue}
          />
        )}
        {fieldSpec.valueType === 'gpu-type' && (
          <DropDownInput
            value={fieldValue?.value as GpuType}
            options={Object.keys(GPU_TYPES) as GpuType[]}
            setValue={setValue}
          />
        )}
        {fieldSpec.valueType === 'scaling-law' && (
          <DropDownInput
            value={fieldValue?.value as ScalingLawType}
            options={SCALING_LAWS}
            setValue={setValue}
          />
        )}
        <div>
          {fieldSpec.calculations.map((calculation, i) => (
            <Calculate
              key={i}
              fields={fields}
              setField={setField}
              calculation={calculation}
            />
          ))}
          <Default fieldType={field} fields={fields} setField={setField} />
        </div>
      </div>
    </div>
  );
}

function Calculate<T extends ModelFieldType>({
  fields,
  setField: setField,
  calculation,
}: {
  fields: ModelFields;
  setField: (field: ModelFieldType, value: ModelField | undefined) => void;
  calculation: Calculation<any, T>;
}) {
  const calculatedValue = calculate(fields, calculation);
  return (
    <div className='m-1 flex flex-row'>
      <div className='flex-grow'>
        <SetValueButton
          value={calculatedValue}
          field={calculation.fieldType}
          fields={fields}
          setField={setField}
          canConflict={true}
        />
      </div>
      <div className='ml-1'>
        <span className='text-sm'>
          from <CalculationLink type={calculation.type} />
          &nbsp;with{' '}
        </span>
        {calculation.requires.map((requirement, i) => (
          <span key={i} className='text-sm'>
            <ValueTag key={i} field={requirement} value={fields[requirement]} />{' '}
          </span>
        ))}
      </div>
    </div>
  );
}

function Default<T extends ModelFieldType>({
  fieldType,
  fields,
  setField,
}: {
  fieldType: T;
  fields: ModelFields;
  setField: (field: ModelFieldType, value: ModelField | undefined) => void;
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
        setField={setField}
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
    <span className='inline-block whitespace-nowrap rounded px-1 bg-green-200'>
      {fieldSpec.name}=<Value field={value} />
    </span>
  );
}

function SetValueButton<T extends ModelFieldType>({
  value,
  field,
  fields,
  setField,
  canConflict,
}: {
  value: ModelValueType | undefined;
  field: T;
  fields: ModelFields;
  setField: (field: ModelFieldType, value: ModelField | undefined) => void;
  canConflict: boolean;
}) {
  let color: string;
  if (
    canConflict &&
    hasConflict(value, fields[field]?.value) &&
    value !== undefined
  ) {
    color = 'bg-orange-500 text-white';
  } else if (
    canConflict &&
    !hasConflict(value, fields[field]?.value) &&
    value !== undefined
  ) {
    color = 'bg-blue-500 text-white';
  } else {
    color = 'bg-gray-200';
  }
  return (
    <button
      disabled={value === undefined}
      className={`rounded px-1 whitespace-nowrap ${color}`}
      onClick={() => {
        if (value !== undefined) {
          setField(field, { value, source: 'custom' });
        }
      }}
    >
      = <Value field={value ? { value, source: 'custom' } : undefined} />
    </button>
  );
}

function Value({ field }: { field: ModelField | undefined }) {
  if (field !== undefined) {
    if (typeof field.value === 'number') {
      return <span>{siFormat(field.value)}</span>;
    } else {
      return <span>{field.value.toString()}</span>;
    }
  } else {
    return <span className='bg-gray-200 italic'>N/A</span>;
  }
}

function hasConflict(
  value1: ModelValueType | undefined,
  value2: ModelValueType | undefined
): boolean {
  if (
    typeof value1 !== 'number' ||
    typeof value2 !== 'number' ||
    value1 === undefined ||
    value2 === undefined ||
    value1 === 0
  ) {
    return value1 !== value2;
  }
  return Math.abs((value1 - value2) / value1) > 0.001;
}
