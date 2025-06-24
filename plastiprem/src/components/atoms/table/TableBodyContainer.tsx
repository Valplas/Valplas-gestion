import { ReactNode } from "react"

export const TableBodyContainer = ({children}:{children:ReactNode[]}) => {
  return (
    
    <div className="flex flex-col">{children}</div>
  )
}
