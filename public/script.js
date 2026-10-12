const form = document.querySelector('#project-form');
const nameInput = document.querySelector('#name');
const statusInput = document.querySelector('#status');
const projectList = document.querySelector('#project-list');
const emptyState = document.querySelector('#empty-state');
const saveButton = document.querySelector('#save-button');
const cancelButton = document.querySelector('#cancel-button');
const messageBox = document.querySelector('#message');

const STORAGE_KEY = 'workshop-projects-v1';

let projects = [];
let editingId = null;

function loadProjects() {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) {
      projects = [];
      return;
    }
    const parsed = JSON.parse(storedData);
    if (Array.isArray(parsed)) {
      projects = parsed;
    } else {
      projects = [];
      if (messageBox) messageBox.textContent = 'Stored data was invalid. Starting with an empty list.';
    }
  } catch (error) {
    projects = [];
    if (messageBox) messageBox.textContent = 'Could not load saved projects due to a storage error.';
  }
}

function saveProjects() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    if (messageBox) messageBox.textContent = 'Changes could not be saved to storage.';
  }
}

function renderProjects() {
  projectList.innerHTML = '';

  if (projects.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  projects.forEach(project => {
    const li = document.createElement('li');
    li.textContent = `${project.name} - Status: ${project.status} `;

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.textContent = 'Edit';
    editButton.style.marginLeft = '1rem';
    editButton.addEventListener('click', () => {
      editingId = project.id;
      nameInput.value = project.name;
      statusInput.value = project.status;
      saveButton.textContent = 'Save Changes';
      cancelButton.style.display = 'inline-block';
    });

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    deleteButton.style.marginLeft = '0.5rem';
    deleteButton.addEventListener('click', () => {
      const confirmed = window.confirm(`Are you sure you want to delete "${project.name}"?`);
      if (!confirmed) return;

      projects = projects.filter(p => p.id !== project.id);
      saveProjects();

      if (editingId === project.id) {
        resetFormTooltip();
      }

      renderProjects();
    });

    li.appendChild(editButton);
    li.appendChild(deleteButton);
    projectList.appendChild(li);
  });
}

function resetFormTooltip() {
  editingId = null;
  form.reset();
  saveButton.textContent = 'Save Project';
  cancelButton.style.display = 'none';
}

form.addEventListener('submit', event => {
  event.preventDefault();

  const projectName = nameInput.value.trim();
  const projectStatus = statusInput.value;

  if (!projectName) return;

  if (editingId !== null) {
    const project = projects.find(p => p.id === editingId);
    if (project) {
      project.name = projectName;
      project.status = projectStatus;
    }
  } else {
    const newProject = {
      id: Date.now(),
      name: projectName,
      status: projectStatus
    };
    projects.push(newProject);
  }

  saveProjects();
  renderProjects();
  resetFormTooltip();
});

cancelButton.addEventListener('click', () => {
  resetFormTooltip();
});

// Initial load on page start
loadProjects();
renderProjects();