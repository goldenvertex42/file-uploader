document.addEventListener('DOMContentLoaded', () => {
  const newFolderBtn = document.querySelector('#btn-new-folder');
  const folderFormItem = document.querySelector('#new-folder-item');
  const folderInput = document.querySelector('#new-folder-input');

  const editFolderBtn = document.querySelector('#btn-edit-folder');
  const titleFolderContainer = document.querySelector('#folder-title-container');
  const renameFolderForm = document.querySelector('#rename-folder-form');
  const renameFolderInput = document.querySelector('#rename-folder-input');

  const editFileBtn = document.querySelector('#btn-edit-file');
  const fileTitleContainer = document.querySelector('#file-title-container');
  const renameFileForm = document.querySelector('#rename-file-form');
  const renameFileInput = document.querySelector('#rename-file-input');

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

  if (editFolderBtn && titleFolderContainer && renameFolderForm && renameFolderInput) {
    editFolderBtn.addEventListener('click', () => {
      titleFolderContainer.classList.add('hidden');
      renameFolderForm.classList.remove('hidden');
      renameFolderInput.focus();
      renameFolderInput.select();
    });

    renameFolderInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        renameFolderForm.classList.add('hidden');
        titleFolderContainer.classList.remove('hidden');
      }
    });

    document.addEventListener('click', (e) => {
      if (!renameFolderForm.contains(e.target) && e.target !== editFolderBtn) {
        renameFolderForm.classList.add('hidden');
        titleFolderContainer.classList.remove('hidden');
      }
    });
  }


  if (editFileBtn && fileTitleContainer && renameFileForm && renameFileInput) {
    editFileBtn.addEventListener('click', () => {
      fileTitleContainer.classList.add('hidden');
      renameFileForm.classList.remove('hidden');
      renameFileInput.focus();
      renameFileInput.select();
    });

    renameFileInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        renameFileForm.classList.add('hidden');
        fileTitleContainer.classList.remove('hidden');
      }
    });

    document.addEventListener('click', (e) => {
      if (!renameFileForm.contains(e.target) && e.target !== editFileBtn) {
        renameFileForm.classList.add('hidden');
        fileTitleContainer.classList.remove('hidden');
      }
    });
  }
});
