document.addEventListener('DOMContentLoaded', function () {
    const publicFilesUrl = 'http://localhost:3000/public-files';  // Backend endpoint for public files
    const privateFilesUrl = 'http://localhost:3000/private-files';  // Backend endpoint for private files

    // Fetch public and private files from the backend
    async function fetchFiles() {
        try {
            // Fetch public files
            const publicResponse = await fetch(publicFilesUrl);
            const publicFiles = await publicResponse.json();
            displayFiles(publicFiles, 'Public Files');

            // Fetch private files
            const privateResponse = await fetch(privateFilesUrl);
            const privateFiles = await privateResponse.json();
            displayFiles(privateFiles, 'Private Files');
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    }

    // Display the files on the webpage
    function displayFiles(files, section) {
        const sectionContainer = document.getElementById('files-container');
        const sectionTitle = document.createElement('h3');
        sectionTitle.textContent = section;
        sectionContainer.appendChild(sectionTitle);

        files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <i class="fas fa-file-pdf file-icon"></i>
                    <div class="file-name">${file.name}</div>
                </div>
                <div class="file-actions">
                    <a href="${file.download_url}" target="_blank" title="View"><i class="fas fa-eye"></i></a>
                    <a href="${file.download_url}" download title="Download"><i class="fas fa-download"></i></a>
                </div>
            `;
            sectionContainer.appendChild(fileItem);
        });
    }

    // Fetch and display files when the page loads
    fetchFiles();
});
