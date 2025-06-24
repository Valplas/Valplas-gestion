interface ItemContainerProps {
    text: string | number
    center?: boolean
    hidden?: boolean
    upper?:boolean
}


export const TableItemContainer = ({ text, center, hidden, upper }: ItemContainerProps) => {
    return (

        <div className={`${hidden? "hidden":""} p-1 ${center ? "text-center" : ''} ${upper?"uppercase":''} sm:block xl:p-2`}>

            <h5 className="text-sm font-medium  xsm:text-base">
                {text}
            </h5>
        </div>
    )
}
