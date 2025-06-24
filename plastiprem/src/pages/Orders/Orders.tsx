import { Fragment, lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { TableHeaders } from '../../components/molecules/table/TableHeaders';
import { TableRow } from '../../components/molecules/table/TableRow';
import { TableItemContainer } from '../../components/atoms/table/TableItemContainer';
import useFetch from '../../hooks/useFetch';
import { OrderModel, OrderStatusType } from '../../types/order.type';
import dayjs from 'dayjs';
import { SkeletonRow } from '../../components/atoms/skeleton/SkeletonRow';
import { TableBodyContainer } from '../../components/atoms/table/TableBodyContainer';
import { PageContainer } from '../../components/atoms/container/PageContainer';
import { TableActions } from '../../components/molecules/table/TableActions';
import { useSnackbar } from '../../feature/Snackbar/SnackbarContext';
import { BACKEND_URL } from '../../envs';
import Loader from '../../common/Loader/Loader';
import { BsPrinterFill } from 'react-icons/bs';
import { PrintableOrder } from '../../components/molecules/print/PrintableOrder';
import jsPDF from 'jspdf';
import { generatePDF } from '../../helpers/functions/generateOrderPDF';

const headers = [
  'Estado',
  'Número',
  'Cliente',
  '$ total',
  'Fecha alta',
  'Fecha entrega',
  'Horarios',
  'Localidad',
  'Kilos',
  ' ',
];
export const Orders = () => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const { data, loading, error } = useFetch<OrderModel[]>(
    `${BACKEND_URL}/orders`,
    [refresh],
  );




  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (error) {
      showSnackbar('Hubo un error al cargar la pagina');
    }
  }, [error]);
  const [ids, setIds] = useState<string[]>([]);

  const handleDropdown = (id: string) => {
    if (ids.includes(id)) {
      setIds(ids.filter((elem) => elem !== id));
    } else {
      setIds([...ids, id]);
    }
  };

  return (
    <>
      <PageContainer>
        <div className="flex justify-between items-center ">
          <h4 className=" text-xl font-semibold text-black dark:text-white">
            Pedidos
          </h4>
          <Link
            to="/orders/new"
            className="inline-flex items-center  justify-center gap-2.5 rounded-full bg-meta-3 py-2 px-4 text-center font-bold text-lg text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            Nuevo pedido
          </Link>
        </div>
        <TableBodyContainer>
          <TableHeaders titles={headers} columns={headers.length} />

          {loading ? (
            <div className="w-full">
              {[...Array(5)].map((_, index) => (
                <SkeletonRow key={index} />
              ))}
            </div> // Muestra 5 filas de skeleton
          ) : (
            data?.map((order) => (
              <div key={order.orderID}>
                <TableRow
                  content={{
                    Estado: OrderStatusType[order.orderStatus],
                    Número: order.orderNumber,
                    Cliente:
                      order.client?.clientName ??
                      order.client?.clientNumber ??
                      '',
                    Monto: order.amount,
                    'Fecha alta': dayjs(order.orderDate).format('DD/MM/YYYY'),
                    'Fecha entrega': dayjs(order.deliveryDate).format(
                      'DD/MM/YYYY',
                    ),
                    Horarios: order.schedules,
                    Localidad: order.address,
                    Kilos: `${Math.ceil(order.weight)} Kg`,
                  }}
                  showCollapse={ids.includes(order.orderID)}
                  onClick={() => handleDropdown(order.orderID)}
                  actions={
                    <div className="flex">
                      <TableActions
                        onDelete={() => {
                          setSelectedOrderId(order.orderID);
                          setIsDeleteOpen(true);
                        }}
                        onEdit={() => {
                          setSelectedOrderId(order.orderID);
                          setIsEditOpen(true);
                        }}
                      />
                      <button
                        className="relative flex items-center justify-center p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition"
                        onClick={() => generatePDF(order)}
                      >
                        <BsPrinterFill className="w-5 h-5" />
                      </button>
                    </div>
                  }
                />

                {ids.includes(order.orderID) && (
                  <div
                    className={`grid grid-cols-5 px-10 rounded-sm bg-gray-2 dark:bg-meta-4  border-0 border-b-2 border-solid border-black dark:border-gray-2`}
                  >
                    <TableItemContainer text={'Producto'} />
                    <TableItemContainer text={'Cantidad'} />
                    <TableItemContainer text={'Precio unitario'} />
                    <TableItemContainer text={'Subtotal'} />
                    <TableItemContainer text={'Código'} />
                    {order.orderProducts?.map((row) => (
                      <Fragment
                        key={`${order.orderID}-${row.product.productID}`}
                      >
                        <TableItemContainer text={row.product.description} />
                        <TableItemContainer text={row.quantity.toString()} />
                        <TableItemContainer text={`$${row.unitaryPrice}`} />
                        <TableItemContainer
                          text={`$${row.quantity * Number(row.unitaryPrice)}`}
                        />
                        <TableItemContainer text={row.product.code} />
                      </Fragment>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}

        </TableBodyContainer>
        <Suspense fallback={<Loader />}>
          {selectedOrderId && isDeleteOpen && (
            <DeleteOrderDialog
              open={isDeleteOpen}
              orderId={selectedOrderId}
              setOpen={setIsDeleteOpen}
              onDeleted={() => setRefresh((prev) => !prev)}
            />
          )}

          {selectedOrderId && isEditOpen && (
            <EditOrderDialog
              open={isEditOpen}
              orderId={selectedOrderId}
              setOpen={setIsEditOpen}
              onEdited={() => setRefresh((prev) => !prev)}
              onCancel={() => setIsEditOpen(false)}
            />
          )}
        </Suspense>
      </PageContainer>
    </>
  );
};

const DeleteOrderDialog = lazy(
  () => import('../../components/molecules/modal/DeleteOrderDialog'),
);
const EditOrderDialog = lazy(
  () => import('../../components/molecules/modal/EditOrderDialog'),
);
