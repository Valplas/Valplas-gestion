import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSnackbar } from '../../../feature/Snackbar/SnackbarContext';
import { ClientModel } from '../../../types/clients.type';
import useFetch from '../../../hooks/useFetch';
import usePost from '../../../hooks/usePost';
import { ModalContainer } from '../../atoms/modal/ModalContainer';
import { ClientForm } from '../form/ClientForm';
import { BACKEND_URL } from '../../../envs';

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  clientId: string;
  onEdited: () => void;
  onCancel: VoidFunction
}

const EditClientDialog = ({ open, setOpen, clientId, onEdited, onCancel }: Props) => {
  const { showSnackbar } = useSnackbar();
  const methods = useForm<ClientModel>();
  const { reset } = methods;

  const { data: client, error } = useFetch<ClientModel>(
    `${BACKEND_URL}/client/${clientId}`,
    [open, clientId],
  );

  const { postData, loading: saving } = usePost(
    `${BACKEND_URL}/client/${clientId}`,
  );

  useEffect(() => {
    if (client) reset(client);
  }, [client]);

  useEffect(() => {
    if (error) showSnackbar('Error al cargar los datos del cliente');
  }, [error]);

  const onSubmit = async (data: ClientModel) => {
    try {
      await postData(data, 'PUT');
      showSnackbar('Cliente editado correctamente');
      setOpen(false);
      onEdited();
    } catch (err) {
      showSnackbar('Error al guardar los cambios');
    }
  };

  if (!open) return null;

  return (
    <ModalContainer setOpen={setOpen}>
      <div className="w-full max-w-[1000px]">
        <h2 className="text-xl font-semibold text-white mb-4">
          Editar cliente
        </h2>
        <ClientForm methods={methods} onSubmit={onSubmit} loading={saving} onCancel={onCancel}/>
      </div>
    </ModalContainer>
  );
};

export default EditClientDialog;
