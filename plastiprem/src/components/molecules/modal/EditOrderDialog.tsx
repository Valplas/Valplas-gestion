import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { NewOrderDTO, OrderModel, OrderProductsEntity } from '../../../types/order.type';
import { useSnackbar } from '../../../feature/Snackbar/SnackbarContext';
import useFetch from '../../../hooks/useFetch';
import usePost from '../../../hooks/usePost';
import { ModalContainer } from '../../atoms/modal/ModalContainer';
import { BACKEND_URL } from '../../../envs';
import OrderForm from '../form/OrderForm';

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  orderId: string;
  onEdited: () => void;
  onCancel: VoidFunction;
}

const EditOrderDialog = ({
  open,
  setOpen,
  orderId,
  onEdited,
}: Props) => {
  const { showSnackbar } = useSnackbar();
  const methods = useForm<OrderProductsEntity>();

  const { data: order, error } = useFetch<OrderModel>(
    `${BACKEND_URL}/orders/${orderId}`,
    [open, orderId],
  );
  const { postData, loading } = usePost<NewOrderDTO>(`${BACKEND_URL}/orders/${orderId}`);

  useEffect(() => {
    if (error) showSnackbar('Error al cargar el orden');
  }, [error]);

  const onSubmit = async (formData: NewOrderDTO) => {
    try {

      await postData(formData, 'PUT');
      showSnackbar('Orden editada correctamente');
      setOpen(false);
      onEdited();
    } catch {
      showSnackbar('Error al guardar los cambios');
    }
  };

  if (!open) return null;

  return (
    <ModalContainer setOpen={setOpen}>
      <div className="w-full max-h-[90vh] overflow-y-auto max-w-[1000px]">
        <h2 className="text-xl font-semibold text-white mb-4">Editar order</h2>

        <OrderForm
          order={order}
          methods={methods}
          submit={onSubmit}
          loading={loading}
          defaultOrderProducts={order?.orderProducts}
          clients={order?.client ? [order?.client] : []}
        />
      </div>
    </ModalContainer>
  );
};

export default EditOrderDialog;
