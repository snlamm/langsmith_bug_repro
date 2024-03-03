import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { getRandomTextTool } from './tools/randomTextTool';
import { ChatOpenAI } from '@langchain/openai';
import {
  CallbackManager,
  traceAsGroup,
} from '@langchain/core/callbacks/manager';
import { Client } from 'langsmith';

const AGENT_PROMPT = `You are a test agent, who is to follow the instructions so we can stress test our LLM logging.

Your goal is too call the randomText tool over and over again until instructed to finish.`;

export const runAgent = async ({
  count,
  callbackManager,
}: {
  count: number;
  callbackManager: CallbackManager;
}) => {
  const tools = [getRandomTextTool()];
  const chatLLM = new ChatOpenAI({
    streaming: true,
    modelName: 'gpt-3.5-turbo',
    temperature: 0.4,
    maxTokens: 1000,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const executor = await initializeAgentExecutorWithOptions(tools, chatLLM, {
    agentType: 'structured-chat-zero-shot-react-description',
    agentArgs: {
      prefix: AGENT_PROMPT,
    },
    maxIterations: 1,
    tags: [],
    metadata: {},
    callbacks: [callbackManager],
  });

  await executor.call(
    {
      input: '',
      runName: `(${count}) Agent Executor`,
    },
    { callbacks: [callbackManager] },
  );

  await chatLLM.invoke("Say the word 'test'", {
    runName: 'Log Test',
    callbacks: [callbackManager],
  });
};

export const runAgentsInParallel = async () => {
  const client = new Client({
    apiKey: process.env.LANGCHAIN_API_KEY,
    callerOptions: {
      maxRetries: 3,
    },
  });

  await traceAsGroup(
    { name: 'Trace Group', client },
    async (callbackManager) =>
      await Promise.all(
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) =>
          runAgent({
            count,
            callbackManager,
          }),
        ),
      ),
  );
};
