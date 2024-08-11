// Function to handle navigation when clicking on sidebar links
function handleNavigation(event) {
  const pageId = event.target.getAttribute("data-page");
  if (pageId) {
    navigateTo(pageId);
  }
}

// Function to navigate to the specified page and hide other content
function navigateTo(pageId) {
  const contents = document.querySelectorAll(".content");
  contents.forEach((content) => {
    if (content.id === pageId) {
      content.style.display = "block";
    } else {
      content.style.display = "none";
    }
  });
}

// Attach event listener to the sidebar links
const sidebarLinks = document.querySelectorAll(".sidebar a");
sidebarLinks.forEach((link) => {
  link.addEventListener("click", handleNavigation);
});

// Initially display the first page (Images)
navigateTo("imagePage");

// Function to create content grid based on the content type
function createContentGrid(gridId, type, contentSize, limit = 16) {
  const contentGrid = document.getElementById(gridId);
  contentGrid.innerHTML = ""; // Clear the previous content (if any)

  for (let i = 1; i <= limit; i++) {
    const content = document.createElement(
      type === "Image" ? "img" : type.toLowerCase()
    );
    content.src =
      type === "Image"
        ? `https://picsum.photos/seed/${i}/${contentSize.width}/${contentSize.height}`
        : "";
    content.alt = `${type} ${i}`;

    if (type === "Video" || type === "Audio") {
      content.controls = true;
      content.src =
        type === "Video" ? getRandomVideoUrl() : getRandomAudioUrl();
    } else if (type === "Text") {
      const textContainer = document.createElement("div");
      textContainer.classList.add("text-segment");
      const textContent = document.createElement("p");
      textContent.textContent = generateRandomText(); // Generate random text for the text content
      textContainer.appendChild(textContent);
      contentGrid.appendChild(textContainer);
      continue; // Skip the rest of the loop
    }

    contentGrid.appendChild(content);

    if (type === "Video" && i % 3 === 0) {
      const nextPageBreak = document.createElement("div");
      nextPageBreak.classList.add("next-page-break");
      contentGrid.appendChild(nextPageBreak);
    }
  }
}

// Function to generate random text
function generateRandomText() {
  const loremIpsum =
    "Lorem ipsum dolor sit amet, consectetur adipiscing fuck, sed do eiusmod tempor incididunt ut shit et dolore magna aliqua.";
  const ipsumWords = loremIpsum.split(" ");
  const randomText = [];
  const maxWords = 50; // Adjust the maximum number of words for each text element

  for (let i = 0; i < maxWords; i++) {
    const randomIndex = Math.floor(Math.random() * ipsumWords.length);
    randomText.push(ipsumWords[randomIndex]);
  }

  return randomText.join(" ");
}

// Function to get a random video URL
function getRandomVideoUrl() {
  const videoUrls = [
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    // Add more video URLs as needed
  ];
  const randomIndex = Math.floor(Math.random() * videoUrls.length);
  return videoUrls[randomIndex];
}

// Function to get a random audio URL
function getRandomAudioUrl() {
  const audioUrls = [
    "https://cdn.discordapp.com/attachments/1090917514596323388/1138723712150020126/voice-message.ogg",
    "https://cdn.discordapp.com/attachments/1090917514596323388/1138731870939533362/voice-message.ogg",
    "https://cdn.discordapp.com/attachments/1090917514596323388/1138731891105734756/voice-message.ogg"
    // Add more audio URLs as needed
  ];
  const randomIndex = Math.floor(Math.random() * audioUrls.length);
  return audioUrls[randomIndex];
}

// Dynamically create image grid with 4 images per row
createContentGrid("imageGrid", "Image", { width: 200, height: 300 }, 32);

// Dynamically create video grid with 2 videos per row
createContentGrid("videoGrid", "Video", { width: 400, height: 300 }, 10); // Set limit to 10 videos

// Dynamically create audio grid with 2 audio elements per row
createContentGrid("audioGrid", "Audio", { width: 400, height: 80 }, 16);

// Dynamically create text grid with 2 text elements per row
createContentGrid("textGrid", "Text", { width: 400, height: 200 }, 16);
