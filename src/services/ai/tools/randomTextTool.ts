import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { createRandomTexts } from '../process/executeRandomTexts.js';

export const getRandomTextTool = ({ shortId }: { shortId: string }) => {
  return new DynamicStructuredTool({
    name: 'randomText',
    description: 'generate random via an LLM',
    schema: z.object({ randomWord: z.string() }),
    func: async ({ randomWord }, callbackManager) => {
      console.log('tool started!');

      await createRandomTexts({
        randomWord,
        count: 1,
        callbackManager,
        shortId,
      });
      await createRandomTexts({
        randomWord,
        count: 2,
        callbackManager,
        shortId,
      });
      await createRandomTexts({
        randomWord,
        count: 3,
        callbackManager,
        shortId,
      });
      await createRandomTexts({
        randomWord,
        count: 4,
        callbackManager,
        shortId,
      });
      const result = await createRandomTexts({
        randomWord,
        count: 5,
        callbackManager,
        shortId,
      });

      return result;
    },
  });
};
