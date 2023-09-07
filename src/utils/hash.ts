import * as bcrypt from 'bcrypt';

async function hashPin(pin: string) {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(pin, salt);
  return {
    salt,
    hash,
  };
}
async function isMatchPin(pin: string, hashPin: string) {
  return await bcrypt.compare(pin, hashPin);
}

export { hashPin, isMatchPin };
