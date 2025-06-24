
import { GoogleMapsComponent } from "../../components/Maps/GoogleMapsComponent"
import PageTitle from "../../components/PageTitle"

export const Logistics = () => {
  return (
    <>
      <div className="rounded-sm border flex flex-col gap-3 py-1 px-1 border-stroke  bg-white  shadow-default dark:border-strokedark dark:bg-boxdark ">
        <PageTitle title={'Logística'} />
        <GoogleMapsComponent />
      </div >
    </>
  )
}