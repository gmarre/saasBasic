import {type Employee, type Producer } from 'wasp/entities';
import { faker } from '@faker-js/faker';
import type { PrismaClient } from '@prisma/client';
import {
    type DeleteAllProducers,
    type DeleteAllEmployees,
  } from 'wasp/server/operations';

export async function devDelEmployeeProducer(prismaClient: PrismaClient) {
  try {
    
    // Récupérer tous les employés de la base de données
    const employees: Employee[] = await prismaClient.employee.findMany();
    
    // Récupérer tous les producteurs de la base de données
    const producers: Producer[] = await prismaClient.producer.findMany();
    
    await DeleteAllEmployees();
    await DeleteAllProducers();
    
    console.log(`Employees et Producteurs ont été supprimés avec succès.`);
  } catch (error) {
    console.error('Erreur lors de la suppresion des employees :', error);
  }
}
