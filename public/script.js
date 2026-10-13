const form = document.querySelector('#project-form');
const nameInput = document.querySelector('#name');
const statusInput = document.querySelector('#status');
const projectList = document.querySelector('#project-list');
const emptyState = document.querySelector('#empty-state');
const saveButton = document.querySelector('#save-button');
const cancelButton = document.querySelector('#cancel-button');
const messageBox = document.querySelector('#message');

let projects = [];
let editingId = null;

async function loadProjects() {
  try {
    messageBox.textContent = 'Loading projects...';
    const response = await fetch('/api/projects');
    if (!response.ok) {
      throw new Error(`Failed to load projects (HTTP ${response.status})`);
    }
    const data = await response.json();
    if (Array.isArray(data)) {
      projects = data;
      messageBox.textContent = '';
    } else {
      projects = [];
      messageBox.textContent = 'Received invalid data from server.';
    }
  } catch (error) {
    projects = [];
    messageBox.textContent = error.message || 'Network error while loading projects.';
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
      messageBox.textContent = '';
    });

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    deleteButton.style.marginLeft = '0.5rem';
    deleteButton.addEventListener('click', async () => {
      const confirmed = window.confirm(`Are you sure you want to delete "${project.name}"?`);
      if (!confirmed) return;

      try {
        messageBox.textContent = 'Deleting project...';
        const response = await fetch(`/api/projects/${project.id}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error(`Failed to delete project (HTTP ${response.status})`);
        }

        if (editingId === project.id) {
          resetFormTooltip();
        }

        await loadProjects();
        renderProjects();
        messageBox.textContent = 'Project deleted successfully.';
      } catch (error) {
        messageBox.textContent = error.message || 'Network error while deleting project.';
      }
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

form.addEventListener('submit', async event => {
  event.preventDefault();

  const projectName = nameInput.value.trim();
  const projectStatus = statusInput.value;

  if (!projectName) return;

  try {
    if (editingId !== null) {
      messageBox.textContent = 'Saving changes...';
      const response = await fetch(`/api/projects/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: projectName, status: projectStatus })
      });

      if (!response.ok) {
        throw new Error(`Failed to update project (HTTP ${response.status})`);
      }

      messageBox.textContent = 'Project updated successfully.';
    } else {
      messageBox.textContent = 'Saving new project...';
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: projectName, status: projectStatus })
      });

      if (!response.ok) {
        throw new Error(`Failed to create project (HTTP ${response.status})`);
      }

      messageBox.textContent = 'Project created successfully.';
    }

    resetFormTooltip();
    await loadProjects();
    renderProjects();
  } catch (error) {
    messageBox.textContent = error.message || 'Network error during save operation.';
  }
});

cancelButton.addEventListener('click', () => {
  resetFormTooltip();
  messageBox.textContent = '';
});

// Initial load on page start
(async function init() {
  await loadProjects();
  renderProjects();
})();