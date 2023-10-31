// Affichage projet non plus par HTML  mais grace à l'API
{function init() {
  getProjects().then((projects) => {
    displayGallery(projects);
  });
}
async function getProjects() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}

const gallery = document.querySelector(".gallery");

function displayGallery(projects) {
  projects.forEach((item) => {
    const Div = document.createElement("figure");
    const addFig = `
        <img src="${item.imageUrl}" alt="${item.title}">
        <figcaption>${item.title}</figcaption>
        `;

    Div.innerHTML = addFig;
    gallery.appendChild(Div);
  });
}

init();

// Création Filtres

function init2() {
  getFilters().then((id) => {
    filterCategory(id);
  });
}

async function getFilters() {
  const responseFilters = await fetch("http://localhost:5678/api/categories");
  const categories = await responseFilters.json();

  console.log(categories);

  const btnTous = document.createElement("button");
  btnTous.classList.add("btn_projects");

  btnTous.innerText = "Tous";

  const divButtons = document.createElement("div");
  divButtons.classList.add("all-btn");

  divButtons.appendChild(btnTous);


init2();

}} ;