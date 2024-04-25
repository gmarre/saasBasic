import {type Employee } from 'wasp/entities';
import { faker } from '@faker-js/faker';
import type { PrismaClient } from '@prisma/client';

// in a terminal window run `wasp db seed` to seed your dev database with mock employee data
export function createRandomEmployee(userId: number): Omit<Employee, 'id'> {
  const employee: Omit<Employee, 'id'> = {
    firstname: faker.person.firstName(),
    surname:faker.person.lastName(),
    companyEmployeeId: faker.number.int({ min: 11540000, max: 11555555 }),
    company:faker.company.name(),
    userId:userId,
  };
  return employee;
}

const EMPLOYEES_COUNT = 50; // Nombre d'employees à créer

export async function devSeedEmployee(prismaClient: PrismaClient) {
  try {
    // Récupérer tous les utilisateurs de la base de données
    const users = await prismaClient.user.findMany();
    
    // S'assurer qu'il y a au moins un utilisateur dans la base de données
    if (users.length === 0) {
      throw new Error('Aucun utilisateur trouvé dans la base de données.');
    }
    
    // Créer des employee pour chaque utilisateur existant
    for (let i = 0; i < EMPLOYEES_COUNT; i++) {
      const randomIndex = Math.floor(Math.random() * users.length);
      const randomUser = users[randomIndex];
      const employeeData = createRandomEmployee(randomUser.id);
      
      await prismaClient.employee.create({
        data: employeeData,
      });
    }
    
    console.log(`${EMPLOYEES_COUNT} employees ont été créés avec succès.`);
  } catch (error) {
    console.error('Erreur lors de la création des employees :', error);
  }
}
