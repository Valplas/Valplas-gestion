import { useForm } from 'react-hook-form';
import { Button } from '../../atoms/button/Button';
import { ItemFormContainer } from '../../atoms/container/ItemFormContainer';
import { ModalContainer } from '../../atoms/modal/ModalContainer';
import { FormItem } from '../form/FormItem';
import usePost from '../../../hooks/usePost';
import { PriceListModel } from '../../../types/priceList.type';
import { BACKEND_URL } from '../../../envs';
import { useSnackbar } from '../../../feature/Snackbar/SnackbarContext';
import { useEffect } from 'react';

interface ModalPriceListProps {
  setOpen: (value: boolean) => void;
  open: boolean;
}

const ModalPriceList = ({ setOpen, open }: ModalPriceListProps) => {
  if (!open) return null;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PriceListModel>();
  const { postData, error, loading, data } = usePost<PriceListModel>(
    `${BACKEND_URL}/listprices`,
  );

  const { showSnackbar } = useSnackbar();

  const onSubmit = async (formData: PriceListModel) => {
    postData({ ...formData });
  };

  useEffect(() => {
    if (data) {
      showSnackbar('Lista creada con éxito');
    }
    if (error) showSnackbar('Ocurrio un error al crear la lista');
  }, [error, loading, data]);

  return (
    <ModalContainer setOpen={setOpen}>
      <div className="flex flex-col items-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ItemFormContainer>
            <FormItem
              errors={errors}
              label="Nombre"
              name="name"
              placeholder="Lista Mayorista 1"
              type="text"
              register={register}
            />
            <FormItem
              errors={errors}
              label="Margen %"
              name="margin"
              placeholder="50"
              type="number"
              register={register}
            />
          </ItemFormContainer>
          <div className="flex gap-2">
            <Button label="Crear" type="submit" />
            <Button label="Cancelar" onClick={() => setOpen(false)} />
          </div>
        </form>
      </div>
    </ModalContainer>
  );
};

export default ModalPriceList;
