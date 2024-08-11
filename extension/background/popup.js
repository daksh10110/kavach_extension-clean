// // popup.js
// document.getElementById("blockWebsiteForm").addEventListener("submit", (event) => {
//   event.preventDefault();
//   const blockWebsiteInput = document.getElementById("blockWebsiteInput");
//   const websiteToBlock = blockWebsiteInput.value.trim();
//   if (websiteToBlock) {
//     chrome.runtime.sendMessage({ action: "addBlockedWebsite", website: websiteToBlock }, (response) => {
//       if (response.success) {
//         showBlockMessage(`Website ${websiteToBlock} has been added to the blocked list.`);
//       } else {
//         showBlockMessage(response.message);
//       }
//     });
//   }  
// });

// document.getElementById("unblockWebsiteForm").addEventListener("submit", (event) => {
//   event.preventDefault();
//   const unblockWebsiteInput = document.getElementById("unblockWebsiteInput");
//   const websiteToUnblock = unblockWebsiteInput.value.trim();
//   if (websiteToUnblock) {
//     chrome.runtime.sendMessage({ action: "removeBlockedWebsite", website: websiteToUnblock }, (response) => {
//       if (response.success) {
//         showUnblockMessage(`Website ${websiteToUnblock} has been removed from the blocked list.`);
//       } else {
//         showUnblockMessage(response.message);
//       }
//     });
//   }
// });

// function showBlockMessage(message) {
//   const blockMessageDiv = document.getElementById("blockMessage");
//   blockMessageDiv.textContent = message;
//   setTimeout(() => {
//     blockMessageDiv.textContent = "";
//   }, 3000);
// }

// function showUnblockMessage(message) {
//   const unblockMessageDiv = document.getElementById("unblockMessage");
//   unblockMessageDiv.textContent = message;
//   setTimeout(() => {
//     unblockMessageDiv.textContent = "";
//   }, 3000);
// }

// // Add a click event listener for the extension icon
// chrome.action.onClicked.addListener(() => {
//   chrome.windows.create({
//     url: "popup.html",
//     type: "popup",
//     width: 400,
//     height: 300,
//   });
// });
