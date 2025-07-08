import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { BsBuilding } from 'react-icons/bs';
import { businessOptions, ProductModel } from '../../../types/product.type';
import { ItemFormContainer } from '../../atoms/container/ItemFormContainer';
import { FormItem } from './FormItem';
import { Button } from '../../atoms/button/Button';

interface Props {
  methods: UseFormReturn<ProductModel>;
  onSubmit: SubmitHandler<ProductModel>;
  loading?: boolean;
  onCancel?: VoidFunction;
}

export const ProductForm = ({
  methods,
  onSubmit,
  loading,
  onCancel,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = methods;
  const watchedFields = watch();
  const isFormEmpty = Object.values(watchedFields).every(
    (value) =>
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === ''),
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ItemFormContainer>
         <FormItem
        errors={errors}
        label="Negocio"
        name="business"
        register={register}
        options={businessOptions}
        icon={<BsBuilding size={20} />}
      />
        <FormItem
          errors={errors}
          label="Precio de costo"
          name="costPrice"
          placeholder="1234"
          type="text"
          register={register}
        />
      </ItemFormContainer>
     
      <ItemFormContainer>
        <FormItem
          errors={errors}
          label="Nombre"
          name="name"
          placeholder="Nombre del producto"
          type="tesxt"
          register={register}
        />
        <FormItem
          errors={errors}
          label="Descripción"
          name="description"
          placeholder="Descripción del producto"
          type="text"
          register={register}
        />
      </ItemFormContainer>

      <ItemFormContainer>
        <FormItem
          errors={errors}
          label="Fabricante"
          name="manufacturer"
          placeholder="Fabricante del producto"
          type="text"
          register={register}
        />
        <FormItem
          errors={errors}
          label="Código"
          name="code"
          placeholder="Código del producto"
          type="number"
          register={register}
        />
      </ItemFormContainer>

      <ItemFormContainer>
        <FormItem
          errors={errors}
          label="Peso (kg)"
          name="weightKg"
          placeholder="Peso en kg"
          type="number"
          register={register}
        />
        <FormItem
          errors={errors}
          label="Ancho"
          name="width"
          placeholder="Ancho en cm"
          type="number"
          register={register}
        />
      </ItemFormContainer>

      <ItemFormContainer>
        <FormItem
          errors={errors}
          label="Largo"
          name="long"
          placeholder="Largo en cm"
          type="number"
          register={register}
        />
        <FormItem
          errors={errors}
          label="Alto"
          name="height"
          placeholder="Alto en cm"
          type="number"
          register={register}
        />
      </ItemFormContainer>
      <ItemFormContainer>
        <FormItem
          errors={errors}
          label="Origen"
          name="origin"
          placeholder="Origen del producto"
          type="text"
          register={register}
        />
        <FormItem
          errors={errors}
          label="Cantidad"
          name="quantity"
          placeholder="Cantidad"
          type="text"
          register={register}
        />
      </ItemFormContainer>
      <div className="flex justify-end gap-4.5">
        <Button
          type="reset"
          label="Cancelar"
          isLoading={loading}
          onClick={() => onCancel?.()}
        />
        <Button
          type="submit"
          label="GUARDAR"
          isLoading={loading}
          disabled={isFormEmpty}
        />
      </div>
    </form>
  );
};
