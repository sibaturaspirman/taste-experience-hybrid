# Taste Experience – kiosk TV portrait

Kiosk interaktif untuk TV 43" berdiri (portrait, 4K) di booth. Pengunjung menjawab 3 pertanyaan, lalu dapat hasil
FRESH / BOLD / CREAMY, lalu scan QR untuk membuka halaman hasil di HP.

## Isi folder

- `index.html`: seluruh aplikasi dalam satu file, ±8,5 MB. Isinya CSS, JS, markup, plus font IQOS, semua gambar, dan
  3 video hasil yang tertanam sebagai base64.
- `lib/qrcode.js`: pembuat QR offline. Jangan dipisahkan dari `index.html`.
- `video/`: arsip MP4 hasil (fresh, bold, creamy). Video yang dipakai aplikasi sudah tertanam di `index.html`.
- `README.txt`: panduan pemasangan untuk operator (Bahasa Indonesia).

## Cara kerja dengan file ini

- **Jangan baca `index.html` utuh**, karena base64-nya sangat besar. Buat salinan ringkas tanpa base64 dulu, lalu
  cari di salinan itu:
  `sed -E 's/data:[a-z]+\/[a-z0-9.+-]+;base64,[A-Za-z0-9+\/=]+/DATA/g; s/[A-Za-z0-9+\/=]{200,}/B64/g' index.html > stripped.html`
- **Edit lewat skrip Node** yang mengganti string unik (cek jumlah kecocokan = 1), bukan lewat editor biasa.
  Python tidak terpasang di mesin ini.
- **Hati-hati dengan `\b` di regex.** Kalau kode ditulis lewat `node -e '…'` dengan template string, `\b` bisa
  berubah jadi karakter backspace (0x08) yang tidak terlihat, dan regex-nya diam-diam tidak pernah cocok. Ini
  pernah merusak `?fill=1` dan `?result=`. Tulis skrip patch ke file `.js`, atau pakai `(?![a-z])` sebagai ganti
  `\b`. Setelah patch, cek: `node -e 'console.log(require("fs").readFileSync("index.html","utf8").includes("\x08"))'`
  harus `false`.
- **Backup dulu sebelum edit**, karena folder ini bukan repo git.
- Untuk mengolah gambar (crop/resize/webp) pakai `sharp` (`npm install sharp`) di folder sementara, lalu tanam
  hasilnya sebagai base64.

## Menjalankan dan mengetes

- Dev server: konfigurasi `taste-kiosk` di `../.claude/launch.json` (http-server, port 5600). Buka
  http://localhost:5600.
- Halaman hasil versi HP: `http://localhost:5600/#fresh` (atau `#bold`, `#creamy`).
- Langsung ke hasil kiosk (loader + kartu, tanpa menjawab pertanyaan): `http://localhost:5600/?result=fresh`
  (atau `bold`, `creamy`). Jawabannya diambil dari kombinasi pertama di matrix yang menghasilkan hasil itu.
- Panel preview di app Claude bisa membekukan animasi kalau panelnya tersembunyi (`document.timeline` diam di 0).
  Untuk mengecek animasi, pakai Chrome headless (puppeteer-core + Chrome terpasang).
- Ukuran tes: 1080×1920 (desain), 2160×3840 (TV 4K), 1920×1080 (laptop, sisi kiri-kanan hitam).
- Helper di console: `__te.go('q1'|'q2'|'q3'|'result'|'qr'|'start')`, `__te.setResult('fresh'|'bold'|'creamy')`,
  `__te.noFx()` (matikan efek glitch supaya screenshot bersih; ini juga melewati animasi loading).
- Perpindahan layar memakai animasi sekitar 1–2 detik. Tunggu dulu sebelum mengambil screenshot.

## Struktur aplikasi

- Panggung desain **1080×1920 px** (`#stage`), diskalakan agar pas layar di `fit()`. Di TV 4K skalanya ×2. Semua
  posisi di CSS memakai satuan stage ini.
- Layar (`<section class="screen" data-screen=...>`): `start`, `q1`–`q3` (dibangun JS dari `Q`), `result`
  (loader + kartu video), `qr`, dan `mobile` (halaman hasil di HP, dibuka dari QR).
