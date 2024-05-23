import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { type Producer } from 'wasp/entities'; // Importez le type Producer
import {
  useQuery,
  getProducerById,
} from 'wasp/client/operations';

// Définir le type de nos paramètres
interface RouteParams {
  producerId: string; // Modifier pour qu'il soit une chaîne de caractères
}

const LocalProducerDetailPage: React.FC = () => {
  const { producerId } = useParams<RouteParams>();

  // Stocker les données du producteur dans un state local
  const [producerData, setProducerData] = useState<Producer | null>(null);

  // Charger les données du producteur une seule fois
useQuery(getProducerById, { id: parseInt(producerId) }, {
  onSuccess: (data: Producer) => {
    setProducerData(data);
  }
});

  return (
    <div className='py-10 lg:mt-10'>
      
        {/* Afficher le nom du producteur à l'extérieur du cadre */}
      {producerData && (
        <h1 className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white'>Votre Producteur <span className='text-yellow-500'>{producerData.firstname}</span> </h1>
      )}

      {/* Afficher le cadre du détail du producteur avec les autres informations */}
      {producerData && (
        <div className='my-8 border rounded-3xl border-gray-900/10 dark:border-gray-100/10'>
          <img src={producerData.profilPicture} alt="Photo de profil" style={{display: 'flex' }}/>                  
          <p>Producteur Description : {producerData.description}</p>
          {/* Ajoutez le reste des informations du producteur ici */}
        </div>
      )}
      
      
    </div>
  );
};

export default LocalProducerDetailPage;
