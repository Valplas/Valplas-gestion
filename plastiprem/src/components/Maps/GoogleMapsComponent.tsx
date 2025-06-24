import {
    Map,
    AdvancedMarker,
    Pin,
    useMap,
    useMapsLibrary,

} from '@vis.gl/react-google-maps';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { Mark } from '../../helpers/type/googleMaps.type';
import { Search } from '../atoms/inputs/Search';
import { BsXCircle } from 'react-icons/bs';

//@ts-ignore
const VITE_GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

export const GoogleMapsComponent = () => {
    const [place, setPlace] = useState<string>('')
    const [locations, setLocations] = useState<Mark[]>([])
    const [zoom, setZoom] = useState<number>(11)

    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

    // Manejar el arrastre inicial
    const handleDragStart = (index: number) => {
        setDraggedItemIndex(index);
    };

    // Permitir que el elemento sea soltado (cancelar el comportamiento predeterminado)
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    // Manejar cuando el elemento es soltado
    const handleDrop = (index: number) => {
        if (draggedItemIndex !== null) {
            const updatedLocations = [...locations];
            const [draggedItem] = updatedLocations.splice(draggedItemIndex, 1);
            updatedLocations.splice(index, 0, draggedItem);
            setLocations(updatedLocations);
            setDraggedItemIndex(null); // Resetear el estado del índice arrastrado
        }
    };

    const handleTouchStart = (index: number) => {
        setDraggedItemIndex(index);
      };
    
      const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
        event.preventDefault();
        // Aquí podrías manejar la posición de arrastre si lo necesitas
      };
    
      const handleTouchEnd = (index: number) => {
        handleDrop(index);
      };


    const map = useMap()
    let geocoder = useMapsLibrary('geocoding')
    let geocoderInstance = undefined

    if (geocoder) {
        geocoderInstance = new geocoder.Geocoder()
    }

    const onSearch = () => {
        if (geocoderInstance) {
            geocoderInstance.geocode({ address: place }, (res: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
                if (status === 'OK' && res) {
                    setLocations(prev => {
                        return [...prev, {
                            key: res[0].place_id,
                            adress: res[0].formatted_address,
                            location: {
                                lat: res[0].geometry.location.lat(),
                                lng: res[0].geometry.location.lng()
                            }
                        }]
                    })
                }
            })
        }
        setPlace('')
    }

    const handleClick = useCallback((ev: google.maps.MapMouseEvent) => {
        if (!map) return;
        if (!ev.detail.latLng) return;
        map.panTo(ev.detail.latLng);
    }, [map]);

    const handleMapClick = (ev) => {
        if (!ev.detail.latLng) return;
        setLocations(prev => {
            return [...prev, ev.detail.latLng]
        })

    }

    const handleDelete = (id: string) => {
        setLocations((prev) => {
            return prev.filter((location) => {
                return location.key !== id
            })
        })
    }

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 768) {
                setZoom(10); // Zoom para dispositivos móviles
            } else {
                setZoom(11); // Zoom para tablets
            }
        };

        // Ejecutar la función cuando cargue el componente
        handleResize();

        // Agregar event listener para manejar los cambios de tamaño
        window.addEventListener('resize', handleResize);

        // Limpiar el event listener al desmontar el componente
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <div>


                <Search placeholder='Ingresar dirección' value={place} onChange={(place) => setPlace(place)} onSearch={onSearch} />
            </div>
            <div className='flex-col sm:flex sm:flex-row  h-80 md:h-125'>

                <Suspense fallback={<div>Loading</div>}>


                    <div className='flex h-80 md:h-125 w-full'>

                        <Map
                            defaultZoom={zoom}
                            mapId={VITE_GOOGLE_MAPS_KEY}
                            defaultCenter={{ lat: -34.614270, lng: -58.567546 }}
                            onClick={handleMapClick}
                        >
                            {locations.map((mark: Mark) => {
                                return (

                                    <AdvancedMarker
                                        key={mark.key}
                                        position={mark.location}
                                        clickable={true}
                                        onClick={handleClick}
                                    >

                                        <Pin background={'#fb0404'} glyphColor={'#000'} borderColor={'#000'} />
                                    </AdvancedMarker>

                                )
                            })}
                        </Map>
                    </div>
                </Suspense>
                <div className='flex-col w-75'>
                    {
                        locations.map((location, index) => {
                            return (
                                <div
                                    key={location.key}
                                    className='border-b-2 border-white flex justify-between items-center'
                                    draggable
                                    onDragStart={() => handleDragStart(index)}
                                    onDragOver={handleDragOver}
                                    onDrop={() => handleDrop(index)}
                                    onTouchStart={() => handleTouchStart(index)}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={() => handleTouchEnd(index)}
                                >
                                    <span>

                                        {location.adress}
                                    </span>
                                    <button
                                        onClick={() => handleDelete(location.key)}
                                        
                                    >
                                        <BsXCircle />
                                    </button>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}