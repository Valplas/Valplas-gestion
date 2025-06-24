import { FieldValues, UseFormRegister } from 'react-hook-form';

interface InputTextProps {
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
  name: string;
  placeholder?: string;
  register?: UseFormRegister<FieldValues>;
  error?: boolean;
  icon?: boolean;
  disabled?: boolean
}

export const InputText = ({
  type,
  name,
  placeholder,
  register,
  error,
  icon,
  disabled = false
}: InputTextProps) => {
  return (
    <input
      className={`w-full rounded border border-stroke bg-gray py-3 px-4.5 ${
        icon ? 'pl-11.5 pr-4.5 ' : undefined
      } text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${
        error ? 'border-danger' : undefined
      }`}
      type={type}
      {...register?.(
        name,
        type === 'number' ? { valueAsNumber: true } : undefined,
      )}
      id={name}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
};
