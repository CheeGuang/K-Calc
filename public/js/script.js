// attach event listener after the DOM loads
document.addEventListener("DOMContentLoaded", function () {
  const homeLink = document.querySelector("#get-started-button");
  if (homeLink) {
    homeLink.addEventListener("click", function (e) {
      e.preventDefault(); // stop default navigation
      showCustomAlert("Helloworld", "home.html");
    });
  }
});
