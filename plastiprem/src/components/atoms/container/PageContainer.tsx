import  { ReactNode } from 'react'

export const PageContainer = ({children}:{children:ReactNode[]}) => {
  return (
    <div className="rounded-sm border flex flex-col gap-3 py-1 px-1 border-stroke  bg-white  shadow-default dark:border-strokedark dark:bg-boxdark ">
 {children}</div>
  )
}
