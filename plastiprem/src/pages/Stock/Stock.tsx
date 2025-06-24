import { useMemo, useState } from "react"
import { BsCheck, BsDash, BsPlus, BsPlusCircle, BsX } from "react-icons/bs"
import { Link } from "react-router-dom"
import { StockItem } from "../../components/Stock/StockItem"

const STOCK = [
  {
    code: '12341234',
    article: 'Caja x 10 resma',
    quantity: 23
  },
  {
    code: '6567567',
    article: 'Bolsa 40x25',
    quantity: 2
  },
  {
    code: '63546',
    article: 'Resma A4',
    quantity: 45
  },
  {
    code: '12341234',
    article: 'Caja x 10 resma',
    quantity: 23
  },
  {
    code: '12341234',
    article: 'Caja x 10 resma',
    quantity: 23
  },
  {
    code: '12341234',
    article: 'Caja x 10 resma',
    quantity: 23
  },
  {
    code: '12341234',
    article: 'Caja x 10 resma',
    quantity: 23
  },
  {
    code: '12341234',
    article: 'Caja x 10 resma',
    quantity: 23
  },
  {
    code: '12341234',
    article: 'Caja x 10 resma',
    quantity: 23
  },
]

export const Stock = () => {
  return (
    <>
      <div className="rounded-sm border flex flex-col gap-3 py-1 px-1 border-stroke  bg-white  shadow-default dark:border-strokedark dark:bg-boxdark ">
        <div className="flex justify-between items-center ">
          <h4 className=" text-xl font-semibold text-black dark:text-white">
            Stock
          </h4>
        </div>
        <div className="relative">
          <button className="absolute left-0 top-1/2 -translate-y-1/2">
            <svg
              className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                fill=""
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                fill=""
              />
            </svg>
          </button>

          <input
            type="text"
            placeholder="Buscar artículo, código de barras..."
            className="w-full bg-gray-2 pl-9 pr-4 rounded-sm text-black focus:outline-none dark:text-white xl:w-125"
          />
        </div>
        <div className="flex flex-col">
          <div className="grid grid-cols-4 rounded-sm bg-gray-2 dark:bg-meta-4  border-solid border-b-2 border-white">
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Código
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Artículo
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Cantidad
              </h5>
            </div>
            <div className=" p-2.5 text-center  xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Reponer stock
              </h5>
            </div>

          </div>
          {STOCK.map((item, key) => (
            <StockItem
              {...item}
              key={key}
            />
          ))}
        </div>
      </div >

    </>
  )
}
