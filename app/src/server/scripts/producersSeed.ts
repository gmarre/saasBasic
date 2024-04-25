import {type Producer } from 'wasp/entities';
import { faker } from '@faker-js/faker';
import type { PrismaClient } from '@prisma/client';

// in a terminal window run `wasp db seed` to seed your dev database with mock producer data
export function createRandomProducer(userId: number): Omit<Producer, 'id'> {
  const producer: Omit<Producer, 'id'> = {
    firstname: faker.person.firstName(),
    surname:faker.person.lastName(),
    profilPicture: faker.image.url(),
    userId:userId,
    description:faker.lorem.text(),
    shopname:faker.company.name(),
  };
  return producer;
}

const PRODUCERS_COUNT = 50; // Nombre de producteurs à créer

export async function devSeedProducers(prismaClient: PrismaClient) {
  try {
    // Récupérer tous les utilisateurs de la base de données
    const users = await prismaClient.user.findMany();
    
    // S'assurer qu'il y a au moins un utilisateur dans la base de données
    if (users.length === 0) {
      throw new Error('Aucun utilisateur trouvé dans la base de données.');
    }
    
    // Créer des producteurs pour chaque utilisateur existant
    for (let i = 0; i < PRODUCERS_COUNT; i++) {
      const randomIndex = Math.floor(Math.random() * users.length);
      const randomUser = users[randomIndex];
      const producerData = createRandomProducer(randomUser.id);
      
      await prismaClient.producer.create({
        data: producerData,
      });
    }
    
    console.log(`${PRODUCERS_COUNT} producteurs ont été créés avec succès.`);
  } catch (error) {
    console.error('Erreur lors de la création des producteurs :', error);
  }
}