- Data di JS (cari nama variabelnya):
  - `IMG`: gambar base64. Isinya `cards` (kartu pilihan per pertanyaan, 1526×1010 dengan frame glitch), `photos`
    (foto untuk loader), `ptitle`/`pbody` (panel kartu hasil), `poster`, `mobile`, dan `btn`.
  - `Q`: teks pertanyaan, label pilihan (`opts`), dan label pendek untuk loader (`short`).
  - `RESULTS`: judul (`head`) dan deskripsi (`body` = teks polos, `mbody` = baris kartu, sudah dipotong dengan `<br>`).
  - `DEFAULT_MATRIX`: kombinasi 3 jawaban → hasil. Bisa diubah dari panel admin.
  - `VIDEO`: MP4 base64 per hasil. Ukurannya 720×1280, jadi agak lembut di 4K. Ganti dengan 2160×3840 kalau ada.
- Fungsi utama: `go()`, `showResult()`, `runLoader()` (animasi "AI matching"), `buildCard()`, `renderQR()`,
  `saveResult()`, `openAdmin()`, dan modul `Fluid` (video hasil + glitch).
- Panel admin: tahan pojok kiri atas 2 detik, atau tekan Ctrl+M. Isinya matrix hasil, link QR, reset otomatis,
  orientasi layar, dan layar penuh. Pengaturan disimpan di localStorage `te_kiosk_v1`.

## Fitur yang ditambahkan (Nov 2026)

- **4K**: `RES` = 2 kalau layar 4K. Canvas efek `#fx` dan canvas glitch video ikut dirender ×2.
- **Rotasi**: `?rotate=90` / `?rotate=270`, atau lewat admin "Orientasi layar". Dipakai untuk TV berdiri yang
  browsernya tetap landscape. Lihat kelas `#vp.rot90` / `#vp.rot270` dan `rotation()`.
- **Layar lebar**: sisi di luar frame 9:16 dibuat hitam polos. `?fill=1` mengembalikan isian background bercermin
  (lihat `FILL`).
- **Scale-up**: blok CSS `SCALE-UP untuk TV` memperbesar elemen sekitar 10% dengan properti CSS `scale`/`translate`.
  Properti ini sengaja dipakai, bukan `transform`, supaya tidak bentrok dengan animasi yang sudah ada.
- **Copy**: semua teks untuk pengunjung berbahasa Inggris, mengikuti deck klien. Judulnya "TASTE EXPERIENCE"
  (tunggal). Ada disclaimer di layar start (`.disc`). Panel admin sengaja tetap Bahasa Indonesia.
- **Gambar** "A warm & relaxing sunset" (`IMG.cards.q3[1]` dan `IMG.photos.q3[1]`) diambil dari mockup klien
  UI-UX-13.

## Revisi result & QR (11 Nov 2026)

- **Frame hasil kiosk 9:16**: kartu tampil utuh, tidak dipotong lagi. Ukurannya: `.rin` 643.5×1144 di (215.85, 351.1),
  `.rframe` 749.5×1250, kartu diskalakan `.59583`, dan `scale` 1.1 pada `.flipA` dimatikan. Loader ikut disesuaikan
  ke frame baru (posisi kotak tag `643-120-w`, scan `translateY(1160px)`, wipe `1144px`). Desain animasinya tetap.
- **Overlay biru+glitch** (`IMG.over`, kelas `.vov`): lapisan transparan di atas video swirl, diambil dari mockup
  klien UI-UX-16/17/18. Hanya piksel yang dominan biru yang dipakai, dan navy gelap dibuat transparan supaya tidak
  keruh. Tanpa overlay ini, video swirl menutup cahaya biru dan glitch yang ada di mockup. Berlaku di kiosk dan HP.
- **Glitch dianimasikan**: `.vov` berkedip dan bergeser (`vovBase`). Dua salinan `.vov.g1`/`.vov.g2` tampil sebagai
  irisan horizontal yang meloncat (`vovG1`, `vovG2`). Mati otomatis kalau perangkat memakai reduced motion.
- **QR**: kotak putih 820×820, persegi, dan `scale` pada `.flipB` dimatikan. QR 712.5px dengan margin putih 53.75px.
  Proporsinya sama dengan versi yang disetujui klien: margin 7,5% dari ukuran QR. Catatan: SVG QR tidak punya
  quiet zone bawaan, jadi margin putih sepenuhnya berasal dari kotak. Jarak judul → kotak QR → caption → tombol
  sama, 121.8px, diukur dari tepi huruf.

