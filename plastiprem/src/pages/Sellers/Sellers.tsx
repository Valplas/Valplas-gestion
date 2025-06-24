import { Link } from "react-router-dom"
import { USUARIOS } from "../Clients/Clients"

export const Sellers = () => {
    return (
      <>
      <div className="rounded-sm border flex flex-col gap-3 py-1 px-1 border-stroke  bg-white  shadow-default dark:border-strokedark dark:bg-boxdark ">
          <div className="flex justify-between items-center ">

              <h4 className=" text-xl font-semibold text-black dark:text-white">
                  Vendedores
              </h4>
              <Link
                  to="/sellers/new"
                  className="inline-flex items-center  justify-center gap-2.5 rounded-full bg-meta-3 py-2 px-4 text-center font-bold text-lg text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
              >
                  Nuevo vendedor
              </Link>
          </div>
          <div className="flex flex-col">
              <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
                  <div className="p-2.5 xl:p-5">
                      <h5 className="text-sm font-medium uppercase xsm:text-base">
                          Nombre
                      </h5>
                  </div>
                  <div className="p-2.5 text-center xl:p-5">
                      <h5 className="text-sm font-medium uppercase xsm:text-base">
                          Apellido
                      </h5>
                  </div>
                  <div className="p-2.5 text-center xl:p-5">
                      <h5 className="text-sm font-medium uppercase xsm:text-base">
                          Telefono
                      </h5>
                  </div>
                  <div className="hidden p-2.5 text-center sm:block xl:p-5">
                      <h5 className="text-sm font-medium uppercase xsm:text-base">
                          Direccion
                      </h5>
                  </div>
                  <div className="hidden p-2.5 text-center sm:block xl:p-5">
                      <h5 className="text-sm font-medium uppercase xsm:text-base">
                          Mail
                      </h5>
                  </div>
              </div>


              {USUARIOS.map((user, key) => (
                  <div
                      className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5"
                      key={key}
                  >
                      <div className="p-2.5 xl:p-5">
                          <h5 className="text-sm font-medium  xsm:text-base">
                              {user.name}
                          </h5>
                      </div>
                      <div className="p-2.5 text-center xl:p-5">
                          <h5 className="text-sm font-medium  xsm:text-base">
                              {user.surname}
                          </h5>
                      </div>
                      <div className="p-2.5 text-center xl:p-5">
                          <h5 className="text-sm font-medium  xsm:text-base">
                              {user.phone}
                          </h5>
                      </div>
                      <div className="hidden p-2.5 text-center sm:block xl:p-5">
                          <h5 className="text-sm font-medium  xsm:text-base">
                              {user.address}
                          </h5>
                      </div>
                      <div className="hidden p-2.5 text-center sm:block xl:p-5">
                          <h5 className="text-sm font-medium  xsm:text-base">
                              {user.mail}
                          </h5>
                      </div>
                  </div>
              ))}
          </div>
      </div >

  </>
    )
  }