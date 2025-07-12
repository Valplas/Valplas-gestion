import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { ProductModel } from '../../../types/product.type';
import { useSnackbar } from '../../../feature/Snackbar/SnackbarContext';
import useFetch from '../../../hooks/useFetch';
import usePost from '../../../hooks/usePost';
import { ModalContainer } from '../../atoms/modal/ModalContainer';
import { ProductForm } from '../form/ProductForm';
import { BACKEND_URL } from '../../../envs';

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  productId: string;
  onEdited: () => void;
  onCancel: VoidFunction
}

const EditProductDialog = ({ open, setOpen, productId, onEdited, onCancel }: Props) => {
  const { showSnackbar } = useSnackbar();
  const methods = useForm<ProductModel>();
  const { reset } = methods;

  const { data: product, error } = useFetch<ProductModel>(
    `${BACKEND_URL}/products/${productId}`,
    [open, productId],
  );
  const { postData, loading } = usePost(`${BACKEND_URL}/products/${productId}`);

  useEffect(() => {
    if (product) reset(product);
  }, [product]);

  useEffect(() => {
    if (error) showSnackbar('Error al cargar el producto');
  }, [error]);

  const onSubmit = async (formData: ProductModel) => {

    try {
      await postData(formData, 'PUT');
      showSnackbar('Producto editado correctamente');
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
        <h2 className="text-xl font-semibold text-white mb-4">
          Editar producto
        </h2>
        <ProductForm methods={methods} onSubmit={onSubmit} loading={loading} onCancel={onCancel}/>
      </div>
    </ModalContainer>
  );
};

export default EditProductDialog;
