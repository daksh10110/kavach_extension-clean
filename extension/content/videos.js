async function sendVideoUrl(url) {
  const videoData = {
    url: url,
    page_url: window.location.href
  };
  console.log(url);

  const jsonPayload = JSON.stringify(videoData);

  try {
    const response = await fetch("http://localhost:8000/process_video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonPayload,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const processedData = await response.json();

    console.log("Video sent to server successfully!");
    if (processedData.hide === true) {
      console.log("blur: " + processedData.url);
      const blurUrl = processedData.url;

      videoElements = document.querySelectorAll("video");
      console.log(videoElements);

      videoElements.forEach((videoElement) => {
        const videoSource = videoElement.currentSrc;
        if (videoSource === blurUrl && videoElement.style.display != "none") {
          videoElement.style.display = "none"; //blocking the element done
          const messageElement = document.createElement("div");
          messageElement.textContent = "This video has obscene content";
          messageElement.style.color = "red";
          messageElement.style.fontWeight = "bold";
          messageElement.style.marginTop = "10px";

          // Append the message element after the video element
          videoElement.parentNode.insertBefore(
            messageElement,
            videoElement.nextSibling
          );
        }
      });
    }
  } catch (error) {
    console.error("Error sending video to server:", error);
  }
}

function sendAllVideo() {
  const videoUrls = [];
  const videoElements = document.getElementsByTagName("video");
  console.log(videoElements);
  for (const videoElement of videoElements) {
    console.log(videoElement);

    // let src = videoElement.src;
    let src = videoElement.currentSrc;
    if (!src) {
      if (videoElement) {
        const sourceElements = videoElement.querySelector("source");
        src = (sourceElements.getAttribute("src") || sourceElements.getAttribute("data-src"));
        
        console.log(src);
        videoUrls.push(src);
      }
    } else {
      console.log(src);
      sendVideoUrl(src)
    }
  }
}

function observeDynamicVideos() {
  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (typeof node.getElementsByTagName !== "function") {
          return;
        }
        const videoElements = node.getElementsByTagName("video");
        console.log(videoElements);

        for (const videoElement of videoElements) {
          if (videoElement) {
            console.log(videoElement.outerHTML);
            console.log(videoElement.currentSrc);

            const src = videoElement.src;
            console.log(src);

            if (!src) {
              const sourceElement = videoElement.querySelector("source");
              console.log(sourceElement);
              src = sourceElement.src;
              if (src) {
                sendVideoUrl(src);
              }
            }
          }
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}


document.addEventListener("DOMContentLoaded", async function () {
  sendAllVideo();
  observeDynamicVideos();
});