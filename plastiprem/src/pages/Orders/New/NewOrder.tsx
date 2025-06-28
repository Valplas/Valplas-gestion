import { useForm } from 'react-hook-form';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import usePost from '../../../hooks/usePost';
import { NewOrderDTO, OrderProductsEntity } from '../../../types/order.type';
import { BACKEND_URL } from '../../../envs';
import OrderForm from '../../../components/molecules/form/OrderForm';
import { useSnackbar } from '../../../feature/Snackbar/SnackbarContext';
import { ClientModel } from '../../../types/clients.type';
import useFetch from '../../../hooks/useFetch';

export const NewOrder = () => {
  const { showSnackbar } = useSnackbar();

  const methods = useForm<OrderProductsEntity>({
    // resolver: zodResolver(newOrderSchema),
  });
  const { postData, loading } = usePost<NewOrderDTO>(
    `${BACKEND_URL}/orders`,
  );
  const { data: clients } = useFetch<ClientModel[]>(`${BACKEND_URL}/client`);
  const onSubmit = async (formData: NewOrderDTO) => {
    try {
      await postData(formData, 'POST');
      showSnackbar('Orden editada correctamente');
    } catch {
      showSnackbar('Error al guardar los cambios');
    }
  };

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Órdenes | Nueva orden" />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Información de la Orden
                </h3>
                <OrderForm
                  clients={clients ?? undefined}
                  methods={methods}
                  submit={onSubmit}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
