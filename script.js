// ===== Open Form when template is clicked =====
function openForm(templateId) {
  // Save template in hidden input
  document.getElementById("templateId").value = templateId;

  // Scroll down to form section
  document.querySelector(".customize-section").scrollIntoView({ behavior: "smooth" });

  // Show popup (optional)
  const popup = document.getElementById("popup");
  popup.innerText = `You selected ${templateId}. Now fill details below 👇`;
  popup.style.display = "block";
}
// ====== Global State ======
let selectedTemplate = null;

// ====== Open Form when template is clicked ======
function openForm(templateId) {
  // Save selected template
  selectedTemplate = templateId;
  document.getElementById("templateId").value = templateId;

  // Scroll to the form section
  document.querySelector(".customize-section").scrollIntoView({ behavior: "smooth" });

  // Show popup (optional)
  const popup = document.getElementById("popup");
  popup.innerText = "Template selected! Please fill details below 👇";
  popup.style.display = "block";
}

// ====== Add More Recipient Fields ======
document.getElementById("addRecipient").addEventListener("click", () => {
  const div = document.createElement("div");
  div.innerHTML = `<input type="text" name="recipient[]" placeholder="Recipient's Name" required>`;
  document.getElementById("recipients").appendChild(div);
});

// ====== Handle Form Submission ======
document.getElementById("inviteForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Collect form values
  const bride = this.bride.value;
  const groom = this.groom.value;
  const date = this.date.value;
  const venue = this.venue.value;
  const timing = this.timing.value;
  const recipients = Array.from(this.querySelectorAll('input[name="recipient[]"]')).map(i => i.value);

  const previewArea = document.getElementById("previewArea");
  previewArea.innerHTML = "";

  recipients.forEach(recipient => {
    // Create card
    const card = document.createElement("div");
    card.className = "invite-card";

    // Apply selected template background
    if (selectedTemplate) {
      card.style.backgroundImage = `url('Images/${selectedTemplate}.jpg')`;
      card.style.backgroundSize = "cover";
      card.style.backgroundPosition = "center";
      card.style.width = "500px";
      card.style.height = "700px";
      card.style.position = "relative";
      card.style.color = "#000"; // adjust text color if needed
    }

    // Add text overlays
    card.innerHTML = `
      <div class="draggable" style="position:absolute; top:20px; left:20px;">${bride} ❤ ${groom}</div>
      <div class="draggable" style="position:absolute; top:70px; left:20px;">Dear ${recipient},</div>
      <div class="draggable" style="position:absolute; top:120px; left:20px;">Date: ${date}</div>
      <div class="draggable" style="position:absolute; top:170px; left:20px;">Venue: ${venue}</div>
      <div class="draggable" style="position:absolute; top:220px; left:20px;">Time: ${timing}</div>
      <button class="downloadBtn" style="position:absolute; bottom:10px; left:10px;">Download</button>
    `;

    previewArea.appendChild(card);

    // Enable drag for text
    makeDraggable(card.querySelectorAll(".draggable"));

    // Download button
    card.querySelector(".downloadBtn").addEventListener("click", () => {
      html2canvas(card).then(canvas => {
        let link = document.createElement("a");
        link.download = `${recipient}-invitation.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    });
  });
});

// ====== Make Text Draggable ======
function makeDraggable(elements) {
  elements.forEach(el => {
    el.onmousedown = function (e) {
      let shiftX = e.clientX - el.getBoundingClientRect().left;
      let shiftY = e.clientY - el.getBoundingClientRect().top;

      function moveAt(pageX, pageY) {
        el.style.left = pageX - shiftX + "px";
        el.style.top = pageY - shiftY + "px";
      }

      function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
      }

      document.addEventListener("mousemove", onMouseMove);

      el.onmouseup = function () {
        document.removeEventListener("mousemove", onMouseMove);
        el.onmouseup = null;
      };
    };
    el.ondragstart = () => false;
  });
}

// ====== Font Customization ======
document.getElementById("fontSize").oninput = function () {
  document.querySelectorAll(".draggable").forEach(el => {
    el.style.fontSize = this.value + "px";
  });
};

document.getElementById("fontColor").oninput = function () {
  document.querySelectorAll(".draggable").forEach(el => {
    el.style.color = this.value;
  });
};

document.getElementById("fontFamily").onchange = function () {
  document.querySelectorAll(".draggable").forEach(el => {
    el.style.fontFamily = this.value;
  });
};

// ====== Share on WhatsApp ======
document.getElementById("shareBtn").onclick = function () {
  let text = Array.from(document.querySelectorAll(".draggable"))
    .map(el => el.textContent)
    .join("\n");
  let url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
};
