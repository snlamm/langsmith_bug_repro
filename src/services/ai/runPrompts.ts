import { ChatOpenAI } from '@langchain/openai';
import { traceAsGroup } from '@langchain/core/callbacks/manager';
import { Client } from 'langsmith';
import { LangChainTracer } from '@langchain/core/tracers/tracer_langchain';
import { makeId } from './utils/makeId.js';

const getChatLLM = ({ shortId }: { shortId: string }) => {
  const chatLLM = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo',
    temperature: 0.4,
    maxTokens: 500,
    openAIApiKey: process.env.OPENAI_API_KEY,
    tags: [shortId],
  });

  return chatLLM;
};

export const runAllPrompts = async () => {
  try {
    const shortId = `testShortId:${makeId(5)}`;

    console.log(`starting! ShortId ${shortId}`);

    const client = new Client({
      apiKey: process.env.LANGCHAIN_API_KEY,
    });

    const chatLLM = getChatLLM({ shortId });

    // this log works!
    await chatLLM.invoke("Say the word 'hello'", {
      runName: 'Log Test',
      tags: [shortId],
      callbacks: [
        new LangChainTracer({
          client,
          projectName: process.env.LANGSMITH_PROJECT_NAME,
        }),
      ],
    });

    await traceAsGroup(
      {
        name: 'Trace Group',
        client,
        projectName: process.env.LANGSMITH_PROJECT_NAME,
      },
      async (callbackManager) => {
        const chatLLM = getChatLLM({ shortId });

        const result = await chatLLM.invoke("Say the word 'test'", {
          runName: 'Log Test',
          tags: [shortId],
          callbacks: [callbackManager],
        });

        // the result logs correctly, but the log always shows as pending
        console.log('result!', result);
      },
    );
  } catch (error) {
    console.log('error!');
    console.log(error);
  }
};
