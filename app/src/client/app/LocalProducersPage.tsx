import { useAuth } from 'wasp/client/auth'; // Importez useAuth pour récupérer les informations sur l'utilisateur
import { type Producer } from 'wasp/entities'; // Importez le type Producer
import { ProducerTheme } from '../../shared/types'; // Assurez-vous que ce fichier contient la définition de ProducerTheme
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";

import { Link } from 'react-router-dom';
import ProducersTable from '../admin/components/ProducerTable';
import { useEffect, useState, useRef } from 'react';
import { useQuery, getAllProducers } from 'wasp/client/operations';
import React from 'react';
import Breadcrumb from '../admin/components/Breadcrumb';
// import ProducerTable from '../components/ProducerTable';


// Définir une interface pour les props du composant Pin
interface PinProps {
  background: string;
  borderColor: string;
  scale: number;
  children: React.ReactNode;
}

// Composant Pin personnalisé
const Pin: React.FC<PinProps> = ({ background, borderColor, scale, children }) => (
  <div style={{
    backgroundColor: background,
    border: `2px solid ${borderColor}`,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: `${scale * 20}px`,
    height: `${scale * 20}px`,
    fontSize: `${scale * 10}px`
  }}>
    {children}
  </div>
);


const getPinProps = (theme: ProducerTheme) => {
  switch (theme) {
    case 'ELEVEUR':
      return { background: '#ffd1dc', borderColor: '#b20000', emoji: '🐄' };
    case 'MARAICHER':
      return { background: '#aeebd8', borderColor: '#00b200', emoji: '🥕' };
    case 'MODE':
      return { background: '#aec6cf', borderColor: '#0000b2', emoji: '👗' };
    case 'AUTRES':
      return { background: '#fffacd', borderColor: '#b2b200', emoji: '🔧' };
    default:
      return { background: '#000000', borderColor: '#000000', emoji: '❓' };
  }
};

