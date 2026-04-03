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

async function createFolder(name, userId) {
  return await prisma.folder.create({
    data: {
      name: name,
      userId: userId,
    },
  });
}

async function getUserFolders(userId) {
  return await prisma.folder.findMany({
    where: { userId },
    orderBy: { name: 'asc' }
  });
}

async function getUserRootFiles(userId) {
  return await prisma.file.findMany({
    where: { 
      userId: userId,
      folderId: null // Only files NOT in a folder
    },
    orderBy: { createdAt: 'desc' }
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
  createFolder,
  getUserFolders,
  getUserRootFiles,
  getUserByEmail,
  getUserById
}