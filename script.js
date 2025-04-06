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
            loadFilesForFolder(tabId, i);
        });
        
        foldersContainer.appendChild(folder);
    }
}

// Load files for a specific folder
function loadFilesForFolder(tabId, folderNumber) {
    const filesContainer = document.getElementById(`${tabId}-files`);
    const foldersContainer = document.getElementById(`${tabId}-folders`);
    
    // Show loading state
    filesContainer.innerHTML = '<p>Loading files...</p>';
    filesContainer.style.display = 'block';
    foldersContainer.style.display = 'none';
    
    // Simulate loading files (in a real app, you would fetch from GitHub)
    setTimeout(() => {
        // Create back button
        filesContainer.innerHTML = `
            <div class="back-button" id="back-to-folders">
                <i class="fas fa-arrow-left"></i> Back to folders
            </div>
        `;
        
        // Create sample files
        for (let i = 1; i <= 3; i++) {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <i class="fas fa-file-pdf file-icon"></i>
                    <div class="file-name">${tabId} File ${folderNumber}-${i}.pdf</div>
                </div>
                <div class="file-actions">
                    <a href="#" target="_blank" title="View"><i class="fas fa-eye"></i></a>
                    <a href="#" download title="Download"><i class="fas fa-download"></i></a>
                </div>
            `;
            filesContainer.appendChild(fileItem);
        }
        
        // Add event listener to back button
        document.getElementById('back-to-folders').addEventListener('click', () => {
            filesContainer.style.display = 'none';
            foldersContainer.style.display = 'grid';
        });
    }, 500);
}
