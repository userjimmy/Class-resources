// 📁 File: script.js (for GitHub Pages)
document.addEventListener('DOMContentLoaded', () => {
  // 🔧 Configuration
  const CONFIG = {
    API_BASE: "https://your-proxy.onrender.com", // ⚠️ Replace with your Render URL
    REPO_NAME: "Class-resources"
  };

  // Set copyright year
  document.getElementById('copyright-year').textContent = new Date().getFullYear();

  // Tab switching
  document.querySelectorAll('.tab-button').forEach(tab => {
    tab.addEventListener('click', async () => {
      // Update active tab UI
      document.querySelectorAll('.tab-button').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');

      // Load content
      await loadFolders(tab.dataset.tab);
    });
  });

  // Load folders for a tab
  async function loadFolders(tabId) {
    const container = document.getElementById(`${tabId}-folders`);
    container.innerHTML = '<div class="spinner"></div>';

    try {
      const response = await fetch(`${CONFIG.API_BASE}/api/content/${tabId}`);
      const { success, data, message } = await response.json();

      if (!success) throw new Error(message);

      container.innerHTML = data.length ? '' : '<p>No folders found</p>';
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
      container.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
  }

  // Load files from a folder
  async function loadFiles(tabId, folderName) {
    const filesContainer = document.getElementById(`${tabId}-files`);
    filesContainer.innerHTML = '<div class="spinner"></div>';
    filesContainer.style.display = 'block';
    document.getElementById(`${tabId}-folders`).style.display = 'none';

    try {
      const response = await fetch(`${CONFIG.API_BASE}/api/content/${tabId}/${folderName}`);
      const { success, data, message } = await response.json();

      if (!success) throw new Error(message);

      filesContainer.innerHTML = `
        <button class="back-button" onclick="showFolders('${tabId}')">
          <i class="fas fa-arrow-left"></i> Back
        </button>
        <h3>${formatName(folderName)}</h3>
        ${data.length ? '' : '<p>No PDFs found</p>'}
      `;

      data.forEach(file => {
        const fileEl = document.createElement('div');
        fileEl.className = 'file';
        fileEl.innerHTML = `
          <i class="fas fa-file-pdf"></i>
          <span>${file.name}</span>
          <div class="actions">
            <a href="${file.url}" target="_blank">
              <i class="fas fa-eye"></i> View
            </a>
            <a href="${file.url}" download="${file.name}">
              <i class="fas fa-download"></i> Download
            </a>
          </div>
        `;
        filesContainer.appendChild(fileEl);
      });
    } catch (error) {
      filesContainer.innerHTML = `
        <p class="error">Error: ${error.message}</p>
        <button onclick="location.reload()">Retry</button>
      `;
    }
  }

  // Helper function
  function formatName(str) {
    return str.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  // Global function for back button
  window.showFolders = (tabId) => {
    document.getElementById(`${tabId}-files`).style.display = 'none';
    document.getElementById(`${tabId}-folders`).style.display = 'grid';
  };
});
