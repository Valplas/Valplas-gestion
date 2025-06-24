import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { BsClock, BsHouse, BsMap, BsPerson, BsPersonVcard, BsPhone, BsPinMap } from 'react-icons/bs';
import { FormItem } from './FormItem';
import { ErrorMessage } from '@hookform/error-message';
import { ClientModel, clientType, taxConditions } from '../../../types/clients.type';
import { ItemFormContainer } from '../../atoms/container/ItemFormContainer';
import { Button } from '../../atoms/button/Button';


interface Props {
  methods: UseFormReturn<ClientModel>;
  onSubmit: SubmitHandler<ClientModel>;
  loading?: boolean;
  onCancel?: VoidFunction
}

export const ClientForm = ({  methods,onSubmit, loading, onCancel }: Props) => {
  const { register, handleSubmit, formState: { errors },  watch } = methods
  

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
          label="Nombres"
          name="clientName"
          placeholder="Juan Pablo"
          type="text"
          register={register}
          icon={<BsPerson size={20} />}
        />
        <FormItem
          errors={errors}
          label="Apellido"
          name="clientSurname"
          placeholder="Pérez"
          type="text"
          register={register}
        />
      </ItemFormContainer>

      <ItemFormContainer>
        <FormItem
          errors={errors}
          label="Tipo"
          name="clientType"
          register={register}
          options={clientType}
          icon={<BsPerson size={20} />}
        />
        <FormItem
          errors={errors}
          label="Número"
          name="clientNumber"
          placeholder="0001"
          type="number"
          register={register}
        />
      </ItemFormContainer>

      <ItemFormContainer>
        <FormItem
          errors={errors}
          label="Dirección"
          name="clientAddress"
          register={register}
          icon={<BsHouse size={20} />}
          placeholder="Av Juan B Justo 9999"
          type="text"
        />
        <FormItem
          errors={errors}
          label="Localidad/Barrio"
          name="clientLocality"
          register={register}
          type="text"
          placeholder="CABA"
          icon={<BsMap size={20} />}
        />
      </ItemFormContainer>

      <div className="mb-5.5">
        <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="clientNotes">
          Aclaraciones
        </label>
        <div className="relative">
          <textarea
            className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
            id="clientNotes"
            {...register('clientNotes')}
            rows={2}
            placeholder="Aclaraciones importantes, negocio con rejas, cartel verde, etc"
          ></textarea>
          <ErrorMessage errors={errors} name="clientNotes" />
        </div>
      </div>

      <ItemFormContainer>
        <FormItem
          errors={errors}
          label="Horarios"
          name="clientWorkingHours"
          register={register}
          icon={<BsClock size={20} />}
          placeholder="8 a 18"
          type="text"
        />
        <FormItem
          errors={errors}
          label="Point"
          name="clientPoint"
          register={register}
          type="text"
          placeholder="https://maps.app.goo.gl/..."
          icon={<BsPinMap size={20} />}
        />
      </ItemFormContainer>

      <ItemFormContainer>
        <FormItem
          errors={errors}
          label="Celular"
          name="clientPhone"
          register={register}
          icon={<BsPhone size={20} />}
          placeholder="1122334455"
          type="text"
        />
        <FormItem
          errors={errors}
          label="Teléfono alternativo"
          name="clientAlternativePhone"
          register={register}
          icon={<BsPhone size={20} />}
          placeholder="1199887766"
          type="text"
        />
      </ItemFormContainer>

      <div className="mb-5.5">
        <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="clientEmail">
          Email
        </label>
        <input
          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
          type="email"
          {...register('clientEmail')}
          id="clientEmail"
          placeholder="ejemplo@prueba.com"
        />
        <ErrorMessage errors={errors} name="clientEmail" />
      </div>

      <ItemFormContainer>
        <FormItem
          errors={errors}
          label="CUIT"
          name="clientCUIT"
          register={register}
          icon={<BsPersonVcard size={20} />}
          placeholder="20-11222333-2"
          type="text"
        />
        <FormItem
          errors={errors}
          label="Condición frente al IVA"
          name="clientTaxCondition"
          register={register}
          options={taxConditions}
        />
      </ItemFormContainer>

      <ItemFormContainer>
        <FormItem
          errors={errors}
          label="Fuente"
          name="clientFont"
          register={register}
          placeholder="Recomendado, campaña, etc"
          type="text"
        />
        <FormItem
          errors={errors}
          label="Fecha"
          name="clientDate"
          register={register}
          type="date"
        />
      </ItemFormContainer>

      <div className="flex justify-end gap-4.5">
        <Button type="reset" label="Cancelar" isLoading={loading} onClick={()=>onCancel?.()}/>
        <Button type="submit" label="GUARDAR" isLoading={loading} disabled={isFormEmpty} />
      </div>
    </form>
  );
};
