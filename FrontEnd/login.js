const form = document.querySelector("form");
const error = document.querySelector("#msgError");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const getForm = new FormData(form);
  const objForm = Object.fromEntries(getForm);
  setForm(objForm).then((requete) => {
    if (requete.ok) {
      error.style.display = "none";
      getToken(requete).then((body)=> {
        localStorage.setItem("token", JSON.stringify(body));

      });
      location.href = "index.html";
    } else {
      error.classList.add("error");
      error.textContent = "Erreur dans l’identifiant ou le mot de passe";
    }
  });
});

const setForm = async (form) => {
  return await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    body: JSON.stringify(form),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const getToken = async (response) => {
  return await response.json();
};

function checkLogin() {
  if(localStorage.getItem('token') !== null) {
    localStorage.removeItem('token');
    error.textContent = "Vous avez été déconnecté";
  }
}

checkLogin();