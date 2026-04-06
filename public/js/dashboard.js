document.addEventListener('DOMContentLoaded', () => {
  const newFolderBtn = document.querySelector('#btn-new-folder');
  const folderFormItem = document.querySelector('#new-folder-item');
  const folderInput = document.querySelector('#new-folder-input');

  const editBtn = document.querySelector('#btn-edit-folder');
  const titleContainer = document.querySelector('#folder-title-container');
  const renameForm = document.querySelector('#rename-folder-form');
  const renameInput = document.querySelector('#rename-folder-input');

  if (newFolderBtn && folderFormItem && folderInput) {
    newFolderBtn.addEventListener('click', () => {
      folderFormItem.classList.remove('hidden');
      folderInput.focus();
      folderInput.select();
    });

    folderInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && folderInput.value.trim() === '') {
        e.preventDefault();
        folderFormItem.classList.add('hidden');
      }
      if (e.key === 'Escape') {
        folderFormItem.classList.add('hidden');
      }
    });

    document.addEventListener('click', (e) => {
      if (!folderFormItem.contains(e.target) && e.target !== newFolderBtn) {
        folderFormItem.classList.add('hidden');
      }
    });
  }

  if (editBtn && titleContainer && renameForm && renameInput) {
    editBtn.addEventListener('click', () => {
      titleContainer.classList.add('hidden');
      renameForm.classList.remove('hidden');
      renameInput.focus();
      renameInput.select();
    });

    renameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        renameForm.classList.add('hidden');
        titleContainer.classList.remove('hidden');
      }
    });

    document.addEventListener('click', (e) => {
      if (!renameForm.contains(e.target) && e.target !== editBtn) {
        renameForm.classList.add('hidden');
        titleContainer.classList.remove('hidden');
      }
    });
  }
});
