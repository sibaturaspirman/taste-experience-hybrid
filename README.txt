TASTE EXPERIENCES – Kiosk TV 43" (portrait)
============================================

ISI FOLDER
- index.html   : aplikasinya (gambar, font, dan 3 video sudah tertanam di dalamnya)
- lib/qrcode.js: library pembuat kode QR (supaya QR tetap jalan tanpa internet)
- video/       : 3 video background hasil (fresh, bold, creamy) sebagai arsip

CARA PAKAI DI TV
1. Salin seluruh folder ini ke TV / mini-PC / USB. Jangan pisahkan index.html dari folder lib.
2. Buka index.html di browser berbasis Chrome (Chrome, Edge, atau browser bawaan TV yang berbasis Chromium).
3. Layar penuh: tahan pojok kiri atas layar 2 detik (atau tekan Ctrl+M) untuk membuka panel admin,
   lalu tekan "Layar penuh". Untuk mini-PC bisa juga jalankan Chrome dengan mode kiosk:
   chrome --kiosk --autoplay-policy=no-user-gesture-required "file:///path/ke/index.html"
4. Tampilan otomatis menyesuaikan layar. Di TV portrait 9:16 tampil penuh. Di layar lain (misalnya laptop),
   sisi kiri-kanan dibuat hitam polos. Tambahkan ?fill=1 kalau sisi itu mau diisi lanjutan background.

5. 4K: desain portrait 1080x1920 otomatis diskalakan x2 di TV 4K portrait (2160x3840).
   Gambar sudah resolusi 2x, efek glitch & video hasil ikut dirender tajam di 4K.
6. Kalau TV dipasang berdiri tapi browser-nya tetap landscape (3840x2160), putar tampilan:
   panel admin > "Orientasi layar", atau buka index.html?rotate=90 (atau ?rotate=270).

TAMPILAN HP
- Kalau dibuka di HP (portrait), tampilan otomatis memenuhi layar dan tulisannya diperbesar.
  Di TV, laptop, dan tablet tampilannya tetap seperti biasa.

PANEL ADMIN (tahan pojok kiri atas 2 detik / Ctrl+M)
- Matrix hasil: atur hasil (FRESH / BOLD / CREAMY) untuk tiap kombinasi 3 jawaban.
- Link untuk QR: link halaman yang dibuka HP pengunjung saat scan QR.
  Default-nya link artifact Claude; artifact harus sudah di-share supaya bisa dibuka di HP.
- Reset otomatis: kembali ke layar awal setelah X detik tidak disentuh (default 45, isi 0 untuk mematikan).
Pengaturan tersimpan di browser perangkat itu.

CATATAN
- HP pengunjung butuh internet untuk membuka hasil dari QR. TV-nya sendiri tidak butuh internet.
- Video sekarang masih dummy. Untuk mengganti, kirim 3 video final (MP4 H.264, portrait 9:16,
  tanpa audio, 6–10 detik, idealnya < 3 MB per video) supaya ditanam ulang ke index.html.
- Browser yang disarankan: Chrome terbaru. Safari dan browser lama mungkin tidak menampilkan semua efek.
