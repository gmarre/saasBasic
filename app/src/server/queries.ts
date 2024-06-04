import { type DailyStats, type GptResponse, type User, type PageViewSource, type Task, type File, type Producer } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import {
  type GetGptResponses,
  type GetDailyStats,
  type GetPaginatedUsers,
  type GetPaginatedProducers,
  type GetAllTasksByUser,
  type GetAllFilesByUser,
  type GetDownloadFileSignedURL,
  type GetAllProducers,
  type GetProducerById,
  type GetFiveRandomProducers 
} from 'wasp/server/operations';
import { getDownloadFileSignedURLFromS3 } from './file-upload/s3Utils.js';
import { ProducerTheme } from '../shared/types.js';
import { MdTurnedIn } from 'react-icons/md';

type DailyStatsWithSources = DailyStats & {
  sources: PageViewSource[];
};

type DailyStatsValues = {
  dailyStats: DailyStatsWithSources;
  weeklyStats: DailyStatsWithSources[];
};

export const getGptResponses: GetGptResponses<void, GptResponse[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  return context.entities.GptResponse.findMany({
    where: {
      user: {
        id: context.user.id,
      },
    },
  });
};

export const getAllProducers: GetAllProducers<void, Producer[]> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  return context.entities.Producer.findMany();
};

export const getProducerById: GetProducerById<{ id: number }, Producer> = async ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const producer = await context.entities.Producer.findUnique({
    where: {
      id: id,
    },
  });

  if (!producer) {
    throw new HttpError(404, 'Producer not found');
  }

  return producer;
};


export const getAllTasksByUser: GetAllTasksByUser<void, Task[]> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  return context.entities.Task.findMany({
    where: {
      user: {
        id: context.user.id,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getAllFilesByUser: GetAllFilesByUser<void, File[]> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  return context.entities.File.findMany({
    where: {
      user: {
        id: context.user.id,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getDownloadFileSignedURL: GetDownloadFileSignedURL<{ key: string }, string> = async (
  { key },
  _context
) => {
  return await getDownloadFileSignedURLFromS3({ key });
};

export const getDailyStats: GetDailyStats<void, DailyStatsValues> = async (_args, context) => {
  if (!context.user?.isAdmin) {
    throw new HttpError(401);
  }
  const dailyStats = await context.entities.DailyStats.findFirstOrThrow({
    orderBy: {
      date: 'desc',
    },
    include: {
      sources: true,
    },
  });

  const weeklyStats = await context.entities.DailyStats.findMany({
    orderBy: {
      date: 'desc',
    },
    take: 7,
    include: {
      sources: true,
    },
  });

  return { dailyStats, weeklyStats };
};

type GetPaginatedUsersInput = {
  skip: number;
  cursor?: number | undefined;
  hasPaidFilter: boolean | undefined;
  emailContains?: string;
  subscriptionStatus?: string[];
};
type GetPaginatedUsersOutput = {
  users: Pick<
    User,
    'id' | 'email' | 'username' | 'lastActiveTimestamp' | 'hasPaid' | 'subscriptionStatus' | 'stripeId'
  >[];
  totalPages: number;
};

export const getPaginatedUsers: GetPaginatedUsers<GetPaginatedUsersInput, GetPaginatedUsersOutput> = async (
  args,
  context
) => {
  let subscriptionStatus = args.subscriptionStatus?.filter((status) => status !== 'hasPaid');
  subscriptionStatus = subscriptionStatus?.length ? subscriptionStatus : undefined;

  const queryResults = await context.entities.User.findMany({
    skip: args.skip,
    take: 10,
    where: {
      email: {
        contains: args.emailContains || undefined,
        mode: 'insensitive',
      },
      hasPaid: args.hasPaidFilter,
      subscriptionStatus: {
        in: subscriptionStatus || undefined,
      },
    },
    select: {
      id: true,
      email: true,
      username: true,
      lastActiveTimestamp: true,
      hasPaid: true,
      subscriptionStatus: true,
      stripeId: true,
    },
    orderBy: {
      id: 'desc',
    },
  });

  const totalUserCount = await context.entities.User.count({
    where: {
      email: {
        contains: args.emailContains || undefined,
      },
      hasPaid: args.hasPaidFilter,
      subscriptionStatus: {
        in: subscriptionStatus || undefined,
      },
    },
  });
  const totalPages = Math.ceil(totalUserCount / 10);

  return {
    users: queryResults,
    totalPages,
  };
};

type GetPaginatedProducersInput = {
  skip: number;
  shopnameContains?: string;
  themeFilter?: ProducerTheme;
};

type GetPaginatedProducersOutput = {
  producers: Pick<
    Producer,
    'id' | 'firstname' | 'surname' | 'shopname' | 'description' | 'theme'
  >[];
  totalPages: number;
};

export const getPaginatedProducers: GetPaginatedProducers<GetPaginatedProducersInput, GetPaginatedProducersOutput> = async (
  args,
  context
) => {
  const queryResults = await context.entities.Producer.findMany({
    skip: args.skip,
    take: 10,
    where: {
      shopname: {
        contains: args.shopnameContains || undefined,
        mode: 'insensitive',
      },
      theme: args.themeFilter || undefined,
    },
    select: {
      id: true,
      firstname: true,
      surname: true,
      shopname: true,
      description: true,
      theme: true,
    },
    orderBy: {
      id: 'desc',
    },
  });

  const totalProducerCount = await context.entities.Producer.count({
    where: {
      shopname: {
        contains: args.shopnameContains || undefined,
        mode: 'insensitive',
      },
      theme: args.themeFilter || undefined,
    },
  });
  const totalPages = Math.ceil(totalProducerCount / 10);

  return {
    producers: queryResults,
    totalPages,
  };
};

type GetRandomProducersOutput = {
  producers: Pick<
    Producer,
    'id' | 'firstname' | 'surname' | 'shopname' | 'description' | 'profilPicture' |'theme'
  >[];
};

export const getFiveRandomProducers: GetFiveRandomProducers<void, GetRandomProducersOutput> = async (_args: void, context) => {

  const queryResults = await context.entities.Producer.findMany({
    take: 5,
    select: {
      id: true,
      firstname: true,
      surname: true,
      shopname: true,
      description: true,
      profilPicture : true,
      theme: true,
    },
    orderBy: {
      id: 'desc',
    },
  });

  return {
    producers: queryResults,
  };
};