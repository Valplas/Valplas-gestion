import { useEffect } from 'react';
import { useSnackbar } from '../../../feature/Snackbar/SnackbarContext';
import { ClientModel } from '../../../types/clients.type';
import { ModalContainer } from '../../atoms/modal/ModalContainer';
import useFetch from '../../../hooks/useFetch';
import { BACKEND_URL } from '../../../envs';
import usePost from '../../../hooks/usePost';


interface Props {
  open: boolean;
  clientId: string;
  setOpen: (value: boolean) => void;
  onDeleted: () => void;
}



const DeleteClientDialog = ({ open, clientId, setOpen, onDeleted }: Props) => {
    const { showSnackbar } = useSnackbar();
  
    const { data: client, error } = useFetch<ClientModel>(
      `${BACKEND_URL}/client/${clientId}`,
      [open, clientId] // se vuelve a ejecutar cuando abre el modal o cambia el ID
    );
    const { postData, loading } = usePost(`${BACKEND_URL}/client/${clientId}`);

    useEffect(() => {
      if (error) {
        showSnackbar('Error al obtener los datos del cliente');
      }
    }, [error]);
  
    const handleDelete = async () => {
      try {
        await postData(null, 'DELETE');
        showSnackbar('Cliente eliminado correctamente');
        onDeleted();
      } catch (error) {
        showSnackbar('No se pudo eliminar el cliente');
      }finally{
        setOpen(false);
      }
    };
  
    if (!open) return null;
  return (
    <ModalContainer setOpen={setOpen}>
      <div className="text-white">
        <h2 className="text-lg font-bold mb-4">¿Eliminar cliente?</h2>

        {client ? (
          <div className="mb-4 space-y-1">
            <p><strong>Nombre:</strong> {client.clientName} {client.clientSurname}</p>
            <p><strong>CUIT:</strong> {client.clientCUIT}</p>
            <p><strong>Email:</strong> {client.clientEmail}</p>
          </div>
        ) : (
          <p className="mb-4">Cargando datos del cliente...</p>
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
  );
};


export default DeleteClientDialog;