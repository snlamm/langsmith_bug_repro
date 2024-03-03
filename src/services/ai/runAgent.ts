import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { getRandomTextTool } from './tools/randomTextTool.js';
import { ChatOpenAI } from '@langchain/openai';
import {
  CallbackManager,
  traceAsGroup,
} from '@langchain/core/callbacks/manager';
import { Client } from 'langsmith';
import { awaitAllCallbacks } from '@langchain/core/callbacks/promises';

const makeId = (length: number) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

const AGENT_PROMPT = `You are a test agent, who is to follow the instructions so we can stress test our LLM logging.

Your goal is too call the randomText tool over and over again until instructed to finish. You should call it with a random word structured as  {{ "randomWord": "<some word>"}}`;

export const runAgent = async ({
  count,
  callbackManager,
  shortId,
}: {
  count: number;
  callbackManager: CallbackManager;
  shortId: string;
}) => {
  console.log('start agent!');

  const tools = [getRandomTextTool({ shortId })];

  const chatLLM = new ChatOpenAI({
    streaming: true,
    modelName: 'gpt-3.5-turbo',
    temperature: 0.4,
    maxTokens: 500,
    openAIApiKey: process.env.OPENAI_API_KEY,
    tags: [shortId],
    callbacks: [callbackManager],
  });
  console.log('openai initiated!');

  //   const executor = await initializeAgentExecutorWithOptions(tools, chatLLM, {
  //     agentType: 'structured-chat-zero-shot-react-description',
  //     agentArgs: {
  //       prefix: AGENT_PROMPT,
  //     },
  //     maxIterations: 1,
  //     tags: [shortId],
  //     metadata: {},
  //     callbacks: [callbackManager],
  //   });

  //   console.log('calling executor!');

  //   await executor.call(
  //     {
  //       input: '',
  //       runName: `(${count}) Agent Executor`,
  //     },
  //     { callbacks: [callbackManager], tags: [shortId] },
  //   );

  //   console.log('start test!');

  const result = await chatLLM.invoke("Say the word 'test'", {
    runName: 'Log Test',
    tags: [shortId],
  });
  console.log('results!', result);
};

export const runAgentsInParallel = async () => {
  try {
    const shortId = `testShortId:${makeId(5)}`;

    console.log(`starting! ShortId ${shortId}`);

    const client = new Client({
      apiKey: process.env.LANGCHAIN_API_KEY,
      callerOptions: {
        maxRetries: 3,
      },
    });
    console.log('client initiated!');

    await traceAsGroup(
      {
        name: 'Trace Group',
        client,
        projectName: process.env.LANGSMITH_PROJECT_NAME,
      },
      async (callbackManager) => {
        await Promise.all(
          //   [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) =>
          [1].map((count) =>
            runAgent({
              count,
              callbackManager,
              shortId,
            }),
          ),
        );
      },
    );
  } catch (error) {
    console.log('error!');
    console.log(error);
  } finally {
    await awaitAllCallbacks();
  }
};
