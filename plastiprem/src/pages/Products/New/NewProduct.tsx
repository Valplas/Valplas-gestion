import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../../components/atoms/button/Button';
import { FormItem } from '../../../components/molecules/form/FormItem';
import { ItemFormContainer } from '../../../components/atoms/container/ItemFormContainer';
import { BsClipboard, BsBuilding } from 'react-icons/bs';
import { useSnackbar } from '../../../feature/Snackbar/SnackbarContext';
import { productSchema } from './schemas';
import { businessOptions, ProductModel } from '../../../types/product.type';
import usePost from '../../../hooks/usePost';
import { useEffect } from 'react';
import { BACKEND_URL } from '../../../envs';
import { cleanEmptyStrings } from '../../../helpers/functions/clearEmptyFields';
import { ProductForm } from '../../../components/molecules/form/ProductForm';

export const NewProduct = () => {
  const methods = useForm<ProductModel>({
    // resolver: zodResolver(productSchema),
  });

  const { reset } = methods;
  const { postData, error, loading, data } = usePost<ProductModel>(
    `${BACKEND_URL}/products`,
  );
  const { showSnackbar } = useSnackbar();

  const onSubmit = async (formData: ProductModel) => {
    
        const cleaned = cleanEmptyStrings(formData);
    postData({
      ...cleaned,
      business: cleaned?.business && +cleaned.business,
    });
  };
  
  useEffect(() => {
    if(data) {
      showSnackbar('Producto creado con éxito')
      reset();
    }
    if (error) showSnackbar('error');
  }, [error, loading, data]);
  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Productos | Nuevo producto" />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Información del Producto
                </h3>
              </div>
              <div className="p-7">
              <ProductForm
                methods={methods}
                onSubmit={onSubmit}
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
