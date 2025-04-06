document.addEventListener('DOMContentLoaded', async () => {
  // Set copyright year
  document.getElementById('copyright-year').textContent = new Date().getFullYear();

  // DOM elements
  const tabs = document.querySelectorAll('.tab-button');
  const contents = document.querySelectorAll('.tab-content');

  // Load folders for a tab type
  async function loadFolders(tabId) {
    const container = document.getElementById(`${tabId}-folders`);
    container.innerHTML = '<div class="spinner"></div>';

    try {
      const response = await fetch(`/api/content/${tabId}`);
      const { success, data, message } = await response.json();

      if (!success) throw new Error(message);

      container.innerHTML = '';
      if (data.length === 0) {
        container.innerHTML = '<p class="empty">No folders found</p>';
        return;
      }

      data.forEach(folder => {
        const folderEl = document.createElement('div');
        folderEl.className = 'folder';
        folderEl.innerHTML = `
          <i class="fas fa-folder"></i>
          <span>${formatName(folder.name)}</span>
        `;
        folderEl.addEventListener('click', () => loadFiles(tabId, folder.name));
        container.appendChild(folderEl);
      });

    } catch (error) {
      container.innerHTML = `<p class="error">${error.message}</p>`;
      console.error('Load folders error:', error);
    }
  }

  // Load files from a folder
  async function loadFiles(tabId, folderName) {
    const filesContainer = document.getElementById(`${tabId}-files`);
    const foldersContainer = document.getElementById(`${tabId}-folders`);
    
    filesContainer.innerHTML = '<div class="spinner"></div>';
    filesContainer.style.display = 'block';
    foldersContainer.style.display = 'none';

    try {
      const response = await fetch(`/api/content/${tabId}/${folderName}`);
      const { success, data, message } = await response.json();

      if (!success) throw new Error(message);

      filesContainer.innerHTML = `
        <button class="back-button" onclick="showFolders('${tabId}')">
          <i class="fas fa-arrow-left"></i> Back to ${tabId}
        </button>
        <h3>${formatName(folderName)}</h3>
      `;

      if (data.length === 0) {
        filesContainer.innerHTML += '<p class="empty">No PDFs found</p>';
      } else {
        data.forEach(file => {
          const fileEl = document.createElement('div');
          fileEl.className = 'file-item';
          fileEl.innerHTML = `
            <div class="file-info">
              <i class="fas fa-file-pdf"></i>
              <span>${file.name}</span>
            </div>
            <div class="file-actions">
              <a href="${file.url}" target="_blank" title="View">
                <i class="fas fa-eye"></i>
              </a>
              <a href="${file.url}" download="${file.name}" title="Download">
                <i class="fas fa-download"></i>
              </a>
            </div>
          `;
          filesContainer.appendChild(fileEl);
        });
      }

    } catch (error) {
      filesContainer.innerHTML = `
        <p class="error">Failed to load files: ${error.message}</p>
        <button class="retry-button" onclick="loadFiles('${tabId}', '${folderName}')">
          <i class="fas fa-sync-alt"></i> Retry
        </button>
      `;
    }
  }

  // Helper function to format names
  function formatName(str) {
    return str
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
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

  // Initialize
  loadFolders('notes');
});

// Global function for back button
window.showFolders = (tabId) => {
  document.getElementById(`${tabId}-files`).style.display = 'none';
  document.getElementById(`${tabId}-folders`).style.display = 'grid';
};
