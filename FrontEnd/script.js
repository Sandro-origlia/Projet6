// Affichage projet non plus par HTML  mais grace à l'API
function init() {
    getProjects().then((projects) => {
        displayGallery(projects, null);
    });

    getFilters().then((filters) => {
      displayFilters(filters)
    });
}

async function getProjects() {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
}

const gallery = document.querySelector(".gallery");

function displayGallery(projects, filterID) {
  if(filterID !== null) {
    projects = projects.filter((project)=> project.categoryId === filterID)
  }

  gallery.innerHTML = '';

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

async function getFilters() {
    const responseFilters = await fetch("http://localhost:5678/api/categories");
    return await responseFilters.json();
}

function displayFilters(filters) {
  const portfolio = document.querySelector('#portfolio');
  const gallery = document.querySelector('.gallery');

  const btnTous = document.createElement("button");
  btnTous.classList.add("btn_projects");
  btnTous.innerText = "Tous";
  btnTous.addEventListener('click', ()=> {
    getProjects().then((projects) => {
      displayGallery(projects, null);
    });
  });

  const divButtons = document.createElement("div");
  divButtons.classList.add("all-btn");

  divButtons.appendChild(btnTous);

  filters.forEach((filter) => {
    const button = document.createElement("button");
    button.classList.add("btn_projects");
    button.innerText = filter.name;
    button.addEventListener('click', ()=> {
      getProjects().then((projects) => {
        displayGallery(projects, filter.id);
      });
    })
    divButtons.appendChild(button);
  })

  portfolio.insertBefore(divButtons, gallery);
}

init();