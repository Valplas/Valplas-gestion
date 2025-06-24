
import { ModalContainer } from '../../atoms/modal/ModalContainer';
import { useSnackbar } from '../../../feature/Snackbar/SnackbarContext';
import { ProductModel } from '../../../types/product.type';
import useFetch from '../../../hooks/useFetch';
import usePost from '../../../hooks/usePost';
import { BACKEND_URL } from '../../../envs';

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  productId: string;
  onDeleted: () => void;
}

const DeleteProductDialog = ({ open, setOpen, productId, onDeleted }: Props) => {
  const { showSnackbar } = useSnackbar();
  const { data: product } = useFetch<ProductModel>(`${BACKEND_URL}/products/${productId}`, [open]);
  const { postData, loading } = usePost(`${BACKEND_URL}/products/${productId}`);

  const handleDelete = async () => {
    try {
      await postData(null, 'DELETE');
      showSnackbar('Producto eliminado correctamente');
      setOpen(false);
      onDeleted();
    } catch (error) {
      showSnackbar('No se pudo eliminar el producto');
    }
  };

  if (!open) return null;

  return (
    <ModalContainer setOpen={setOpen}>
      <div className="text-white">
        <h2 className="text-lg font-bold mb-4">¿Eliminar producto?</h2>

        {product ? (
          <div className="mb-4 space-y-1">
            <p><strong>Descripción:</strong> {product.description}</p>
            <p><strong>Código:</strong> {product.code}</p>
            <p><strong>Marca:</strong> {product.manufacturer}</p>
          </div>
        ) : (
          <p className="mb-4">Cargando datos del producto...</p>
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

export default DeleteProductDialog;
