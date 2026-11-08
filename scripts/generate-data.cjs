const fs = require('fs');
const path = require('path');

// ============================================================================
// 1. GENERATE BAHAN (45+ Pantry Ingredients)
// ============================================================================
const bahanList = [
  // KARBO
  { id: 'beras', nama: 'Beras / Nasi', harga: 3000, satuan: 'porsi', kalori: 204, kategori: 'karbo', gambar: '/images/bahan/beras.jpg' },
  { id: 'mie-instan', nama: 'Mie instan', harga: 3500, satuan: 'bungkus', kalori: 380, kategori: 'karbo', gambar: '/images/bahan/mie-instan.jpg' },
  { id: 'bihun', nama: 'Bihun beras', harga: 3000, satuan: 'keping', kalori: 190, kategori: 'karbo', gambar: '/images/bahan/mie-instan.jpg' },
  { id: 'kwetiau', nama: 'Kwetiau basah', harga: 4000, satuan: 'porsi', kalori: 210, kategori: 'karbo', gambar: '/images/bahan/mie-instan.jpg' },
  { id: 'kentang', nama: 'Kentang', harga: 3500, satuan: 'buah', kalori: 160, kategori: 'karbo', gambar: '/images/bahan/kentang.jpg' },
  { id: 'roti-tawar', nama: 'Roti tawar', harga: 2000, satuan: 'lembar', kalori: 130, kategori: 'karbo', gambar: '/images/bahan/roti-tawar.jpg' },
  { id: 'jagung', nama: 'Jagung manis', harga: 3000, satuan: 'buah', kalori: 90, kategori: 'karbo', gambar: '/images/bahan/jagung.jpg' },
  { id: 'makaroni', nama: 'Makaroni', harga: 2500, satuan: 'genggam', kalori: 180, kategori: 'karbo', gambar: '/images/bahan/mie-instan.jpg' },
  { id: 'singkong', nama: 'Singkong putih', harga: 2500, satuan: 'potong', kalori: 150, kategori: 'karbo', gambar: '/images/bahan/kentang.jpg' },
  { id: 'ubi-manis', nama: 'Ubi jalar manis', harga: 2500, satuan: 'buah', kalori: 140, kategori: 'karbo', gambar: '/images/bahan/kentang.jpg' },

  // PROTEIN
  { id: 'telur', nama: 'Telur ayam', harga: 2500, satuan: 'butir', kalori: 74, kategori: 'protein', gambar: '/images/bahan/telur.jpg' },
  { id: 'telur-bebek', nama: 'Telur bebek', harga: 3500, satuan: 'butir', kalori: 130, kategori: 'protein', gambar: '/images/bahan/telur.jpg' },
  { id: 'tempe', nama: 'Tempe kedelai', harga: 3000, satuan: 'papan', kalori: 160, kategori: 'protein', gambar: '/images/bahan/tempe.jpg' },
  { id: 'tahu', nama: 'Tahu putih', harga: 2000, satuan: 'potong', kalori: 80, kategori: 'protein', gambar: '/images/bahan/tahu.jpg' },
  { id: 'tahu-kuning', nama: 'Tahu kuning sutra', harga: 2500, satuan: 'potong', kalori: 85, kategori: 'protein', gambar: '/images/bahan/tahu.jpg' },
  { id: 'ayam', nama: 'Ayam fillet', harga: 8000, satuan: 'potong', kalori: 165, kategori: 'protein', gambar: '/images/bahan/ayam.jpg' },
  { id: 'daging-sapi', nama: 'Daging sapi cincang', harga: 14000, satuan: 'porsi (100g)', kalori: 250, kategori: 'protein', gambar: '/images/bahan/daging-sapi.jpg' },
  { id: 'udang', nama: 'Udang segar', harga: 9000, satuan: 'porsi (80g)', kalori: 110, kategori: 'protein', gambar: '/images/bahan/udang.jpg' },
  { id: 'cumi', nama: 'Cumi-cumi bersih', harga: 9000, satuan: 'porsi', kalori: 95, kategori: 'protein', gambar: '/images/bahan/udang.jpg' },
  { id: 'ikan-tongkol', nama: 'Ikan tongkol suwir', harga: 6000, satuan: 'porsi', kalori: 130, kategori: 'protein', gambar: '/images/bahan/ayam.jpg' },
  { id: 'bakso', nama: 'Bakso sapi', harga: 4000, satuan: 'butir (5 pcs)', kalori: 150, kategori: 'protein', gambar: '/images/menu/bakso.jpg' },
  { id: 'sosis', nama: 'Sosis ayam/sapi', harga: 3000, satuan: 'batang', kalori: 140, kategori: 'protein', gambar: '/images/bahan/sosis.jpg' },
  { id: 'kornet', nama: 'Kornet daging sapi', harga: 5000, satuan: 'sachet', kalori: 180, kategori: 'protein', gambar: '/images/bahan/daging-sapi.jpg' },
  { id: 'keju', nama: 'Keju cheddar parut', harga: 4000, satuan: 'porsi', kalori: 120, kategori: 'protein', gambar: '/images/bahan/keju.jpg' },

  // SAYUR
  { id: 'kangkung', nama: 'Kangkung segar', harga: 2500, satuan: 'ikat', kalori: 28, kategori: 'sayur', gambar: '/images/bahan/kangkung.jpg' },
  { id: 'bayam', nama: 'Bayam hijau', harga: 2500, satuan: 'ikat', kalori: 23, kategori: 'sayur', gambar: '/images/bahan/bayam.jpg' },
  { id: 'wortel', nama: 'Wortel manis', harga: 2000, satuan: 'buah', kalori: 25, kategori: 'sayur', gambar: '/images/bahan/wortel.jpg' },
  { id: 'brokoli', nama: 'Brokoli segar', harga: 4000, satuan: 'kuntum', kalori: 35, kategori: 'sayur', gambar: '/images/bahan/brokoli.jpg' },
  { id: 'kol', nama: 'Kubis / Kol', harga: 2000, satuan: 'potong', kalori: 22, kategori: 'sayur', gambar: '/images/bahan/kangkung.jpg' },
  { id: 'tauge', nama: 'Tauge kedelai', harga: 1500, satuan: 'kantong', kalori: 30, kategori: 'sayur', gambar: '/images/bahan/bayam.jpg' },
  { id: 'buncis', nama: 'Buncis muda', harga: 2500, satuan: 'ikat', kalori: 31, kategori: 'sayur', gambar: '/images/bahan/kangkung.jpg' },
  { id: 'sawi-hijau', nama: 'Sawi hijau / Caisim', harga: 2000, satuan: 'ikat', kalori: 20, kategori: 'sayur', gambar: '/images/bahan/kangkung.jpg' },
  { id: 'sawi-putih', nama: 'Sawi putih', harga: 2500, satuan: 'potong', kalori: 18, kategori: 'sayur', gambar: '/images/bahan/kangkung.jpg' },
  { id: 'jamur', nama: 'Jamur tiram', harga: 3000, satuan: 'bungkus', kalori: 35, kategori: 'sayur', gambar: '/images/bahan/jamur.jpg' },
  { id: 'terong', nama: 'Terong ungu', harga: 2000, satuan: 'buah', kalori: 25, kategori: 'sayur', gambar: '/images/bahan/wortel.jpg' },
  { id: 'mentimun', nama: 'Mentimun segar', harga: 1500, satuan: 'buah', kalori: 16, kategori: 'sayur', gambar: '/images/bahan/mentimun.jpg' },
  { id: 'tomat', nama: 'Tomat merah segar', harga: 1500, satuan: 'buah', kalori: 22, kategori: 'sayur', gambar: '/images/bahan/tomat.jpg' },
  { id: 'daun-bawang', nama: 'Daun bawang & seledri', harga: 1000, satuan: 'ikat kecil', kalori: 12, kategori: 'sayur', gambar: '/images/bahan/kangkung.jpg' },

  // BUMBU
  { id: 'bawang', nama: 'Bawang merah & putih', harga: 1500, satuan: 'porsi bumbu', kalori: 15, kategori: 'bumbu', gambar: '/images/bahan/bawang.jpg' },
  { id: 'bawang-putih', nama: 'Bawang putih halus', harga: 1000, satuan: 'porsi', kalori: 10, kategori: 'bumbu', gambar: '/images/bahan/bawang-putih.jpg' },
  { id: 'cabai', nama: 'Cabai rawit & merah', harga: 1500, satuan: 'porsi bumbu', kalori: 10, kategori: 'bumbu', gambar: '/images/bahan/cabai.jpg' },
  { id: 'kecap', nama: 'Kecap manis', harga: 1000, satuan: 'sachet', kalori: 45, kategori: 'bumbu', gambar: '/images/bahan/kecap.jpg' },
  { id: 'minyak', nama: 'Minyak goreng', harga: 1500, satuan: '2 sdm', kalori: 120, kategori: 'bumbu', gambar: '/images/bahan/minyak.jpg' },
  { id: 'saus-tiram', nama: 'Saus tiram gurih', harga: 1500, satuan: 'sachet', kalori: 25, kategori: 'bumbu', gambar: '/images/bahan/kecap.jpg' },
  { id: 'margarin', nama: 'Margarin gurih', harga: 1500, satuan: '1 sdm', kalori: 100, kategori: 'bumbu', gambar: '/images/bahan/minyak.jpg' },
  { id: 'santan', nama: 'Santan kelapa kental', harga: 3000, satuan: 'sachet kecil', kalori: 130, kategori: 'bumbu', gambar: '/images/bahan/minyak.jpg' },
  { id: 'garam-rempah', nama: 'Garam, gula & merica', harga: 1000, satuan: 'porsi tabur', kalori: 8, kategori: 'bumbu', gambar: '/images/bahan/garam-rempah.jpg' }
];

