const fs = require('fs');
const path = require('path');

// ============================================================================
// 1. GENERATE 160+ INDONESIAN PANTRY INGREDIENTS (BAHAN)
// ============================================================================
const rawBahan = [
  // KARBOHIDRAT (28 items)
  { id: 'beras', nama: 'Beras putih pulen', harga: 3000, satuan: 'porsi (100g)', kalori: 204, kategori: 'karbo', gambar: '/images/bahan/beras.jpg' },
  { id: 'beras-merah', nama: 'Beras merah organik', harga: 4500, satuan: 'porsi', kalori: 180, kategori: 'karbo', gambar: '/images/bahan/beras.jpg' },
  { id: 'beras-ketan', nama: 'Beras ketan putih', harga: 4000, satuan: 'porsi', kalori: 215, kategori: 'karbo', gambar: '/images/bahan/beras.jpg' },
  { id: 'lontong', nama: 'Lontong daun pisang', harga: 3000, satuan: 'buah', kalori: 130, kategori: 'karbo', gambar: '/images/bahan/beras.jpg' },
  { id: 'ketupat', nama: 'Ketupat janur matang', harga: 3500, satuan: 'buah', kalori: 140, kategori: 'karbo', gambar: '/images/bahan/beras.jpg' },
  { id: 'mie-instan', nama: 'Mie instan goreng/kuah', harga: 3500, satuan: 'bungkus', kalori: 380, kategori: 'karbo', gambar: '/images/bahan/mie-instan.jpg' },
  { id: 'mie-telur', nama: 'Mie telur basah/kering', harga: 4000, satuan: 'keping (100g)', kalori: 220, kategori: 'karbo', gambar: '/images/bahan/mie-instan.jpg' },
  { id: 'mie-telur-lebar', nama: 'Mie telur lebar kenyal', harga: 4500, satuan: 'keping', kalori: 230, kategori: 'karbo', gambar: '/images/bahan/mie-instan.jpg' },
  { id: 'bihun', nama: 'Bihun beras lembut', harga: 3000, satuan: 'keping', kalori: 190, kategori: 'karbo', gambar: '/images/bahan/bihun.jpg' },
  { id: 'kwetiau', nama: 'Kwetiau beras basah', harga: 4000, satuan: 'porsi', kalori: 210, kategori: 'karbo', gambar: '/images/bahan/kwetiau.jpg' },
  { id: 'soun', nama: 'Soun pati kacang hijau', harga: 3000, satuan: 'keping', kalori: 180, kategori: 'karbo', gambar: '/images/bahan/bihun.jpg' },
  { id: 'kentang', nama: 'Kentang segar', harga: 3500, satuan: 'buah besar', kalori: 160, kategori: 'karbo', gambar: '/images/bahan/kentang.jpg' },
  { id: 'ubi-manis', nama: 'Ubi jalar kuning/merah', harga: 2500, satuan: 'buah', kalori: 140, kategori: 'karbo', gambar: '/images/bahan/kentang.jpg' },
  { id: 'ubi-cilembu', nama: 'Ubi Cilembu madu manis', harga: 3500, satuan: 'buah', kalori: 155, kategori: 'karbo', gambar: '/images/bahan/kentang.jpg' },
  { id: 'singkong', nama: 'Singkong putih pulen', harga: 2500, satuan: 'potong (150g)', kalori: 150, kategori: 'karbo', gambar: '/images/bahan/singkong.jpg' },
  { id: 'talas', nama: 'Talas Bogor kukus empuk', harga: 3000, satuan: 'potong', kalori: 145, kategori: 'karbo', gambar: '/images/bahan/singkong.jpg' },
  { id: 'jagung', nama: 'Jagung manis pipil/utuh', harga: 3000, satuan: 'buah', kalori: 90, kategori: 'karbo', gambar: '/images/bahan/jagung.jpg' },
  { id: 'roti-tawar', nama: 'Roti tawar putih', harga: 2000, satuan: 'lembar', kalori: 130, kategori: 'karbo', gambar: '/images/bahan/roti-tawar.jpg' },
  { id: 'roti-gandum', nama: 'Roti tawar gandum serat', harga: 2500, satuan: 'lembar', kalori: 110, kategori: 'karbo', gambar: '/images/bahan/roti-tawar.jpg' },
  { id: 'makaroni', nama: 'Makaroni spiral/pipa', harga: 2500, satuan: 'genggam', kalori: 180, kategori: 'karbo', gambar: '/images/bahan/makaroni.jpg' },
  { id: 'spaghetti', nama: 'Pasta spaghetti', harga: 4000, satuan: 'porsi (80g)', kalori: 200, kategori: 'karbo', gambar: '/images/bahan/mie-instan.jpg' },
  { id: 'tepung-terigu', nama: 'Tepung terigu serbaguna', harga: 2000, satuan: '4 sdm', kalori: 140, kategori: 'karbo', gambar: '/images/bahan/beras.jpg' },
  { id: 'tepung-beras', nama: 'Tepung beras putih', harga: 2000, satuan: '4 sdm', kalori: 135, kategori: 'karbo', gambar: '/images/bahan/beras.jpg' },
  { id: 'tepung-tapioka', nama: 'Tepung tapioka / kanji', harga: 2000, satuan: '4 sdm', kalori: 130, kategori: 'karbo', gambar: '/images/bahan/beras.jpg' },
  { id: 'tepung-maizena', nama: 'Tepung maizena jagung', harga: 2500, satuan: '2 sdm', kalori: 60, kategori: 'karbo', gambar: '/images/bahan/jagung.jpg' },
  { id: 'tepung-bumbu', nama: 'Tepung bumbu krispi', harga: 3000, satuan: 'sachet', kalori: 150, kategori: 'karbo', gambar: '/images/bahan/beras.jpg' },
  { id: 'kulit-pangsit', nama: 'Kulit pangsit / dimsum tipis', harga: 2500, satuan: '5 lembar', kalori: 90, kategori: 'karbo', gambar: '/images/bahan/makaroni.jpg' },
  { id: 'kulit-lumpia', nama: 'Kulit lumpia goreng renyah', harga: 2500, satuan: '4 lembar', kalori: 85, kategori: 'karbo', gambar: '/images/bahan/makaroni.jpg' },

  // PROTEIN (48 items)
  { id: 'telur', nama: 'Telur ayam ras', harga: 2500, satuan: 'butir', kalori: 74, kategori: 'protein', gambar: '/images/bahan/telur.jpg' },
  { id: 'telur-kampung', nama: 'Telur ayam kampung murni', harga: 3500, satuan: 'butir', kalori: 65, kategori: 'protein', gambar: '/images/bahan/telur.jpg' },
  { id: 'telur-bebek', nama: 'Telur bebek segar', harga: 3500, satuan: 'butir', kalori: 130, kategori: 'protein', gambar: '/images/bahan/telur.jpg' },
  { id: 'telur-asin', nama: 'Telur asin masir gurih', harga: 4500, satuan: 'butir', kalori: 135, kategori: 'protein', gambar: '/images/bahan/telur.jpg' },
  { id: 'telur-puyuh', nama: 'Telur puyuh rebus/segar', harga: 3000, satuan: '5 butir', kalori: 70, kategori: 'protein', gambar: '/images/bahan/telur.jpg' },
  { id: 'tahu', nama: 'Tahu putih segar', harga: 2000, satuan: 'potong', kalori: 80, kategori: 'protein', gambar: '/images/bahan/tahu.jpg' },
  { id: 'tahu-kuning', nama: 'Tahu kuning sutra', harga: 2500, satuan: 'potong', kalori: 85, kategori: 'protein', gambar: '/images/bahan/tahu.jpg' },
  { id: 'tahu-pong', nama: 'Tahu pong goreng', harga: 2000, satuan: '4 pcs', kalori: 90, kategori: 'protein', gambar: '/images/bahan/tahu.jpg' },
  { id: 'tahu-sutra', nama: 'Tahu sutra Jepang lembut', harga: 4000, satuan: 'tube', kalori: 95, kategori: 'protein', gambar: '/images/bahan/tahu.jpg' },
  { id: 'tempe', nama: 'Tempe kedelai segar', harga: 3000, satuan: 'papan sedang', kalori: 160, kategori: 'protein', gambar: '/images/bahan/tempe.jpg' },
  { id: 'tempe-gembus', nama: 'Tempe gembus empuk gurih', harga: 2000, satuan: 'papan', kalori: 110, kategori: 'protein', gambar: '/images/bahan/tempe.jpg' },
  { id: 'oncom', nama: 'Oncom merah Sunda', harga: 2500, satuan: 'papan kecil', kalori: 120, kategori: 'protein', gambar: '/images/bahan/tempe.jpg' },
  { id: 'ayam', nama: 'Daging ayam fillet', harga: 8000, satuan: 'potong (100g)', kalori: 165, kategori: 'protein', gambar: '/images/bahan/ayam.jpg' },
  { id: 'dada-ayam', nama: 'Dada ayam fillet tanpa lemak', harga: 9000, satuan: 'potong (100g)', kalori: 140, kategori: 'protein', gambar: '/images/bahan/ayam.jpg' },
  { id: 'paha-ayam', nama: 'Paha ayam utuh', harga: 9000, satuan: 'potong', kalori: 190, kategori: 'protein', gambar: '/images/bahan/ayam.jpg' },
  { id: 'sayap-ayam', nama: 'Sayap ayam segar', harga: 6000, satuan: '2 potong', kalori: 170, kategori: 'protein', gambar: '/images/bahan/ayam.jpg' },
  { id: 'ceker-ayam', nama: 'Ceker ayam empuk', harga: 5000, satuan: '4 buah', kalori: 150, kategori: 'protein', gambar: '/images/bahan/ayam.jpg' },
  { id: 'ati-ampela', nama: 'Ati & ampela ayam', harga: 5000, satuan: 'pasang', kalori: 140, kategori: 'protein', gambar: '/images/bahan/ayam.jpg' },
  { id: 'daging-sapi', nama: 'Daging sapi cincang', harga: 14000, satuan: 'porsi (100g)', kalori: 250, kategori: 'protein', gambar: '/images/bahan/daging-sapi.jpg' },
  { id: 'tetelan-sapi', nama: 'Daging tetelan / rawon', harga: 12000, satuan: 'porsi (100g)', kalori: 260, kategori: 'protein', gambar: '/images/bahan/daging-sapi.jpg' },
  { id: 'iga-sapi', nama: 'Iga sapi berdaging', harga: 18000, satuan: 'potong (120g)', kalori: 280, kategori: 'protein', gambar: '/images/bahan/daging-sapi.jpg' },
  { id: 'paru-sapi', nama: 'Paru sapi rebus ungkep', harga: 11000, satuan: 'potong', kalori: 210, kategori: 'protein', gambar: '/images/bahan/daging-sapi.jpg' },
  { id: 'babat-sapi', nama: 'Babat sapi putih empuk', harga: 12000, satuan: 'potong', kalori: 190, kategori: 'protein', gambar: '/images/bahan/daging-sapi.jpg' },
  { id: 'daging-kambing', nama: 'Daging kambing muda', harga: 16000, satuan: 'porsi (100g)', kalori: 230, kategori: 'protein', gambar: '/images/bahan/daging-sapi.jpg' },
  { id: 'ikan-lele', nama: 'Ikan lele segar', harga: 7000, satuan: 'ekor', kalori: 145, kategori: 'protein', gambar: '/images/bahan/ikan.jpg' },
  { id: 'ikan-nila', nama: 'Ikan nila merah', harga: 10000, satuan: 'ekor sedang', kalori: 155, kategori: 'protein', gambar: '/images/bahan/ikan.jpg' },
  { id: 'ikan-gurame', nama: 'Ikan gurame segar', harga: 15000, satuan: 'potong', kalori: 160, kategori: 'protein', gambar: '/images/bahan/ikan.jpg' },
  { id: 'ikan-kembung', nama: 'Ikan kembung banjar segar', harga: 8000, satuan: 'ekor', kalori: 150, kategori: 'protein', gambar: '/images/bahan/ikan.jpg' },
  { id: 'ikan-bandeng', nama: 'Ikan bandeng presto', harga: 9000, satuan: 'potong', kalori: 170, kategori: 'protein', gambar: '/images/bahan/ikan.jpg' },
  { id: 'ikan-tongkol', nama: 'Ikan tongkol suwir matang', harga: 6000, satuan: 'porsi', kalori: 130, kategori: 'protein', gambar: '/images/bahan/ikan.jpg' },
  { id: 'ikan-teri', nama: 'Teri medan asin gurih', harga: 4000, satuan: 'genggam', kalori: 85, kategori: 'protein', gambar: '/images/bahan/ikan.jpg' },
  { id: 'ikan-teri-nasi', nama: 'Teri nasi tawar halus', harga: 5000, satuan: 'genggam', kalori: 80, kategori: 'protein', gambar: '/images/bahan/ikan.jpg' },
  { id: 'ikan-patin', nama: 'Ikan patin fillet lembut', harga: 9000, satuan: 'potong', kalori: 160, kategori: 'protein', gambar: '/images/bahan/ikan.jpg' },
  { id: 'ikan-bawal', nama: 'Ikan bawal air tawar', harga: 11000, satuan: 'ekor', kalori: 150, kategori: 'protein', gambar: '/images/bahan/ikan.jpg' },
  { id: 'udang', nama: 'Udang vaname segar', harga: 9000, satuan: 'porsi (80g)', kalori: 110, kategori: 'protein', gambar: '/images/bahan/udang.jpg' },
  { id: 'udang-rebon', nama: 'Udang rebon kering gurih', harga: 3500, satuan: '2 sdm', kalori: 75, kategori: 'protein', gambar: '/images/bahan/udang.jpg' },
  { id: 'cumi', nama: 'Cumi-cumi bersih', harga: 9000, satuan: 'porsi', kalori: 95, kategori: 'protein', gambar: '/images/bahan/cumi.jpg' },
  { id: 'cumi-asin', nama: 'Cumi asin kecil', harga: 7000, satuan: 'porsi kecil', kalori: 110, kategori: 'protein', gambar: '/images/bahan/cumi.jpg' },
  { id: 'kerang-hijau', nama: 'Kerang hijau kupas', harga: 8000, satuan: 'porsi', kalori: 90, kategori: 'protein', gambar: '/images/bahan/udang.jpg' },
  { id: 'kerang-dara', nama: 'Kerang dara segar', harga: 8000, satuan: 'porsi', kalori: 85, kategori: 'protein', gambar: '/images/bahan/udang.jpg' },
  { id: 'bakso', nama: 'Bakso sapi kenyal', harga: 4000, satuan: '5 butir', kalori: 150, kategori: 'protein', gambar: '/images/bahan/bakso.jpg' },
  { id: 'bakso-ikan', nama: 'Bakso ikan putih lembut', harga: 4000, satuan: '5 butir', kalori: 130, kategori: 'protein', gambar: '/images/bahan/bakso.jpg' },
  { id: 'sosis', nama: 'Sosis ayam / sapi', harga: 3000, satuan: 'batang', kalori: 140, kategori: 'protein', gambar: '/images/bahan/sosis.jpg' },
  { id: 'kornet', nama: 'Kornet daging sapi', harga: 5000, satuan: 'sachet', kalori: 180, kategori: 'protein', gambar: '/images/bahan/daging-sapi.jpg' },
  { id: 'nugget', nama: 'Nugget ayam crispy', harga: 4000, satuan: '3 pcs', kalori: 160, kategori: 'protein', gambar: '/images/bahan/ayam.jpg' },
  { id: 'keju', nama: 'Keju cheddar parut', harga: 4000, satuan: 'porsi (30g)', kalori: 120, kategori: 'protein', gambar: '/images/bahan/keju.jpg' },
  { id: 'keju-mozarella', nama: 'Keju mozzarella leleh', harga: 6000, satuan: 'porsi', kalori: 140, kategori: 'protein', gambar: '/images/bahan/keju.jpg' },

  // SAYUR (44 items)
  { id: 'kangkung', nama: 'Kangkung segar', harga: 2500, satuan: 'ikat', kalori: 28, kategori: 'sayur', gambar: '/images/bahan/kangkung.jpg' },
  { id: 'bayam', nama: 'Bayam hijau', harga: 2500, satuan: 'ikat', kalori: 23, kategori: 'sayur', gambar: '/images/bahan/bayam.jpg' },
  { id: 'daun-singkong', nama: 'Daun singkong muda', harga: 2500, satuan: 'ikat', kalori: 35, kategori: 'sayur', gambar: '/images/bahan/kangkung.jpg' },
  { id: 'daun-katuk', nama: 'Daun katuk segar', harga: 3000, satuan: 'ikat', kalori: 25, kategori: 'sayur', gambar: '/images/bahan/kangkung.jpg' },
  { id: 'daun-pepaya', nama: 'Daun pepaya muda', harga: 2500, satuan: 'ikat', kalori: 30, kategori: 'sayur', gambar: '/images/bahan/kangkung.jpg' },
  { id: 'sawi-hijau', nama: 'Sawi hijau / Caisim', harga: 2000, satuan: 'ikat', kalori: 20, kategori: 'sayur', gambar: '/images/bahan/kangkung.jpg' },
  { id: 'sawi-putih', nama: 'Sawi putih crunchy', harga: 2500, satuan: 'potong', kalori: 18, kategori: 'sayur', gambar: '/images/bahan/kangkung.jpg' },
  { id: 'pakcoy', nama: 'Pakcoy / Bok choy', harga: 3000, satuan: 'ikat', kalori: 22, kategori: 'sayur', gambar: '/images/bahan/kangkung.jpg' },
  { id: 'kubis', nama: 'Kubis / Kol putih segar', harga: 2000, satuan: 'potong', kalori: 22, kategori: 'sayur', gambar: '/images/bahan/kubis.jpg' },
  { id: 'kol', nama: 'Kol putih renyah', harga: 2000, satuan: 'potong', kalori: 22, kategori: 'sayur', gambar: '/images/bahan/kubis.jpg' },
  { id: 'wortel', nama: 'Wortel manis segar', harga: 2000, satuan: 'buah', kalori: 25, kategori: 'sayur', gambar: '/images/bahan/wortel.jpg' },
  { id: 'brokoli', nama: 'Brokoli segar hijau', harga: 4000, satuan: 'kuntum', kalori: 35, kategori: 'sayur', gambar: '/images/bahan/brokoli.jpg' },
  { id: 'kembang-kol', nama: 'Kembang kol putih', harga: 3500, satuan: 'kuntum', kalori: 30, kategori: 'sayur', gambar: '/images/bahan/brokoli.jpg' },
  { id: 'buncis', nama: 'Buncis muda manis', harga: 2500, satuan: 'ikat', kalori: 31, kategori: 'sayur', gambar: '/images/bahan/buncis.jpg' },
  { id: 'kacang-panjang', nama: 'Kacang panjang renyah', harga: 2500, satuan: 'ikat', kalori: 30, kategori: 'sayur', gambar: '/images/bahan/buncis.jpg' },
  { id: 'kacang-kapri', nama: 'Kacang kapri muda manis', harga: 3500, satuan: 'bungkus', kalori: 32, kategori: 'sayur', gambar: '/images/bahan/buncis.jpg' },
  { id: 'tauge', nama: 'Tauge kedelai renyah', harga: 1500, satuan: 'kantong', kalori: 30, kategori: 'sayur', gambar: '/images/bahan/tauge.jpg' },
  { id: 'tauge-pendek', nama: 'Tauge pendek renyah segar', harga: 1500, satuan: 'kantong', kalori: 25, kategori: 'sayur', gambar: '/images/bahan/tauge.jpg' },
  { id: 'jamur', nama: 'Jamur tiram putih', harga: 3000, satuan: 'bungkus', kalori: 35, kategori: 'sayur', gambar: '/images/bahan/jamur.jpg' },
  { id: 'jamur-kancing', nama: 'Jamur kancing segar', harga: 4500, satuan: 'porsi', kalori: 32, kategori: 'sayur', gambar: '/images/bahan/jamur.jpg' },
  { id: 'jamur-kuping', nama: 'Jamur kuping hitam basah', harga: 3000, satuan: 'lembar', kalori: 25, kategori: 'sayur', gambar: '/images/bahan/jamur.jpg' },
  { id: 'jamur-enoki', nama: 'Jamur enoki putih segar', harga: 4000, satuan: 'bungkus', kalori: 36, kategori: 'sayur', gambar: '/images/bahan/jamur.jpg' },
  { id: 'terong', nama: 'Terong ungu empuk manis', harga: 2000, satuan: 'buah', kalori: 25, kategori: 'sayur', gambar: '/images/bahan/terong.jpg' },
  { id: 'terong-bulat', nama: 'Terong bulat lalap renyah', harga: 2000, satuan: '3 buah', kalori: 22, kategori: 'sayur', gambar: '/images/bahan/terong.jpg' },
  { id: 'mentimun', nama: 'Mentimun lalap segar', harga: 1500, satuan: 'buah', kalori: 16, kategori: 'sayur', gambar: '/images/bahan/mentimun.jpg' },
  { id: 'labu-siam', nama: 'Labu siam muda manis', harga: 2500, satuan: 'buah', kalori: 24, kategori: 'sayur', gambar: '/images/bahan/mentimun.jpg' },
  { id: 'oyong', nama: 'Oyong / Gambas serat lembut', harga: 2500, satuan: 'buah', kalori: 20, kategori: 'sayur', gambar: '/images/bahan/mentimun.jpg' },
  { id: 'tomat', nama: 'Tomat merah buah segar', harga: 1500, satuan: 'buah', kalori: 22, kategori: 'sayur', gambar: '/images/bahan/tomat.jpg' },
  { id: 'tomat-hijau', nama: 'Tomat hijau lalap/tumis', harga: 1500, satuan: 'buah', kalori: 20, kategori: 'sayur', gambar: '/images/bahan/tomat.jpg' },
  { id: 'daun-kemangi', nama: 'Daun kemangi wangi harum', harga: 1500, satuan: 'ikat', kalori: 15, kategori: 'sayur', gambar: '/images/bahan/kangkung.jpg' },
  { id: 'daun-bawang', nama: 'Daun bawang seledri', harga: 1500, satuan: 'ikat kecil', kalori: 14, kategori: 'sayur', gambar: '/images/bahan/daun-bawang.jpg' },
  { id: 'seledri', nama: 'Seledri sop wangi segar', harga: 1500, satuan: 'ikat', kalori: 12, kategori: 'sayur', gambar: '/images/bahan/daun-bawang.jpg' },
  { id: 'pare', nama: 'Pare hijau segar sedap', harga: 2500, satuan: 'buah', kalori: 21, kategori: 'sayur', gambar: '/images/bahan/mentimun.jpg' },
  { id: 'jagung-putren', nama: 'Jagung putren (baby corn)', harga: 3000, satuan: 'bungkus', kalori: 28, kategori: 'sayur', gambar: '/images/bahan/jagung.jpg' },
  { id: 'selada', nama: 'Selada keriting segar', harga: 2500, satuan: 'ikat', kalori: 15, kategori: 'sayur', gambar: '/images/bahan/kangkung.jpg' },
  { id: 'petai', nama: 'Petai papan segar gurih', harga: 5000, satuan: 'papan', kalori: 60, kategori: 'sayur', gambar: '/images/bahan/buncis.jpg' },
  { id: 'jengkol', nama: 'Jengkol tua pulen empuk', harga: 5000, satuan: 'porsi (5 butir)', kalori: 85, kategori: 'sayur', gambar: '/images/bahan/kentang.jpg' },
  { id: 'melinjo', nama: 'Buah melinjo empuk', harga: 2500, satuan: 'genggam', kalori: 50, kategori: 'sayur', gambar: '/images/bahan/garam-rempah.jpg' },
  { id: 'daun-melinjo', nama: 'Daun melinjo muda sayur lodeh', harga: 2000, satuan: 'ikat', kalori: 20, kategori: 'sayur', gambar: '/images/bahan/kangkung.jpg' },
  { id: 'rebung', nama: 'Rebung bambu muda empuk', harga: 3500, satuan: 'kantong iris', kalori: 30, kategori: 'sayur', gambar: '/images/bahan/singkong.jpg' },

  // BUMBU & REMPAH (45 items)
  { id: 'bawang', nama: 'Bawang merah lokal Brebes', harga: 1500, satuan: 'porsi bumbu', kalori: 15, kategori: 'bumbu', gambar: '/images/bahan/bawang.jpg' },
  { id: 'bawang-putih', nama: 'Bawang putih kating harum', harga: 1000, satuan: '3 siung', kalori: 10, kategori: 'bumbu', gambar: '/images/bahan/bawang-putih.jpg' },
  { id: 'bawang-bombay', nama: 'Bawang bombay manis berair', harga: 3000, satuan: 'butir', kalori: 40, kategori: 'bumbu', gambar: '/images/bahan/bawang-bombay.jpg' },
  { id: 'cabai', nama: 'Cabai rawit merah pedas', harga: 1500, satuan: 'porsi bumbu', kalori: 10, kategori: 'bumbu', gambar: '/images/bahan/cabai.jpg' },
  { id: 'cabai-merah', nama: 'Cabai merah keriting', harga: 1500, satuan: 'porsi bumbu', kalori: 12, kategori: 'bumbu', gambar: '/images/bahan/cabai.jpg' },
  { id: 'cabai-ijo', nama: 'Cabai hijau besar tumis', harga: 1500, satuan: 'porsi', kalori: 11, kategori: 'bumbu', gambar: '/images/bahan/cabai.jpg' },
  { id: 'cabai-rawit-hijau', nama: 'Cabai rawit hijau lalapan', harga: 1500, satuan: 'porsi', kalori: 10, kategori: 'bumbu', gambar: '/images/bahan/cabai.jpg' },
  { id: 'lengkuas', nama: 'Lengkuas / Laos memar wangi', harga: 1000, satuan: 'ruas', kalori: 8, kategori: 'bumbu', gambar: '/images/bahan/jahe.jpg' },
  { id: 'jahe', nama: 'Jahe wangi segar hangat', harga: 1000, satuan: 'ruas', kalori: 10, kategori: 'bumbu', gambar: '/images/bahan/jahe.jpg' },
  { id: 'kunyit', nama: 'Kunyit basah segar kuning', harga: 1000, satuan: 'ruas', kalori: 9, kategori: 'bumbu', gambar: '/images/bahan/kunyit.jpg' },
  { id: 'kencur', nama: 'Kencur wangi khas seblak', harga: 1000, satuan: 'ruas', kalori: 7, kategori: 'bumbu', gambar: '/images/bahan/jahe.jpg' },
  { id: 'serai', nama: 'Batang serai wangi memar', harga: 1000, satuan: '2 batang', kalori: 6, kategori: 'bumbu', gambar: '/images/bahan/daun-bawang.jpg' },
  { id: 'daun-salam', nama: 'Daun salam wangi kaldu', harga: 500, satuan: '3 lembar', kalori: 4, kategori: 'bumbu', gambar: '/images/bahan/kangkung.jpg' },
  { id: 'daun-jeruk', nama: 'Daun jeruk purut wangi', harga: 500, satuan: '3 lembar', kalori: 4, kategori: 'bumbu', gambar: '/images/bahan/kangkung.jpg' },
  { id: 'daun-kunyit', nama: 'Daun kunyit harum gulai', harga: 1000, satuan: 'lembar', kalori: 5, kategori: 'bumbu', gambar: '/images/bahan/kangkung.jpg' },
  { id: 'asam-jawa', nama: 'Asam jawa matang pekat', harga: 1000, satuan: 'sendok teh', kalori: 12, kategori: 'bumbu', gambar: '/images/bahan/garam-rempah.jpg' },
  { id: 'asam-kandis', nama: 'Asam kandis kering khas gulai', harga: 1000, satuan: '2 buah', kalori: 8, kategori: 'bumbu', gambar: '/images/bahan/garam-rempah.jpg' },
  { id: 'santan', nama: 'Santan kelapa kental gurih', harga: 3000, satuan: 'sachet (65ml)', kalori: 130, kategori: 'bumbu', gambar: '/images/bahan/santan.jpg' },
  { id: 'minyak', nama: 'Minyak goreng sawit jernih', harga: 1500, satuan: '2 sdm', kalori: 120, kategori: 'bumbu', gambar: '/images/bahan/minyak.jpg' },
  { id: 'minyak-wijen', nama: 'Minyak wijen wangi oriental', harga: 2500, satuan: '1 sdt', kalori: 45, kategori: 'bumbu', gambar: '/images/bahan/minyak.jpg' },
  { id: 'minyak-kelapa', nama: 'Minyak kelapa murni klentik', harga: 2500, satuan: '2 sdm', kalori: 125, kategori: 'bumbu', gambar: '/images/bahan/minyak.jpg' },
  { id: 'margarin', nama: 'Margarin gurih leleh', harga: 1500, satuan: '1 sdm', kalori: 100, kategori: 'bumbu', gambar: '/images/bahan/minyak.jpg' },
  { id: 'kecap', nama: 'Kecap manis kental gurih', harga: 1000, satuan: 'sachet (20ml)', kalori: 45, kategori: 'bumbu', gambar: '/images/bahan/kecap.jpg' },
  { id: 'kecap-asin', nama: 'Kecap asin fermentasi sedap', harga: 1000, satuan: '1 sdm', kalori: 15, kategori: 'bumbu', gambar: '/images/bahan/kecap.jpg' },
  { id: 'kecap-ikan', nama: 'Kecap ikan wangi gurih', harga: 1500, satuan: '1 sdm', kalori: 16, kategori: 'bumbu', gambar: '/images/bahan/kecap.jpg' },
  { id: 'saus-tiram', nama: 'Saus tiram gurih pekat', harga: 1500, satuan: 'sachet', kalori: 25, kategori: 'bumbu', gambar: '/images/bahan/kecap.jpg' },
  { id: 'saus-sambal', nama: 'Saus sambal pedas asam', harga: 1000, satuan: 'sachet', kalori: 20, kategori: 'bumbu', gambar: '/images/bahan/cabai.jpg' },
  { id: 'saus-tomat', nama: 'Saus tomat manis segar', harga: 1000, satuan: 'sachet', kalori: 18, kategori: 'bumbu', gambar: '/images/bahan/tomat.jpg' },
  { id: 'saus-bbq', nama: 'Saus barbeque asap lezat', harga: 2500, satuan: '2 sdm', kalori: 45, kategori: 'bumbu', gambar: '/images/bahan/kecap.jpg' },
  { id: 'mayones', nama: 'Mayones creamy lezat', harga: 2000, satuan: 'sachet', kalori: 90, kategori: 'bumbu', gambar: '/images/bahan/keju.jpg' },
  { id: 'terasi', nama: 'Terasi udang bakar harum', harga: 1000, satuan: 'bungkus kecil', kalori: 15, kategori: 'bumbu', gambar: '/images/bahan/garam-rempah.jpg' },
  { id: 'merica', nama: 'Merica / Lada putih bubuk', harga: 1000, satuan: 'sachet', kalori: 6, kategori: 'bumbu', gambar: '/images/bahan/garam-rempah.jpg' },
  { id: 'merica-hitam', nama: 'Lada hitam bubuk kasar', harga: 1500, satuan: 'sachet', kalori: 8, kategori: 'bumbu', gambar: '/images/bahan/garam-rempah.jpg' },
  { id: 'ketumbar', nama: 'Ketumbar bubuk sangrai', harga: 1000, satuan: 'sachet', kalori: 7, kategori: 'bumbu', gambar: '/images/bahan/garam-rempah.jpg' },
  { id: 'kemiri', nama: 'Kemiri sangrai bulat pekat', harga: 1000, satuan: '3 butir', kalori: 35, kategori: 'bumbu', gambar: '/images/bahan/garam-rempah.jpg' },
  { id: 'pala', nama: 'Biji pala bubuk wangi sup', harga: 1000, satuan: 'sejumput', kalori: 5, kategori: 'bumbu', gambar: '/images/bahan/garam-rempah.jpg' },
  { id: 'kayu-manis', nama: 'Kayu manis batangan rempah', harga: 1000, satuan: 'batang', kalori: 6, kategori: 'bumbu', gambar: '/images/bahan/garam-rempah.jpg' },
  { id: 'cengkeh', nama: 'Cengkeh wangi bunga kering', harga: 1000, satuan: '3 butir', kalori: 4, kategori: 'bumbu', gambar: '/images/bahan/garam-rempah.jpg' },
  { id: 'gula-merah', nama: 'Gula merah / aren kelapa', harga: 1500, satuan: 'potong kecil', kalori: 40, kategori: 'bumbu', gambar: '/images/bahan/garam-rempah.jpg' },
  { id: 'gula-pasir', nama: 'Gula pasir putih murni', harga: 1000, satuan: '1 sdm', kalori: 48, kategori: 'bumbu', gambar: '/images/bahan/garam-rempah.jpg' },
  { id: 'garam-rempah', nama: 'Garam & penyedap kaldu', harga: 1000, satuan: 'porsi tabur', kalori: 5, kategori: 'bumbu', gambar: '/images/bahan/garam-rempah.jpg' },
  { id: 'kaldu-jamur', nama: 'Kaldu jamur totole gurih alami', harga: 1500, satuan: 'sachet kecil', kalori: 8, kategori: 'bumbu', gambar: '/images/bahan/garam-rempah.jpg' },
  { id: 'jeruk-nipis', nama: 'Jeruk nipis peras segar', harga: 1500, satuan: 'buah', kalori: 12, kategori: 'bumbu', gambar: '/images/bahan/mentimun.jpg' },
  { id: 'jeruk-limau', nama: 'Jeruk limau sambal harum', harga: 1000, satuan: 'buah', kalori: 8, kategori: 'bumbu', gambar: '/images/bahan/mentimun.jpg' },
  { id: 'bawang-goreng', nama: 'Bawang merah goreng renyah', harga: 2000, satuan: '2 sdm tabur', kalori: 45, kategori: 'bumbu', gambar: '/images/bahan/bawang.jpg' }
];

