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
  btnTous.setAttribute("autofocus", "true");
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

  /* Log out */

  const logout = document.getElementById("login");
  logout.innerHTML = "logout";

  /* Bouton action*/

  const editBtn = document.createElement("button");
  editBtn.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> modifier';
  editBtn.classList.add("editBtn");
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

  const modalTitle = document.createElement("p");
  modalTitle.classList.add("modalTitle");
  modalTitle.innerHTML = "Galerie Photo";

  const gallery = document.createElement("div");
  gallery.classList.add("galleryModal");
  modal.appendChild(gallery);

  /* créeer la gallery */
  getProjects().then((projects) => {
    displayGallery(projects, null, gallery, true);
  });

  const bordure = document.createElement("hr");
  bordure.classList.add("bordure");
  modal.appendChild(bordure);

  const button = document.createElement("button");
  button.classList.add("add_project");
  button.innerHTML = "Ajouter une photo";
  modal.appendChild(modalTitle);

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
  const modalTitle = document.createElement("p");
  modalTitle.classList.add("modalTitle");
  modalTitle.innerHTML = "Ajout photo";
  modal.appendChild(modalTitle);

  /* Créer le bouton retour */
  const back = document.createElement("div");
  back.classList.add("back");
  back.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
  back.addEventListener("click", () => {
    deleteModal(overlay);
    createModal();
  });
  modal.appendChild(back);

  /* CREER UN FORMULAIRE */
  const form = document.createElement("form");
  form.setAttribute("id", "createProject");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
  });

  const labelTitre = document.createElement("h3");
  labelTitre.classList.add("h3");
  labelTitre.innerHTML = "Titre";
  form.appendChild(labelTitre);

  //preview photo//
  const previewPhoto = document.createElement("div");
  previewPhoto.classList.add("previewPhoto")
  modal.appendChild(previewPhoto)

  const spanPhoto = document.createElement("span");
  spanPhoto.classList.add("photo_i")
  spanPhoto.innerHTML = `<i class = "fa-regular fa-image"><i>`;
  previewPhoto.appendChild(spanPhoto)

  const btnAjoutPhoto = document.createElement("div");
  btnAjoutPhoto.classList.add("btnAjoutPhotoDiv")
  previewPhoto.appendChild(btnAjoutPhoto)

  const btnAjout = document.createElement("label")
  btnAjout.classList.add("btnAjout")
  btnAjout.setAttribute('for', 'photo')
  btnAjout.innerHTML = "+ Ajouter une photo"
  btnAjoutPhoto.appendChild(btnAjout)

  const imgPreview = document.createElement('img');
  imgPreview.classList.add('preview');
  previewPhoto.appendChild(imgPreview)

  const inputPhoto = document.createElement("input")
  inputPhoto.setAttribute("type", "file")
  inputPhoto.setAttribute("name", "photo")
  inputPhoto.setAttribute("id", "photo")
  inputPhoto.classList.add("inputPhoto")
  inputPhoto.addEventListener('change', (event)=> {
    loadFile(event, imgPreview)
  })
  btnAjoutPhoto.appendChild(inputPhoto)

  const photoTaille = document.createElement("span")
  photoTaille.innerHTML = "jpg, png : 4mo max"
  photoTaille.classList.add("photoTaille")
  previewPhoto.appendChild(photoTaille)

  const projectName = document.createElement("input");
  projectName.setAttribute("type", "text");
  projectName.setAttribute("name", "title");
  projectName.setAttribute("id", "title");
  form.appendChild(projectName);

  const labelCategorie = document.createElement("h3");
  labelCategorie.classList.add("h3");
  labelCategorie.innerHTML = "Catégorie";
  form.appendChild(labelCategorie);

  const projectCategory = document.createElement("select");
  projectCategory.setAttribute("name", "category");
  projectCategory.setAttribute("id", "category");

  const bordure2 = document.createElement("hr");
  bordure2.classList.add("bordure2");
  modal.appendChild(bordure2);

  getFilters().then((categories) => {
    categories.forEach((categorie) => {
      const option = document.createElement("option");
      option.setAttribute("value", categorie.id);
      option.setAttribute("name", categorie.name);
      option.text = categorie.name;
      projectCategory.appendChild(option);
    });
  });

  form.appendChild(projectCategory);

  const btnAjouterPhoto = document.createElement("button");
  btnAjouterPhoto.setAttribute("type", "submit");
  btnAjouterPhoto.classList.add("valider");
  btnAjouterPhoto.innerHTML = "Valider";
  btnAjouterPhoto.addEventListener("click", () => {
    const name = projectName.value;
    const category = projectCategory.value;
    const photo = inputPhoto.files[0];

    if (name === '' || category === '' || photo === undefined) {
      alert('Remplissez tous les champs')
    } else {
      const formData = new FormData();
      formData.append("image", photo);
      formData.append('category', parseInt(category))
      formData.append('title', name)
      createProject(formData);
    }
  
  });
  form.appendChild(btnAjouterPhoto);
  modal.appendChild(form);
}


function createProject(projet) {
 fetch('http://localhost:5678/api/works', {
  method: 'POST',
  body: projet,
  headers: {
      'Authorization': `Bearer ${token}`
  }
})
.then(response => {
  if (response.status === 201) {
      alert('Projet Ajouté');
      window.location.href = 'index.html'
  } else {
      console.error('erreur');
  }
});
}


function deleteModal(overlay) {
  overlay.remove();
}

async function deleteProject(modalProject, projectId) {
  const landingProject = document.querySelector("#project" + projectId);

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

function loadFile(event, imagePreview) {
  const reader = new FileReader();
  reader.onload = function () {
    imagePreview.style.display = 'block'
      imagePreview.src = reader.result;
  };
  console.log(event.target.files[0])
  reader.readAsDataURL(event.target.files[0]);
}

init();