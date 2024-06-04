import React, { useState } from 'react';
import { useQuery, getFiveRandomProducers } from 'wasp/client/operations';
import { Link } from 'react-router-dom';
import { Producer } from 'wasp/entities';

const DisplayFiveProducers = () => {
  const { data, isLoading } = useQuery(getFiveRandomProducers);
  const [currentProducerIndex, setCurrentProducerIndex] = useState(0);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const producers = data?.producers;

  if (!producers || producers.length === 0) {
    return <div>No producers available.</div>;
  }

  const handleNextProducer = () => {
    setCurrentProducerIndex((prevIndex) => (prevIndex + 1) % producers.length);
  };

  const currentProducer = producers[currentProducerIndex];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: '40px' }}>
        <div style={{ maxWidth: '400px', textAlign: 'center' }}>
          <img src={currentProducer.profilPicture} alt={`${currentProducer.firstname} ${currentProducer.surname}`} style={{ width: '100%', borderRadius: '10px' }} />
          <h2 style={{ marginTop: '10px' }}>{currentProducer.shopname}</h2>
          <p>{`${currentProducer.firstname} ${currentProducer.surname}`}</p>
          <p>{currentProducer.theme}</p>
          <p>{currentProducer.description}</p>
        </div>
        <button onClick={handleNextProducer} style={{ marginLeft: '20px', fontSize: '24px', cursor: 'pointer', background: 'none', border: 'none' }}>
          ➡️
        </button>
      </div>
    </div>
  );
};

export default DisplayFiveProducers;
