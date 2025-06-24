import { ReactNode } from 'react';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import { InputText } from '../../atoms/inputs/InputText';
import { ErrorMessage } from '@hookform/error-message';
import { InputSelect } from '../../atoms/inputs/InputSelect';

interface FormItemProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  icon?: ReactNode;
  errors: FieldErrors<FieldValues>;
  options?: {
    value: any;
    label: string;
  }[];
  disabled?:boolean
}

export const FormItem = ({
  name,
  label,
  type,
  register,
  icon,
  errors,
  placeholder,
  options,
  disabled = false
}: FormItemProps) => {
  return (
    <div className="w-full sm:w-1/2">
      <label
        className="mb-3 block text-sm font-medium text-black dark:text-white"
        htmlFor={name}
      >
        {label}
      </label>
      <div className={icon ? 'relative' : ''}>
        {icon && <span className="absolute left-4.5 top-4">{icon}</span>}
        {options?.length ? (
          <InputSelect
            name={name}
            options={options}
            register={register}
            error={!!errors[name]?.message}
            placeholder={placeholder}
            icon={!!icon}
          />
        ) : (
          <InputText
          name={name}
            error={!!errors[name]?.message}
            placeholder={placeholder}
            register={register}
            type={type}
            icon={!!icon}
            disabled={disabled}
          />
        )}

        <ErrorMessage
          errors={errors}
          name={name}
          render={({ message }) => <p className="text-danger">{message}</p>}
        />
      </div>
    </div>
  );
};
