import { DynamicTool } from '@langchain/core/tools';

const getRandomOtherTool = () => {
  return new DynamicTool({
    name: 'Some Text Log',
    description: 'Creates a text log',
    func: async () => '',
  });
};

export const createLog = () => {
  const tool = getRandomOtherTool();
};
