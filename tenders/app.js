// Navigation between placeholder pages
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("visible"));
  document.getElementById(id).classList.add("visible");
}

// Fake login for testing UI flow
function fakeLogin() {
  document.getElementById("loginStatus").innerText =
    "Login simulated — replace with Firebase Auth later.";
}

// Fake upload action for testing UI
function selectFile() {
  const fileInput = document.getElementById("fileInput");
  if (!fileInput.files.length) {
    document.getElementById("uploadStatus").innerText = "No file selected!";
    return;
  }

  const file = fileInput.files[0];

  document.getElementById("uploadStatus").innerText =
    `Pretending to upload: ${file.name} (real upload will use Firebase Storage).`;
}