## Video rekaman

- Folder `../taste-experience-result-videos/` berisi 6 MP4 (1080×1920, 30fps): `result-*` (±14 detik, loader + kartu)
  dan `fullflow-*` (±27 detik, start → 3 pertanyaan → loader → hasil → QR).
- Cara merekam: puppeteer-core + Chrome, screencast CDP, lalu ffmpeg (`ffmpeg-static`). Halaman terlalu berat untuk
  direkam real-time (sekitar 11fps), jadi direkam slow motion 4×: jam, timer, rAF, dan video halaman diperlambat
  lewat shim di `evaluateOnNewDocument`, animasi CSS lewat `Animation.setPlaybackRate`, lalu frame-nya diatur
  ulang waktunya ÷4 di ffmpeg.
- Jawaban yang dipakai di full flow: FRESH `010`, BOLD `000`, CREAMY `101`.

## Mode HP / responsif (20 Nov 2026)

- Aktif otomatis kalau layar portrait dan lebarnya ≤820px: `fit()` memberi kelas `html.phone`. TV, laptop, dan HP
  landscape tidak berubah. Di tablet kelasnya ikut aktif, tapi skalanya sama, jadi tampilannya tidak berubah.
- Zoom memakai `min(w/900, h/1920)`, jadi hanya ±900 dari 1080px lebar desain yang terlihat. Teks jadi ±1,2× lebih besar.
  Tinggi stage = tinggi layar (≥1920), dan layar ditaruh di tengah vertikal.
- Variabel CSS di `#stage`: `--dy` = setengah tinggi tambahan, `--vx` = lebar yang terpotong di tiap sisi. Elemen di
  pinggir (tagline, bar, sudut admin, frame kartu HP, HUD loader) digeser masuk memakai variabel ini.
- **Loader & hasil kiosk di HP tetap di dalam frame**, sama seperti di TV (keputusan klien 20 Nov: jangan dibuat
  penuh layar). Konsekuensinya, teks deskripsi di kartu hasil kiosk di HP kecil (±10px). Halaman hasil HP dari QR
  (`#bold`/`#creamy`) tetap penuh layar dengan teks ±17px. Loader membaca ukuran frame dari `#rin` (`RW`, `RH`).
- Ukuran terukur di HP 390×844: teks utama 17–19px, tombol 48–52px. Di HP 360×800: 16–18px. HP lama 16:9 (360×640)
  ±13–15px, karena dibatasi tinggi layar.

## Keputusan klien yang perlu dijaga

- **Style aktif = glitch lama** (background biru bergaris glitch, tombol glitch, frame glitch). Klien sempat minta
  style "Art for the Curious", lalu membatalkannya. Versi itu disimpan di `../taste-experiences-kiosk-style-curious/`.
  Isinya background kristal yang dibuat dari `BG_SRC`, tombol pill cyan `#12e4ff`, dan frame kartu/QR/hasil baru.
  Jangan dicampur ke versi aktif kecuali diminta.
- **Animasi loading "AI matching" harus tetap yang lama**, di versi mana pun.
- Typo dari deck klien sengaja diperbaiki: "entertainment" dan "not intended". Kalimat CREAMY
  "…crafted for your vibe" memang tanpa titik, mengikuti deck.
- Jarak di layar pertanyaan (versi style-curious) dibuat rata sekitar 70px: teks → kartu 1 → kartu 2 → tombol NEXT.
- Revisi 11 Nov (result 9:16, overlay + animasi glitch, QR, `?result=`) **hanya ada di versi aktif**. Versi
  style-curious belum ikut diperbarui. Satu-satunya perubahan di sana adalah perbaikan bug `?fill=1`.

## Hal yang perlu diingat

- QR membuka halaman hasil di HP lewat link di admin ("Link untuk QR") + `#fresh`/`#bold`/`#creamy`. HP pengunjung
  butuh internet. TV-nya sendiri bisa offline.
- Di TV, pakai mini-PC + Chrome mode kiosk:
  `chrome --kiosk --autoplay-policy=no-user-gesture-required "file:///.../index.html"`.
- `index.html.orig` adalah file asli dari zip klien (9 Nov 2026), hanya untuk rollback. Jangan ikut dikirim.
