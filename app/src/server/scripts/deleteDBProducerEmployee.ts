import { Employee, Producer, User } from 'wasp/entities';
import type { PrismaClient } from '@prisma/client';
import { deleteProducer, deleteEmployee } from 'wasp/server/operations';

export async function devDelEmployeeProducer(prismaClient: PrismaClient) {
  try {
    // Retrieve all employees and producers from the database
    const employees: Employee[] = await prismaClient.employee.findMany();
    const producers: Producer[] = await prismaClient.producer.findMany();

    // Delete all employees using the DeleteEmployee function
    for (const employee of employees) {
      // Find the user associated with the employee
      const user: User | null = await prismaClient.user.findUnique({
        where: { id: employee.userId },
      });
      
      // Pass the user to the deleteEmployee function
      await deleteEmployee({ id: employee.id }, { user }); // Assuming a valid user ID for authorization
    }

    // Delete all producers using the DeleteProducer function
    for (const producer of producers) {
      // Find the user associated with the producer
      const user: User | null = await prismaClient.user.findUnique({
        where: { id: producer.userId },
      });

      // Pass the user to the deleteProducer function
      await deleteProducer({ id: producer.id }, { user }); // Assuming a valid user ID for authorization
    }

    console.log(`Employees et Producteurs ont été supprimés avec succès.`);
  } catch (error) {
    console.error('Erreur lors de la suppresion des employees :', error);
  }
}
