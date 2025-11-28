// =========================
// ELEMENT LOGIN / REGISTER
// =========================
const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');
const emailInput = document.getElementById('email');
const passInput = document.getElementById('password');
const btnLogin = document.getElementById('btn-login');
const btnRegister = document.getElementById('btn-register');
const btnLogout = document.getElementById('btn-logout');

const userEmailSpan = document.getElementById('user-email');


// =========================
// MENU TITIK TIGA (SIDEBAR)
// =========================
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const menuBtn = document.getElementById("menu-btn");
const closeBtn = document.getElementById("close-btn");

menuBtn.onclick = () => {
  sidebar.classList.add("open");
  overlay.classList.add("show");
};

closeBtn.onclick = () => {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
};

overlay.onclick = () => {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
};


// =========================
// LOGIN LISTENER
// =========================
const userNameEl = document.getElementById("user-name");
const userPhotoEl = document.getElementById("user-photo");

auth.onAuthStateChanged(user => {
  if (user) {
    authSection.classList.add("hidden");    // sembunyikan login
    appSection.classList.remove("hidden");  // tampilkan dashboard
  } else {
    authSection.classList.remove("hidden"); 
    appSection.classList.add("hidden");    
  }
});

    // Tampilkan email
    userEmailSpan.textContent = user.email;

    // Tampilkan nama dari akun yang login
    userNameEl.textContent = user.displayName || "Pengguna";

    // Tampilkan foto profil (jika ada)
    if (user.photoURL) {
      userPhotoEl.src = user.photoURL;
    } else {
      userPhotoEl.src = "assets/default-avatar.png"; // Pastikan ada gambar default
    }

  } else {
    authSection.classList.remove("hidden");
    appSection.classList.add("hidden");

    userEmailSpan.textContent = "";
    userNameEl.textContent = "Pengguna";
    userPhotoEl.src = "assets/default-avatar.png";
  }
});

// =========================
// REGISTER
// =========================
btnRegister.onclick = async () => {
  const email = emailInput.value.trim();
  const pass = passInput.value.trim();

  if (!email || !pass)
    return alert("Isi email & password untuk register");

  try {
    await auth.createUserWithEmailAndPassword(email, pass);
    alert("Registrasi berhasil. Silakan login.");
  } catch (e) {
    alert("Gagal register: " + e.message);
  }
};


// =========================
// LOGIN
// =========================
btnLogin.onclick = async () => {
  const email = emailInput.value.trim();
  const pass = passInput.value.trim();

  if (!email || !pass)
    return alert("Isi email & password untuk login");

  try {
    await auth.signInWithEmailAndPassword(email, pass);
  } catch (e) {
    alert("Login gagal: " + e.message);
  }
};


// =========================
// LOGOUT
// =========================
btnLogout.onclick = async () => {
  await auth.signOut();
};