// ============================================================================
// 2. GENERATE RESEP (40+ Home Cooking Recipes)
// ============================================================================
const resepList = [
  {
    id: 'nasi-goreng-telur',
    nama: 'Nasi goreng telur',
    waktu: 15,
    gambar: '/images/resep/nasi-goreng-telur.jpg',
    bahan: [
      { id: 'beras', jumlah: 1 },
      { id: 'telur', jumlah: 1 },
      { id: 'bawang', jumlah: 1 },
      { id: 'kecap', jumlah: 1 },
      { id: 'minyak', jumlah: 1 }
    ],
    langkah: [
      'Panaskan minyak di wajan dengan api sedang.',
      'Tumis irisan bawang merah dan putih sampai harum keemasan.',
      'Masukkan telur, orak-arik hingga setengah matang dan beraroma gurih.',
      'Masukkan nasi putih, beri kecap manis, garam, dan merica secukupnya.',
      'Aduk cepat di atas api besar hingga bumbu merata dan tercium aroma sangit sedap. Angkat dan sajikan hangat.'
    ]
  },
  {
    id: 'telur-dadar',
    nama: 'Telur dadar tebal gurih',
    waktu: 8,
    gambar: '/images/resep/telur-dadar.jpg',
    bahan: [
      { id: 'telur', jumlah: 2 },
      { id: 'bawang', jumlah: 1 },
      { id: 'cabai', jumlah: 1 },
      { id: 'minyak', jumlah: 1 }
    ],
    langkah: [
      'Kocok lepas 2 butir telur ayam dalam mangkuk.',
      'Iris tipis bawang merah, bawang putih, dan cabai rawit.',
      'Campurkan irisan bumbu ke kocokan telur, tambahkan sedikit garam.',
      'Panaskan minyak agak banyak di wajan cekung.',
      'Tuang telur saat minyak panas, goreng sampai pinggirannya renyah keriting dan bagian tengah matang merata.'
    ]
  },
  {
    id: 'tumis-kangkung',
    nama: 'Tumis kangkung terasi',
    waktu: 10,
    gambar: '/images/resep/tumis-kangkung.jpg',
    bahan: [
      { id: 'kangkung', jumlah: 1 },
      { id: 'bawang', jumlah: 1 },
      { id: 'cabai', jumlah: 1 },
      { id: 'minyak', jumlah: 1 }
    ],
    langkah: [
      'Petik dan cuci bersih kangkung di air mengalir, tiriskan.',
      'Iris halus bawang merah, bawang putih, dan cabai rawit.',
      'Tumis bumbu iris dengan 2 sdm minyak sampai harum semerbak.',
      'Masukkan kangkung, besarkan api kompor, aduk cepat selama 2-3 menit agar warnanya tetap hijau segar.',
      'Bumbui dengan garam dan sedikit gula, angkat selagi renyah krispi.'
    ]
  },
  {
    id: 'sayur-bayam',
    nama: 'Sayur bayam bening jagung',
    waktu: 12,
    gambar: '/images/resep/sayur-bayam.jpg',
    bahan: [
      { id: 'bayam', jumlah: 1 },
      { id: 'jagung', jumlah: 1 },
      { id: 'bawang', jumlah: 1 }
    ],
    langkah: [
      'Didihkan 600 ml air dalam panci.',
      'Masukkan potongan jagung manis dan irisan bawang merah/putih, masak hingga jagung empuk manis.',
      'Bumbui dengan garam dan sejumput gula pasir.',
      'Masukkan daun bayam yang sudah dicuci bersih.',
      'Masak sebentar sekitar 1 menit sampai bayam layu, segera matikan api agar kuah tetap segar bening.'
    ]
  },
  {
    id: 'tahu-goreng-kecap',
    nama: 'Tahu goreng kecap pedas',
    waktu: 12,
    gambar: '/images/resep/tahu-goreng-kecap.jpg',
    bahan: [
      { id: 'tahu', jumlah: 2 },
      { id: 'kecap', jumlah: 1 },
      { id: 'cabai', jumlah: 1 },
      { id: 'minyak', jumlah: 1 }
    ],
    langkah: [
      'Potong dadu tahu putih, rendam sejenak di air garam.',
      'Goreng tahu dalam minyak panas sampai berkulit kuning keemasan, tiriskan.',
      'Ulek kasar cabai rawit merah dan sedikit bawang putih.',
      'Campurkan ulekan cabai dengan kecap manis kental di mangkuk saji.',
      'Siramkan saus kecap pedas ke atas tahu goreng hangat, sajikan dengan taburan bawang goreng.'
    ]
  },
  {
    id: 'tempe-orek',
    nama: 'Tempe orek manis gurih',
    waktu: 15,
    gambar: '/images/resep/tempe-orek.jpg',
    bahan: [
      { id: 'tempe', jumlah: 1 },
      { id: 'bawang', jumlah: 1 },
      { id: 'cabai', jumlah: 1 },
      { id: 'kecap', jumlah: 1 },
      { id: 'minyak', jumlah: 1 }
    ],
    langkah: [
      'Potong tempe bentuk korek api tipis memanjang.',
      'Goreng tempe dalam minyak panas hingga setengah kering atau renyah, angkat.',
      'Tumis irisan bawang dan cabai rawit sampai harum matang.',
      'Beri 2 sdm air, masukkan kecap manis kental dan garam, aduk hingga kuah mengental berbuih.',
      'Masukkan tempe goreng, aduk cepat hingga semua permukaan tempe terbalut karamel kecap.'
    ]
  },
  {
    id: 'mie-telur-sayur',
    nama: 'Mie instan nyemek telur sayur',
    waktu: 10,
    gambar: '/images/resep/mie-telur-sayur.jpg',
    bahan: [
      { id: 'mie-instan', jumlah: 1 },
      { id: 'telur', jumlah: 1 },
      { id: 'sawi-hijau', jumlah: 1 },
      { id: 'cabai', jumlah: 1 }
    ],
    langkah: [
      'Rebus air secukupnya (jangan terlalu banyak agar kuah kental nyemek).',
      'Masukkan mie instan dan irisan cabai rawit pedas.',
      'Pecahkan 1 butir telur langsung ke dalam kuah mendidih, aduk perlahan agar kuahnya creamy.',
      'Masukkan potongan sawi hijau segar dan bumbu mie instan.',
      'Masak hingga kuah mengental gurih, angkat dan sajikan selagi panas.'
    ]
  },
  {
    id: 'ayam-goreng-sederhana',
    nama: 'Ayam goreng bawang ketumbar',
    waktu: 20,
    gambar: '/images/resep/ayam-goreng-sederhana.jpg',
    bahan: [
      { id: 'ayam', jumlah: 1 },
      { id: 'bawang', jumlah: 1 },
      { id: 'minyak', jumlah: 1 }
    ],
    langkah: [
      'Cuci bersih potongan ayam fillet, lumuri dengan bawang putih halus, garam, dan merica.',
      'Diamkan selama 10 menit agar bumbu meresap ke dalam serat daging.',
      'Panaskan minyak cukup banyak di wajan.',
      'Goreng ayam dengan api sedang sampai matang merata dan berwarna cokelat keemasan menggoda.',
      'Tiriskan minyaknya dan sajikan dengan sambal favorit.'
    ]
  },
  {
    id: 'bihun-goreng-spesial',
    nama: 'Bihun goreng bakso sayur',
    waktu: 15,
    gambar: '/images/resep/mie-telur-sayur.jpg',
    bahan: [
      { id: 'bihun', jumlah: 1 },
      { id: 'bakso', jumlah: 1 },
      { id: 'wortel', jumlah: 1 },
      { id: 'bawang', jumlah: 1 },
      { id: 'kecap', jumlah: 1 },
      { id: 'minyak', jumlah: 1 }
    ],
    langkah: [
      'Seduh bihun dengan air hangat sampai lembut, tiriskan lalu beri sedikit kecap manis dan minyak.',
      'Tumis bawang merah dan putih cincang sampai harum.',
      'Masukkan irisan bakso dan wortel yang dipotong korek api, tumis hingga empuk.',
      'Masukkan bihun, bumbui dengan garam, merica, dan saus tiram.',
      'Aduk rata dengan api sedang hingga bumbu meresap sempurna.'
    ]
  },
  {
    id: 'kwetiau-siram-telur',
    nama: 'Kwetiau siram telur kuah kental',
    waktu: 12,
    gambar: '/images/resep/mie-telur-sayur.jpg',
    bahan: [
      { id: 'kwetiau', jumlah: 1 },
      { id: 'telur', jumlah: 1 },
      { id: 'sawi-hijau', jumlah: 1 },
      { id: 'bawang', jumlah: 1 },
      { id: 'minyak', jumlah: 1 }
    ],
    langkah: [
      'Goreng kwetiau sebentar di wajan panas dengan sedikit kecap asin dan minyak wijen, tata di piring.',
      'Untuk kuahnya: tumis bawang putih hingga harum, tuang 300 ml air kaldu.',
      'Masukkan potongan sawi hijau dan bumbui garam merica.',
      'Kocok telur lalu tuang perlahan sambil diaduk memutar hingga membentuk serabut lembut.',
      'Siramkan kuah telur kental panas ke atas kwetiau.'
    ]
  },
  {
    id: 'sop-ayam-makaroni',
    nama: 'Sop ayam bening makaroni',
    waktu: 20,
    gambar: '/images/resep/sayur-bayam.jpg',
    bahan: [
      { id: 'ayam', jumlah: 1 },
      { id: 'makaroni', jumlah: 1 },
      { id: 'wortel', jumlah: 1 },
      { id: 'kentang', jumlah: 1 },
      { id: 'bawang', jumlah: 1 }
    ],
    langkah: [
      'Rebus ayam fillet hingga keluar kaldu gurihnya, tiriskan dan potong dadu.',
      'Masukkan potongan wortel dan kentang ke dalam air kaldu mendidih.',
      'Tumis bawang putih dan bawang merah cincang, masukkan ke dalam kuah sop.',
      'Tambahkan makaroni rebus, bumbui dengan garam, gula, dan merica bubuk.',
      'Masak hingga sayuran empuk, taburi daun bawang dan seledri sebelum dihidangkan.'
    ]
  },
  {
    id: 'daging-sapi-lada-hitam',
    nama: 'Tumis sapi lada hitam gurih',
    waktu: 15,
    gambar: '/images/resep/ayam-goreng-sederhana.jpg',
    bahan: [
      { id: 'daging-sapi', jumlah: 1 },
      { id: 'bawang', jumlah: 1 },
      { id: 'kecap', jumlah: 1 },
      { id: 'minyak', jumlah: 1 }
    ],
    langkah: [
      'Marinasi daging sapi dengan kecap manis, saus tiram, dan lada hitam tumbuk kasar selama 10 menit.',
      'Panaskan minyak, tumis irisan bawang hingga harum dan layu.',
      'Masukkan daging sapi, masak dengan api besar sambil diaduk cepat sampai daging berubah warna.',
      'Beri sedikit air agar bumbu meresap dan mengental.',
      'Angkat saat daging empuk berbalut saus lada hitam gurih pekat.'
    ]
  },
  {
    id: 'udang-asam-manis',
    nama: 'Udang saus tiram asam manis',
    waktu: 12,
    gambar: '/images/resep/tumis-kangkung.jpg',
    bahan: [
      { id: 'udang', jumlah: 1 },
      { id: 'tomat', jumlah: 1 },
      { id: 'bawang', jumlah: 1 },
      { id: 'minyak', jumlah: 1 }
    ],
    langkah: [
      'Bersihkan udang dan buang kotorannya, lumuri sedikit perasan jeruk nipis.',
      'Tumis bawang putih dan bawang merah hingga wangi.',
      'Masukkan potongan tomat segar dan udang, tumis hingga udang berubah warna kemerahan.',
      'Tambahkan saus tiram, sedikit gula, dan garam.',
      'Masak sebentar selama 3-4 menit sampai kuah meresap, sajikan hangat.'
    ]
  },
  {
    id: 'roti-bakar-telur-keju',
    nama: 'Roti bakar telur keju meleleh',
    waktu: 10,
    gambar: '/images/menu/roti-bakar-coklat.jpg',
    bahan: [
      { id: 'roti-tawar', jumlah: 2 },
      { id: 'telur', jumlah: 1 },
      { id: 'keju', jumlah: 1 },
      { id: 'margarin', jumlah: 1 }
    ],
    langkah: [
      'Goreng telur mata sapi atau dadar tipis di wajan anti lengket.',
      'Olesi permukaan roti tawar dengan margarin gurih.',
      'Letakkan telur goreng dan parutan keju cheddar di antara dua lembar roti.',
      'Panggang roti di wajan datar dengan api kecil sambil dibolak-balik hingga kecokelatan krispi.',
      'Potong segitiga dan nikmati selagi keju masih lumer hangat.'
    ]
  },
  {
    id: 'capcay-sayur-bakso',
    nama: 'Capcay kuah sayur bakso',
    waktu: 15,
    gambar: '/images/resep/tumis-kangkung.jpg',
    bahan: [
      { id: 'bakso', jumlah: 1 },
      { id: 'wortel', jumlah: 1 },
      { id: 'brokoli', jumlah: 1 },
      { id: 'kol', jumlah: 1 },
      { id: 'bawang', jumlah: 1 },
      { id: 'minyak', jumlah: 1 }
    ],
    langkah: [
      'Potong-potong wortel, brokoli, kol, dan iris bakso sapi.',
      'Tumis bawang putih cincang hingga harum kekuningan.',
      'Masukkan irisan bakso dan wortel, beri sedikit air, masak sampai wortel mulai lunak.',
      'Masukkan brokoli dan kol, bumbui dengan garam, merica, dan saus tiram.',
      'Aduk rata selama 2-3 menit hingga sayuran matang renyah berkuah gurih.'
    ]
  },
  {
    id: 'perkedel-kentang-daging',
    nama: 'Perkedel kentang daging lembut',
    waktu: 20,
    gambar: '/images/resep/telur-dadar.jpg',
    bahan: [
      { id: 'kentang', jumlah: 2 },
      { id: 'telur', jumlah: 1 },
      { id: 'daging-sapi', jumlah: 1 },
      { id: 'bawang', jumlah: 1 },
      { id: 'minyak', jumlah: 1 }
    ],
    langkah: [
      'Kupas kentang, potong-potong lalu goreng hingga empuk matang. Haluskan selagi panas.',
      'Tumis daging sapi cincang bersama bawang putih halus hingga matang beraroma.',
      'Campurkan kentang lumat, daging tumis, irisan daun seledri, garam, dan merica bubuk.',
      'Bentuk adonan bulat pipih padat.',
      'Celupkan ke kocokan putih telur, goreng dalam minyak panas api sedang hingga kuning kecokelatan.'
    ]
  }
];

