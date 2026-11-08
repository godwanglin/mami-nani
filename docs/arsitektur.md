# Arsitektur — Rekomendasi Makanan

Situs statis. Vite membangun React jadi HTML, CSS, dan JavaScript. Vercel menyajikan hasil build itu tanpa server. Data makanan ikut ter-bundle karena di-import dari `src/data`.

## Yang dihitung di browser

User mengisi budget sekali, di awal. Budget itu dipakai kedua mode.

1. **Menu jadi.** Menu yang harganya tidak melebihi budget. Diurutkan dari yang paling mendekati budget. Kalori hanya ditampilkan.
2. **Masak sendiri.** User mencentang bahan yang dia punya. Resep muncul hanya jika setiap bahannya ada di pilihan itu, dan total harga (jumlah × harga bahan) tidak melebihi budget. Kalori adalah jumlah kalori bahan, juga hanya ditampilkan.

Budget adalah harga satu porsi utuh. Bahan yang user centang dianggap harus dibeli, bukan stok yang sudah dimiliki.

## Data

Tiga file, dipisah supaya harga dan kalori tidak ditulis dua kali.

`bahan.json` — sumber harga dan kalori.

```json
{ "id": "telur", "nama": "Telur ayam", "harga": 2500, "satuan": "butir", "kalori": 72, "kategori": "protein" }
```

`resep.json` — tidak menyimpan harga atau kalori. Keduanya dihitung dari bahan.

```json
{
  "id": "nasi-goreng-telur",
  "nama": "Nasi goreng telur",
  "porsi": 1,
  "waktu": 15,
  "bahan": [{ "id": "nasi", "jumlah": 1 }, { "id": "telur", "jumlah": 2 }],
  "langkah": ["Panaskan minyak.", "Goreng telur.", "Masukkan nasi."]
}
```

`menu.json` — harga jual dan kalori ditulis langsung, karena ini makanan jadi, bukan jumlah bahan.

```json
{ "id": "ayam-geprek", "nama": "Ayam geprek", "harga": 18000, "kalori": 650, "kategori": "makan-siang", "tempat": "Warung" }
```

## Aturan data

- `id` huruf kecil, dipisah tanda hubung, unik di dalam filenya.
- Setiap `resep.bahan[].id` wajib ada di `bahan.json`. Build gagal jika ada yang tidak ketemu.
- Harga dalam rupiah, bilangan bulat, tanpa desimal. Kalori dalam kkal per satuan bahan, atau per porsi untuk menu jadi.
- `jumlah` mengikuti `satuan`. Satu telur, 100 gram beras, satu sachet kecap.
- Teks dalam Bahasa Indonesia. Nama makanan ditulis biasa, bukan kapital semua.
- Gambar tidak disimpan di data. Gambar adalah hiasan antarmuka, bukan foto tiap makanan.
- File baru ditambahkan dengan pola yang sama. Logika pencarian tidak berubah saat data bertambah ke ribuan.

## Struktur

```
src/
  data/          bahan.json, resep.json, menu.json
  lib/           cari.js (filter), hitung.js (harga + kalori), validasi.js
  components/    Budget, BahanPicker, KartuMenu, KartuResep, Kosong
  App.jsx
  styles.css
public/
  gambar/        ilustrasi yang diunduh, disebut dari CSS
docs/
  arsitektur.md
```

## Tampilan

Bingkai ponsel di tengah, seperti referensi, karena pemakaiannya satu tangan: isi budget, centang bahan, lihat hasil. Bukan landing page.

Warna diambil dari referensi, bukan ditiru mentah: pink `#ea6f9f`, pink lembut `#fff0f6`, teks plum `#66344f`, garis `#f4bfd3`, latar `#fff7fa`. Font Nunito, karena bulat dan mudah dibaca untuk angka harga.

Dua pilihan ditampilkan sebagai dua tab di dalam bingkai: "Tinggal makan" dan "Masak sendiri". Tab aktif berwarna penuh, yang lain garis saja.

## Skala

Seribu menu dan seribu bahan tetap dihitung di browser. Hasil yang panjang dipecah per halaman, bukan dirender sekaligus. Kalau suatu saat data harus bisa diubah tanpa build ulang, file dipindah ke `public/` dan diambil dengan `fetch`. Skema dan aturan di atas tidak berubah.
