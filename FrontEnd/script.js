// Affichage projet non plus par HTML  mais grace à l'API
const gallery = document.querySelector(".gallery");
let token = "";
let modal = null;

function init() {
  getProjects().then((projects) => {
    displayGallery(projects, null, gallery);
  });

  getFilters().then((filters) => {
    displayFilters(filters);
  });

  isLogIn();
}

async function getProjects() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}

function displayGallery(projects, filterID, container, displayTrash = false) {
  if (filterID !== null) {
    projects = projects.filter((project) => project.categoryId === filterID);
  }

  container.innerHTML = "";

  projects.forEach((item) => {
    const Div = document.createElement("figure");
    const addFig = `
      <img src="${item.imageUrl}" alt="${item.title}">
      <figcaption>${item.title}</figcaption>
      `;
    Div.innerHTML = addFig;

    if (displayTrash) {
      const remove = document.createElement("i");
      remove.classList.add("fa");
      remove.classList.add("fa-trash");
      remove.addEventListener("click", () => {
        deleteProject(Div, item.id);
      });
      Div.appendChild(remove);
    } else {
      Div.setAttribute("id", "project" + item.id);
    }

    container.appendChild(Div);
  });
}

async function getFilters() {
  const responseFilters = await fetch("http://localhost:5678/api/categories");
  return await responseFilters.json();
}

function displayFilters(filters) {
  const portfolio = document.querySelector("#portfolio");
  const gallery = document.querySelector(".gallery");

  const btnTous = document.createElement("button");
  btnTous.classList.add("btn_projects");
  btnTous.innerText = "Tous";
  btnTous.addEventListener("click", () => {
    getProjects().then((projects) => {
      displayGallery(projects, null, gallery);
    });
  });

  const divButtons = document.createElement("div");
  divButtons.classList.add("all-btn");

  divButtons.appendChild(btnTous);

  filters.forEach((filter) => {
    const button = document.createElement("button");
    button.classList.add("btn_projects");
    button.innerText = filter.name;
    button.addEventListener("click", () => {
      getProjects().then((projects) => {
        displayGallery(projects, filter.id, gallery);
      });
    });
    divButtons.appendChild(button);
  });

  portfolio.insertBefore(divButtons, gallery);
}

// Gestion de la modification

function isLogIn() {
  if (localStorage.getItem("token") !== null) {
    token = JSON.parse(localStorage.getItem("token"));
    token = token.token;
    createEditElements();
  }
}

function createEditElements() {
  /* Banniere d'edition */
  const body = document.querySelector("body");
  const banner = document.createElement("div");
  banner.classList.add("banner");
  banner.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Modifier';

  body.appendChild(banner);

  /* Bouton action*/

  const editBtn = document.createElement("button");
  editBtn.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Modifier';
  editBtn.addEventListener("click", () => {
    createModal();
  });
  document.querySelector("#portfolio h2").appendChild(editBtn);
}

function createModal() {
  const body = document.querySelector("body");
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
  overlay.addEventListener("click", (e) => {
    if (e.target.classList.contains("overlay")) {
      deleteModal(overlay);
    }
  });

  modal = document.createElement("div");
  modal.classList.add("modal");

  const gallery = document.createElement("div");
  gallery.classList.add("galleryModal");
  modal.appendChild(gallery);

  /* créeer la gallery */
  getProjects().then((projects) => {
    displayGallery(projects, null, gallery, true);
  });


  const button = document.createElement('button');
  button.classList.add('add_project');
  button.innerHTML = "Ajouter une photo"

  button.addEventListener("click", () => {
    displayAddProjectModal(modal, overlay);
  });
  modal.appendChild(button);

  /* suppression de projet */
  overlay.appendChild(modal);

  /* Créer la croix */
  const croix = document.createElement("div");
  croix.classList.add("close_modal");
  croix.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  croix.addEventListener("click", () => {
    deleteModal(overlay);
  });
  overlay.appendChild(croix);
  body.appendChild(overlay);
}

function displayAddProjectModal(modal, overlay) {
  modal.innerHTML = "";
  const modalTitle = document.createElement("h1");
  modalTitle.classList.add('modalTitle')
  modalTitle.innerHTML = "Galerie photo";
  modal.appendChild(modalTitle);


  /* Créer le bouton retour */
  const back = document.createElement("div");
  back.classList.add("back");
  back.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
  back.addEventListener("click", () => {
    deleteModal(overlay)
    createModal()
  });
  modal.appendChild(back);

  /* CREER UN FORMULAIRE */
  const form = document.createElement('form');
  form.setAttribute('id', 'createProject')
  form.addEventListener('submit', (e) => {
    e.preventDefault();
  })

  const projectName = document.createElement('input')
  projectName.setAttribute('type', 'text')
  projectName.setAttribute('name', 'title')
  projectName.setAttribute('id', 'title')
  form.appendChild(projectName);


  const projectCategory = document.createElement('select')
  projectCategory.setAttribute('name', 'category')
  projectCategory.setAttribute('id', 'category')

  getFilters().then((categories) => {
    categories.forEach((categorie) => {
      const option = document.createElement('option');
      option.setAttribute('value', categorie.id);
      option.setAttribute('name', categorie.name);
      option.text = categorie.name;
      projectCategory.appendChild(option);
    })
  });


  form.appendChild(projectCategory);

  const btnAjouterPhoto = document.createElement("button");
  btnAjouterPhoto.setAttribute('type', 'submit')
  btnAjouterPhoto.classList.add("btnConnexion");
  btnAjouterPhoto.innerHTML = "Ajouter une photo";
  btnAjouterPhoto.addEventListener('click', ()=> {
    const formData = new FormData(form)
    createProject(Object.fromEntries(formData))
  });
  form.appendChild(btnAjouterPhoto);
  modal.appendChild(form);
}

function createProject(projet) {
  console.log(projet)

  fetch("/pieces/1/avis", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: projet
  });
}


function deleteModal(overlay) {
  overlay.remove();
}

async function deleteProject(modalProject, projectId) {
  const landingProject = document.querySelector("#project" + projectId);
  console.log(token);

  await fetch("http://localhost:5678/api/works/" + projectId, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    if (response.ok) {
      modalProject.remove();
      landingProject.remove();
    }
  });
}

init();
