document.addEventListener('DOMContentLoaded', async () => {
  // UI Elements
  const tabs = document.querySelectorAll('.tab-button');
  const contents = document.querySelectorAll('.tab-content');
  
  // Load folders for a tab
  async function loadFolders(tabId) {
    const container = document.getElementById(`${tabId}-folders`);
    container.innerHTML = '<div class="spinner"></div>';
    
    try {
      const response = await fetch(`/api/content/${tabId}`);
      const { success, data, message } = await response.json();
      
      if (!success) throw new Error(message);
      
      container.innerHTML = data.length ? '' : '<p>No folders found</p>';
      
      data.forEach(folder => {
        const folderEl = document.createElement('div');
        folderEl.className = 'folder';
        folderEl.innerHTML = `
          <i class="fas fa-folder"></i>
          <span>${folder.name.replace(/-/g, ' ')}</span>
        `;
        folderEl.addEventListener('click', () => loadFiles(tabId, folder.name));
        container.appendChild(folderEl);
      });
      
    } catch (error) {
      container.innerHTML = `<p class="error">${error.message}</p>`;
    }
  }

  // Load files from a folder
  async function loadFiles(tabId, folderName) {
    const filesContainer = document.getElementById(`${tabId}-files`);
    filesContainer.innerHTML = '<div class="spinner"></div>';
    
    try {
      const response = await fetch(`/api/content/${tabId}/${folderName}`);
      const { success, data, message } = await response.json();
      
      if (!success) throw new Error(message);
      
      filesContainer.innerHTML = `
        <button class="back" onclick="showFolders('${tabId}')">
          <i class="fas fa-arrow-left"></i> Back
        </button>
        <h3>${folderName.replace(/-/g, ' ')}</h3>
        ${data.length ? '' : '<p>No PDFs found</p>'}
      `;
      
      data.forEach(file => {
        const fileEl = document.createElement('div');
        fileEl.className = 'file';
        fileEl.innerHTML = `
          <i class="fas fa-file-pdf"></i>
          <span>${file.name}</span>
          <div class="actions">
            <a href="${file.download_url}" target="_blank">
              <i class="fas fa-eye"></i> View
            </a>
          </div>
        `;
        filesContainer.appendChild(fileEl);
      });
      
    } catch (error) {
      filesContainer.innerHTML = `<p class="error">${error.message}</p>`;
    }
  }

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      
      tab.classList.add('active');
      const tabId = tab.dataset.tab;
      document.getElementById(tabId).classList.add('active');
      
      loadFolders(tabId);
    });
  });

  // Initial load
  loadFolders('notes');
});

// Helper function (global for HTML onclick)
window.showFolders = (tabId) => {
  document.getElementById(`${tabId}-files`).style.display = 'none';
  document.getElementById(`${tabId}-folders`).style.display = 'grid';
};
