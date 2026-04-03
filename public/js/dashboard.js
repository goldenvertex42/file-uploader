// public/js/dashboard.js
document.addEventListener('DOMContentLoaded', () => {
  const newFolderBtn = document.querySelector('#btn-new-folder');
  const folderFormItem = document.querySelector('#new-folder-item');
  const folderInput = document.querySelector('#new-folder-input');

  if (newFolderBtn) {
    newFolderBtn.addEventListener('click', () => {
      folderFormItem.classList.remove('hidden');
      folderInput.focus();
      folderInput.select();
    });
  }

  // Cancel if user hits 'Escape'
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !folderFormItem.classList.contains('hidden')) {
      folderFormItem.classList.add('hidden');
    }
  });

  folderInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && folderInput.value.trim() === '') {
      e.preventDefault(); // Stop the form from submitting to the server
      folderFormItem.classList.add('hidden'); // Just hide the UI
    }
  });

  // Optional: Hide if user clicks outside the form
  document.addEventListener('click', (e) => {
    if (!folderFormItem.contains(e.target) && e.target !== newFolderBtn) {
      folderFormItem.classList.add('hidden');
    }
  });
});
