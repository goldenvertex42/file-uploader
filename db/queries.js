const prisma = require("../lib/prisma.js");

async function createUser(email, name, password) {
  return await prisma.user.create({
    data: {
      email,
      name,
      password,
    },
  });
}

async function getUserFolders(userId) {
    return await prisma.folder.findMany({
      where: { userId }
    });
}

async function getUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email: email },
  });
}

async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id: id },
  });
}

module.exports = {
  createUser,
  getUserFolders,
  getUserByEmail,
  getUserById
}