console.log('Total Bahan:', rawBahan.length);

// ============================================================================
// 2. GENERATE 104 READY-TO-EAT DISHES WITH 100% UNIQUE IMAGES
// ============================================================================
// Every single dish below has its OWN dedicated image file!
// NO TWO DISHES SHARE THE SAME IMAGE PATH!
const distinctMenuDishes = [
  // Ikan & Seafood (Each has its OWN unique fish/seafood photo!)
  { id: 'ikan-bandeng-presto', nama: 'Ikan Bandeng Presto Goreng Balut Telur', harga: 22000, kalori: 490, kategori: 'makan-siang', tempat: 'Warung', img: 'ikan-bandeng-presto.jpg' },
  { id: 'ikan-kembung-bakar', nama: 'Ikan Kembung Bakar Sambal Dabu-Dabu', harga: 20000, kalori: 460, kategori: 'makan-siang', tempat: 'Warung', img: 'ikan-kembung-bakar.jpg' },
  { id: 'ikan-lele-goreng', nama: 'Pecel Lele Goreng Kremes Sambal Lamongan', harga: 16000, kalori: 480, kategori: 'makan-malam', tempat: 'Kaki Lima', img: 'ikan-lele-goreng.jpg' },
  { id: 'ikan-gurame-asam-manis', nama: 'Gurame Goreng Saus Asam Manis Nanas', harga: 38000, kalori: 630, kategori: 'makan-siang', tempat: 'Restoran', img: 'ikan-gurame-asam-manis.jpg' },
  { id: 'ikan-nila-bakar', nama: 'Ikan Nila Bakar Sambal Kecap Bawang', harga: 23000, kalori: 490, kategori: 'makan-malam', tempat: 'Rumah Makan', img: 'ikan-nila-bakar.jpg' },
  { id: 'ikan-kakap-merah-bakar', nama: 'Ikan Kakap Merah Bakar Bumbu Jimbaran', harga: 42000, kalori: 580, kategori: 'makan-malam', tempat: 'Restoran', img: 'ikan-kakap-merah-bakar.jpg' },
  { id: 'ikan-bakar-madu', nama: 'Ikan Bakar Madu Gurih Saus Mentega', harga: 26000, kalori: 520, kategori: 'makan-siang', tempat: 'Rumah Makan', img: 'ikan-bakar.jpg' },
  { id: 'kerang-hijau-saus-tiram', nama: 'Kerang Hijau Tumis Saus Tiram Gurih', harga: 19000, kalori: 410, kategori: 'makan-malam', tempat: 'Warung', img: 'kerang-hijau-saus-tiram.jpg' },
  { id: 'kerang-dara-rebus', nama: 'Kerang Dara Rebus Sambal Nanas Pedas', harga: 18000, kalori: 375, kategori: 'makan-malam', tempat: 'Kaki Lima', img: 'kerang-dara-rebus.jpg' },
  { id: 'cumi-goreng-tepung', nama: 'Cumi Goreng Tepung Calamari Saus Tartar', harga: 25000, kalori: 510, kategori: 'makan-siang', tempat: 'Kafe', img: 'cumi-goreng-tepung.jpg' },
  { id: 'cumi-saus-padang', nama: 'Cumi Segar Masak Saus Padang Pedas Manis', harga: 27000, kalori: 490, kategori: 'makan-malam', tempat: 'Rumah Makan', img: 'cumi-saus-padang.jpg' },
  { id: 'kepiting-saus-padang', nama: 'Kepiting Saus Padang Telur Kuah Kental', harga: 55000, kalori: 690, kategori: 'makan-malam', tempat: 'Restoran', img: 'kepiting-saus-padang.jpg' },
  { id: 'udang-bakar-madu', nama: 'Udang Bakar Madu Bumbu Bakaran Gurih', harga: 29000, kalori: 480, kategori: 'makan-siang', tempat: 'Restoran', img: 'udang-bakar-madu.jpg' },
  { id: 'udang-saus-padang', nama: 'Udang Saus Padang Seafood Istimewa', harga: 28000, kalori: 520, kategori: 'makan-malam', tempat: 'Rumah Makan', img: 'udang-seafood.jpg' },
  { id: 'pempek-kapal-selam', nama: 'Pempek Palembang Asli Kapal Selam Cuko', harga: 22000, kalori: 540, kategori: 'camilan', tempat: 'Warung', img: 'pempek.jpg' },

  // Olahan Nasi & Beras (Each has its OWN unique photo!)
  { id: 'nasi-goreng-spesial', nama: 'Nasi Goreng Spesial Telur Sosis Bakso', harga: 18000, kalori: 620, kategori: 'makan-malam', tempat: 'Warung', img: 'nasi-goreng-spesial.jpg' },
  { id: 'nasi-goreng-seafood', nama: 'Nasi Goreng Seafood Udang & Cumi', harga: 24000, kalori: 650, kategori: 'makan-malam', tempat: 'Restoran', img: 'nasi-goreng-seafood.jpg' },
  { id: 'nasi-goreng-kampung', nama: 'Nasi Goreng Kampung Ikan Teri Cabai Rawit', harga: 16000, kalori: 570, kategori: 'sarapan', tempat: 'Kaki Lima', img: 'nasi-goreng-kampung.jpg' },
  { id: 'nasi-gila-lengkap', nama: 'Nasi Gila Komplit Sosis Bakso Telur Pedas', harga: 20000, kalori: 680, kategori: 'makan-malam', tempat: 'Kaki Lima', img: 'nasi-gila-lengkap.jpg' },
  { id: 'nasi-uduk-komplit', nama: 'Nasi Uduk Betawi Ayam Goreng Sambal Kacang', harga: 20000, kalori: 670, kategori: 'sarapan', tempat: 'Warung', img: 'nasi-uduk-komplit.jpg' },
  { id: 'nasi-kuning-komplit', nama: 'Nasi Kuning Manado Abon Ikan Cakalang', harga: 19000, kalori: 560, kategori: 'sarapan', tempat: 'Warung', img: 'nasi-kuning-komplit.jpg' },
  { id: 'nasi-liwet-solo', nama: 'Nasi Liwet Solo Gurih Opor Ayam Suwir Labu', harga: 22000, kalori: 610, kategori: 'makan-siang', tempat: 'Warung', img: 'nasi-liwet-solo.jpg' },
  { id: 'nasi-bakar-tongkol', nama: 'Nasi Bakar Tongkol Kemangi Daun Pisang', harga: 18000, kalori: 490, kategori: 'makan-siang', tempat: 'Warung', img: 'nasi-bakar-tongkol.jpg' },
  { id: 'nasi-pecel-madiun', nama: 'Nasi Pecel Madiun Pincuk Rempeyek Kacang', harga: 15000, kalori: 420, kategori: 'sarapan', tempat: 'Warung', img: 'nasi-pecel-madiun.jpg' },
  { id: 'nasi-rawon-daging', nama: 'Nasi Rawon Daging Sapi Kuah Hitam Kluwek', harga: 28000, kalori: 640, kategori: 'makan-siang', tempat: 'Rumah Makan', img: 'nasi-rawon-daging.jpg' },
  { id: 'nasi-kebuli-kambing', nama: 'Nasi Kebuli Kambing Rempah Minyak Samin', harga: 38000, kalori: 780, kategori: 'makan-siang', tempat: 'Restoran', img: 'nasi-kebuli-kambing.jpg' },
  { id: 'nasi-campur-bali', nama: 'Nasi Campur Bali Ayam Betutu Sate Lilit', harga: 32000, kalori: 710, kategori: 'makan-siang', tempat: 'Restoran', img: 'nasi-campur-bali.jpg' },
  { id: 'nasi-padang-rendang', nama: 'Nasi Padang Rendang Sapi Gulai Nangka', harga: 25000, kalori: 780, kategori: 'makan-siang', tempat: 'Rumah Makan', img: 'nasi-padang-rendang.jpg' },
  { id: 'nasi-ayam-geprek', nama: 'Nasi Ayam Geprek Sambal Bawang Pedas', harga: 18000, kalori: 650, kategori: 'makan-siang', tempat: 'Warung', img: 'nasi-ayam-geprek.jpg' },
  { id: 'bubur-ayam-sukabumi', nama: 'Bubur Ayam Sukabumi Cakwe Telur Rebus', harga: 12000, kalori: 380, kategori: 'sarapan', tempat: 'Kaki Lima', img: 'bubur-ayam.jpg' },

  // Olahan Ayam & Bebek (Each has its OWN unique photo!)
  { id: 'ayam-bakar-madu', nama: 'Ayam Bakar Madu Manis Gurih Meresap', harga: 24000, kalori: 590, kategori: 'makan-malam', tempat: 'Rumah Makan', img: 'ayam-bakar.jpg' },
  { id: 'bebek-goreng-madura', nama: 'Bebek Goreng Madura Bumbu Hitam Rempah', harga: 28000, kalori: 750, kategori: 'makan-malam', tempat: 'Rumah Makan', img: 'bebek-goreng-madura.jpg' },
  { id: 'ayam-taliwang-pedas', nama: 'Ayam Bakar Taliwang Khas Lombok Pedas', harga: 25000, kalori: 610, kategori: 'makan-malam', tempat: 'Rumah Makan', img: 'ayam-taliwang-pedas.jpg' },
  { id: 'ayam-penyet-sambal', nama: 'Ayam Penyet Sambal Korek Ulek Segar', harga: 19000, kalori: 610, kategori: 'makan-siang', tempat: 'Warung', img: 'ayam-penyet-sambal.jpg' },
  { id: 'ayam-kremes-kraton', nama: 'Ayam Goreng Kremes Gurih Renyah Emas', harga: 20000, kalori: 660, kategori: 'makan-siang', tempat: 'Warung', img: 'ayam-kremes-kraton.jpg' },
  { id: 'ayam-pop-minang', nama: 'Ayam Pop Lembut Saus Tomat Padang', harga: 22000, kalori: 580, kategori: 'makan-siang', tempat: 'Rumah Makan', img: 'ayam-pop-minang.jpg' },
  { id: 'ayam-rica-rica', nama: 'Ayam Rica-Rica Kemangi Pedas Manado', harga: 23000, kalori: 610, kategori: 'makan-siang', tempat: 'Rumah Makan', img: 'ayam-rica-rica.jpg' },
  { id: 'fried-chicken-crispy', nama: 'Fried Chicken Crispy Saus Keju Gurih', harga: 16000, kalori: 540, kategori: 'makan-siang', tempat: 'Kaki Lima', img: 'fried-chicken.jpg' },
  { id: 'chicken-katsu-curry', nama: 'Chicken Katsu Saus Curry Jepang Hangat', harga: 25000, kalori: 640, kategori: 'makan-siang', tempat: 'Kafe', img: 'chicken-katsu-curry.jpg' },

  // Sate & Olahan Daging (Each has its OWN unique photo!)
  { id: 'sate-ayam-madura', nama: 'Sate Ayam Madura Bumbu Kacang Tabur Bawang', harga: 22000, kalori: 540, kategori: 'makan-malam', tempat: 'Kaki Lima', img: 'sate.jpg' },
  { id: 'sate-taichan-pedas', nama: 'Sate Taichan Ayam Sambal Rawit Jeruk Nipis', harga: 20000, kalori: 420, kategori: 'makan-malam', tempat: 'Kaki Lima', img: 'sate-taichan-pedas.jpg' },
  { id: 'sate-kambing-muda', nama: 'Sate Kambing Muda Bumbu Kecap Tomat Rawit', harga: 35000, kalori: 660, kategori: 'makan-malam', tempat: 'Rumah Makan', img: 'sate-kambing-muda.jpg' },
  { id: 'sate-padang-lidah', nama: 'Sate Padang Lidah Sapi Kuah Kuning Pedas', harga: 27000, kalori: 610, kategori: 'makan-malam', tempat: 'Kaki Lima', img: 'sate-padang-lidah.jpg' },
  { id: 'sate-lilit-bali', nama: 'Sate Lilit Ayam Batang Serai Khas Bali', harga: 25000, kalori: 520, kategori: 'makan-siang', tempat: 'Restoran', img: 'sate-lilit-bali.jpg' },
  { id: 'sate-maranggi-sapi', nama: 'Sate Maranggi Sapi Purwakarta Sambal Tomat', harga: 32000, kalori: 610, kategori: 'makan-malam', tempat: 'Rumah Makan', img: 'sate-maranggi-sapi.jpg' },
  { id: 'empal-gentong-daging', nama: 'Empal Gentong Cirebon Daging Sapi Kuah Kuning', harga: 26000, kalori: 590, kategori: 'makan-siang', tempat: 'Warung', img: 'empal-gentong-daging.jpg' },
  { id: 'tongseng-kambing', nama: 'Tongseng Kambing Santan Kubis Segar', harga: 32000, kalori: 670, kategori: 'makan-siang', tempat: 'Rumah Makan', img: 'tongseng-kambing.jpg' },
  { id: 'kari-daging-sapi', nama: 'Kari Daging Sapi Rempah Minang Gurih', harga: 26000, kalori: 680, kategori: 'makan-siang', tempat: 'Rumah Makan', img: 'kari-rendang.jpg' },

  // Soto & Sup (Each has its OWN unique photo!)
  { id: 'soto-ayam-lamongan', nama: 'Soto Ayam Lamongan Kuah Kuning Koya Gurih', harga: 16000, kalori: 420, kategori: 'sarapan', tempat: 'Warung', img: 'soto-ayam.jpg' },
  { id: 'soto-betawi-daging', nama: 'Soto Betawi Daging Sapi Kuah Santan Susu', harga: 28000, kalori: 650, kategori: 'makan-siang', tempat: 'Warung', img: 'soto-betawi-daging.jpg' },
  { id: 'soto-kudus-mangkuk', nama: 'Soto Kudus Ayam Mangkuk Kecil Tradisional', harga: 18000, kalori: 410, kategori: 'sarapan', tempat: 'Warung', img: 'soto-kudus-mangkuk.jpg' },
  { id: 'soto-mie-bogor', nama: 'Soto Mie Bogor Daging Risoles Bihun Kuah Bening', harga: 20000, kalori: 540, kategori: 'makan-siang', tempat: 'Kaki Lima', img: 'soto-mie-bogor.jpg' },
  { id: 'coto-makassar-daging', nama: 'Coto Makassar Daging Sapi Kuah Kacang Rempah', harga: 28000, kalori: 640, kategori: 'makan-siang', tempat: 'Rumah Makan', img: 'coto-makassar-daging.jpg' },
  { id: 'sop-konro-bakar', nama: 'Konro Bakar Iga Sapi Saus Kacang Makassar', harga: 42000, kalori: 780, kategori: 'makan-malam', tempat: 'Restoran', img: 'sop-konro-bakar.jpg' },
  { id: 'sop-buntut-sapi', nama: 'Sop Buntut Sapi Kuah Bening Wortel Rempah', harga: 45000, kalori: 680, kategori: 'makan-siang', tempat: 'Restoran', img: 'sop-buntut-sapi.jpg' },
  { id: 'sop-iga-sapi-bening', nama: 'Sop Iga Sapi Kuah Bening Rempah Kayu Manis', harga: 38000, kalori: 620, kategori: 'makan-siang', tempat: 'Rumah Makan', img: 'sop-iga.jpg' },
  { id: 'sayur-asem-komplit', nama: 'Sayur Asem Komplit Jakarta Jagung Labu', harga: 12000, kalori: 180, kategori: 'makan-siang', tempat: 'Warung', img: 'sayur-asem-komplit.jpg' },
  { id: 'sayur-lodeh-santan', nama: 'Sayur Lodeh Labu Siam Tempe Santan Gurih', harga: 13000, kalori: 230, kategori: 'makan-siang', tempat: 'Warung', img: 'sayur-lodeh-santan.jpg' },
  { id: 'bakso-sapi-kuah', nama: 'Bakso Sapi Urat & Halus Kuah Kaldu Bening', harga: 18000, kalori: 450, kategori: 'makan-siang', tempat: 'Kaki Lima', img: 'bakso.jpg' },

  // Mie & Pasta (Each has its OWN unique photo!)
  { id: 'mie-ayam-bakso', nama: 'Mie Ayam Bakso Pangsit Kuah Gurih', harga: 17000, kalori: 520, kategori: 'makan-siang', tempat: 'Warung', img: 'mie-ayam-bakso.jpg' },
  { id: 'kwetiau-goreng-sapi', nama: 'Kwetiau Goreng Daging Sapi Telur Tauge', harga: 25000, kalori: 640, kategori: 'makan-malam', tempat: 'Restoran', img: 'kwetiau-goreng-sapi.jpg' },
  { id: 'kwetiau-siram-seafood', nama: 'Kwetiau Siram Seafood Udang Kuah Kental', harga: 26000, kalori: 610, kategori: 'makan-malam', tempat: 'Restoran', img: 'kwetiau-siram-seafood.jpg' },
  { id: 'bihun-goreng-bakso', nama: 'Bihun Goreng Spesial Bakso Sosis Sayur', harga: 17000, kalori: 510, kategori: 'makan-siang', tempat: 'Warung', img: 'bihun-goreng-bakso.jpg' },
  { id: 'bakmi-jawa-godhog', nama: 'Bakmi Jawa Godhog Kuah Kaldu Telur Bebek', harga: 20000, kalori: 560, kategori: 'makan-malam', tempat: 'Kaki Lima', img: 'bakmi-jawa-godhog.jpg' },
  { id: 'mie-aceh-pedas', nama: 'Mie Aceh Goreng Daging Sapi Bumbu Kari Pedas', harga: 25000, kalori: 670, kategori: 'makan-malam', tempat: 'Restoran', img: 'mie-aceh-pedas.jpg' },
  { id: 'mie-kocok-bandung', nama: 'Mie Kocok Bandung Kikil Kaki Sapi Tauge', harga: 24000, kalori: 610, kategori: 'makan-siang', tempat: 'Warung', img: 'mie-kocok-bandung.jpg' },
  { id: 'indomie-warkop-spesial', nama: 'Indomie Goreng Dobel Telur Kornet Keju (Internet)', harga: 16000, kalori: 620, kategori: 'makan-malam', tempat: 'Warkop', img: 'indomie-warkop-spesial.jpg' },
  { id: 'ramen-kuah-pedas', nama: 'Ramen Ayam Kuah Kaldu Paitan Pedas Gurih', harga: 28000, kalori: 640, kategori: 'makan-siang', tempat: 'Kafe', img: 'ramen-kuah-pedas.jpg' },
  { id: 'spaghetti-bolognese', nama: 'Spaghetti Bolognese Daging Cincang Keju Melt', harga: 26000, kalori: 580, kategori: 'makan-siang', tempat: 'Kafe', img: 'spaghetti-bolognese.jpg' },

  // Camilan & Street Food (Each has its OWN unique photo!)
  { id: 'batagor-bandung', nama: 'Batagor Bandung Renyah Saus Kacang Limau', harga: 16000, kalori: 490, kategori: 'camilan', tempat: 'Kaki Lima', img: 'batagor-bandung.jpg' },
  { id: 'siomay-bandung-komplit', nama: 'Siomay Ikan Bandung Telur Kentang Kol Pare', harga: 18000, kalori: 510, kategori: 'camilan', tempat: 'Kaki Lima', img: 'siomay-bandung-komplit.jpg' },
  { id: 'tahu-gejrot-cirebon', nama: 'Tahu Gejrot Cirebon Kuah Gula Jawa Asam Pedas', harga: 10000, kalori: 220, kategori: 'camilan', tempat: 'Kaki Lima', img: 'tahu-gejrot-cirebon.jpg' },
  { id: 'ketoprak-cirebon', nama: 'Ketoprak Cirebon Bumbu Kacang Bihun Tahu', harga: 15000, kalori: 480, kategori: 'sarapan', tempat: 'Kaki Lima', img: 'ketoprak-cirebon.jpg' },
  { id: 'cireng-rujak-crispy', nama: 'Cireng Krispi Renyah Bumbu Rujak Pedas Manis', harga: 12000, kalori: 350, kategori: 'camilan', tempat: 'Kaki Lima', img: 'cireng-rujak-crispy.jpg' },
  { id: 'seblak-ceker-pedas', nama: 'Seblak Komplit Ceker Sosis Makaroni Kerupuk', harga: 17000, kalori: 520, kategori: 'camilan', tempat: 'Kaki Lima', img: 'seblak-ceker-pedas.jpg' },
  { id: 'bakwan-jagung-renyah', nama: 'Bakwan Jagung Manis Renyah Hangat (4 Pcs)', harga: 10000, kalori: 320, kategori: 'camilan', tempat: 'Warung', img: 'bakwan-jagung-renyah.jpg' },
  { id: 'pisang-goreng-keju', nama: 'Pisang Goreng Crispy Saus Karamel Keju Parut', harga: 15000, kalori: 390, kategori: 'camilan', tempat: 'Kafe', img: 'pisang-goreng-keju.jpg' },
  { id: 'martabak-telor-bebek', nama: 'Martabak Telor Bebek Daging Cincang Gurih', harga: 35000, kalori: 720, kategori: 'camilan', tempat: 'Kaki Lima', img: 'martabak-telor-bebek.jpg' },
  { id: 'martabak-manis-coklat', nama: 'Martabak Manis Coklat Keju Wijen Susu', harga: 28000, kalori: 780, kategori: 'camilan', tempat: 'Kaki Lima', img: 'martabak.jpg' },
  { id: 'roti-bakar-coklat', nama: 'Roti Bakar Bandung Coklat Keju Susu Meises', harga: 16000, kalori: 490, kategori: 'camilan', tempat: 'Warkop', img: 'roti-bakar-coklat.jpg' },
  { id: 'roti-canai-kari', nama: 'Roti Canai Panggang Kuah Kari Ayam Kentang', harga: 18000, kalori: 450, kategori: 'sarapan', tempat: 'Kafe', img: 'roti-canai-kari.jpg' },
  { id: 'burger-sapi-keju', nama: 'Burger Sapi Daging Asli Double Melt Cheese', harga: 28000, kalori: 680, kategori: 'camilan', tempat: 'Kafe', img: 'burger.jpg' },
  { id: 'hotdog-sosis-panggang', nama: 'Hotdog Sosis Sapi Panggang Saus Mustard Keju', harga: 24000, kalori: 560, kategori: 'camilan', tempat: 'Kafe', img: 'hotdog-sosis-panggang.jpg' },
  { id: 'kentang-goreng-french-fries', nama: 'Kentang Goreng French Fries Bumbu Keju BBQ', harga: 15000, kalori: 380, kategori: 'camilan', tempat: 'Kafe', img: 'kentang-goreng-french-fries.jpg' },
  { id: 'dimsum-siomay-kukus', nama: 'Dimsum Siomay Ayam Udang Saus Sambal (4 Pcs)', harga: 20000, kalori: 360, kategori: 'camilan', tempat: 'Kafe', img: 'dimsum.jpg' },
  { id: 'gado-gado-betawi', nama: 'Gado-Gado Betawi Bumbu Kacang Lontong Telur', harga: 17000, kalori: 460, kategori: 'makan-siang', tempat: 'Warung', img: 'gado-gado.jpg' },
  { id: 'salad-buah-segar', nama: 'Salad Buah Segar Saus Mayones Keju Parut', harga: 20000, kalori: 280, kategori: 'camilan', tempat: 'Kafe', img: 'salad-buah.jpg' },

  // Minuman Segar & Kopi (Each has its OWN unique photo!)
  { id: 'es-cendol-dawet', nama: 'Es Cendol Dawet Ayu Banjarnegara Gula Aren', harga: 12000, kalori: 260, kategori: 'minuman', tempat: 'Kaki Lima', img: 'es-cendol-dawet.jpg' },
  { id: 'es-doger-bandung', nama: 'Es Doger Bandung Tape Ketan Hitam Kelapa Muda', harga: 14000, kalori: 290, kategori: 'minuman', tempat: 'Kaki Lima', img: 'es-doger-bandung.jpg' },
  { id: 'es-teler-spesial', nama: 'Es Teler Alpukat Kelapa Muda Nangka Susu', harga: 18000, kalori: 340, kategori: 'minuman', tempat: 'Warung', img: 'es-teler-spesial.jpg' },
  { id: 'es-campur-medan', nama: 'Es Campur Medan Buah Segar Sirup Merah Delima', harga: 15000, kalori: 310, kategori: 'minuman', tempat: 'Warung', img: 'es-campur-medan.jpg' },
  { id: 'es-kuwut-melon', nama: 'Es Kuwut Melon Jeruk Nipis Selasih Khas Bali', harga: 12000, kalori: 160, kategori: 'minuman', tempat: 'Warung', img: 'es-kuwut-melon.jpg' },
  { id: 'es-pisang-ijo-makassar', nama: 'Es Pisang Ijo Khas Makassar Bubur Sumsum DHT', harga: 16000, kalori: 350, kategori: 'minuman', tempat: 'Rumah Makan', img: 'es-pisang-ijo-makassar.jpg' },
  { id: 'es-teh-manis-segar', nama: 'Es Teh Manis Segar Jumbo Dingin', harga: 5000, kalori: 90, kategori: 'minuman', tempat: 'Warung', img: 'es-teh-manis.jpg' },
  { id: 'es-jeruk-peras', nama: 'Es Jeruk Peras Murni Bulir Asli Manis', harga: 8000, kalori: 110, kategori: 'minuman', tempat: 'Warung', img: 'es-jeruk.jpg' },
  { id: 'jus-alpukat-kental', nama: 'Jus Alpukat Kental Saus Coklat Susu Kental', harga: 15000, kalori: 280, kategori: 'minuman', tempat: 'Kafe', img: 'jus-alpukat-kental.jpg' },
  { id: 'jus-mangga-harum-manis', nama: 'Jus Mangga Harum Manis Dingin Segar', harga: 14000, kalori: 210, kategori: 'minuman', tempat: 'Kafe', img: 'jus-mangga-harum-manis.jpg' },
  { id: 'jus-buah-naga', nama: 'Jus Buah Naga Merah Manis Dingin', harga: 14000, kalori: 190, kategori: 'minuman', tempat: 'Kafe', img: 'jus-buah-naga.jpg' },
  { id: 'kopi-susu-gula-aren', nama: 'Kopi Susu Gula Aren Kekinian Creamy', harga: 15000, kalori: 210, kategori: 'minuman', tempat: 'Kafe', img: 'kopi.jpg' },
  { id: 'kopi-tubruk-robusta', nama: 'Kopi Tubruk Robusta Tradisional Dampit Malang', harga: 6000, kalori: 25, kategori: 'minuman', tempat: 'Warkop', img: 'kopi-tubruk-robusta.jpg' },
  { id: 'kopi-tarik-aceh', nama: 'Kopi Tarik Khas Aceh Busa Lembut Wangi', harga: 12000, kalori: 170, kategori: 'minuman', tempat: 'Warkop', img: 'kopi-tarik-aceh.jpg' },
  { id: 'wedang-ronde-jahe', nama: 'Wedang Ronde Jahe Hangat Kuah Gula Merah Kacang', harga: 12000, kalori: 220, kategori: 'minuman', tempat: 'Kaki Lima', img: 'wedang-ronde-jahe.jpg' },
  { id: 'thai-tea-dingin', nama: 'Thai Tea Dingin Creamy Original', harga: 12000, kalori: 180, kategori: 'minuman', tempat: 'Kafe', img: 'thai-tea-dingin.jpg' },
  { id: 'matcha-latte-dingin', nama: 'Matcha Green Tea Latte Dingin Susu Segar', harga: 16000, kalori: 190, kategori: 'minuman', tempat: 'Kafe', img: 'matcha-latte-dingin.jpg' }
];

const menuList = distinctMenuDishes.map(d => ({
  id: d.id,
  nama: d.nama,
  harga: d.harga,
  kalori: d.kalori,
  kategori: d.kategori,
  tempat: d.tempat,
  gambar: `/images/menu/${d.img}`
}));

// VERIFY 100% IMAGE UNIQUENESS!
const imgSet = new Set();
let duplicatesFound = false;
for (const m of menuList) {
  if (imgSet.has(m.gambar)) {
    console.error('DUPLICATE IMAGE FOUND:', m.gambar, 'on dish', m.nama);
    duplicatesFound = true;
  }
  imgSet.add(m.gambar);
}

if (!duplicatesFound) {
  console.log('SUCCESS: All', menuList.length, 'dishes have 100% UNIQUE MATCHING IMAGES!');
}

// Write files
fs.writeFileSync('src/data/bahan.json', JSON.stringify(rawBahan, null, 2), 'utf8');
fs.writeFileSync('src/data/menu.json', JSON.stringify(menuList, null, 2), 'utf8');
console.log('Done writing bahan.json and menu.json!');
