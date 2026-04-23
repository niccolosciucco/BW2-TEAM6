const login = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const modal = new bootstrap.Modal(document.querySelector(".modal"));

  if (email === "" || password === "") {
    modal.show();
  } else {
    const firstP = document.getElementById("problem");
    const secondP = document.getElementById("check-input");
    const button = document.getElementById("final-button");
    const modalTitle = document.getElementById("modal-title");

    const emailLocalStorage = localStorage.getItem("email");
    const passwordLocalStorage = localStorage.getItem("password");

    if (email === "" || password === "") {
      modal.show();
    } else if (email != emailLocalStorage || password != passwordLocalStorage) {
      firstP.innerText = "Invalid email or password";
      secondP.innerText = "Please check your credentials and try again.";
      modalTitle.innerHTML = `
    Login Failed <i class="bi bi-exclamation-circle-fill text-danger"></i>`;
      modal.show();
    } else {
      firstP.innerText = "Log In was successful";
      secondP.innerText = "Start listening";
      modalTitle.innerHTML = `
        Success <i class="bi bi-patch-check"></i>`;

      modal.show();

      button.addEventListener("click", function () {
        window.location.href = "./home-page.html";
      });
    }
  }
};