resepList.push(...[
  {
    "id": "ayam-kecap-mentega",
    "nama": "Ayam kecap saus mentega gurih",
    "waktu": 20,
    "gambar": "/images/resep/ayam-goreng-sederhana.jpg",
    "bahan": [
      {
        "id": "ayam",
        "jumlah": 1
      },
      {
        "id": "margarin",
        "jumlah": 1
      },
      {
        "id": "kecap",
        "jumlah": 1
      },
      {
        "id": "bawang",
        "jumlah": 1
      }
    ],
    "langkah": [
      "Goreng ayam fillet hingga setengah matang dan berkulit, tiriskan.",
      "Lelehkan margarin gurih di wajan dengan api sedang.",
      "Tumis irisan bawang hingga harum dan layu keemasan.",
      "Masukkan kecap manis, saus tiram, dan sedikit air perasan jeruk nipis.",
      "Masukkan ayam, aduk cepat hingga kuah mentega menyusut dan membalut daging ayam."
    ]
  },
  {
    "id": "nasi-gila-lengkap",
    "nama": "Nasi gila komplit sosis bakso telur",
    "waktu": 15,
    "gambar": "/images/resep/nasi-goreng-telur.jpg",
    "bahan": [
      {
        "id": "beras",
        "jumlah": 1
      },
      {
        "id": "telur",
        "jumlah": 1
      },
      {
        "id": "sosis",
        "jumlah": 1
      },
      {
        "id": "bakso",
        "jumlah": 1
      },
      {
        "id": "bawang",
        "jumlah": 1
      },
      {
        "id": "kecap",
        "jumlah": 1
      },
      {
        "id": "cabai",
        "jumlah": 1
      }
    ],
    "langkah": [
      "Iris sosis dan bakso sapi tipis melingkar.",
      "Tumis bawang merah, bawang putih, dan cabai rawit hingga harum.",
      "Pecahkan telur, orak-arik cepat di wajan bersama sosis dan bakso.",
      "Beri kecap manis, saus tiram, garam, dan merica, aduk sampai mengental manis gurih.",
      "Siramkan tumisan gila panas ke atas sepiring nasi putih hangat."
    ]
  },
  {
    "id": "telur-balado-padang",
    "nama": "Telur balado merah pedas manis",
    "waktu": 15,
    "gambar": "/images/resep/telur-dadar.jpg",
    "bahan": [
      {
        "id": "telur",
        "jumlah": 2
      },
      {
        "id": "cabai",
        "jumlah": 1
      },
      {
        "id": "tomat",
        "jumlah": 1
      },
      {
        "id": "bawang",
        "jumlah": 1
      },
      {
        "id": "minyak",
        "jumlah": 1
      }
    ],
    "langkah": [
      "Rebus telur ayam hingga matang padat, kupas kulitnya lalu goreng sebentar hingga berkulit.",
      "Ulek kasar cabai merah, cabai rawit, tomat, dan bawang merah.",
      "Tumis sambal balado dengan minyak hingga matang tanak dan minyak berwarna merah berkilau.",
      "Bumbui dengan garam dan sedikit gula pasir penyedap rasa.",
      "Masukkan telur goreng, aduk rata perlahan agar bumbu balado meresap sempurna."
    ]
  },
  {
    "id": "tumis-buncis-telur",
    "nama": "Tumis buncis wortel orak-arik telur",
    "waktu": 12,
    "gambar": "/images/resep/tumis-kangkung.jpg",
    "bahan": [
      {
        "id": "buncis",
        "jumlah": 1
      },
      {
        "id": "wortel",
        "jumlah": 1
      },
      {
        "id": "telur",
        "jumlah": 1
      },
      {
        "id": "bawang",
        "jumlah": 1
      },
      {
        "id": "minyak",
        "jumlah": 1
      }
    ],
    "langkah": [
      "Iris serong buncis muda dan potong wortel bentuk korek api.",
      "Tumis bawang merah dan putih hingga harum semerbak.",
      "Sisihkan bumbu ke pinggir wajan, masukkan telur dan orak-arik hingga butirannya matang.",
      "Masukkan buncis dan wortel, beri 3 sdm air, bumbui garam dan merica.",
      "Aduk cepat selama 3 menit hingga sayuran matang renyah, angkat selagi segar."
    ]
  },
  {
    "id": "semur-tahu-tempe",
    "nama": "Semur tahu tempe bumbu rempah kecap",
    "waktu": 20,
    "gambar": "/images/resep/tahu-goreng-kecap.jpg",
    "bahan": [
      {
        "id": "tahu",
        "jumlah": 1
      },
      {
        "id": "tempe",
        "jumlah": 1
      },
      {
        "id": "kecap",
        "jumlah": 1
      },
      {
        "id": "bawang",
        "jumlah": 1
      },
      {
        "id": "minyak",
        "jumlah": 1
      }
    ],
    "langkah": [
      "Goreng tahu dan tempe sebentar sampai setengah matang, tiriskan.",
      "Tumis bawang putih dan bawang merah halus hingga harum.",
      "Tuang 300 ml air, masukkan kecap manis kental, garam, dan merica.",
      "Masukkan potongan tahu dan tempe, aduk perlahan.",
      "Masak dengan api kecil sampai kuah semur menyusut gurih dan meresap ke dalam tahu tempe."
    ]
  },
  {
    "id": "bakwan-jagung-renyah",
    "nama": "Bakwan jagung manis krispi",
    "waktu": 15,
    "gambar": "/images/resep/telur-dadar.jpg",
    "bahan": [
      {
        "id": "jagung",
        "jumlah": 1
      },
      {
        "id": "telur",
        "jumlah": 1
      },
      {
        "id": "daun-bawang",
        "jumlah": 1
      },
      {
        "id": "bawang",
        "jumlah": 1
      },
      {
        "id": "minyak",
        "jumlah": 1
      }
    ],
    "langkah": [
      "Pipil jagung manis, ulek kasar sebagian agar sari manisnya keluar.",
      "Campurkan jagung dengan kocokan telur, irisan daun bawang, bawang putih halus, garam, dan sedikit tepung beras/terigu.",
      "Aduk hingga adonan menyatu dan kental.",
      "Sendokkan adonan ke dalam minyak panas yang cukup banyak.",
      "Goreng dengan api sedang hingga bakwan kuning keemasan dan renyah krispi di pinggirannya."
    ]
  },
  {
    "id": "cumi-saus-tiram-pedas",
    "nama": "Tumis cumi saus tiram cabe rawit",
    "waktu": 12,
    "gambar": "/images/resep/tumis-kangkung.jpg",
    "bahan": [
      {
        "id": "cumi",
        "jumlah": 1
      },
      {
        "id": "cabai",
        "jumlah": 1
      },
      {
        "id": "bawang",
        "jumlah": 1
      },
      {
        "id": "saus-tiram",
        "jumlah": 1
      },
      {
        "id": "minyak",
        "jumlah": 1
      }
    ],
    "langkah": [
      "Potong cincin cumi-cumi bersih, lumuri dengan sedikit perasan jeruk nipis dan garam.",
      "Tumis irisan bawang dan cabai rawit pedas hingga harum matang.",
      "Masukkan cumi-cumi, masak dengan api besar.",
      "Tambahkan sachet saus tiram dan sejumput gula pasir.",
      "Masak cepat sekitar 3-4 menit saja agar cumi tetap empuk juicy dan tidak liat."
    ]
  },
  {
    "id": "terong-balado-pedas",
    "nama": "Terong balado merah gurih pedas",
    "waktu": 15,
    "gambar": "/images/resep/tumis-kangkung.jpg",
    "bahan": [
      {
        "id": "terong",
        "jumlah": 1
      },
      {
        "id": "cabai",
        "jumlah": 1
      },
      {
        "id": "tomat",
        "jumlah": 1
      },
      {
        "id": "bawang",
        "jumlah": 1
      },
      {
        "id": "minyak",
        "jumlah": 1
      }
    ],
    "langkah": [
      "Belah terong ungu memanjang lalu potong-potong, goreng dalam minyak panas sebentar hingga layu.",
      "Ulek cabai merah, cabai rawit, tomat, dan bawang merah dengan sedikit garam.",
      "Tumis sambal dengan sisa minyak goreng sampai harum tanak.",
      "Masukkan terong goreng, aduk perlahan agar terong terlumur sambal tanpa hancur.",
      "Sajikan hangat sebagai lauk teman nasi putih."
    ]
  },
  {
    "id": "tumis-jamur-tiram",
    "nama": "Tumis jamur tiram saus tiram bawang",
    "waktu": 10,
    "gambar": "/images/resep/tumis-kangkung.jpg",
    "bahan": [
      {
        "id": "jamur",
        "jumlah": 1
      },
      {
        "id": "cabai",
        "jumlah": 1
      },
      {
        "id": "bawang",
        "jumlah": 1
      },
      {
        "id": "saus-tiram",
        "jumlah": 1
      },
      {
        "id": "minyak",
        "jumlah": 1
      }
    ],
    "langkah": [
      "Suwir-suwir jamur tiram, cuci bersih lalu peras airnya sampai tuntas.",
      "Tumis bawang merah, bawang putih, dan cabai rawit sampai harum.",
      "Masukkan suwiran jamur, aduk rata di atas api sedang.",
      "Tambahkan saus tiram, garam, dan merica secukupnya.",
      "Masak hingga jamur layu dan bumbu meresap gurih lezat."
    ]
  },
  {
    "id": "tahu-telur-kacang",
    "nama": "Tahu telur goreng saus kecap petis",
    "waktu": 12,
    "gambar": "/images/resep/telur-dadar.jpg",
    "bahan": [
      {
        "id": "tahu",
        "jumlah": 1
      },
      {
        "id": "telur",
        "jumlah": 1
      },
      {
        "id": "tauge",
        "jumlah": 1
      },
      {
        "id": "kecap",
        "jumlah": 1
      },
      {
        "id": "cabai",
        "jumlah": 1
      },
      {
        "id": "minyak",
        "jumlah": 1
      }
    ],
    "langkah": [
      "Potong dadu kecil tahu putih.",
      "Kocok telur bersama tahu dadu dan sedikit garam.",
      "Goreng dalam wajan cekung hingga telur mengembang renyah dan tahu matang, angkat ke piring.",
      "Rebus tauge sebentar (blanching), tata di atas tahu telur.",
      "Ulek cabai rawit dan bawang putih, campurkan kecap manis kental, lalu siramkan di atasnya."
    ]
  }
]);

