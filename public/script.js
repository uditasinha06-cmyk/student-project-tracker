const form = document.querySelector('#project-form');
const nameInput = document.querySelector('#name');
const statusInput = document.querySelector('#status');
const projectList = document.querySelector('#project-list');
const emptyState = document.querySelector('#empty-state');

let projects = [];

function renderProjects() {
  projectList.innerHTML = '';

  if (projects.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  projects.forEach(project => {
    const li = document.createElement('li');
    li.textContent = `${project.name} - Status: ${project.status}`;
    projectList.appendChild(li);
  });
}

form.addEventListener('submit', event => {
  event.preventDefault();

  const projectName = nameInput.value.trim();
  const projectStatus = statusInput.value;

  if (!projectName) return;

  const newProject = {
    id: Date.now(),
    name: projectName,
    status: projectStatus
  };

  projects.push(newProject);
  renderProjects();
  form.reset();
});
