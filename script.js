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
            
            // Hide files and pdf viewer when switching tabs
            document.getElementById(`${tabId}-files`).style.display = 'none';
            document.getElementById(`${tabId}-pdf-viewer`).style.display = 'none';
        });
    });
    
    // Load folders for the initially active tab (NOTES)
    loadFoldersForTab('notes');
});

// Different files for each tab's folders
const tabFiles = {
    'notes': {
        'ben': [
            { name: 'Programming Fundamentals', url: 'https://github.com/userjimmy/My-resources/raw/main/notes/prog/fundamentals.pdf' }
        ],
        'jem': [
            { name: 'Data Structures', url: 'https://github.com/userjimmy/My-resources/raw/main/notes/ds/data-structures.pdf' }
        ],
        'vin': [
            { name: 'Algorithms', url: 'https://github.com/userjimmy/My-resources/raw/main/notes/algo/algorithms.pdf' }
        ],
        'mimi': [
            { name: 'Web Development', url: 'https://github.com/userjimmy/My-resources/raw/main/notes/web/web-dev.pdf' }
        ],
        'hiy': [
            { name: 'Database Systems', url: 'https://github.com/userjimmy/My-resources/raw/main/notes/db/database.pdf' }
        ],
        'six': [
            { name: 'Operating Systems', url: 'https://github.com/userjimmy/My-resources/raw/main/notes/os/os.pdf' }
        ]
    },
    'cats': {
        'ben': [
            { name: 'CAT 1 - Programming', url: 'https://github.com/userjimmy/My-resources/raw/main/cats/prog/cat1.pdf' }
        ],
        'jem': [
            { name: 'CAT 1 - Data Structures', url: 'https://github.com/userjimmy/My-resources/raw/main/cats/ds/cat1.pdf' }
        ],
        'vin': [
            { name: 'CAT 2 - Algorithms', url: 'https://github.com/userjimmy/My-resources/raw/main/cats/algo/cat2.pdf' }
        ],
        'mimi': [
            { name: 'CAT 2 - Web Dev', url: 'https://github.com/userjimmy/My-resources/raw/main/cats/web/cat2.pdf' }
        ],
        'hiy': [
            { name: 'CAT 3 - Databases', url: 'https://github.com/userjimmy/My-resources/raw/main/cats/db/cat3.pdf' }
        ],
        'six': [
            { name: 'CAT 3 - OS', url: 'https://github.com/userjimmy/My-resources/raw/main/cats/os/cat3.pdf' }
        ]
    },
    'assignments': {
        'ben': [
            { name: 'Assignment 1 - Programming', url: 'https://github.com/userjimmy/My-resources/raw/main/assignments/prog/assignment1.pdf' }
        ],
        'jem': [
            { name: 'Assignment 1 - Data Structures', url: 'https://github.com/userjimmy/My-resources/raw/main/assignments/ds/assignment1.pdf' }
        ],
        'vin': [
            { name: 'Assignment 2 - Algorithms', url: 'https://github.com/userjimmy/My-resources/raw/main/assignments/algo/assignment2.pdf' }
        ],
        'mimi': [
            { name: 'Assignment 2 - Web Dev', url: 'https://github.com/userjimmy/My-resources/raw/main/assignments/web/assignment2.pdf' }
        ],
        'hiy': [
            { name: 'Assignment 3 - Databases', url: 'https://github.com/userjimmy/My-resources/raw/main/assignments/db/assignment3.pdf' }
        ],
        'six': [
            { name: 'Assignment 3 - OS', url: 'https://github.com/userjimmy/My-resources/raw/main/assignments/os/assignment3.pdf' }
        ]
    }
};

// Load folders for a specific tab
function loadFoldersForTab(tabId) {
    const foldersContainer = document.getElementById(`${tabId}-folders`);
    foldersContainer.innerHTML = '';
    
    const folderNames = ['ben', 'jem', 'vin', 'mimi', 'hiy', 'six'];
    
    folderNames.forEach((name) => {
        const folder = document.createElement('div');
        folder.className = 'folder';
        folder.innerHTML = `
            <i class="fas fa-folder"></i>
            <div class="folder-name">${name}</div>
        `;
        
        folder.addEventListener('click', () => {
            loadFilesForFolder(tabId, name);
        });
        
        foldersContainer.appendChild(folder);
    });
}

// Load files for a specific folder
function loadFilesForFolder(tabId, folderName) {
    const filesContainer = document.getElementById(`${tabId}-files`);
    const pdfViewerContainer = document.getElementById(`${tabId}-pdf-viewer`);
    const foldersContainer = document.getElementById(`${tabId}-folders`);
    
    filesContainer.innerHTML = '<p>Loading files...</p>';
    filesContainer.style.display = 'block';
    foldersContainer.style.display = 'none';
    pdfViewerContainer.style.display = 'none';
    
    setTimeout(() => {
        let filesHTML = `
            <div class="back-button" id="back-to-folders">
                <i class="fas fa-arrow-left"></i> Back to folders
            </div>
        `;
        
        if (tabFiles[tabId] && tabFiles[tabId][folderName]) {
            tabFiles[tabId][folderName].forEach(file => {
                filesHTML += `
                    <div class="file-item">
                        <div class="file-info">
                            <i class="fas fa-file-pdf file-icon"></i>
                            <span class="file-name">${file.name}</span>
                        </div>
                    </div>
                `;
            });
        } else {
            filesHTML += '<p>No files found in this folder.</p>';
        }
        
        filesContainer.innerHTML = filesHTML;
        
        // Add event listeners to open PDF on click
        document.querySelectorAll('.file-item').forEach(item => {
            item.addEventListener('click', function() {
                const fileName = this.querySelector('.file-name').textContent;
                const file = tabFiles[tabId][folderName].find(f => f.name === fileName);
                if (file) {
                    showPdfViewer(tabId, file.url);
                }
            });
        });
        
        document.getElementById('back-to-folders').addEventListener('click', () => {
            filesContainer.style.display = 'none';
            pdfViewerContainer.style.display = 'none';
            foldersContainer.style.display = 'grid';
        });
    }, 500);
}

// Show PDF viewer when a file is clicked
function showPdfViewer(tabId, pdfUrl) {
    const filesContainer = document.getElementById(`${tabId}-files`);
    const pdfViewerContainer = document.getElementById(`${tabId}-pdf-viewer`);
    const foldersContainer = document.getElementById(`${tabId}-folders`);
    
    filesContainer.style.display = 'none';
    foldersContainer.style.display = 'none';
    
    pdfViewerContainer.innerHTML = `
        <div class="pdf-viewer-header">
            <button class="back-button" id="back-to-files">
                <i class="fas fa-arrow-left"></i> Back to files
            </button>
        </div>
        <embed class="pdf-embed" src="${pdfUrl}#toolbar=0&navpanes=0" type="application/pdf">
    `;
    
    pdfViewerContainer.style.display = 'block';
    
    document.getElementById('back-to-files').addEventListener('click', () => {
        pdfViewerContainer.style.display = 'none';
        filesContainer.style.display = 'block';
    });
}
