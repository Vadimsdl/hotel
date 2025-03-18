import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import { hotelWorkflow } from './workflows/hotelWorkflow.js';
import { hotelAgent } from './agents/hotelAgent.js';

export const mastra = new Mastra({
  workflows: { hotelWorkflow },
  agents: { hotelAgent },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
