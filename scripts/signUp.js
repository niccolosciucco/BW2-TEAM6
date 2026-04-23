const signUp = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const modal = new bootstrap.Modal(document.querySelector(".modal"));

  if (email === "" || password === "") {
    modal.show();
  } else {
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);

    const firstP = document.getElementById("problem");
    const secondP = document.getElementById("check-input");
    const button = document.getElementById("final-button");
    const modalTitle = document.getElementById("modal-title");

    firstP.innerText = "Registration was successful";
    secondP.innerText = "Log in to start listening";
    modalTitle.innerHTML = `
    Success <i class="bi bi-patch-check"></i>`;

    modal.show();

    button.addEventListener("click", function () {
      window.location.href = "./firstPage.html";
    });
  }
};
