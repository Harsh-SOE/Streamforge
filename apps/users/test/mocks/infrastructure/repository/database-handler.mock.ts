/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

export const DatabaseHandlerMock = () => ({
  execute: jest.fn().mockImplementation(async (operation) => {
    console.log(operation);
    return await operation();
  }),
});
