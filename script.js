// script.js

const githubUsername = "yourusername"; // Replace with your GitHub username
const repoName = "yourrepo"; // Replace with your repo name

const sections = {
  NOTES: ["folder1", "folder2", "folder3", "folder4", "folder5", "folder6"],
  CATs: ["folder1", "folder2", "folder3", "folder4", "folder5", "folder6"],
  ASSIGNMENTS: ["folder1", "folder2", "folder3", "folder4", "folder5", "folder6"],
};

function loadSection(section) {
  document.getElementById("sectionTitle").textContent = section;
  const foldersContainer = document.getElementById("folders");
  foldersContainer.innerHTML = "Loading...";

  const folderNames = sections[section];
  foldersContainer.innerHTML = "";

  folderNames.forEach(folder => {
    const apiURL = `https://api.github.com/repos/${githubUsername}/${repoName}/contents/${section}/${folder}`;

    fetch(apiURL)
      .then(res => res.json())
      .then(files => {
        const folderDiv = document.createElement("div");
        folderDiv.className = "folder";
        folderDiv.innerHTML = `<h3>${folder}</h3><ul></ul>`;
        const ul = folderDiv.querySelector("ul");

        files.forEach(file => {
          if (file.name.endsWith(".pdf")) {
            const li = document.createElement("li");
            li.innerHTML = `<a href="${file.download_url}" target="_blank">${file.name}</a>`;
            ul.appendChild(li);
          }
        });

        foldersContainer.appendChild(folderDiv);
      })
      .catch(err => {
        const errorDiv = document.createElement("div");
        errorDiv.className = "folder";
        errorDiv.innerHTML = `<h3>${folder}</h3><p>Failed to load files</p>`;
        foldersContainer.appendChild(errorDiv);
      });
  });
}