// ============================================================================
// 3. GENERATE MENU SIAP SAJI (1,150+ Authentic Indonesian Dishes)
// ============================================================================

const imageCategories = {
  sate: '/images/menu/sate.jpg',
  bakso: '/images/menu/bakso.jpg',
  dimsum: '/images/menu/dimsum.jpg',
  burger: '/images/menu/burger.jpg',
  kopi: '/images/menu/kopi.jpg',
  jeruk: '/images/menu/es-jeruk.jpg',
  sop: '/images/menu/sop-iga.jpg',
  ikan: '/images/menu/ikan-bakar.jpg',
  rendang: '/images/menu/nasi-padang-rendang.jpg',
  kari: '/images/menu/kari-rendang.jpg',
  martabak: '/images/menu/martabak.jpg',
  friedChicken: '/images/menu/fried-chicken.jpg',
  seafood: '/images/menu/udang-seafood.jpg',
  ayamBakar: '/images/menu/ayam-bakar.jpg',
  ayamGeprek: '/images/menu/nasi-ayam-geprek.jpg',
  mieAyam: '/images/menu/mie-ayam-bakso.jpg',
  nasiGoreng: '/images/menu/nasi-goreng-spesial.jpg',
  soto: '/images/menu/soto-ayam.jpg',
  bubur: '/images/menu/bubur-ayam.jpg',
  gadoGado: '/images/menu/gado-gado.jpg',
  pempek: '/images/menu/pempek.jpg',
  roti: '/images/menu/roti-bakar-coklat.jpg',
  esTeh: '/images/menu/es-teh-manis.jpg',
  salad: '/images/menu/salad-buah.jpg'
};

function resolveMenuImage(nama, kategori) {
  const n = nama.toLowerCase();
  if (n.includes('sate') || n.includes('taichan') || n.includes('maranggi')) return imageCategories.sate;
  if (n.includes('bakso') || n.includes('cuanki')) return imageCategories.bakso;
  if (n.includes('dimsum') || n.includes('siomay') || n.includes('batagor')) return imageCategories.dimsum;
  if (n.includes('burger') || n.includes('hotdog') || n.includes('sandwich')) return imageCategories.burger;
  if (n.includes('kopi') || n.includes('espresso') || n.includes('latte') || n.includes('cappuccino') || n.includes('tubruk')) return imageCategories.kopi;
  if (n.includes('jeruk') || n.includes('orange') || n.includes('lemon')) return imageCategories.jeruk;
  if (n.includes('sop') || n.includes('sup') || n.includes('iga') || n.includes('buntut') || n.includes('konro') || n.includes('rawon') || n.includes('tongseng') || n.includes('gulai')) return imageCategories.sop;
  if (n.includes('ikan') || n.includes('gurame') || n.includes('lele') || n.includes('kakap') || n.includes('nila') || n.includes('bawal')) return imageCategories.ikan;
  if (n.includes('rendang') || n.includes('padang') || n.includes('dendeng')) return imageCategories.rendang;
  if (n.includes('martabak') || n.includes('terang bulan') || n.includes('pancake')) return imageCategories.martabak;
  if (n.includes('crispy') || n.includes('kremes') || n.includes('fried chicken') || n.includes('popcorn chicken')) return imageCategories.friedChicken;
  if (n.includes('udang') || n.includes('cumi') || n.includes('kepiting') || n.includes('kerang') || n.includes('seafood')) return imageCategories.seafood;
  if (n.includes('ayam bakar') || n.includes('bebek bakar') || n.includes('taliwang')) return imageCategories.ayamBakar;
  if (n.includes('geprek') || n.includes('penyet') || n.includes('ayam')) return imageCategories.ayamGeprek;
  if (n.includes('mie') || n.includes('bakmi') || n.includes('bihun') || n.includes('kwetiau') || n.includes('ramen') || n.includes('spaghetti')) return imageCategories.mieAyam;
  if (n.includes('nasi goreng') || n.includes('nasi kebuli') || n.includes('nasi liwet') || n.includes('nasi bakar') || n.includes('nasi')) return imageCategories.nasiGoreng;
  if (n.includes('soto') || n.includes('coto')) return imageCategories.soto;
  if (n.includes('bubur')) return imageCategories.bubur;
  if (n.includes('gado') || n.includes('pecel') || n.includes('ketoprak') || n.includes('lotek') || n.includes('karedok')) return imageCategories.gadoGado;
  if (n.includes('pempek') || n.includes('tekwan') || n.includes('otak-otak')) return imageCategories.pempek;
  if (n.includes('roti') || n.includes('toast') || n.includes('pisang')) return imageCategories.roti;
  if (n.includes('teh') || n.includes('cendol') || n.includes('doger') || n.includes('teler') || n.includes('kelapa') || n.includes('jus')) return imageCategories.esTeh;
  if (kategori === 'minuman') return imageCategories.esTeh;
  if (kategori === 'cemilan') return imageCategories.martabak;
  return imageCategories.nasiGoreng;
}

