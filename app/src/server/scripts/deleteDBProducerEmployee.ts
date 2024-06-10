import { Producer, User } from 'wasp/entities';
import type { PrismaClient } from '@prisma/client';
import { deleteProducer} from 'wasp/server/operations';

export async function devDelProducer(prismaClient: PrismaClient) {
  try {
    // Retrieve all producers from the database
    const producers: Producer[] = await prismaClient.producer.findMany();

    // Delete all producers using the DeleteProducer function
    for (const producer of producers) {
      // Find the user associated with the producer
      const user: User | null = await prismaClient.user.findUnique({
        where: { id: producer.userId },
      });

      // Pass the user to the deleteProducer function
      await deleteProducer({ id: producer.id }, { user }); // Assuming a valid user ID for authorization
    }

    console.log(`Producteurs ont été supprimés avec succès.`);
  } catch (error) {
    console.error('Erreur lors de la suppresion des employees :', error);
  }
}
