import { TableItemContainer } from '../../atoms/table/TableItemContainer';
import { columnsAux, TableRowProps } from '../../../types/table.type';
import { BsArrowDown, BsArrowUp } from 'react-icons/bs';

export const TableRow = <T extends string | number>({
  showCollapse,
  onClick,
  content,
  actions,
}: TableRowProps<T>) => {
  return (
    <div
      className={`grid ${
        columnsAux[Object.entries(content).length + (actions ? 1 : 0)]
      } rounded-sm bg-gray-2 dark:bg-meta-4  border-0 ${
        showCollapse ? '' : 'border-b-2'
      } border-solid border-black dark:border-gray-2`}
    >
      {Object.entries(content).map(([key, value], index) => {
        if (onClick && index === 0) {
          return (
            <div className="hidden p-2.5 text-center sm:block  " key={index}>
              <h5 className="text-sm font-medium xsm:text-base">
                
                  <button
                    className="rounded-full border-solid border-white border-[1px] p-1"
                    onClick={() => onClick?.()}
                  >
                    {showCollapse ? <BsArrowUp /> : <BsArrowDown />}
                  </button>
                
                {String(value ?? '')}
              </h5>
            </div>
          );
        }

        return <TableItemContainer key={key} text={String(value ?? '')} />;
      })}
      {actions}
    </div>
  );
};