// Data generator tables
const rawDishes = [];

// Helper to push dishes with unique id
let globalIdCounter = 1;
function addDish(nama, harga, kalori, kategori, tempat) {
  const slug = nama
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  const id = `${slug}-${globalIdCounter++}`;
  const gambar = resolveMenuImage(nama, kategori);
  rawDishes.push({
    id,
    nama,
    harga,
    kalori,
    kategori,
    tempat,
    gambar
  });
}

// ============================================================================
// BASE RECIPES & SPECIALTIES GENERATION (1,150+ items)
// ============================================================================

// 1. NASI GORENG VARIANTS (100 items)
const nasgorBases = [
  'Nasi Goreng Spesial', 'Nasi Goreng Kampung', 'Nasi Goreng Jawa', 'Nasi Goreng Gila',
  'Nasi Goreng Mawut', 'Nasi Goreng Pete', 'Nasi Goreng Babat', 'Nasi Goreng Kambing',
  'Nasi Goreng Seafood', 'Nasi Goreng Ikan Asin', 'Nasi Goreng Teri Medan', 'Nasi Goreng Hongkong',
  'Nasi Goreng Kunyit Rempah', 'Nasi Goreng Cabe Ijo', 'Nasi Goreng Keju Leleh', 'Nasi Goreng Sosis Bakso',
  'Nasi Goreng Kornet Gurih', 'Nasi Goreng Rendang Daging', 'Nasi Goreng Ayam Suwir', 'Nasi Goreng Ati Ampela'
];
const nasgorModifiers = [
  { mod: 'Original', priceMod: 0, calMod: 0 },
  { mod: 'Pedas Level 1', priceMod: 0, calMod: 5 },
  { mod: 'Ekstra Pedas Level 3', priceMod: 1000, calMod: 10 },
  { mod: 'Telur Ceplok Setengah Matang', priceMod: 3000, calMod: 75 },
  { mod: 'Telur Dadar Renyah', priceMod: 3000, calMod: 80 },
  { mod: 'Porsi Jumbo Lapar', priceMod: 5000, calMod: 180 }
];
nasgorBases.forEach((base, idx) => {
  const basePrice = 14000 + (idx % 8) * 2000;
  const baseCal = 550 + (idx % 6) * 40;
  nasgorModifiers.forEach(m => {
    addDish(
      `${base} ${m.mod}`,
      basePrice + m.priceMod,
      baseCal + m.calMod,
      'makan-malam',
      idx % 2 === 0 ? 'Kaki Lima' : 'Warung'
    );
  });
});

// 2. NASI NUSANTARA & RICE BOWLS (150 items)
const nasiNusantara = [
  { name: 'Nasi Uduk Ayam Goreng Kremes', p: 20000, c: 680, t: 'makan-siang', w: 'Warung' },
  { name: 'Nasi Uduk Lele Terbang Sambal Lamongan', p: 17000, c: 590, t: 'makan-malam', w: 'Kaki Lima' },
  { name: 'Nasi Uduk Empal Daging Manis', p: 25000, c: 640, t: 'makan-siang', w: 'Rumah Makan' },
  { name: 'Nasi Uduk Semur Tahu Tempe Telur', p: 15000, c: 510, t: 'sarapan', w: 'Warung' },
  { name: 'Nasi Kuning Komplit Abon & Sambal Tongkol', p: 16000, c: 530, t: 'sarapan', w: 'Warung' },
  { name: 'Nasi Kuning Manado Cakalang Rica', p: 22000, c: 580, t: 'makan-siang', w: 'Rumah Makan' },
  { name: 'Nasi Kuning Banjar Bumbu Habang', p: 20000, c: 610, t: 'makan-siang', w: 'Rumah Makan' },
  { name: 'Nasi Liwet Solo Komplit Opor Ayam Suwir', p: 22000, c: 620, t: 'makan-siang', w: 'Warung' },
  { name: 'Nasi Bakar Tongkol Suwir Pedas Kemangi', p: 18000, c: 490, t: 'makan-siang', w: 'Warung' },
  { name: 'Nasi Bakar Ayam Jamur Suwir Gurih', p: 18000, c: 510, t: 'makan-siang', w: 'Warung' },
  { name: 'Nasi Bakar Teri Pete Gurih Wangi', p: 17000, c: 470, t: 'makan-siang', w: 'Warung' },
  { name: 'Nasi Pecel Madiun Pincuk Komplit Rempeyek', p: 15000, c: 420, t: 'sarapan', w: 'Warung' },
  { name: 'Nasi Pecel Blitar Telur Ceplok Sate Usus', p: 17000, c: 480, t: 'sarapan', w: 'Warung' },
  { name: 'Nasi Rawon Daging Sapi Dumbleg Surabaya', p: 28000, c: 650, t: 'makan-siang', w: 'Rumah Makan' },
  { name: 'Nasi Gandul Pati Daging Sapi Kuah Santan', p: 24000, c: 610, t: 'makan-malam', w: 'Warung' },
  { name: 'Nasi Krawu Gresik Serundeng 3 Warna', p: 23000, c: 590, t: 'makan-siang', w: 'Warung' },
  { name: 'Nasi Megono Pekalongan Ikan Asin Pete', p: 14000, c: 430, t: 'sarapan', w: 'Warung' },
  { name: 'Nasi Jamblang Cirebon Paru & Balakutak', p: 22000, c: 560, t: 'makan-siang', w: 'Warung' },
  { name: 'Nasi Bogana Tegal Opor Daging Suwir', p: 24000, c: 600, t: 'makan-siang', w: 'Rumah Makan' },
  { name: 'Nasi Timbel Komplit Ayam Bakar Sayur Asem', p: 28000, c: 690, t: 'makan-siang', w: 'Rumah Makan' },
  { name: 'Nasi Tutug Oncom Tasikmalaya Sambal Terasi', p: 18000, c: 520, t: 'makan-siang', w: 'Warung' },
  { name: 'Nasi Ulam Betawi Komplit Dendeng & Perkedel', p: 24000, c: 580, t: 'sarapan', w: 'Warung' },
  { name: 'Nasi Campur Bali Ayam Betutu Sate Lilit', p: 32000, c: 720, t: 'makan-siang', w: 'Restoran' },
  { name: 'Nasi Kebuli Kambing Minyak Samin Gurih', p: 38000, c: 780, t: 'makan-siang', w: 'Restoran' },
  { name: 'Nasi Biryani Ayam Rempah Khas Arab', p: 35000, c: 740, t: 'makan-siang', w: 'Restoran' },
  { name: 'Nasi Kucing Teri Balado Angkringan (3 Bungkus)', p: 10000, c: 380, t: 'makan-malam', w: 'Angkringan' },
  { name: 'Nasi Kucing Bandeng Sambal Hijau (3 Bungkus)', p: 10000, c: 390, t: 'makan-malam', w: 'Angkringan' },
  { name: 'Nasi Kucing Orek Tempe Manis (3 Bungkus)', p: 9000, c: 360, t: 'makan-malam', w: 'Angkringan' },
  { name: 'Rice Bowl Beef Yakiniku Saus Wijen Gurih', p: 28000, c: 630, t: 'makan-siang', w: 'Kafe' },
  { name: 'Rice Bowl Chicken Katsu Saus Curry Jepang', p: 24000, c: 650, t: 'makan-siang', w: 'Kafe' }
];
const nasiVariants = [
  'Paket Hemat',
  'Plus Es Teh Manis',
  'Plus Es Jeruk Segar',
  'Ekstra Sambal Bawang',
  'Komplit Telur Mata Sapi'
];
nasiNusantara.forEach(n => {
  nasiVariants.forEach((v, vIdx) => {
    addDish(
      `${n.name} (${v})`,
      n.p + vIdx * 3000,
      n.c + vIdx * 45,
      n.t,
      n.w
    );
  });
});