function LocalProducersPage() {
  const { data: producers, isLoading: isProducersLoading } = useQuery(getAllProducers);
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<Producer | null>(null);

  const markerRefs = useRef<{ [key: string]: any }>({});

  const handleMarkerClick = (producer: Producer) => {
    setSelectedMarker(producer);
    setInfowindowOpen(true);
  };

  const [selectedThemes, setSelectedThemes] = useState<ProducerTheme[]>([]);

  const toggleTheme = (theme: ProducerTheme) => {
    if (selectedThemes.includes(theme)) {
      setSelectedThemes(selectedThemes.filter((t) => t !== theme));
    } else {
      setSelectedThemes([...selectedThemes, theme]);
    }
  };

  return (
    <div className='py-10 lg:mt-10'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-4xl text-center'>
          <h2 className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white'>
            <p><span className='text-pear'>Engageons</span> nous vers un commerce local</p>
          </h2>
        </div>
        <p className='mx-auto mt-6 max-w-4xl text-center text-lg leading-8 text-gray-600 dark:text-white'>
          Notre objectif est de rassembler les entreprises et les producteurs locaux de nos régions. <br />
          Profitons de l'élan donné par les grandes entreprises pour faire grandir nos régions et nos talents ! <br />
          <span className='text-pear'> A vous de jouer !</span><br />
        </p>
        {/* begin Display of Producers Picture */}
        <div className='my-8 border rounded-3xl border-gray-900/10 dark:border-gray-100/10'>
          <div className='sm:w-[90%] md:w-[70%] lg:w-[50%] py-10 px-6 mx-auto my-8 space-y-10'>
            <h2 className='mt-2 text-4xl font-bold tracking-tight text-pear sm:text-2xl dark:text-pear'>Liste des producteurs</h2>
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
        {/* begin link to ALL PRODUCER TABLE */}
        <div className='my-8 border rounded-3xl border-gray-900/10 dark:border-gray-100/10'>
          <div className='py-10 px-6 mx-auto my-8 space-y-10'>
            <h1 className='sm:w-[90%] mt-2 text-4xl font-bold tracking-tight text-pear sm:text-1xl dark:text-pear'>Retrouvez l'ensemble de vos producteurs : </h1>
              <div className="flex flex-col gap-10">
                <ProducersTable />
              </div>
          </div>
        </div>
        {/* end link to ALL PRODUCER TABLE */}
        {/* begin Display of Google Maps */}
        <div className='my-8 border rounded-3xl border-gray-900/10 dark:border-gray-100/10'>
          <div className='py-10 px-6 mx-auto my-8 space-y-20'>
            <div className="flex flex-col gap-10">
              <h2 className='mt-2 text-4xl font-bold tracking-tight text-pear dark:text-pear'>Google Maps des producteurs 🌍 !!</h2>
              <APIProvider apiKey='AIzaSyAUXN0p7b9wdErsBaVik7ZJVOkzg6yoQ9o'>
                <div className='flex flex-col lg:flex-row gap-10 border-gray-900/10 dark:border-gray-100/10'>
                  <div className="rounded-map mx-auto" style={{height: "70vh", width : "80%"}}>
                    <Map
                      defaultZoom={11}
                      defaultCenter={{lat: 43.604261, lng: 1.443425}}
                      gestureHandling={'greedy'}
                      disableDefaultUI={true}
                      mapId={'c3348dcf5b0ca956'}
                    >
                      {producers && producers
                      .filter((producer) => selectedThemes.length === 0 || selectedThemes.includes(producer.theme))
                      .map(producer => {
                        const { background, borderColor, emoji } = getPinProps(producer.theme);
                        return (
                          <AdvancedMarker
                            key={producer.id}
                            position={{ lat: producer.lat, lng: producer.lgt }}
                            title={producer.shopname}
                            onClick={() => handleMarkerClick(producer)}
                            ref={(ref) => (markerRefs.current[producer.id] = ref)}
                          >
                            <Pin background={background} borderColor={borderColor} scale={2}>
                              {emoji}
                            </Pin>
                          </AdvancedMarker>
                        );
                      })}
                      {infowindowOpen && selectedMarker && (
                        <InfoWindow
                          anchor={markerRefs.current[selectedMarker.id]}
                          maxWidth={300}
                          onCloseClick={() => setInfowindowOpen(false)}
                        >
                          <Link to={`/local-producers-detail-page/${selectedMarker.id}`}>
                            <div style={{ color: 'black', backgroundColor: 'white', padding: '10px' }}>
                              Go to Producer Detail Page
                              <img src={selectedMarker.profilPicture} alt="Photo de profil" style={{ width: '100px', height: '100px', marginBottom: '0px', justifyContent: 'center' }} />
                              <p>Prénom: {selectedMarker.firstname}</p>
                              <p>ShopName: {selectedMarker.shopname}</p>
                            </div>
                          </Link>
                        </InfoWindow>
                      )}
                    </Map> 
                  </div>
                  <div className='py-5 px-3 mx-3 my-2 space-y-2 flex flex-col gap-10'>
                    Filtre :  
                    <label style={{ display: 'block' }}>
                        <input
                          type="checkbox"
                          checked={selectedThemes.includes('ELEVEUR')}
                          onChange={() => toggleTheme('ELEVEUR')}
                        />
                        | Eleveur 🐄 
                      </label>
                      <label style={{ display: 'block' }}>
                        <input
                          type="checkbox"
                          checked={selectedThemes.includes('MARAICHER')}
                          onChange={() => toggleTheme('MARAICHER')}
                        />
                        | Maraicher 🥕
                      </label>
                      <label style={{ display: 'block' }}>
                        <input
                          type="checkbox"
                          checked={selectedThemes.includes('MODE')}
                          onChange={() => toggleTheme('MODE')}
                        />
                        | Mode 👗
                      </label>
                      <label style={{ display: 'block' }}>
                        <input
                          type="checkbox"
                          checked={selectedThemes.includes('AUTRES')}
                          onChange={() => toggleTheme('AUTRES')}
                        />
                        | Autres 🔧 
                      </label>
                  </div>
                </div>
                
              </APIProvider>
            </div>
          </div>
        </div>
        {/* end Display of Google Maps */}
      </div>
    </div>
  );
}
  
export default LocalProducersPage;


