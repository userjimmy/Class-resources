// Configuration
const CONFIG = {
  API_BASE: "https://your-proxy.onrender.com", // Your backend URL
  REPO_NAME: "Class-resources"
};

class ResourceViewer {
  constructor() {
    this.init();
  }

  async init() {
    this.setCopyrightYear();
    this.setupTabs();
    await this.loadContent('notes');
  }

  async loadContent(type, folder) {
    const containerId = folder ? `${type}-files` : `${type}-folders`;
    const container = document.getElementById(containerId);
    
    container.innerHTML = '<div class="spinner"></div>';
    if (folder) document.getElementById(`${type}-folders`).style.display = 'none';

    try {
      const endpoint = folder 
        ? `${CONFIG.API_BASE}/api/content/${type}/${folder}`
        : `${CONFIG.API_BASE}/api/content/${type}`;
      
      const response = await fetch(endpoint);
      const { success, data, message } = await response.json();

      if (!success) throw new Error(message);
      container.innerHTML = folder ? this.renderFiles(data) : this.renderFolders(data, type);

    } catch (error) {
      container.innerHTML = `
        <div class="error">
          <p>${error.message}</p>
          <button onclick="app.loadContent('${type}'${folder ? `, '${folder}'` : ''})">
            <i class="fas fa-sync-alt"></i> Retry
          </button>
        </div>
      `;
    }
  }

  renderFolders(folders, type) {
    return folders.map(folder => `
      <div class="folder" onclick="app.loadContent('${type}', '${folder.name}')">
        <i class="fas fa-folder"></i>
        <span>${this.formatName(folder.name)}</span>
      </div>
    `).join('');
  }

  renderFiles(files) {
    return files.map(file => `
      <div class="file">
        <i class="fas fa-file-pdf"></i>
        <span>${file.name}</span>
        <div class="actions">
          <a href="${file.url}" target="_blank" title="View">
            <i class="fas fa-eye"></i>
          </a>
          <a href="${file.url}" download="${file.name}" title="Download">
            <i class="fas fa-download"></i>
          </a>
        </div>
      </div>
    `).join('');
  }

  // Helper methods
  formatName(str) {
    return str.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  setCopyrightYear() {
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
  }

  setupTabs() {
    document.querySelectorAll('.tab-button').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab-button').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        const tabId = tab.dataset.tab;
        document.getElementById(tabId).classList.add('active');
        
        this.loadContent(tabId);
      });
    });
  }
}

// Initialize
const app = new ResourceViewer();
window.app = app;
