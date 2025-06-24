interface PageTitleProps{
    title: string
}
export const PageTitle = ({title}:PageTitleProps) => {
    return (
      <div className="flex justify-between items-center ">
            <h4 className=" text-xl font-semibold text-black dark:text-white">
              {title}
            </h4>
          </div>
    )
  }