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

              {/*               <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  {`Total de la Orden:  $ ${orderAmount}`}
                </h3>
              </div>
              <div className="p-7">
                {client && (
                  <div className="mb-3 block text-sm font-medium text-black dark:text-white">
                    {`${client.clientName} - ${client.clientCUIT} - ${client.clientAddress}`}
                  </div>
                )}
                <Button label="Cliente" onClick={() => setOpen(true)} />
                <form onSubmit={handleSubmit(onSubmit)}>
                  <ItemFormContainer>
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor={'product'}
                      >
                        Producto
                      </label>
                      <div>
                        {
                          <select
                            className={`w-full rounded border py-3 px-4.5 border-stroke bg-gray 
                              text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${
                                error ? 'border-danger' : ''
                              }`}
                            id="product"
                            placeholder="Seleccione un producto"
                            onChange={(e) => {
                              const selectedProduct = products?.find(
                                (prod) => prod.productID === e.target.value,
                              );
                              if (selectedProduct)
                                setValue('product', selectedProduct); // Establece el valor en el formulario
                            }}
                          >
                            <option value="">Seleccione un producto</option>

                            {products?.map((prod) => (
                              <option
                                key={prod.productID}
                                value={prod.productID}
                              >
                                {prod.name}
                              </option>
                            ))}
                          </select>
                        }
                        <ErrorMessage
                          errors={errors}
                          name={'product'}
                          render={({ message }) => (
                            <p className="text-danger">{message}</p>
                          )}
                        />
                      </div>
                    </div>
                    <FormItem
                      errors={errors}
                      label={`Cantidad - Stock disponible: ${
                        watch('product')?.quantity ?? 'No disponible'
                      }`}
                      name="quantity"
                      type="number"
                      placeholder="Cantidad del producto"
                      register={register}
                    />
                  </ItemFormContainer>

                  <ItemFormContainer>
                    <FormItem
                      errors={errors}
                      label="Precio Unitario"
                      name="unitaryPrice"
                      type="number"
                      placeholder="Precio por unidad"
                      register={register}
                    />

                    <FormItem
                      errors={errors}
                      label="Subtotal"
                      name="subtotal"
                      type="number"
                      placeholder="Subtotal calculado"
                      register={register}
                      disabled={true}
                    />
                  </ItemFormContainer>

                  <FormItem
                    errors={errors}
                    label="Código de producto"
                    name="code"
                    type="text"
                    placeholder="Código único de producto"
                    register={register}
                  />

                  <div className="flex justify-end gap-4.5">
                    <Button type="reset" label="Cancelar" />
                    <Button
                      type="submit"
                      label="GUARDAR PRODUCTO"
                      isLoading={loading}
                    />
                  </div>
                </form>
                <table className="text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Producto
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Cantidad
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Precio Unitario
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderProducts.map((prod, index) => (
                      <tr
                        key={index}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                        onClick={() => {
                          // Acción al hacer clic en una fila, si es necesario
                          console.log(prod);
                        }}
                      >
                        <td className="px-6 py-4">
                          {prod.product.description}
                        </td>
                        <td className="px-6 py-4">{prod.quantity}</td>
                        <td className="px-6 py-4">
                          ${prod.unitaryPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          ${prod.subtotal.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <Button
                  type="submit"
                  label="GUARDAR PEDIDO"
                  isLoading={loading}
                  onClick={() => {
                    postData({
                      clientID: client?.clientID,
                      orderedBy: '',
                      deliveryDate: new Date().getUTCDate,
                      realDeliveryDate: new Date().getUTCDate,
                      schedules: '',
                      address: '',
                      geoPointAddress: '',
                      orderProducts: orderProducts.map((op) => {
                        return {
                          productID: op.product.productID,
                          quantity: op.quantity,
                          unitaryPrice: op.unitaryPrice,
                        };
                      }), // Productos asociados a la orden
                    });
                  }}
                />
              </div> */}
            </div>
          </div>
        </div>
      </div>
      {/*    {open && (
        <ModalContainer setOpen={setOpen}>
          <div className="p-5">
            <Search
              placeholder="Buscar cliente"
              onChange={onChange}
              value={search}
            />
            <h2 className="text-xl font-semibold mb-4">Lista de Clientes</h2>
            <div
              className="max-h-96 overflow-y-auto border rounded-lg"
              onScroll={handleScroll}
            >
              <table className=" text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Razón Social
                    </th>
                    <th scope="col" className="px-6 py-3">
                      CUIT
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Dirección
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleClients.map((client, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      onClick={() => {
                        setClient(client);
                        setSearch('');
                        setOpen(false);
                      }}
                    >
                      <td className="px-6 py-4">{client.clientName}</td>
                      <td className="px-6 py-4">{client.clientCUIT}</td>
                      <td className="px-6 py-4">{client.clientAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ModalContainer>
      )} */}
    </>
  );
};
