document.addEventListener('DOMContentLoaded', function() {
    // Set copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // GitHub configuration (REPLACE WITH YOUR TOKEN)
    const githubConfig = {
        username: 'userjimmy',
        repo: 'My-resources',
        branch: 'main',
        token: 'ghp_yourActualTokenHere', // Create at: https://github.com/settings/tokens
        paths: {
            notes: 'notes/',
            cats: 'cats/',
            assignments: 'assignments/'
        }
    };

    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', async () => {
            // UI Updates
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            document.getElementById(`${tabId}-files`).style.display = 'none';
            
            // Load content
            await loadFoldersForTab(tabId, githubConfig);
        });
    });
    
    // Initial load
    loadFoldersForTab('notes', githubConfig);
});

async function loadFoldersForTab(tabId, config) {
    const foldersContainer = document.getElementById(`${tabId}-folders`);
    foldersContainer.innerHTML = '<div class="loading-spinner"></div>';
    
    try {
        const path = config.paths[tabId];
        const response = await fetch(
            `https://api.github.com/repos/${config.username}/${config.repo}/contents/${path}?ref=${config.branch}`,
            {
                headers: {
                    'Authorization': `token ${config.token}`,
                    'Accept': 'application/vnd.github+json'
                }
            }
        );

        if (!response.ok) throw new Error(await response.text());
        
        const data = await response.json();
        const folders = data.filter(item => item.type === 'dir');
        
        if (folders.length === 0) {
            foldersContainer.innerHTML = '<p class="info">No folders found</p>';
            return;
        }

        foldersContainer.innerHTML = '';
        folders.forEach(folder => {
            const folderEl = document.createElement('div');
            folderEl.className = 'folder';
            folderEl.innerHTML = `
                <i class="fas fa-folder"></i>
                <div class="folder-name">${formatFolderName(folder.name)}</div>
            `;
            folderEl.addEventListener('click', () => loadFilesFromFolder(tabId, folder.name, config));
            foldersContainer.appendChild(folderEl);
        });

    } catch (error) {
        console.error(`Error loading ${tabId}:`, error);
        foldersContainer.innerHTML = `
            <p class="error">Failed to load content</p>
            <small>${getUserFriendlyError(error)}</small>
        `;
    }
}

async function loadFilesFromFolder(tabId, folderName, config) {
    const filesContainer = document.getElementById(`${tabId}-files`);
    const foldersContainer = document.getElementById(`${tabId}-folders`);
    
    filesContainer.innerHTML = '<div class="loading-spinner"></div>';
    filesContainer.style.display = 'block';
    foldersContainer.style.display = 'none';

    try {
        const path = `${config.paths[tabId]}${folderName}/`;
        const response = await fetch(
            `https://api.github.com/repos/${config.username}/${config.repo}/contents/${path}?ref=${config.branch}`,
            {
                headers: {
                    'Authorization': `token ${config.token}`,
                    'Accept': 'application/vnd.github+json'
                }
            }
        );

        if (!response.ok) throw new Error(await response.text());
        
        const data = await response.json();
        const pdfFiles = data.filter(file => 
            file.type === 'file' && file.name.toLowerCase().endsWith('.pdf')
        );

        filesContainer.innerHTML = `
            <button class="back-button" id="back-to-${tabId}">
                <i class="fas fa-arrow-left"></i> Back
            </button>
            <h3>${formatFolderName(folderName)}</h3>
            ${pdfFiles.length ? '' : '<p class="info">No PDFs found</p>'}
        `;

        pdfFiles.forEach(file => {
            const rawUrl = `https://raw.githubusercontent.com/${config.username}/${config.repo}/${config.branch}/${file.path}`;
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <i class="fas fa-file-pdf"></i>
                    <span>${file.name}</span>
                </div>
                <div class="file-actions">
                    <a href="${rawUrl}" target="_blank" title="View">
                        <i class="fas fa-eye"></i>
                    </a>
                    <a href="${rawUrl}" download="${file.name}" title="Download">
                        <i class="fas fa-download"></i>
                    </a>
                </div>
            `;
            filesContainer.appendChild(fileItem);
        });

        // Back button handler
        document.getElementById(`back-to-${tabId}`).addEventListener('click', () => {
            filesContainer.style.display = 'none';
            foldersContainer.style.display = 'grid';
        });

    } catch (error) {
        console.error(`Error loading ${folderName}:`, error);
        filesContainer.innerHTML = `
            <p class="error">Failed to load files</p>
            <small>${getUserFriendlyError(error)}</small>
            <button class="back-button" onclick="location.reload()">
                <i class="fas fa-sync-alt"></i> Retry
            </button>
        `;
    }
}

// Helper functions
function formatFolderName(name) {
    return name
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
}

function getUserFriendlyError(error) {
    const msg = error.message || String(error);
    if (msg.includes('401')) return 'Authentication failed - check your token';
    if (msg.includes('404')) return 'Content not found - check repository structure';
    if (msg.includes('rate limit')) return 'GitHub rate limit exceeded - try again later';
    return 'Please check console for details';
}