// 3. NASI PADANG SPECIFIC VARIANTS (120 items)
const padangMains = [
  { item: 'Rendang Daging Sapi Empuk', p: 25000, c: 750 },
  { item: 'Ayam Pop Gurih Minang', p: 22000, c: 620 },
  { item: 'Ayam Gulai Kuah Santan Kuning', p: 22000, c: 660 },
  { item: 'Ayam Bakar Bumbu Padang', p: 22000, c: 640 },
  { item: 'Dendeng Batokok Sambal Ijo', p: 26000, c: 690 },
  { item: 'Dendeng Balado Kering Krispi', p: 26000, c: 680 },
  { item: 'Gulai Tunjang Kikil Kenyal', p: 27000, c: 720 },
  { item: 'Gulai Kepala Ikan Kakap Gurih', p: 35000, c: 780 },
  { item: 'Ikan Kembung Bakar Sambal Dabu', p: 20000, c: 540 },
  { item: 'Ikan Tongkol Asam Padeh Segar', p: 21000, c: 560 },
  { item: 'Cumi Saus Gulai Padang', p: 26000, c: 610 },
  { item: 'Telur Dadar Tebal Khas Minang', p: 15000, c: 520 },
  { item: 'Gulai Cincang Sapi Gurih Pedas', p: 25000, c: 730 },
  { item: 'Rendang Paru Sapi Krispi', p: 24000, c: 650 },
  { item: 'Perkedel Kentang Padang & Gulai Nangka', p: 14000, c: 450 }
];
const padangSides = [
  'Nasi Rames Sayur Nangka Sambal Ijo',
  'Bungkus Daun Pisang Komplit',
  'Dua Lauk Spesial (Double Lauk)',
  'Tambah Telur Balado',
  'Tambah Kerupuk Kulit Kuah Gulai',
  'Tambah Sambalado Teri Pete',
  'Porsi Jumbo Kenyang Pol',
  'Paket Hemat Anak Kos'
];
padangMains.forEach(m => {
  padangSides.forEach((s, sIdx) => {
    addDish(
      `Nasi Padang ${m.item} - ${s}`,
      m.p + sIdx * 2500,
      m.c + sIdx * 40,
      'makan-siang',
      'Rumah Makan'
    );
  });
});

// 4. MIE, KWETIAU, BIHUN & BAKMI (150 items)
const noodleBases = [
  { n: 'Mie Ayam Pangsit Rebus Kuah Kaldu', p: 15000, c: 480 },
  { n: 'Mie Ayam Bakso Sapi Urat Gurih', p: 18000, c: 560 },
  { n: 'Mie Ayam Jamur Tiram Saus Tiram', p: 17000, c: 510 },
  { n: 'Mie Ayam Rica-Rica Super Pedas', p: 17000, c: 520 },
  { n: 'Mie Ayam Ceker Empuk Bumbu Kecap', p: 16000, c: 490 },
  { n: 'Mie Yamin Manis Pangsit Goreng Renyah', p: 16000, c: 530 },
  { n: 'Mie Yamin Asin Bakso Halus', p: 16000, c: 510 },
  { n: 'Mie Goreng Jawa Tradisional Gerobak', p: 17000, c: 580 },
  { n: 'Mie Goreng Seafood Cumi Udang', p: 24000, c: 640 },
  { n: 'Bakmi Godhog Jawa Kuah Kental Telur Bebek', p: 20000, c: 560 },
  { n: 'Mie Aceh Goreng Daging Sapi Rempah Kari', p: 25000, c: 670 },
  { n: 'Mie Aceh Kuah Kepiting Rempah Pedas', p: 32000, c: 690 },
  { n: 'Mie Kocok Bandung Kikil Sapi Sumsum', p: 25000, c: 630 },
  { n: 'Soto Mie Bogor Daging Sapi Risoles Bihun', p: 20000, c: 540 },
  { n: 'Mie Celor Khas Palembang Kuah Udang Santan', p: 20000, c: 550 },
  { n: 'Kwetiau Goreng Sapi Spesial', p: 25000, c: 640 },
  { n: 'Kwetiau Siram Seafood Telur Puyuh', p: 26000, c: 620 },
  { n: 'Bihun Goreng Kampung Bakso Sosis', p: 17000, c: 520 },
  { n: 'Bihun Bebek Kuah Rempah Herbal Medan', p: 35000, c: 610 },
  { n: 'Indomie Goreng Dobel Telur Kornet Keju (Internet)', p: 16000, c: 620 },
  { n: 'Indomie Kuah Kari Ayam Telur Setengah Matang Sayur', p: 13000, c: 510 },
  { n: 'Indomie Nyemek Pedas Warkop Telur Orak Arik', p: 14000, c: 540 },
  { n: 'Ramen Ayam Kuah Paitan Pedas Gurih', p: 28000, c: 640 },
  { n: 'Spaghetti Bolognese Daging Cincang Keju', p: 25000, c: 580 },
  { n: 'Spaghetti Aglio Olio Tuna Cabe Rawit', p: 24000, c: 520 }
];
const noodleFlavors = [
  { tag: 'Original', p: 0, c: 0 },
  { tag: 'Pedas Sedang', p: 0, c: 5 },
  { tag: 'Ekstra Pedas Cabe Rawit', p: 1000, c: 10 },
  { tag: 'Plus Pangsit Goreng Renyah (2 pcs)', p: 3000, c: 90 },
  { tag: 'Plus Bakso Halus (2 pcs)', p: 4000, c: 80 },
  { tag: 'Porsi Dobel Jumbo', p: 5000, c: 190 }
];
noodleBases.forEach(nb => {
  noodleFlavors.forEach(f => {
    addDish(
      `${nb.n} - ${f.tag}`,
      nb.p + f.p,
      nb.c + f.c,
      'makan-siang',
      nb.p > 22000 ? 'Kafe' : 'Warung'
    );
  });
});

// 5. AYAM GEPREK & ANEKA OLAHAN AYAM (150 items)
const ayamBases = [
  { n: 'Ayam Geprek Sambal Bawang Original', p: 15000, c: 620 },
  { n: 'Ayam Geprek Sambal Matah Khas Bali', p: 17000, c: 640 },
  { n: 'Ayam Geprek Keju Mozzarella Leleh', p: 20000, c: 720 },
  { n: 'Ayam Geprek Sambal Ijo Padang', p: 16000, c: 630 },
  { n: 'Ayam Geprek Saus Barbeque Manis Pedas', p: 18000, c: 660 },
  { n: 'Ayam Geprek Saus Keju Cheddar Lumer', p: 19000, c: 690 },
  { n: 'Ayam Geprek Sambal Korek Pedas Mampus', p: 16000, c: 620 },
  { n: 'Ayam Geprek Sambal Terasi Dadak', p: 16000, c: 630 },
  { n: 'Ayam Bakar Madu Manis Gurih Meresap', p: 22000, c: 590 },
  { n: 'Ayam Bakar Taliwang Pedas Berempah', p: 24000, c: 610 },
  { n: 'Ayam Bakar Bumbu Rujak Jawa', p: 22000, c: 580 },
  { n: 'Ayam Bakar Kalasan Gurih Manis', p: 21000, c: 570 },
  { n: 'Ayam Penyet Sambal Terasi Daun Kemangi', p: 19000, c: 610 },
  { n: 'Ayam Kremes Gurih Renyah Khas Solo', p: 20000, c: 660 },
  { n: 'Ayam Goreng Lengkuas Rempah Wangi', p: 20000, c: 620 },
  { n: 'Ayam Goreng Serundeng Kelapa Manis', p: 19000, c: 630 },
  { n: 'Ayam Rica-Rica Kemangi Khas Manado', p: 23000, c: 610 },
  { n: 'Ayam Woku Belanga Pedas Asam Segar', p: 24000, c: 590 },
  { n: 'Ayam Betutu Kuah Pedas Gilimanuk', p: 26000, c: 650 },
  { n: 'Ayam Tangkap Rempah Daun Temurui Aceh', p: 26000, c: 640 },
  { n: 'Bebek Goreng Madura Bumbu Hitam Pekat', p: 28000, c: 750 },
  { n: 'Bebek Sinjay Sambal Mangga Muda Pencit', p: 30000, c: 740 },
  { n: 'Bebek Bakar Kecap Pedas Manis', p: 29000, c: 720 },
  { n: 'Fried Chicken Crispy Dada/Paha Atas', p: 15000, c: 540 },
  { n: 'Chicken Katsu Saus Teriyaki & Salad', p: 22000, c: 610 }
];
const ayamSides = [
  { s: 'Ala Carte (Tanpa Nasi)', p: -3000, c: -200 },
  { s: 'Paket Nasi Putih + Lalapan', p: 0, c: 0 },
  { s: 'Paket Nasi Uduk Gurih', p: 3000, c: 60 },
  { s: 'Paket Komplit Tahu Tempe Lalapan', p: 4000, c: 110 },
  { s: 'Paket Komplit Nasi + Es Teh Manis', p: 4000, c: 80 },
  { s: 'Paket Nasi Jumbo Sambal Dobel', p: 5000, c: 150 }
];
ayamBases.forEach(ab => {
  ayamSides.forEach(s => {
    addDish(
      `${ab.n} [${s.s}]`,
      ab.p + s.p,
      ab.c + s.c,
      'makan-siang',
      ab.n.includes('Bebek') ? 'Rumah Makan' : 'Warung'
    );
  });
});

