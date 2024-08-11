async function sendImageUrl(url) {
  const imgElements = document.querySelectorAll(`img[src="${url}"], img[data-src="${url}"]`);
  imgElements.forEach((imgElement) => {
    imgElement.style.filter = "blur(50px)";
  });

  let raw = false;
  let dir = false;
  let hostname = "";

  if (url.startsWith("http://")) {
    raw = false;
  } else if (url.startsWith("data:image/")) {
    raw = true;
    url = decodeURIComponent(url).replace(/\s/g, "");
  } else {
    dir = true;
    hostname = window.location.hostname;
}

  const imageData = {
    url: url,
    raw: raw,
    dir: dir,
    hostname: hostname,
    page_url: window.location.href
  };

  const jsonPayload = JSON.stringify(imageData);

  try {
    const response = await fetch("http://localhost:8000/process_image", {
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

    console.log("Image sent to server successfully!");
    if (processedData.blur === true) {
      imgElements.forEach((imgElement) => {
        let isImageClicked = false;
        console.log(imgElement);

        imgElement.addEventListener("click", function (event) {
          event.preventDefault();
          const parentLink = imgElement.parentNode;

          if (!isImageClicked) {
            const userResponse = window.confirm(
              "Do you want to unblur this image?"
            );
            if (userResponse) {
              imgElement.style.filter = "blur(0)";
              isImageClicked = true;
            }
          } else if (parentLink && parentLink.tagName === "A") {
            isImageClicked = false;
            window.location.href = parentLink.href;
          }
        });
      });
    } else {
      imgElements.forEach((imgElement) => {
        imgElement.style.filter = "none";
      });
    }
  } catch (error) {
    console.error("Error sending image to server:", error);
  }
}

const minSize = 2500;
async function sendAllImages() {
    const imgs = [...document.getElementsByTagName("img")];

    for (let i = 0; i < imgs.length; i++) {
        const width = imgs[i].width;
        const height = imgs[i].height;
        const imageSize = width * height;

        if (!imgs[i].hasAttribute("width") || !imgs[i].hasAttribute("height")) {
          const src = imgs[i].getAttribute("src");
    
          const dataSrc = imgs[i].getAttribute("data-src");
      
          if (dataSrc) {
            sendImageUrl(dataSrc);
          }
          if (src) {
            sendImageUrl(src);
          }
          console.log(src || imgs[i].getAttribute("data-src"));
          };

        if (imageSize >= minSize) {
            const src = imgs[i].getAttribute("src");
            const dataSrc = imgs[i].getAttribute("data-src");

            if (dataSrc) {
                sendImageUrl(dataSrc);
            }
            if (src) {
                sendImageUrl(src);
            }
        }
    }
}

function observeDynamicImages() {
  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (typeof node.getElementsByTagName !== "function") {
          return;
        }

        const images = node.getElementsByTagName("img");
        for (const img of images) {
          const dataSrc = img.getAttribute("data-src");
          const src = img.getAttribute("src");

          if (dataSrc) {
            sendImageUrl(dataSrc);
          }

          if (src) {
            sendImageUrl(src);
          }
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

document.addEventListener("DOMContentLoaded", async function () {
  sendAllImages();
  observeDynamicImages();
});
