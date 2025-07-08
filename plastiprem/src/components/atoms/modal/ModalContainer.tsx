import { ReactNode } from "react"


export const ModalContainer = ({children, setOpen}:{children:ReactNode, setOpen:(value:boolean)=>void}) => {
    const handleBackdropClick = () => {
        setOpen(false);
    };

    const handleModalClick = (event:React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation(); // Evita que el clic en el modal cierre el modal
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            onClick={handleBackdropClick}
        >
            <div 
                className="bg-graydark p-5 rounded-lg max-w-5xl w-fit max-h-[80vh] overflow-y-auto shadow-lg"
                onClick={handleModalClick}
            >
                {children}
            </div>
        </div>
    )
}