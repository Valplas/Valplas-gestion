import React, { ReactNode } from 'react';

interface ItemFormContainerProps {
  children: ReactNode[];
}

export const ItemFormContainer = ({ children }: ItemFormContainerProps) => {
  return (
    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">{children}</div>
  );
};
