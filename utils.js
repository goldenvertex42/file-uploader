function formatSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function buildShareUrl(req, folderId) {
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}/folders/share/${folderId}`;
}

module.exports = {
  formatSize,
  buildShareUrl
}