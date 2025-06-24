import { useMemo } from 'react';
import Loader from '../../../common/Loader/Loader';

interface ButtonProps {
  label: string;
  isLoading?: boolean;
  className?: string;
  type?:React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  disabled?:boolean
  onClick?:React.MouseEventHandler<HTMLButtonElement> | undefined;
}

export const Button = ({ label, isLoading, className, type, disabled, onClick }: ButtonProps) => {
  const ButtonContent = useMemo(() => {
    if (isLoading) return <Loader />;
    return label;
  }, [isLoading]);

  const ButtonType =useMemo(()=>{
    if(type==='reset')return 'flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white'
    return 'flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90'
  },[type]);

  return (
    <button
      className={`${ButtonType} ${className}`}
      disabled={isLoading || disabled}
      type={type ?? 'button'}
      onClick={onClick}
      
    >
      {ButtonContent}
    </button>
  );
};
