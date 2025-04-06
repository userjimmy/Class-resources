document.addEventListener('DOMContentLoaded', function() {
    // Set copyright year
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Load folders for the active tab
            loadFoldersForTab(tabId);
            
            // Hide files container when switching tabs
            document.getElementById(`${tabId}-files`).style.display = 'none';
        });
    });
    
    // Load folders for the initially active tab (NOTES)
    loadFoldersForTab('notes');
});

// GitHub repository configuration
const githubConfig = {
    username: 'your-github-username',
    repo: 'study-materials',
    branch: 'main',
    folders: {
        notes: 'notes',
        cats: 'cats',
        assignments: 'assignments'
    }
};

// Load folders for a specific tab
function loadFoldersForTab(tabId) {
    const foldersContainer = document.getElementById(`${tabId}-folders`);
    foldersContainer.innerHTML = '';
    
    // Create different number of folders based on tab
    let folderCount = 0;
    if (tabId === 'notes') {
        folderCount = 6; // NOTES has 6 folders
    } else if (tabId === 'cats') {
        folderCount = 5; // CATs has 5 folders
    } else {
        folderCount = 5; // ASSIGNMENTS has 5 folders
    }
    
    // Create folder elements
    for (let i = 1; i <= folderCount; i++) {
        const folder = document.createElement('div');
        folder.className = 'folder';
        folder.innerHTML = `
            <i class="fas fa-folder"></i>
            <div class="folder-name">${tabId === 'notes' ? `Unit ${i}` : `Folder ${i}`}</div>
        `;
        
        folder.addEventListener('click', () => {
            loadFilesFromGitHub(tabId, i);
        });
        
        foldersContainer.appendChild(folder);
    }
}

// Load files from GitHub for a specific folder
function loadFilesFromGitHub(tabId, folderNumber) {
    const filesContainer = document.getElementById(`${tabId}-files`);
    const foldersContainer = document.getElementById(`${tabId}-folders`);
    
    // Show loading state
    filesContainer.innerHTML = '<p>Loading files...</p>';
    filesContainer.style.display = 'block';
    foldersContainer.style.display = 'none';
    
    // Sample PDF files - in real app these would come from GitHub API
    const sampleFiles = [
        { name: `${tabId === 'notes' ? 'Lecture' : 'Test'} ${folderNumber}-1.pdf`, 
          url: `https://github.com/${githubConfig.username}/${githubConfig.repo}/blob/${githubConfig.branch}/${githubConfig.folders[tabId]}/folder${folderNumber}/file1.pdf` },
        { name: `${tabId === 'notes' ? 'Lecture' : 'Test'} ${folderNumber}-2.pdf`, 
          url: `https://github.com/${githubConfig.username}/${githubConfig.repo}/blob/${githubConfig.branch}/${githubConfig.folders[tabId]}/folder${folderNumber}/file2.pdf` },
        { name: `${tabId === 'notes' ? 'Summary' : 'Solution'} ${folderNumber}.pdf`, 
          url: `https://github.com/${githubConfig.username}/${githubConfig.repo}/blob/${githubConfig.branch}/${githubConfig.folders[tabId]}/folder${folderNumber}/summary.pdf` }
    ];
    
    // Create back button
    filesContainer.innerHTML = `
        <div class="back-button" id="back-to-folders">
            <i class="fas fa-arrow-left"></i> Back to folders
        </div>
    `;
    
    // Add files to container
    sampleFiles.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-info">
                <i class="fas fa-file-pdf file-icon"></i>
                <div class="file-name">${file.name}</div>
            </div>
            <div class="file-actions">
                <a href="${file.url}" target="_blank" title="View"><i class="fas fa-eye"></i></a>
                <a href="${file.url.replace('/blob/', '/raw/')}" download title="Download"><i class="fas fa-download"></i></a>
            </div>
        `;
        filesContainer.appendChild(fileItem);
    });
    
    // Add event listener to back button
    document.getElementById('back-to-folders').addEventListener('click', () => {
        filesContainer.style.display = 'none';
        foldersContainer.style.display = 'grid';
    });
}
