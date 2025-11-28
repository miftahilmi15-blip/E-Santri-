// =========================
// ELEMENTS
// =========================
const authSection   = document.getElementById('login-card'); // card login/register
const appSection    = document.getElementById('dashboard');  // dashboard setelah login
const emailInput    = document.getElementById('email');
const passInput     = document.getElementById('password');
const btnLogin      = document.querySelector('.btn.primary');   // tombol Login
const btnRegister   = document.querySelector('.btn.secondary'); // tombol Daftar
const menuBtn       = document.getElementById('menu-btn');       // tombol titik 3
const closeBtn      = document.getElementById('close-btn');      // close sidebar
const overlay       = document.getElementById('overlay');        // overlay sidebar

const userNameEl    = document.getElementById('sidebar-name');
const userEmailSpan = document.getElementById('sidebar-email');
const userPhotoEl   = document.getElementById('user-photo');


// =========================
// FIREBASE INITIALIZE
// =========================
firebase.initializeApp({
  apiKey: "AIzaSyAQ1A9rtEoEYoriA5Y7oSB84Fd1Xnu6aes",
  authDomain: "e-santri-ed555.firebaseapp.com",
  projectId: "e-santri-ed555"
});

const auth = firebase.auth();


// =========================
// LOGIN FUNCTION
// =========================
function login() {
  const email = emailInput.value.trim();
  const pass  = passInput.value.trim();

  if (!email || !pass) {
    return showMsg("Isi email & password untuk login");
  }

  auth.signInWithEmailAndPassword(email, pass)
      .catch(e => showMsg("Login gagal: " + e.message));
}


// =========================
// REGISTER FUNCTION
// =========================
function register() {
  const email = emailInput.value.trim();
  const pass  = passInput.value.trim();

  if (!email || !pass) {
    return showMsg("Isi email & password untuk register");
  }

  auth.createUserWithEmailAndPassword(email, pass)
      .then(() => showMsg("Akun berhasil dibuat, silakan login"))
      .catch(e => showMsg("Gagal register: " + e.message));
}


// =========================
// SHOW MESSAGE
// =========================
function showMsg(message) {
  document.getElementById('msg').textContent = message;
}


// =========================
// LOGOUT FUNCTION
// =========================
function logout() {
  auth.signOut();
}


// =========================
// AUTH STATE LISTENER
// =========================
auth.onAuthStateChanged(user => {
  if (user) {
    // LOGIN → sembunyikan login, tampilkan dashboard
    authSection.classList.add('hidden');
    appSection.classList.remove('hidden');
    menuBtn.style.display = 'block';

    // tampilkan info user
    userNameEl.textContent    = user.displayName || "Pengguna";
    userEmailSpan.textContent = user.email;
    userPhotoEl.src           = user.photoURL || "assets/default-avatar.png";

  } else {
    // LOGOUT → tampilkan login, sembunyikan dashboard
    authSection.classList.remove('hidden');
    appSection.classList.add('hidden');
    menuBtn.style.display = 'none';

    // reset info user
    userNameEl.textContent    = "Pengguna";
    userEmailSpan.textContent = "";
    userPhotoEl.src           = "assets/default-avatar.png";
  }
});


// =========================
// SIDEBAR MENU (TITIK 3)
// =========================
menuBtn.onclick = () => {
  sidebar.classList.add('open');
  overlay.classList.add('show');
};

closeBtn.onclick = () => {
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
};

overlay.onclick = () => {
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
};


// =========================
// EDIT PROFILE POPUP
// =========================
function openEdit() {
  document.getElementById('edit-profile-popup').classList.add('show');
}

function closeEdit() {
  document.getElementById('edit-profile-popup').classList.remove('show');
}

async function saveProfile() {
  const user = auth.currentUser;
  if (!user) return alert("Tidak ada user login");

  const name  = document.getElementById('edit-name').value.trim();
  const email = document.getElementById('edit-email').value.trim();
  const pass  = document.getElementById('edit-pass').value.trim();

  try {
    if (name)  await user.updateProfile({ displayName: name });
    if (email) await user.updateEmail(email);
    if (pass)  await user.updatePassword(pass);

    alert("Profil berhasil diperbarui!");
    closeEdit();
    location.reload();
  } catch (e) {
    alert("Gagal update: " + e.message);
  }
}


// =========================
// NAVIGASI DASHBOARD
// =========================
function goTo(page) {
  window.location.href = page;
}