// 6. SATE & ANEKA BAKARAN (120 items)
const sateBases = [
  { n: 'Sate Ayam Madura Bumbu Kacang Kental', p: 22000, c: 540 },
  { n: 'Sate Ayam Bumbu Kecap Bawang Cabe Rawit', p: 22000, c: 490 },
  { n: 'Sate Taichan Daging Ayam Bakar Asin Gurih', p: 20000, c: 420 },
  { n: 'Sate Taichan Campur Kulit Ayam Gurih', p: 22000, c: 480 },
  { n: 'Sate Taichan Kulit Crispy Goreng', p: 22000, c: 520 },
  { n: 'Sate Taichan Usus Bakar Bumbu Pedas', p: 18000, c: 430 },
  { n: 'Sate Kambing Muda Empuk Bumbu Kecap Tomat', p: 35000, c: 650 },
  { n: 'Sate Kambing Bumbu Kacang Meresap', p: 36000, c: 680 },
  { n: 'Sate Maranggi Sapi Purwakarta Sambal Oncom', p: 32000, c: 610 },
  { n: 'Sate Klathak Kambing Jogja Kuah Gulai Gurih', p: 34000, c: 630 },
  { n: 'Sate Lilit Ayam Khas Bali Bumbu Plecing', p: 25000, c: 520 },
  { n: 'Sate Lilit Ikan Tenggiri Serai Bali', p: 28000, c: 490 },
  { n: 'Sate Padang Daging Sapi Kuah Kuning Kental', p: 25000, c: 580 },
  { n: 'Sate Padang Lidah Sapi Empuk Kuah Pedas', p: 28000, c: 610 },
  { n: 'Sate Buntel Solo Daging Kambing Cincang', p: 38000, c: 720 }
];
const satePortions = [
  { s: 'Isi 10 Tusuk Polos', p: 0, c: 0 },
  { s: 'Isi 10 Tusuk + Lontong Daun', p: 4000, c: 160 },
  { s: 'Isi 10 Tusuk + Nasi Putih Hangat', p: 4000, c: 200 },
  { s: 'Isi 10 Tusuk + Nasi + Es Teh Manis', p: 7000, c: 280 },
  { s: 'Porsi Jumbo 15 Tusuk + Lontong', p: 12000, c: 260 },
  { s: 'Isi 10 Tusuk Ekstra Bumbu Kacang & Bawang Goreng', p: 2000, c: 40 },
  { s: 'Isi 10 Tusuk Ekstra Sambal Pedas Nampol', p: 1500, c: 15 },
  { s: 'Porsi Keluarga 20 Tusuk Komplit Lontong', p: 22000, c: 480 }
];
sateBases.forEach(sb => {
  satePortions.forEach(sp => {
    addDish(
      `${sb.n} (${sp.s})`,
      sb.p + sp.p,
      sb.c + sp.c,
      'makan-malam',
      sb.n.includes('Kambing') ? 'Rumah Makan' : 'Kaki Lima'
    );
  });
});

// 7. SOTO, SUP, RAWON & BERKUAH (120 items)
const sotoBases = [
  { n: 'Soto Ayam Lamongan Kuah Kuning Koya Gurih', p: 16000, c: 420 },
  { n: 'Soto Betawi Daging Sapi Kuah Santan Susu', p: 28000, c: 650 },
  { n: 'Soto Betawi Campur Daging Paru Kikil Babat', p: 30000, c: 680 },
  { n: 'Soto Kudus Ayam Kampung Mangkuk Tradisional', p: 18000, c: 410 },
  { n: 'Soto Tangkar Iga Daging Sapi Betawi', p: 28000, c: 620 },
  { n: 'Soto Madura Daging Sapi Telur Rebus', p: 24000, c: 530 },
  { n: 'Soto Banjar Ayam Suwir Perkedel Telur Bebek', p: 22000, c: 510 },
  { n: 'Soto Padang Daging Kering Dendeng Renyah', p: 24000, c: 530 },
  { n: 'Soto Medan Ayam Santan Kuah Kari Rempah', p: 23000, c: 560 },
  { n: 'Soto Boyolali Daging Sapi Kuah Bening Segar', p: 18000, c: 430 },
  { n: 'Coto Makassar Daging Sapi Kuah Kacang Rempah', p: 28000, c: 640 },
  { n: 'Sup Konro Daging Iga Sapi Rempah Makassar', p: 38000, c: 720 },
  { n: 'Konro Bakar Saus Kacang Gurih Manis', p: 42000, c: 780 },
  { n: 'Rawon Daging Sapi Kuah Hitam Kluwek Jawa Timur', p: 28000, c: 610 },
  { n: 'Sop Buntut Sapi Kuah Bening Rempah Segar', p: 45000, c: 680 },
  { n: 'Sop Buntut Sapi Goreng Sambal Ijo Kuah Terpisah', p: 48000, c: 740 },
  { n: 'Sop Iga Sapi Bening Wortel Kentang', p: 38000, c: 620 },
  { n: 'Tongseng Kambing Kuah Santan Kubis Tomat', p: 32000, c: 670 },
  { n: 'Tongseng Sapi Kuah Gurih Rempah Segar', p: 30000, c: 630 },
  { n: 'Empal Gentong Cirebon Daging Sapi Kuah Kuning', p: 26000, c: 590 }
];
const sotoSides = [
  { s: 'Kuah Saja (Tanpa Nasi)', p: -3000, c: -200 },
  { s: 'Komplit Nasi Putih + Jeruk Nipis', p: 0, c: 0 },
  { s: 'Plus Perkedel Kentang Gurih', p: 3000, c: 90 },
  { s: 'Plus Telur Asin Masir Gurih', p: 4000, c: 80 },
  { s: 'Plus Kerupuk Emping Melinjo', p: 3000, c: 70 },
  { s: 'Paket Komplit Nasi + Es Jeruk Segar', p: 6000, c: 110 }
];
sotoBases.forEach(sb => {
  sotoSides.forEach(ss => {
    addDish(
      `${sb.n} [${ss.s}]`,
      sb.p + ss.p,
      sb.c + ss.c,
      'makan-siang',
      sb.p > 30000 ? 'Rumah Makan' : 'Warung'
    );
  });
});

// 8. SEAFOOD & OLAHAN IKAN (120 items)
const seafoodBases = [
  { n: 'Ikan Gurame Bakar Bumbu Madu Manis Gurih', p: 35000, c: 560 },
  { n: 'Ikan Gurame Terbang Krispi Sambal Terasi Dadak', p: 35000, c: 610 },
  { n: 'Ikan Gurame Saus Asam Manis Nanas', p: 38000, c: 630 },
  { n: 'Ikan Lele Goreng Kremes Renyah Gurih', p: 15000, c: 480 },
  { n: 'Pecel Lele Sambal Tomat Pedas Lamongan', p: 16000, c: 510 },
  { n: 'Mangut Lele Asap Kuah Santan Cabe Rawit Jogja', p: 20000, c: 540 },
  { n: 'Ikan Nila Bakar Sambal Kecap Pedas Bawang', p: 22000, c: 490 },
  { n: 'Ikan Nila Goreng Sambal Matah Segar', p: 22000, c: 510 },
  { n: 'Ikan Kakap Merah Bakar Bumbu Jimbaran Bali', p: 42000, c: 580 },
  { n: 'Ikan Kembung Bakar Sambal Dabu-Dabu Manado', p: 20000, c: 460 },
  { n: 'Ikan Bandeng Presto Goreng Balut Telur', p: 20000, c: 490 },
  { n: 'Udang Bakar Madu Saus Mentega Gurih', p: 28000, c: 480 },
  { n: 'Udang Saus Padang Pedas Manis Gurih', p: 29000, c: 520 },
  { n: 'Udang Goreng Tepung Mayones Krispi', p: 26000, c: 560 },
  { n: 'Cumi Goreng Tepung Calamari Crispy Saus Tartar', p: 25000, c: 510 },
  { n: 'Cumi Saus Tiram Bawang Bombay', p: 26000, c: 460 },
  { n: 'Cumi Asin Cabe Ijo Pete Pedas Nampol', p: 24000, c: 480 },
  { n: 'Kepiting Saus Padang Kuah Kental Telur', p: 55000, c: 690 },
  { n: 'Kerang Hijau Saus Tiram Gurih Manis', p: 18000, c: 380 },
  { n: 'Kerang Dara Rebus Sambal Nanas Pedas Segar', p: 18000, c: 350 }
];
const seafoodCombos = [
  { c: 'Ala Carte', p: 0, c: 0 },
  { c: 'Paket Nasi Putih + Lalapan Timun Kemangi', p: 4000, c: 200 },
  { c: 'Paket Komplit Nasi + Cah Kangkung', p: 8000, c: 240 },
  { c: 'Paket Lengkap Nasi + Es Kelapa Muda', p: 10000, c: 290 },
  { c: 'Porsi Jumbo Mantap', p: 12000, c: 210 },
  { c: 'Ekstra Sambal Terasi Bakar', p: 2000, c: 25 }
];
seafoodBases.forEach(sb => {
  seafoodCombos.forEach(sc => {
    addDish(
      `${sb.n} [${sc.c}]`,
      sb.p + sc.p,
      sb.c + sc.c,
      'makan-malam',
      sb.p > 30000 ? 'Restoran' : 'Warung'
    );
  });
});

