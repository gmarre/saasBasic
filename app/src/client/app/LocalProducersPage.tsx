import { useAuth } from 'wasp/client/auth'; // Importez useAuth pour récupérer les informations sur l'utilisateur
"use client";
import { type Producer } from 'wasp/entities'; // Importez le type Producer
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";

import { useEffect, useState, useRef } from 'react';
import { useQuery, getAllProducers } from 'wasp/client/operations';

function LocalProducersMap() {
  const { data: producers, isLoading: isProducersLoading } = useQuery(getAllProducers);
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<Producer | null>(null);

  const markerRefs = useRef<{ [key: string]: any }>({});

  const handleMarkerClick = (producer: Producer) => {
    setSelectedMarker(producer);
    setInfowindowOpen(true);
  };

  return (
    <div className='py-10 lg:mt-10'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-4xl text-center'>
          <h2 className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white'>
            <p><span className='text-yellow-500'>Engageons</span>  nous vers un commerce local</p>
          </h2>
        </div>
        <p className='mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600 dark:text-white'>
          Our aim is to bring together local businesses and producers in our regions. 
          Let's take advantage of the momentum generated by major companies to help our region and our talents grow!
          It's up to you! 
        </p>
        {/* begin Display of Producers Picture */}
        <div className='my-8 border rounded-3xl border-gray-900/10 dark:border-gray-100/10'>
          <div className='sm:w-[90%] md:w-[70%] lg:w-[50%] py-10 px-6 mx-auto my-8 space-y-10'>
            <h2>Liste des producteurs</h2>
            {isProducersLoading && <div>Loading...</div>}
            {producers && producers.length > 0 && (
              <ul style={{ display: 'flex', listStyle: 'none', overflowX: 'auto' }}>
                {producers.map((producer) => (
                  <li key={producer.id}>
                    <div>
                      <img src={producer.profilPicture} alt="Photo de profil" style={{ width: '100px', height: '100px' }} />
                    </div>
                    <div>
                      <p>Prénom: {producer.firstname}</p>
                      <p>ShopName: {producer.shopname}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {/* end Display of Producers Picture */}
        {/* begin Display of Google Maps */}
        <div className='my-8 border rounded-3xl border-gray-900/10 dark:border-gray-100/10'>
          <div className='sm:w-[90%] md:w-[70%] lg:w-[50%] py-10 px-6 mx-auto my-8 space-y-10'>
            <h2>Google Maps des producteurs !!</h2>
            <APIProvider apiKey='AIzaSyAUXN0p7b9wdErsBaVik7ZJVOkzg6yoQ9o'>
              <div style={{height: "50vh", width : "100%"}}>
                <Map
                  defaultZoom={7}
                  defaultCenter={{lat: 43.604261, lng: 1.443425}}
                  gestureHandling={'greedy'}
                  disableDefaultUI={true}
                  mapId={'c3348dcf5b0ca956'}
                >
                  {producers && producers.map(producer => (
                    <AdvancedMarker
                      key={producer.id}
                      position={{ lat: producer.lat, lng: producer.lgt }}
                      title={producer.shopname}
                      onClick={() => handleMarkerClick(producer)}
                      ref={(ref) => markerRefs.current[producer.id] = ref}
                    />
                  ))}
                  {infowindowOpen && selectedMarker && (
                    <InfoWindow
                      anchor={markerRefs.current[selectedMarker.id]}
                      maxWidth={200}
                      onCloseClick={() => setInfowindowOpen(false)}
                    >
                      <div style={{ color: 'black', backgroundColor: 'white', padding: '10px' }}>
                        <img src={selectedMarker.profilPicture} alt="Photo de profil" style={{ width: '100px', height: '100px', marginBottom: '10px' }} />
                        <p>Prénom: {selectedMarker.firstname}</p>
                        <p>ShopName: {selectedMarker.shopname}</p>
                      </div>
                    </InfoWindow>
                  )}
                </Map> 
              </div>
            </APIProvider>
          </div>
        </div>
        {/* end Display of Google Maps */}
      </div>
    </div>
  );
}
  
export default LocalProducersMap;
