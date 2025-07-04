
interface SearchProps {
    placeholder: string
    value: string
    onChange: (value: string) => void
    onSearch?: ()=>void
}

export const Search = ({ placeholder, value, onChange, onSearch }: SearchProps) => {
    return (
        <div className="relative">
            <button
                className="absolute left-1 top-1/2 -translate-y-1/2"
                onClick={onSearch}
               
            >
                <svg
                    className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                        fill=""
                    />
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                        fill=""
                    />
                </svg>
            </button>

            <input
                type="text"
                placeholder={placeholder}
                className="w-full bg-transparent border-solid border-2 border-white rounded-md pl-9 pr-4  text-black focus:outline-none dark:text-white xl:w-125"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(event:React.KeyboardEvent<HTMLInputElement>)=>{
                    if(event.key==='Enter'){
                        onSearch?.()
                    }
                }}
            />
        </div>
    )
}