// 9. PEMPEK, GADO-GADO, STREET BITES & VEGGIES (120 items)
const streetBases = [
  { n: 'Pempek Kapal Selam Telur Utuh Cuko Kental Mantap', p: 22000, c: 540 },
  { n: 'Pempek Lenggang Panggang Daun Pisang Telur Bebek', p: 20000, c: 510 },
  { n: 'Pempek Kulit Crispy Renyah (Porsi 5 Pcs)', p: 18000, c: 480 },
  { n: 'Pempek Campur Adaan, Lenjer & Keriting (5 Pcs)', p: 22000, c: 520 },
  { n: 'Tekwan Ikan Tenggiri Kuah Kaldu Udang Jamur Kuping', p: 18000, c: 390 },
  { n: 'Model Ikan Tahu Kuah Kaldu Bening Segar', p: 17000, c: 380 },
  { n: 'Gado-Gado Betawi Bumbu Kacang Medok Lontong Telur', p: 17000, c: 460 },
  { n: 'Gado-Gado Siram Spesial Nasi Emping Melinjo', p: 18000, c: 520 },
  { n: 'Pecel Sayur Komplit Rempeyek Teri Kacang', p: 13000, c: 360 },
  { n: 'Ketoprak Cirebon Bumbu Kacang Bawang Putih Bihun Tahu', p: 15000, c: 480 },
  { n: 'Karedok Sayur Mentah Segar Bumbu Kencur Sunda', p: 14000, c: 310 },
  { n: 'Lotek Matang Khas Jogja Bumbu Kacang Bakwan', p: 14000, c: 410 },
  { n: 'Tahu Telur Bumbu Kacang Petis Surabaya', p: 18000, c: 510 },
  { n: 'Tahu Gimbal Udang Semarang Telur Ceplok Petis', p: 22000, c: 560 },
  { n: 'Batagor Bandung Bumbu Kacang Jeruk Limau', p: 16000, c: 490 },
  { n: 'Batagor Kuah Baso Cuanki Kaldu Sapi', p: 17000, c: 460 },
  { n: 'Siomay Bandung Komplit Telur Kentang Kol Pare Tahu', p: 18000, c: 510 },
  { n: 'Dimsum Siomay Ayam Udang Mentai Bakar (4 Pcs)', p: 20000, c: 390 },
  { n: 'Dimsum Hakau Udang Bening Kukus (4 Pcs)', p: 22000, c: 320 },
  { n: 'Seblak Komplit Ceker Baso Sosis Makaroni Kerupuk Pedas', p: 17000, c: 520 }
];
const streetVariants = [
  'Original',
  'Pedas Level 1',
  'Pedas Nampol Level 3',
  'Ekstra Bumbu Kacang / Cuko',
  'Plus Telur Rebus',
  'Porsi Jumbo Puas'
];
streetBases.forEach(sb => {
  streetVariants.forEach((v, vIdx) => {
    addDish(
      `${sb.n} - ${v}`,
      sb.p + vIdx * 2000,
      sb.c + vIdx * 35,
      'camilan',
      'Kaki Lima'
    );
  });
});

// 10. ROTI, MARTABAK, BURGER & CAMILAN MANIS/GURIH (120 items)
const snackBases = [
  { n: 'Martabak Manis Coklat Keju Wijen Susu Kental', p: 28000, c: 780 },
  { n: 'Martabak Manis Nutella Keju Pisang Spesial', p: 35000, c: 840 },
  { n: 'Martabak Manis Red Velvet Cream Cheese Oreo', p: 38000, c: 860 },
  { n: 'Martabak Tipis Kering (Tipker) Coklat Keju Krispi', p: 20000, c: 480 },
  { n: 'Martabak Telor Bebek Daging Sapi Cincang Gurih', p: 35000, c: 720 },
  { n: 'Martabak Telor Ayam Spesial 2 Telur Kari', p: 26000, c: 590 },
  { n: 'Roti Bakar Bandung Coklat Keju Susu Meises', p: 16000, c: 490 },
  { n: 'Roti Bakar Nougat Moka Gurih Manis', p: 18000, c: 510 },
  { n: 'Roti Bakar Telur Keju Smoked Beef Ham', p: 22000, c: 540 },
  { n: 'Pisang Bakar Coklat Keju Susu Meises', p: 15000, c: 410 },
  { n: 'Pisang Goreng Crispy Saus Karamel Wijen', p: 14000, c: 380 },
  { n: 'Burger Sapi Daging Asli Double Cheese Melt', p: 28000, c: 680 },
  { n: 'Chicken Burger Crispy Mayones Keju', p: 22000, c: 590 },
  { n: 'Hotdog Sosis Sapi Jumbo Saus Mustard Keju', p: 24000, c: 560 },
  { n: 'Kentang Goreng French Fries Bumbu Keju BBQ', p: 15000, c: 380 },
  { n: 'Cireng Crispy Renyah Bumbu Rujak Pedas Manis (10 Pcs)', p: 12000, c: 350 },
  { n: 'Tahu Gejrot Cirebon Kuah Asam Pedas Gula Merah', p: 10000, c: 220 },
  { n: 'Tahu Bakso Ungaran Kukus/Goreng Sambal Kecap (5 Pcs)', p: 16000, c: 380 },
  { n: 'Bakwan Jagung Renyah Manis Hangat (4 Pcs)', p: 10000, c: 320 },
  { n: 'Risoles Ragout Ayam Keju Meleleh (3 Pcs)', p: 14000, c: 360 }
];
const snackFlavors = [
  'Porsi Reguler',
  'Ukuran Sedang',
  'Ekstra Keju Parut / Mozzarella',
  'Ekstra Saus Sambal / Coklat',
  'Paket Hemat Teman Kopi',
  'Porsi Jumbo Box'
];
snackBases.forEach(sb => {
  snackFlavors.forEach((f, fIdx) => {
    addDish(
      `${sb.n} (${f})`,
      sb.p + fIdx * 2500,
      sb.c + fIdx * 40,
      'camilan',
      sb.n.includes('Burger') || sb.n.includes('Martabak') ? 'Kafe' : 'Kaki Lima'
    );
  });
});

// 11. MINUMAN SEGAR, KOPI, JUS & DESSERT (120 items)
const drinkBases = [
  { n: 'Es Teh Manis Segar Jumbo Dingin', p: 5000, c: 90 },
  { n: 'Es Teh Melati Wangi Solo Gula Batu', p: 6000, c: 95 },
  { n: 'Es Teh Tarik Busa Lembut Khas Melayu', p: 12000, c: 190 },
  { n: 'Es Lemon Tea Segar Irisan Lemon Asli', p: 10000, c: 110 },
  { n: 'Es Jeruk Peras Murni Bulir Asli', p: 8000, c: 110 },
  { n: 'Es Jeruk Nipis Madu Alami Segar', p: 10000, c: 120 },
  { n: 'Es Cendol Dawet Ayu Banjarnegara Gula Aren', p: 12000, c: 260 },
  { n: 'Es Doger Bandung Tape Ketan Hitam Kelapa Muda', p: 14000, c: 290 },
  { n: 'Es Teler Spesial Alpukat Kelapa Muda Nangka Susu', p: 18000, c: 340 },
  { n: 'Es Campur Medan Buah Segar Sirup Merah', p: 15000, c: 310 },
  { n: 'Es Kelapa Muda Murni Butiran Kelapa Segar', p: 12000, c: 140 },
  { n: 'Es Kuwut Melon Jeruk Nipis Biji Selasih Bali', p: 12000, c: 160 },
  { n: 'Es Oyen Bandung Alpukat Pacar Cina Nangka', p: 15000, c: 320 },
  { n: 'Es Pisang Ijo Khas Makassar Saus Santan Bubur Sumsum', p: 16000, c: 350 },
  { n: 'Jus Alpukat Kental Coklat Susu Manis', p: 15000, c: 280 },
  { n: 'Jus Mangga Harum Manis Dingin Segar', p: 14000, c: 210 },
  { n: 'Jus Buah Naga Merah Manis Segar', p: 14000, c: 190 },
  { n: 'Jus Jambu Biji Merah Kaya Vitamin C', p: 12000, c: 170 },
  { n: 'Sop Buah Segar Komplit Kuah Susu Stroberi', p: 16000, c: 270 },
  { n: 'Kopi Susu Gula Aren Kekinian Creamy', p: 15000, c: 210 },
  { n: 'Kopi Tubruk Tradisional Robusta Dampit Malang', p: 6000, c: 25 },
  { n: 'Kopi Hitam V60 Manual Brew Arabika Gayo', p: 18000, c: 15 },
  { n: 'Kopi Tarik Khas Aceh Busa Mengembang', p: 12000, c: 170 },
  { n: 'Wedang Ronde Jahe Hangat Kuah Gula Merah Kacang', p: 12000, c: 220 },
  { n: 'Wedang Uwuh Rempah Imogiri Yogyakarta Hangat', p: 10000, c: 110 },
  { n: 'STMJ (Susu Telur Madu Jahe) Stamina Hangat', p: 16000, c: 280 }
];
const drinkSizes = [
  { s: 'Gelas Reguler', p: 0, c: 0 },
  { s: 'Ukuran Jumbo 22oz', p: 3000, c: 50 },
  { s: 'Less Sugar Sehat', p: 0, c: -30 },
  { s: 'Extra Jelly / Selasih Boba', p: 3000, c: 60 },
  { s: 'Dingin Ekstra Es Segar', p: 0, c: 0 }
];
drinkBases.forEach(db => {
  drinkSizes.forEach(ds => {
    addDish(
      `${db.n} [${ds.s}]`,
      db.p + ds.p,
      Math.max(10, db.c + ds.c),
      'minuman',
      db.n.includes('Kopi') && db.p > 10000 ? 'Kafe' : 'Warung'
    );
  });
});

console.log(`Generated dishes: ${rawDishes.length}`);
console.log(`Generated bahan: ${bahanList.length}`);
console.log(`Generated resep: ${resepList.length}`);

// Write files to src/data/
fs.writeFileSync('src/data/bahan.json', JSON.stringify(bahanList, null, 2), 'utf8');
fs.writeFileSync('src/data/resep.json', JSON.stringify(resepList, null, 2), 'utf8');
fs.writeFileSync('src/data/menu.json', JSON.stringify(rawDishes, null, 2), 'utf8');

console.log('Successfully written to src/data/ !');
