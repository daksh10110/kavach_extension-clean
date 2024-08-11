document.addEventListener("DOMContentLoaded", function () {
    // Check if the email is already saved in local storage
    chrome.storage.local.get('email', (data) => {
      const email = data.email;
      if (!email) {
        // Email not found in local storage, show the email input and save button
        const userEmailInput = document.getElementById("userEmailInput");
        const saveEmailButton = document.getElementById("saveEmailButton");
  
        saveEmailButton.addEventListener("click", function () {
          const email = userEmailInput.value;
          if (email) {
            chrome.runtime.sendMessage({ type: 'emailSaved', email: email });
            // Save the email to local storage
            chrome.storage.local.set({ email: email }, function () {
              if (chrome.runtime.lastError) {
                console.error('Error saving email:', chrome.runtime.lastError);
              } else {
                console.log("Email saved:", email);
                // Close the popup after saving the email
                window.close();
              }
            });
          }
        });
      } else {
        // Email already exists, close the popup immediately
        window.close();
      }
    });
  });