import { Suspense, useMemo, useState } from "react"
import { BsCheck, BsDash, BsPencilSquare,  BsPlus, BsPlusCircle,  BsX } from "react-icons/bs"
import { ModalContainer } from "../atoms/modal/ModalContainer"

interface StockItemProps {
    code: string,
    article: string,
    quantity: number
}

export const StockItem = ({ code, article, quantity }: StockItemProps) => {
    const [addStock, setAddStock] = useState<boolean>(false)
    const [stock, setStock] = useState<number>(quantity)
    const SetStockComponent = useMemo(() => {
        if (addStock) {
            return (
                <AddStockComponent setAddStock={setAddStock} setStock={setStock} />
            )
        }
        return (
            <AddStockButton setAddStock={setAddStock} />
        )
    }, [addStock])

    return (
        <div
            className="grid grid-cols-4 rounded-sm bg-gray-2 dark:bg-meta-4  items-center border-solid border-b-2 border-gray-1"

        >
            <div className="p-2">
                <h5 className="text-sm font-medium  xsm:text-base">
                    {code}
                </h5>
            </div>
            <div className="p-2 text-center">
                <h5 className="text-sm font-medium  xsm:text-base">
                    {article}
                </h5>
            </div>
            <div className="p-2 text-center">
                <h5 className="text-sm font-medium  xsm:text-base">
                    {stock}
                </h5>
            </div>
            <div className="hidden p-2 text-center sm:block">
                {SetStockComponent}
            </div>
            <div className="sm:hidden p-2 text-center">
                <button onClick={() => {setAddStock(true) }}>
                    <BsPencilSquare />
                </button>
            </div>
            {
                addStock && (
                    <Suspense>
                        <ModalContainer setOpen={setAddStock}>
                            <AddStockComponent setAddStock={setAddStock} setStock={setStock} />

                        </ModalContainer>
                    </Suspense>
                )
            }
        </div>
    )
}

const AddStockButton = ({ setAddStock }: { setAddStock: (value: boolean) => void }) => {

    return (

        <button
            className="inline-flex items-center justify-center gap-2.5 rounded-full border border-gray-1 py-2 px-2 text-center font-medium text-gray-1 hover:bg-opacity-90 lg:px-6 xl:px-8"
            onClick={() => setAddStock(true)}
        >
            <span>
                <BsPlusCircle />
            </span>
            Reponer cantidad
        </button>
    )
}

const AddStockComponent = ({ setStock, setAddStock }: {
    setStock: React.Dispatch<React.SetStateAction<number>>,
    setAddStock: (value: boolean) => void
}) => {
    const [quantity, setQuantity] = useState<number>(0)
    return (
        <div
            className="flex-col items-center justify-center gap-2  px-1 "
        >
            <div className="flex items-center justify-center gap-2">

                <button
                    onClick={() => {
                        if (quantity > 0) {
                            setQuantity((prev) => prev - 1)
                        }
                    }}
                >

                    <BsDash />
                </button>

                <input type="number" className="w-30"
                    value={quantity}
                    min={0}
                    onChange={e => {
                        setQuantity(Number(e.target.value))
                    }}
                />

                <button
                    onClick={() => {
                        setQuantity(prev => prev + 1)
                    }}
                >

                    <BsPlus />
                </button>

            </div>
            <div className="flex items-center justify-center gap-3">

                <button
                    className="inline-flex items-center justify-center"
                    onClick={() => {
                        setStock((prev) => prev + quantity)
                        setAddStock(false)
                    }}>
                    <BsCheck />
                    Actualizar
                </button>

                <button
                    className="inline-flex items-center justify-center"
                    onClick={() => {
                        setAddStock(false)
                    }}>
                    <BsX />
                    Cancelar
                </button>
            </div>
        </div>
    )
}