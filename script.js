//--- share image
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

firebase.initializeApp({
  apiKey: "AIzaSyAuFivX_KHL7JyYoeK5u6BvNPNbPaMTpYU",
  authDomain: "leave-a-message-376f3.firebaseapp.com",
  databaseURL: "https://leave-a-message-376f3-default-rtdb.firebaseio.com",
  projectId: "leave-a-message-376f3",
  storageBucket: "leave-a-message-376f3.appspot.com",
  messagingSenderId: "1012538891297",
  appId: "1:1012538891297:web:12d8bc8aa5a887e1299760"
});

const db = firebase.database();
const form = document.querySelector("form");
const box = document.getElementById("massagebox");
const output = document.querySelector(".Current-message");

form.onsubmit = e => {
  e.preventDefault();
  const msg = box.value.trim();
  if (msg) {
    db.ref("latestMessage").set({ text: msg, timestamp: Date.now() });
    box.value = "";
  }
};

db.ref("latestMessage").on("value", snap => {
  const data = snap.val();
  if (data) output.textContent = `"${data.text}"`;
});
