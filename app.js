// app.js

// Ambil elemen UI
const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');
const emailInput = document.getElementById('email');
const passInput = document.getElementById('password');
const btnLogin = document.getElementById('btn-login');
const btnRegister = document.getElementById('btn-register');
const btnLogout = document.getElementById('btn-logout');

const namaInput = document.getElementById('nama');
const kelasInput = document.getElementById('kelas');
const kamarInput = document.getElementById('kamar');
const statusSelect = document.getElementById('status');
const btnAbsen = document.getElementById('btn-absen');
const btnClear = document.getElementById('btn-clear');
const recordsDiv = document.getElementById('records');
const userEmailSpan = document.getElementById('user-email');

// ---- WAKTU SHOLAT ----
function loadPrayerTimes() {
  fetch("https://api.aladhan.com/v1/timingsByCity?city=Jakarta&country=Indonesia&method=11")
    .then(res => res.json())
    .then(data => {
      const times = data.data.timings;
      const list = document.getElementById("pray-times");

      list.innerHTML = `
        <li>Subuh : ${times.Fajr}</li>
        <li>Dzuhur : ${times.Dhuhr}</li>
        <li>Ashar : ${times.Asr}</li>
        <li>Maghrib : ${times.Maghrib}</li>
        <li>Isya : ${times.Isha}</li>
      `;
    })
    .catch(err => console.error("Error Waktu Sholat:", err));
}


// ---- LOGIN LISTENER (HANYA 1!) ----
auth.onAuthStateChanged(user => {
  if (user) {
    authSection.classList.add("hidden");
    appSection.classList.remove("hidden");

    userEmailSpan.textContent = user.email;

    loadPrayerTimes();  // tampilkan waktu sholat
  } else {
    authSection.classList.remove("hidden");
    appSection.classList.add("hidden");
    userEmailSpan.textContent = "";
  }
});


// ---- REGISTER ----
btnRegister.onclick = async () => {
  const email = emailInput.value.trim();
  const pass = passInput.value.trim();
  if (!email || !pass) return alert("Isi email & password untuk register");

  try {
    await auth.createUserWithEmailAndPassword(email, pass);
    alert("Registrasi berhasil. Silakan login.");
  } catch (e) {
    alert("Gagal register: " + e.message);
  }
};


// ---- LOGIN ----
btnLogin.onclick = async () => {
  const email = emailInput.value.trim();
  const pass = passInput.value.trim();
  if (!email || !pass) return alert("Isi email & password untuk login");

  try {
    await auth.signInWithEmailAndPassword(email, pass);
  } catch (e) {
    alert("Login gagal: " + e.message);
  }
};


// ---- LOGOUT ----
btnLogout.onclick = async () => {
  await auth.signOut();
};


// ---- CLEAR INPUT ----
btnClear.onclick = () => {
  namaInput.value = "";
  kelasInput.value = "";
  kamarInput.value = "";
  statusSelect.value = "Hadir";
};


// ---- ABSEN ----
btnAbsen.onclick = async () => {
  const nama = namaInput.value.trim();
  const kelas = kelasInput.value.trim();
  const kamar = kamarInput.value.trim();
  const status = statusSelect.value;

  if (!nama || !kelas || !kamar)
    return alert("Lengkapi Nama, Kelas, Kamar.");

  try {
    await db.collection("attendance").add({
      nama,
      kelas,
      kamar,
      status,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      user: auth.currentUser ? auth.currentUser.email : null
    });

    alert("Absensi tersimpan.");
    btnClear.click();
  } catch (e) {
    alert("Gagal simpan: " + e.message);
  }
};


// ---- REALTIME REKAP ----
db.collection("attendance")
  .orderBy("createdAt", "desc")
  .limit(100)
  .onSnapshot(snap => {
    recordsDiv.innerHTML = "";
    snap.forEach(doc => {
      const d = doc.data();
      const time = d.createdAt?.toDate ? d.createdAt.toDate().toLocaleString() : "-";

      const div = document.createElement("div");
      div.className = "record";
      div.innerHTML = `
        <div><strong>${d.nama}</strong> - ${d.status}</div>
        <div class="meta">Kelas: ${d.kelas} • Kamar: ${d.kamar} • ${time}</div>
      `;
      recordsDiv.appendChild(div);
    });
  });
