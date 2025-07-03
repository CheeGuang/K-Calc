document.addEventListener("DOMContentLoaded", () => {
  fetch("../contactUsButton.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("contactUsButton").innerHTML = html;
      if (!window.location.pathname.includes("userMessage.html")) {
        loadChatbot();
      }
    })
    .catch((error) => console.error("Error loading contactUsButton:", error));

  initializeGoogleTranslate();
  manageTranslation();
  // Additional check for top bar
  setInterval(removeTranslateBanner, 100);
});

function loadChatbot() {
  console.log("Loading IntelliSphere Chatbot...");

  // Create and append Chatbot CSS
  const chatbotCSS = document.createElement("link");
  chatbotCSS.rel = "stylesheet";
  chatbotCSS.href = "./css/chatbot.css";
  document.head.appendChild(chatbotCSS);

  console.log("Chatbot CSS added:", chatbotCSS.href);

  // Create and append Chatbot JS
  const chatbotScript = document.createElement("script");
  chatbotScript.src = "./js/chatbot.js";
  chatbotScript.defer = true;

  chatbotScript.onload = () => {
    console.log("Chatbot script loaded successfully.");
    if (typeof initializeChatbot === "function") {
      console.log("Initializing chatbot manually...");
      initializeChatbot(); // Manually call chatbot initialization if defined
    } else {
      console.error("initializeChatbot function is not defined.");
    }
  };

  chatbotScript.onerror = () => console.error("Error loading chatbot.js.");

  document.body.appendChild(chatbotScript);
  console.log("Chatbot script added:", chatbotScript.src);
}

function signOut() {
  localStorage.removeItem("memberDetails");
  console.log("Signed out and memberDetails removed from local storage");

  showCustomAlert("Successfully Signed out.");

  // Wait for 1 second (1000 milliseconds) before redirecting
  setTimeout(function () {
    window.location.href = "../index.html";
  }, 1000);
}

function initializeGoogleTranslate() {
  window.initGoogleTranslate = function () {
    new google.translate.TranslateElement(
      {
        includedLanguages: "en,ta,ms,zh-CN",
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
      },
      "google_translate_element"
    );
  };

  const translationScript = document.createElement("script");
  translationScript.src =
    "//translate.google.com/translate_a/element.js?cb=initGoogleTranslate";
  translationScript.async = true;
  document.body.appendChild(translationScript);
}

function storeLanguagePreference() {
  document.addEventListener("DOMContentLoaded", () => {
    const languageButton = document.getElementById("languageSaveBtn");
    if (!languageButton) return;

    languageButton.addEventListener("click", () => {
      const languageDropdown = document.querySelector(".goog-te-combo");
      if (languageDropdown) {
        const chosenLanguage = languageDropdown.value;
        localStorage.setItem("preferredLanguage", chosenLanguage);
        languageDropdown.dispatchEvent(new Event("change"));
      }
    });

    const savedLanguage = localStorage.getItem("preferredLanguage");
    if (savedLanguage) {
      setTimeout(() => {
        const languageDropdown = document.querySelector(".goog-te-combo");
        if (languageDropdown) {
          languageDropdown.value = savedLanguage;
          languageDropdown.dispatchEvent(new Event("change"));
        }
      }, 2000);
    }
  });
}

function removeTranslateBanner() {
  const bannerFrame = document.querySelector(".goog-te-banner-frame");
  if (bannerFrame) {
    bannerFrame.style.visibility = "hidden";
    bannerFrame.style.display = "none";
    document.body.style.top = "0px";
  }
}

function manageTranslation() {
  const currentPage = window.location.pathname;
  const validPages = ["memberAccount.html", "adminAccount.html"];

  if (!validPages.some((page) => currentPage.includes(page))) {
    console.log("Translation feature is disabled on this page.");
    return;
  }

  const observer = new MutationObserver(() => {
    removeTranslateBanner();

    const languageSelector = document.querySelector("#languageDropdown");
    if (languageSelector && !languageSelector.dataset.listenerAdded) {
      languageSelector.dataset.listenerAdded = "true";

      languageSelector.addEventListener("change", (event) => {
        const selectedLang = event.target.value;
        if (selectedLang) {
          localStorage.setItem("preferredLanguage", selectedLang);
          setTimeout(removeTranslateBanner, 100);
        }
      });

      const storedLang = localStorage.getItem("preferredLanguage");
      if (storedLang && storedLang !== "en") {
        languageSelector.value = storedLang;
        languageSelector.dispatchEvent(new Event("change"));
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style", "class"],
  });
}
