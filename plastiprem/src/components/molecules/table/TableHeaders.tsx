


import { columnsAux, TableHeadersProps } from '../../../types/table.type'
import { TableItemContainer } from '../../atoms/table/TableItemContainer'



export const TableHeaders = ({ titles, columns }: TableHeadersProps) => {


    return (
        <div className={`grid ${columnsAux[columns]} rounded-sm bg-gray-2 dark:bg-meta-4  border-0 border-b-2 border-solid border-black dark:border-gray-2`} >
            {titles.map((title, i) => {
                if (i === 0) {
                    return (
                        <TableItemContainer key={i} text={title} upper center />
                    )
                }
                return (
                    <TableItemContainer key={i} text={title} upper />
                )
            })}
        </div>
    )
}
