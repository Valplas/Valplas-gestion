import { useForm } from 'react-hook-form';
import { ClientModel } from '../../../types/clients.type';
import { useSnackbar } from '../../../feature/Snackbar/SnackbarContext';
import usePost from '../../../hooks/usePost';
import { cleanEmptyStrings } from '../../../helpers/functions/clearEmptyFields';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { ClientForm } from '../../../components/molecules/form/ClientForm';
import { useEffect } from 'react';
import { BACKEND_URL } from '../../../envs';


export const NewClient = () => {
  const methods = useForm<ClientModel>();

  const { data, loading, error, postData } = usePost<ClientModel>(
    `${BACKEND_URL}/client`,
  );
  const { showSnackbar } = useSnackbar();
  const { reset } = methods;
  const onSubmit = async (formData: ClientModel) => {
    const cleaned = cleanEmptyStrings(formData);
    await postData({
      ...cleaned,
      clientType: cleaned?.clientType ? +cleaned.clientType : undefined,
      clientTaxCondition: cleaned?.clientTaxCondition ?? null,
      clientDate: cleaned?.clientDate ? new Date(cleaned.clientDate) : null,
    });
  };

  useEffect(() => {
    if (data) {
      showSnackbar('Cliente creado con éxito');
      reset();
    }
    if (error) showSnackbar('Hubo un error al crear el cliente');
  }, [error, data]);

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Clientes | Nuevo cliente" />

      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Información personal
              </h3>
            </div>
            <div className="p-7">
              <ClientForm
                methods={methods}
                onSubmit={onSubmit}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
