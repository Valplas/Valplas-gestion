import { UseFormReturn } from 'react-hook-form';
import {
  NewOrderDTO,
  OrderModel,
  OrderProductsEntity,
} from '../../../types/order.type';
import { Button } from '../../atoms/button/Button';
import { ItemFormContainer } from '../../atoms/container/ItemFormContainer';
import { ErrorMessage } from '@hookform/error-message';
import { FormItem } from './FormItem';
import { useEffect, useMemo, useState } from 'react';
import { ProductModel } from '../../../types/product.type';
import { ClientModel } from '../../../types/clients.type';
import { BsFillTrash2Fill } from 'react-icons/bs';
import useFetch from '../../../hooks/useFetch';
import { BACKEND_URL } from '../../../envs';
import { ModalContainer } from '../../atoms/modal/ModalContainer';
import { Search } from '../../atoms/inputs/Search';
import { PriceListModel } from '../../../types/priceList.type';

interface Props {
  methods: UseFormReturn<OrderProductsEntity>;
  submit: (formData: NewOrderDTO | OrderModel) => Promise<void>;
  loading?: boolean;
  defaultOrderProducts?: OrderProductsEntity[];
  order?: OrderModel | null;
  clients?: ClientModel[];
}

export const OrderForm = ({
  order,
  methods,
  submit,
  loading,
  defaultOrderProducts,
  clients,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [visibleClients, setVisibleClients] = useState<ClientModel[]>([]);
  const [loadedRows, setLoadedRows] = useState(40); // Initial number of rows
  const [search, setSearch] = useState<string>('');
  const { data: products } = useFetch<ProductModel[]>(
    `${BACKEND_URL}/products`,
  );
  const { data: priceList } = useFetch<PriceListModel[]>(
    `${BACKEND_URL}/listprices`,
  );

  const [client, setClient] = useState<ClientModel | undefined>(order?.client);
  const [selectedProduct, setSelectedProduct] = useState<
    OrderProductsEntity | undefined
  >(undefined);
  const [orderProducts, setOrderProducts] = useState<OrderProductsEntity[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = methods;
  const onChange = (str: string) => {
    setSearch(str);
  };
  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight) {
      loadMoreRows();
    }
  };

  const loadMoreRows = () => {
    if (clients && loadedRows < clients?.length) {
      setLoadedRows((prev) => prev + 40);
    }
  };

  const selectedFormProduct = watch('product'); // este es el valor real del formulario
  const selectedFormPriceList = watch('listPrice');

  const handleSelectProduct = (prod: OrderProductsEntity) => {
    setSelectedProduct(prod);
    setValue('product', prod.product);
    setValue('quantity', prod.quantity);
  };

  const handleDelete = (id: string) => {
    setOrderProducts((prev) => {
      return prev.filter((prod) => prod.product.productID !== id);
    });
  };

  const submitOrderProducts = async (formData: OrderProductsEntity) => {
    setOrderProducts((prev) => {
      const index = prev.findIndex(
        (product) => product.product.productID === formData.product.productID,
      );
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = formData;
        return updated;
      }

      return [...prev, formData];
    });
    reset();
    setSelectedProduct(undefined);
  };

  // Filtrar clientes y paginarlos
  useEffect(() => {
    if (clients) {
      // Filtrar clientes por nombre, dirección o CUIT
      const filteredClients = clients.filter((client) =>
        [client.clientName, client.clientAddress, client.clientCUIT]
          .filter(Boolean) // Asegura que no intente filtrar valores nulos o indefinidos
          .some((field) => field?.toLowerCase().includes(search.toLowerCase())),
      );

      // Aplicar paginación al resultado filtrado
      setVisibleClients(filteredClients.slice(0, loadedRows));
    }
  }, [clients, search, loadedRows]);

  useEffect(() => {
    setOrderProducts(defaultOrderProducts ?? []);
  }, [defaultOrderProducts]);

  useEffect(() => {
    if (selectedProduct?.product) {
      setValue('product', selectedProduct.product);
    }
  }, [selectedProduct?.product.productID]);

  useEffect(() => {
    setClient(order?.client);
  }, [order?.clientID]);
  console.log(orderProducts)
  const orderAmount = useMemo(() => {
    return orderProducts.reduce(
      (total, product) => total + product.subtotal,
      0,
    );
  }, [orderProducts.length]);

  useEffect(() => {
    const quantity = watch('quantity');
    const unitaryPrice = watch('unitaryPrice');
    if (unitaryPrice) {
      setValue('subtotal', unitaryPrice * quantity);
    } else {
      setValue('subtotal', 0);
    }
  }, [watch('quantity'), watch('unitaryPrice')]);

  useEffect(() => {
    if (selectedFormPriceList && selectedFormProduct) {
      setValue(
        'unitaryPrice',
        selectedFormProduct.costPrice *
          (1 + selectedFormPriceList.margin / 100),
      );
    }
  }, [selectedFormPriceList, selectedFormProduct]);

  return (
    <>
      <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          {`Total de la Orden:  $ ${orderAmount}`}
        </h3>
      </div>
      <div className="p-7">
        {client && (
          <div className="mb-3 block text-md font-medium text-black dark:text-white">
            {`Cliente: ${client.clientName} - ${client.clientCUIT} - ${client.clientAddress}`}
          </div>
        )}
        {clients?.length !== 1 && (
          <Button label="Cliente" onClick={() => setOpen(true)} />
        )}
        <form onSubmit={handleSubmit(submitOrderProducts)}>
          <ItemFormContainer>
            <div className="w-full sm:w-1/2">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor={'product'}
              >
                Producto
              </label>
              <div>
                <select
                  value={selectedFormProduct?.productID ?? ''} // <-- importante
                  className={`w-full rounded border py-3 px-4.5 border-stroke bg-gray 
                        text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${
                          errors ? 'border-danger' : ''
                        }`}
                  id="product"
                  placeholder="Seleccione un producto"
                  onChange={(e) => {
                    const selectedProduct = products?.find(
                      (prod) => prod.productID === e.target.value,
                    );
                    if (selectedProduct) {
                      setValue('product', selectedProduct);
                    }
                  }}
                >
                  <option value={selectedProduct?.product.productID}>
                    Seleccione un producto
                  </option>

                  {products?.map((prod) => (
                    <option key={prod.productID} value={prod.productID}>
                      {prod.name}
                    </option>
                  ))}
                </select>

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
                watch('product')?.quantity ?? 'N/D'
              }`}
              name="quantity"
              type="number"
              placeholder="Cantidad del producto"
              register={register}
            />
          </ItemFormContainer>

          <ItemFormContainer>
            <div className="w-full sm:w-1/2">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor={'product'}
              >
                Lista de precios
              </label>
              <select
                value={selectedFormPriceList?.listPriceID ?? ''} // <-- importante
                className={`w-full rounded border py-3 px-4.5 border-stroke bg-gray 
                        text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${
                          errors ? 'border-danger' : ''
                        }`}
                id="product"
                placeholder="Seleccione una lista"
                onChange={(e) => {
                  const selectedPriceList = priceList?.find(
                    (prod) => prod.listPriceID === e.target.value,
                  );
                  if (selectedPriceList) {
                    setValue('listPrice', selectedPriceList);
                  } // Establece el valor en el formulario
                }}
              >
                <option value={''}>Seleccione una lista</option>

                {priceList?.map((prod) => (
                  <option key={prod.listPriceID} value={prod.listPriceID}>
                    {prod.name} - {prod.margin} %
                  </option>
                ))}
              </select>
            </div>

            <FormItem
              errors={errors}
              label="Precio Unitario"
              name="unitaryPrice"
              type="number"
              placeholder="Precio por unidad"
              register={register}
              disabled={true}
            />
          </ItemFormContainer>
          <ItemFormContainer>
            <FormItem
              errors={errors}
              label="Código de producto"
              name="code"
              type="text"
              placeholder="Código único de producto"
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

          <div className="flex justify-end gap-4.5">
            <Button type="reset" label="Cancelar" />
            <Button
              type="submit"
              label="GUARDAR PRODUCTO"
              isLoading={loading}
            />
          </div>
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
                  Lista
                </th>
                <th scope="col" className="px-6 py-3">
                  Precio Unitario
                </th>
                <th scope="col" className="px-6 py-3">
                  Subtotal
                </th>
                <th scope="col" className="px-6 py-3">
                  Eliminar
                </th>
              </tr>
            </thead>
            <tbody>
              {orderProducts.map((prod, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:cursor-pointer"
                  onClick={() => {
                    // Acción al hacer clic en una fila, si es necesario
                    handleSelectProduct(prod);
                  }}
                >
                  <td className="px-6 py-4">{prod.product.description}</td>
                  <td className="px-6 py-4">{prod.quantity}</td>
                  <td className="px-6 py-4">{prod.listPrice.name}</td>
                  <td className="px-6 py-4">${prod.unitaryPrice.toFixed(2)}</td>
                  <td className="px-6 py-4">${prod.subtotal.toFixed(2)}</td>
                  <td
                    className="px-6 py-4 hover:cursor-pointer"
                    onClick={() => {
                      handleDelete(prod.product.productID);
                    }}
                  >
                    {<BsFillTrash2Fill />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>

        <Button
          label="GUARDAR PEDIDO"
          isLoading={loading}
          onClick={() => {
            submit({
              clientID: client?.clientID ?? '',
              orderedBy: '',
              //@ts-ignore
              deliveryDate: new Date().getUTCDate,
              //@ts-ignore
              realDeliveryDate: new Date().getUTCDate,
              schedules: '',
              address: '',
              geoPointAddress: '',
              orderProducts: orderProducts.map((op) => {
                return {
                  productID: op.product.productID,
                  quantity: op.quantity,
                  unitaryPrice: op.unitaryPrice,
                  costPrice: op.costPrice,
                  listPriceID: op.listPrice.listPriceID,
                  subtotal: op.subtotal,
                  revenue:
                    ((op.costPrice * op.listPrice.margin) / 100) * op.quantity,
                };
              }), // Productos asociados a la orden
            });
          }}
        />
      </div>
      {open && (
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
      )}
    </>
  );
};

export default OrderForm;
