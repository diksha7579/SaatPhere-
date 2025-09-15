const params = new URLSearchParams(window.location.search);
const templateId = params.get("template");
document.getElementById("templateId").value = templateId;

const previewContainer = document.getElementById("previewContainer");
const form = document.getElementById("inviteForm");

const textPositions = {};

const templateBackgrounds = {
  ganeshpuja1: "Images/ganeshpuja2.png",
  ganeshpuja2: "Images/ganeshpuja2.png",
  ganeshpuja3: "Images/ganeshpuja3.jpg",
  engagement1: "Images/engagement1.jpg",
  engagement2: "Images/engagement3.jpg",
  engagement3: "Images/engagement2.jpg",
  haldi1: "Images/haldi1.jpg",
  haldi2: "Images/haldi2.jpg",
  haldi3: "Images/haldi3.jpg",
  sangeet1: "Images/Sangeet1.jpg",
  sangeet2: "Images/Sangeet2.jpg",
  sangeet3: "Images/Sangeet3.png",
  mehndi1: "Images/mehndi1.jpg",
  mehndi2: "Images/mehndi2.jpg",
  mehndi3: "Images/mehndi3.jpg",
  wedding1: "Images/wedding1.png",
  wedding2: "Images/wedding2.jpg",
  wedding3: "Images/wedding3.jpg",
  reception1: "Images/reception1.jpg",
  reception2: "Images/reception2.png",
  reception3: "Images/reception3.jpg"
};

document.getElementById("addRecipient").addEventListener("click", () => {
  const div = document.createElement("div");
  div.innerHTML = `<input type="text" name="recipient[]" placeholder="Recipient's Name">`;
  document.getElementById("recipients").appendChild(div);
});

function generatePreviews() {
  const bride = form.bride.value || "";
  const groom = form.groom.value || "";
  const date = form.date.value || "";
  const venue = form.venue.value || "";
  const timing = form.timing.value || "";
  const fontSize = document.getElementById("fontSize").value || "24";
  const fontColor = document.getElementById("fontColor").value || "#333";
  const fontFamily = document.getElementById("fontFamily").value || "Poppins";

  const recipients = [...form.querySelectorAll("input[name='recipient[]']")]
    .map(r => r.value.trim())
    .filter(v => v !== "");

  previewContainer.innerHTML = "";

  if (!templateId || !templateBackgrounds[templateId]) return;

  const img = new Image();
  img.src = templateBackgrounds[templateId];
  img.onload = () => {
    recipients.forEach((name, index) => {
      const card = document.createElement("div");
      card.className = "preview-area";
      card.style.position = "relative";
      card.style.marginBottom = "30px";
      card.style.width = img.naturalWidth + "px";
      card.style.height = img.naturalHeight + "px";
      card.style.backgroundImage = `url('${img.src}')`;
      card.style.backgroundSize = "contain";
      card.style.backgroundRepeat = "no-repeat";
      card.style.backgroundPosition = "center";

      const text = document.createElement("div");
      text.className = "preview-text";
      text.setAttribute("data-recipient", name);
      text.style.position = "absolute";
      text.style.top = "50%";
      text.style.left = "50%";
      text.style.transform = "translate(-50%, -50%)";
      text.style.textAlign = "center";
      text.style.padding = "20px";
      text.style.fontSize = fontSize + "px";
      text.style.color = fontColor;
      text.style.fontFamily = fontFamily;
      text.style.cursor = "move";
      text.style.maxWidth = "90%";
      text.style.wordBreak = "break-word";

      // Restore dragged position if available
      if (textPositions[name]) {
        text.style.left = textPositions[name].left;
        text.style.top = textPositions[name].top;
        text.style.transform = "none";
      }

      text.innerHTML = `
        <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          <h2 style="margin:0;">${bride} ❤️ ${groom}</h2>
        </div>
        <p>You are warmly invited to the celebration</p>
        ${date ? `<p><b>Date:</b> ${date}</p>` : ""}
        ${timing ? `<p><b>Time:</b> ${timing}</p>` : ""}
        ${venue ? `<p><b>Venue:</b> ${venue}</p>` : ""}
        <p><b>Guest:</b> ${name}</p>
      `;

      enableDrag(text);
      card.appendChild(text);
      previewContainer.appendChild(card);
    });
  };
}

function enableDrag(textElement) {
  let isDragging = false;
  let offsetX, offsetY;

  textElement.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - textElement.getBoundingClientRect().left;
    offsetY = e.clientY - textElement.getBoundingClientRect().top;
    textElement.style.cursor = "grabbing";
    textElement.style.transform = "none";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const parent = textElement.parentElement.getBoundingClientRect();
    let newX = e.clientX - parent.left - offsetX;
    let newY = e.clientY - parent.top - offsetY;

    newX = Math.max(0, Math.min(newX, parent.width - textElement.offsetWidth));
    newY = Math.max(0, Math.min(newY, parent.height - textElement.offsetHeight));

    textElement.style.left = newX + "px";
    textElement.style.top = newY + "px";

    const recipientName = textElement.getAttribute("data-recipient");
    if (recipientName) {
      textPositions[recipientName] = {
        left: textElement.style.left,
        top: textElement.style.top
      };
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    textElement.style.cursor = "move";
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  generatePreviews();
  document.getElementById("popup").style.display = "block";
});

function applyFontStyles() {
  const fontSize = document.getElementById("fontSize").value + "px";
  const fontColor = document.getElementById("fontColor").value;
  const fontFamily = document.getElementById("fontFamily").value;

  document.querySelectorAll(".preview-text").forEach(text => {
    text.style.fontSize = fontSize;
    text.style.color = fontColor;
    text.style.fontFamily = fontFamily;
  });
}

document.getElementById("fontSize").addEventListener("input", applyFontStyles);
document.getElementById("fontColor").addEventListener("input", applyFontStyles);
document.getElementById("fontFamily").addEventListener("change", applyFontStyles);

document.getElementById("downloadBtn").addEventListener("click", () => {
  const cards = document.querySelectorAll(".preview-area");
  cards.forEach((card, index) => {
    html2canvas(card).then(canvas => {
      const link = document.createElement("a");
      link.download = `invitation_${index + 1}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  });
});

document.getElementById("shareBtn").addEventListener("click", () => {
  const text = encodeURIComponent("Here’s our wedding invitation ❤️");
  window.open(`https://wa.me/?text=${text}`, "_blank");
});

window.addEventListener("DOMContentLoaded", () => {
  const hasTemplate = templateId && templateBackgrounds[templateId];
  if (hasTemplate) {
    generatePreviews();
  }

});
