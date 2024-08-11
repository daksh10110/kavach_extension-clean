// options.js
document.getElementById("blockWebsiteForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const websiteInput = document.getElementById("websiteInput");
  const website = websiteInput.value.trim();
  if (website) {
    chrome.runtime.sendMessage({ action: "addBlockedWebsite", website }, (response) => {
      if (response.success) {
        showMessage(`Website ${website} has been added to the blocked list.`);
      } else {
        showMessage(response.message);  
      }
    });
  }
});

document.getElementById("unblockWebsiteForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const websiteInput = document.getElementById("unblockWebsiteInput");
  const website = websiteInput.value.trim();
  if (website) {
    chrome.runtime.sendMessage({ action: "removeBlockedWebsite", website }, (response) => {
      if (response.success) {
        showMessage(`Website ${website} has been unblocked.`);
      } else {
        showMessage(response.message);
      }
    });
  }
});

document.getElementById("editBlocklistButton").addEventListener("click", () => {
  const editBlocklistContainer = document.getElementById("editBlocklistContainer");
  editBlocklistContainer.style.display = "block";
  const reportContainer = document.getElementById("reportContainer");
  reportContainer.style.display = "none";
});

document.getElementById("reportButton").addEventListener("click", () => {
  const reportContainer = document.getElementById("reportContainer");
  reportContainer.style.display = "block";
  const editBlocklistContainer = document.getElementById("editBlocklistContainer");
  editBlocklistContainer.style.display = "none";
});

function showMessage(message) {
  const messageDiv = document.getElementById("message");
  messageDiv.textContent = message;
  setTimeout(() => {
    messageDiv.textContent = "";
  }, 3000);
}
