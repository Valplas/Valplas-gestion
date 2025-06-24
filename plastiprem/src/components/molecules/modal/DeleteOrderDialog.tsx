import { Fragment } from "react";
import { BACKEND_URL } from "../../../envs";
import { useSnackbar } from "../../../feature/Snackbar/SnackbarContext";
import useFetch from "../../../hooks/useFetch";
import usePost from "../../../hooks/usePost";
import { OrderModel } from "../../../types/order.type";
import { ModalContainer } from "../../atoms/modal/ModalContainer";
import { TableItemContainer } from "../../atoms/table/TableItemContainer";
interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  orderId: string;
  onDeleted: () => void;
}


 const DeleteOrderDialog = ({ open, setOpen, orderId, onDeleted }: Props) => {
  const { showSnackbar } = useSnackbar();
  const { data: order } = useFetch<OrderModel>(`${BACKEND_URL}/orders/${orderId}`, [open]);
  const { postData, loading } = usePost(`${BACKEND_URL}/orders/${orderId}`);

  const handleDelete = async () => {
    try {
      await postData(null, 'DELETE');
      showSnackbar('orden eliminado correctamente');
      setOpen(false);
      onDeleted();
    } catch (error) {
      showSnackbar('No se pudo eliminar el orden');
    }
  };

  if (!open) return null;
  return (
    <ModalContainer setOpen={setOpen}>
          <div className="text-white">
            <h2 className="text-lg font-bold mb-4">¿Eliminar orden?</h2>
    
            {order ? (
              <div
                                  className={`grid grid-cols-5 px-10 rounded-sm bg-gray-2 dark:bg-meta-4  border-0 border-b-2 border-solid border-black dark:border-gray-2`}
                                >
                                  <TableItemContainer text={'Producto'} />
                                  <TableItemContainer text={'Cantidad'} />
                                  <TableItemContainer text={'Precio unitario'} />
                                  <TableItemContainer text={'Subtotal'} />
                                  <TableItemContainer text={'Código'} />
                                  {order.orderProducts?.map((row, idx) => (
                                    <Fragment key={idx}>
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
            ) : (
              <p className="mb-4">Cargando datos de la orden...</p>
            )}
    
            <div className="flex justify-end gap-3">
              <button
                className="bg-slate-400 text-black px-4 py-2 rounded hover:bg-slate-500"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                No, cerrar
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={handleDelete}
                disabled={loading}
              >
                Sí, borrar
              </button>
            </div>
          </div>
        </ModalContainer>
  )
}
export default DeleteOrderDialog;
