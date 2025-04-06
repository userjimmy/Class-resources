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

// Load folders for a specific tab
function loadFoldersForTab(tabId) {
    const foldersContainer = document.getElementById(`${tabId}-folders`);
    foldersContainer.innerHTML = '';
    
    // Create 6 folders for all tabs
    for (let i = 1; i <= 6; i++) {
        const folder = document.createElement('div');
        folder.className = 'folder';
        folder.innerHTML = `
            <i class="fas fa-folder"></i>
            <div class="folder-name">Folder ${i}</div>
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
    
    // Sample files for each folder
    const sampleFiles = [
        { name: `Document ${folderNumber}-1.pdf`, url: `#` },
        { name: `Document ${folderNumber}-2.pdf`, url: `#` },
        { name: `Document ${folderNumber}-3.pdf`, url: `#` }
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
                <a href="${file.url}" download title="Download"><i class="fas fa-download"></i></a>
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
