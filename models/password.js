import bcryptjs from "bcryptjs";

async function hash(password) {
  const pepper = getPepper();
  const rounds = getNumberOfRounds();
  return await bcryptjs.hash(password + pepper, rounds);
}

function getNumberOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

function getPepper() {
  return process.env.PASSWORD_PEPPER || "password_pepper_default_value";
}

async function compare(providedPassword, storedPassword) {
  const pepper = getPepper();
  return await bcryptjs.compare(providedPassword + pepper, storedPassword);
}

const password = {
  hash,
  compare,
};

export default password;
