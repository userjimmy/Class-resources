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
    
    // Create 6 folders for all tabs
    const folderCount = 6;
    
    // Create folder elements
    for (let i = 1; i <= folderCount; i++) {
        const folder = document.createElement('div');
        folder.className = 'folder';
        
        // Customize folder names based on tab
        let folderName;
        switch(tabId) {
            case 'notes':
                folderName = `Unit ${i}`;
                break;
            case 'cats':
                folderName = `CAT ${i}`;
                break;
            case 'assignments':
                folderName = `Assignment ${i}`;
                break;
            default:
                folderName = `Folder ${i}`;
        }
        
        folder.innerHTML = `
            <i class="fas fa-folder"></i>
            <div class="folder-name">${folderName}</div>
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
    
    // Sample PDF files - customize based on tab type
    let sampleFiles = [];
    
    switch(tabId) {
        case 'notes':
            sampleFiles = [
                { name: `Lecture ${folderNumber}.pdf`, 
                  url: `https://github.com/${githubConfig.username}/${githubConfig.repo}/blob/${githubConfig.branch}/${githubConfig.folders.notes}/unit${folderNumber}/lecture.pdf` },
                { name: `Summary ${folderNumber}.pdf`, 
                  url: `https://github.com/${githubConfig.username}/${githubConfig.repo}/blob/${githubConfig.branch}/${githubConfig.folders.notes}/unit${folderNumber}/summary.pdf` },
                { name: `Exercises ${folderNumber}.pdf`, 
                  url: `https://github.com/${githubConfig.username}/${githubConfig.repo}/blob/${githubConfig.branch}/${githubConfig.folders.notes}/unit${folderNumber}/exercises.pdf` }
            ];
            break;
            
        case 'cats':
            sampleFiles = [
                { name: `CAT ${folderNumber} Questions.pdf`, 
                  url: `https://github.com/${githubConfig.username}/${githubConfig.repo}/blob/${githubConfig.branch}/${githubConfig.folders.cats}/cat${folderNumber}/questions.pdf` },
                { name: `CAT ${folderNumber} Solutions.pdf`, 
                  url: `https://github.com/${githubConfig.username}/${githubConfig.repo}/blob/${githubConfig.branch}/${githubConfig.folders.cats}/cat${folderNumber}/solutions.pdf` },
                { name: `CAT ${folderNumber} Feedback.pdf`, 
                  url: `https://github.com/${githubConfig.username}/${githubConfig.repo}/blob/${githubConfig.branch}/${githubConfig.folders.cats}/cat${folderNumber}/feedback.pdf` }
            ];
            break;
            
        case 'assignments':
            sampleFiles = [
                { name: `Assignment ${folderNumber}.pdf`, 
                  url: `https://github.com/${githubConfig.username}/${githubConfig.repo}/blob/${githubConfig.branch}/${githubConfig.folders.assignments}/assignment${folderNumber}/task.pdf` },
                { name: `Solution ${folderNumber}.pdf`, 
                  url: `https://github.com/${githubConfig.username}/${githubConfig.repo}/blob/${githubConfig.branch}/${githubConfig.folders.assignments}/assignment${folderNumber}/solution.pdf` },
                { name: `Rubric ${folderNumber}.pdf`, 
                  url: `https://github.com/${githubConfig.username}/${githubConfig.repo}/blob/${githubConfig.branch}/${githubConfig.folders.assignments}/assignment${folderNumber}/rubric.pdf` }
            ];
            break;
    }
    
    // Create back button
    filesContainer.innerHTML = `
        <div class="back-button" id="back-to-folders">
            <i class="fas fa-arrow-left"></i> Back to ${tabId}
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
