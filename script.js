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