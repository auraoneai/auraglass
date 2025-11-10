const hash = jest.fn(async (input: string) => `hashed-${input}`);
const compare = jest.fn(async (input: string, hashed: string) => hashed === `hashed-${input}`);
const genSalt = jest.fn(async () => 'salt');

module.exports = {
  hash,
  compare,
  genSalt,
  default: {
    hash,
    compare,
    genSalt,
  },
};
