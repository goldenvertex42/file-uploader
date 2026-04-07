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

async function getFolderById(folderId, userId) {
  const folder = await prisma.folder.findUnique({
    where: { 
      id: Number(folderId),
      userId: userId 
    },
    include: {
      files: true,
      _count: {
        select: { files: true } // Gets the number of files automatically
      }
    }
  });

  if (!folder) return null;

  // Add the sum aggregation
  const aggregation = await prisma.file.aggregate({
    where: { folderId: Number(folderId) },
    _sum: { size: true }
  });

  // Combine them into one object
  return {
    ...folder,
    totalSize: aggregation._sum.size || 0
  };
}

async function updateFolder(folderId, userId, newName) {
  return await prisma.folder.update({
    where: { 
      id: Number(folderId),
      userId: userId 
    },
    data: { name: newName }
  });
}

async function deleteFolder(folderId, userId) {
  return await prisma.folder.delete({
    where: {
      id: Number(folderId),
      userId: userId // Security: Only owner can delete
    }
  });
}

async function createFile(fileData) {
  return await prisma.file.create({
    data: {
      name: fileData.name,
      size: fileData.size,
      url: fileData.url,       // Must be a string value
      publicId: fileData.publicId,
      userId: fileData.userId,
      folderId: fileData.folderId
    }
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

async function getFileById(fileId, userId) {
  return await prisma.file.findUnique({
    where: { 
      id: Number(fileId),
      userId: userId 
    }
  });
}

async function updateFile(fileId, userId, newName) {
  return await prisma.file.update({
    where: { 
      id: Number(fileId),
      userId: userId 
    },
    data: { name: newName }
  });
}

async function deleteFile(fileId, userId) {
  return await prisma.file.delete({
    where: { 
      id: Number(fileId),
      userId: userId 
    }
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
  getFolderById,
  updateFolder,
  deleteFolder,
  createFile,
  getUserRootFiles,
  getFileById,
  updateFile,
  deleteFile,
  getUserByEmail,
  getUserById
}