import { type Employee, type Producer } from 'wasp/entities';
import type { PrismaClient } from '@prisma/client';
import {
  type DeleteProducer,
  type DeleteEmployee,
} from 'wasp/server/operations';

export async function deleteAllEmployeesAndProducers(prismaClient: PrismaClient) {
  try {
    // Retrieve all employees and producers from the database
    const employees = await prismaClient.employee.findMany();
    const producers = await prismaClient.producer.findMany();

    // Delete all employees using the DeleteEmployee function
    for (const employee of employees) {
      await DeleteEmployee({ id: employee.id }, { user: { id: 1 } }); // Assuming a valid user ID for authorization
    }

    // Delete all producers using the DeleteProducer function
    for (const producer of producers) {
      await DeleteProducer({ id: producer.id }, { user: { id: 1 } }); // Assuming a valid user ID for authorization
    }

    console.log(`Employees and Producers successfully deleted.`);
  } catch (error) {
    console.error('Error during deletion:', error);
  }
}