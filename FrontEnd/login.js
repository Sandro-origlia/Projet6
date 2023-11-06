const form = document.querySelector("form");
const error = document.querySelector("#msgError");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const getForm = new FormData(form);
  const objForm = Object.fromEntries(getForm);
  setForm(objForm);
});

const setForm = async (form) => {
  try {
    const requete = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (requete.ok) {
      error.style.display = "none";
      getToken(requete);
      location.href = "http://127.0.0.1:5500/FrontEnd/";
    } else {
      error.classList.add("error");
      error.textContent = "Erreur dans l’identifiant ou le mot de passe";
    }
  } catch (e) {
    console.log(e);
  }
};

const getToken = async (response) => {
  try {
    const body = await response.json();
    localStorage.setItem("token", JSON.stringify(body));
  } catch (e) {
    console.log(e);
  }
};
