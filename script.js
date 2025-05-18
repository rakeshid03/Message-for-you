// Logo Animation 
window.onload = () => {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  var text = document.querySelector("#shareBtn");
  let i = 0,
    interval = setInterval(() => {
      text.innerText = text.dataset.value
        .split("")
        .map((l, idx) => idx < i ? l : letters[Math.random() * 26 | 0])
        .join("");
      if (i >= text.dataset.value.length) clearInterval(interval);
      i += 0.5;
    }, 35);
};

//--- Share image---
shareBtn.onclick = () => {
  const m = document.querySelector(".Current-message");
  html2canvas(m, { scale: 4, backgroundColor: null }).then(c => {
    const p = 80, b = 10, t = "Shared from 'MESSAGE FOR YOU'";
    const W = c.width + b * 2, H = c.height + p * 2 + 40;
    const n = Object.assign(document.createElement("canvas"), { width: W, height: H });
    const x = n.getContext("2d");

    x.fillStyle = getComputedStyle(document.body).backgroundColor || "#fff";
    x.fillRect(0, 0, W, H);
    x.strokeStyle = "#ccc";
    x.lineWidth = b;
    x.strokeRect(0, 0, W, H);
    x.drawImage(c, b, p);
    x.font = "16px Arial";
    x.fillStyle = "#999";
    x.textAlign = "center";
    x.fillText(t, W / 2, H - 20);

    n.toBlob(blob => {
      const f = new File([blob], "message.png", { type: "image/png" });
      navigator.canShare?.({ files: [f] })
        ? navigator.share({ files: [f], title: "Message For You", text: "A message worth sharing!" })
        : alert("Sharing not supported on this browser.");
    });
  });
};

const gun = Gun(),user = gun.user();
const form = document.querySelector("form"), box = document.getElementById("massagebox"), output = document.querySelector(".Current-message");

// Auto-authenticate
const username = "demoUser", password = "securePassword123";
user.create(username, password, () => user.auth(username, password, setupMessaging));

// Sanitizer to block XSS
function sanitize(input) {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
}

// Message system encryption & validation
function setupMessaging() {
  const messages = user.get("messages");
  // Submit handler
  form.onsubmit = async (e) => {
    e.preventDefault();
    const rawMsg = box.value.trim();
    const msg = sanitize(rawMsg);
    // Validate input
    if (!msg || msg.length > 500) return alert("Invalid message.");
    const encrypted = await Gun.SEA.encrypt(msg, user._.sea);
    messages.set({
      text: encrypted,
    });
    box.value = "";
  };
  
  // Display messages (decrypt & sanitize)
  messages.map().on(async (data) => {
    if (data && data.text) {
      try {
        const decrypted = await Gun.SEA.decrypt(data.text, user._.sea);
        if (decrypted) {
          output.innerHTML = sanitize(decrypted);
        }
      } catch (err) {
        console.warn("Decryption failed", err);
      }
    }
  });
}
