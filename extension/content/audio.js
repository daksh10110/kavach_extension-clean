async function sendAudioUrl(url, audioElement) {
  // Disable audio controls to prevent playing

  const audioData = {
    url: url,
    page_url: window.location.href
  };

  const jsonPayload = JSON.stringify(audioData);

  try {
    audioElement.controls = false;

    const processingMessage = document.createElement("p");
    processingMessage.textContent = "Processing...";
    audioElement.parentNode.insertBefore(processingMessage, audioElement.nextSibling);

    // Check for obscenity
    const response = await fetch("http://localhost:8000/process_audio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonPayload,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();

    processingMessage.parentNode.removeChild(processingMessage);

    if (result.obscene === true) {
      // Enable user option to regain control
      const regainControlButton = document.createElement("button");
      regainControlButton.textContent = "Regain Control";
      audioElement.parentNode.insertBefore(regainControlButton, audioElement.nextSibling);

      regainControlButton.addEventListener("click", function () {
        audioElement.controls = true;
        audioElement.parentNode.removeChild(regainControlButton);
      });
    } else {
      // Enable audio controls to allow playing
      audioElement.controls = true;
    }
  } catch (error) {
    console.error("Error checking obscenity:", error);
  }
}

async function sendAllAudio() {
  const audios = [...document.getElementsByTagName("audio")];

  for (const audio of audios) {
    const src = audio.getAttribute("src");
    if (src) {
      sendAudioUrl(src, audio);
    }
  }
}

function observeDynamicAudio() {
  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (typeof node.getElementsByTagName !== "function") {
          return;
        }

        const audios = node.getElementsByTagName("audio");
        for (const audio of audios) {
          const src = audio.getAttribute("src");
          if (src) {
            sendAudioUrl(src, audio);
          }
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

document.addEventListener("DOMContentLoaded", async function () {
  sendAllAudio();
  observeDynamicAudio();
});
