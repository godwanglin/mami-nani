const fs = require('fs');

const rawBahan20 = [
  // KARBOHIDRAT (6 items)
  {
    id: 'beras',
    nama: 'Beras Putih Pulen',
    harga: 3000,
    satuan: 'porsi (100g)',
    kalori: 204,
    kategori: 'karbo',
    gambar: '/images/bahan/beras.jpg'
  },
  {
    id: 'mie-instan',
    nama: 'Mie Instan Kering',
    harga: 3500,
    satuan: 'bungkus',
    kalori: 380,
    kategori: 'karbo',
    gambar: '/images/bahan/mie-instan.jpg'
  },
  {
    id: 'kentang',
    nama: 'Kentang Segar Mentah',
    harga: 3500,
    satuan: 'buah besar',
    kalori: 160,
    kategori: 'karbo',
    gambar: '/images/bahan/kentang.jpg'
  },
  {
    id: 'ubi',
    nama: 'Ubi Jalar Manis Mentah',
    harga: 2500,
    satuan: 'buah sedang',
    kalori: 140,
    kategori: 'karbo',
    gambar: '/images/bahan/ubi.jpg'
  },
  {
    id: 'singkong',
    nama: 'Singkong Mentah Kupas',
    harga: 2500,
    satuan: 'potong (150g)',
    kalori: 150,
    kategori: 'karbo',
    gambar: '/images/bahan/singkong.jpg'
  },
  {
    id: 'tepung',
    nama: 'Tepung Terigu Serbaguna',
    harga: 2000,
    satuan: '4 sdm (50g)',
    kalori: 140,
    kategori: 'karbo',
    gambar: '/images/bahan/tepung.jpg'
  },

  // PROTEIN (8 items)
  {
    id: 'telur',
    nama: 'Telur Ayam Mentah',
    harga: 2500,
    satuan: 'butir',
    kalori: 74,
    kategori: 'protein',
    gambar: '/images/bahan/telur.jpg'
  },
  {
    id: 'ayam',
    nama: 'Daging Ayam Fillet Mentah',
    harga: 8000,
    satuan: 'potong (100g)',
    kalori: 165,
    kategori: 'protein',
    gambar: '/images/bahan/ayam.jpg'
  },
  {
    id: 'daging-sapi',
    nama: 'Daging Sapi Segar Mentah',
    harga: 14000,
    satuan: 'porsi (100g)',
    kalori: 250,
    kategori: 'protein',
    gambar: '/images/bahan/daging-sapi.jpg'
  },
  {
    id: 'ikan',
    nama: 'Ikan Segar Mentah',
    harga: 8000,
    satuan: 'ekor sedang',
    kalori: 150,
    kategori: 'protein',
    gambar: '/images/bahan/ikan.jpg'
  },
  {
    id: 'udang',
    nama: 'Udang Segar Mentah',
    harga: 9000,
    satuan: 'porsi (80g)',
    kalori: 110,
    kategori: 'protein',
    gambar: '/images/bahan/udang.jpg'
  },
  {
    id: 'cumi',
    nama: 'Cumi-cumi Segar Mentah',
    harga: 9000,
    satuan: 'ekor sedang',
    kalori: 95,
    kategori: 'protein',
    gambar: '/images/bahan/cumi.jpg'
  },
  {
    id: 'tahu',
    nama: 'Tahu Putih Segar',
    harga: 2000,
    satuan: 'potong',
    kalori: 80,
    kategori: 'protein',
    gambar: '/images/bahan/tahu.jpg'
  },
  {
    id: 'tempe',
    nama: 'Tempe Kedelai Mentah',
    harga: 3000,
    satuan: 'papan sedang',
    kalori: 160,
    kategori: 'protein',
    gambar: '/images/bahan/tempe.jpg'
  },

  // SAYUR (3 items)
  {
    id: 'kangkung',
    nama: 'Kangkung Segar Seikat',
    harga: 2500,
    satuan: 'ikat',
    kalori: 28,
    kategori: 'sayur',
    gambar: '/images/bahan/kangkung.jpg'
  },
  {
    id: 'bayam',
    nama: 'Bayam Hijau Segar',
    harga: 2500,
    satuan: 'ikat',
    kalori: 23,
    kategori: 'sayur',
    gambar: '/images/bahan/bayam.jpg'
  },
  {
    id: 'wortel',
    nama: 'Wortel Segar Mentah',
    harga: 2000,
    satuan: 'buah sedang',
    kalori: 25,
    kategori: 'sayur',
    gambar: '/images/bahan/wortel.jpg'
  },

  // BUMBU (3 items)
  {
    id: 'bawang',
    nama: 'Bawang Merah Mentah',
    harga: 1500,
    satuan: 'porsi bumbu',
    kalori: 15,
    kategori: 'bumbu',
    gambar: '/images/bahan/bawang.jpg'
  },
  {
    id: 'cabai',
    nama: 'Cabai Rawit Merah',
    harga: 1500,
    satuan: 'porsi bumbu',
    kalori: 10,
    kategori: 'bumbu',
    gambar: '/images/bahan/cabai.jpg'
  },
  {
    id: 'minyak',
    nama: 'Minyak Goreng Sawit',
    harga: 1500,
    satuan: '2 sdm',
    kalori: 120,
    kategori: 'bumbu',
    gambar: '/images/bahan/minyak.jpg'
  }
];

// 20 RECIPES DESIGNED FROM THE 20 INGREDIENTS
const resepList = [
  {
    id: 'nasi-goreng-telur-bawang',
    nama: 'Nasi Goreng Telur Bawang Cabai',
    deskripsi: 'Nasi goreng harum praktis dengan aroma bawang merah iris, telur orak-arik, dan cabai rawit pedas.',
    porsi: '1 porsi',
    waktuMasak: '10 menit',
    tingkatKesulitan: 'Mudah',
    gambar: '/images/menu/nasi-goreng-spesial.jpg',
    bahan: [
      { id: 'beras', jumlah: 1 },
      { id: 'telur', jumlah: 1 },
      { id: 'bawang', jumlah: 1 },
      { id: 'cabai', jumlah: 1 },
      { id: 'minyak', jumlah: 1 }
    ],
    langkah: [
      'Panaskan minyak di wajan, tumis irisan bawang merah dan cabai rawit sampai harum kekuningan.',
      'Sisihkan tumisan ke tepi wajan, masukkan telur lalu orak-arik sampai matang berbulir.',
      'Masukkan nasi putih dingin, aduk cepat dengan api besar hingga bumbu tercampur rata dan harum semerbak.',
      'Angkat dan sajikan selagi hangat.'
    ]
  },
  {
    id: 'tumis-kangkung-bawang-cabai',
    nama: 'Tumis Kangkung Pedas Gurih',
    deskripsi: 'Sayur kangkung hijau segar ditumis cepat dengan api besar bersama bawang merah dan cabai rawit.',
    porsi: '2 porsi',
    waktuMasak: '7 menit',
    tingkatKesulitan: 'Sangat Mudah',
    gambar: '/images/menu/sayur-asem-komplit.jpg',
    bahan: [
      { id: 'kangkung', jumlah: 1 },
      { id: 'bawang', jumlah: 1 },
      { id: 'cabai', jumlah: 1 },
      { id: 'minyak', jumlah: 1 }
    ],
    langkah: [
      'Cuci bersih kangkung, petik daun dan batang mudanya.',
      'Panaskan minyak, tumis bawang merah dan cabai rawit hingga harum semerbak.',
      'Masukkan kangkung, aduk cepat dengan api besar selama 2-3 menit agar warnanya tetap hijau segar dan teksturnya renyah.',
      'Sajikan langsung hangat mendampingi nasi.'
    ]
  },
  {
    id: 'sayur-bening-bayam-wortel',
    nama: 'Sayur Bening Bayam & Wortel Segar',
    deskripsi: 'Kuah bening hangat yang menyegarkan tenggorokan dengan bayam hijau dan irisan wortel manis.',
    porsi: '2-3 porsi',
    waktuMasak: '10 menit',
    tingkatKesulitan: 'Sangat Mudah',
    gambar: '/images/menu/sayur-lodeh-santan.jpg',
    bahan: [
      { id: 'bayam', jumlah: 1 },
      { id: 'wortel', jumlah: 1 },
      { id: 'bawang', jumlah: 1 }
    ],
    langkah: [
      'Didihkan air dalam panci bersama irisan bawang merah sampai aromanya harum.',
      'Masukkan irisan wortel terlebih dahulu, rebus selama 3 menit hingga mulai empuk.',
      'Masukkan bayam hijau, aduk sebentar selama 1-2 menit saja agar vitaminnya terjaga.',
      'Angkat dan sajikan dalam mangkuk saji hangat.'
    ]
  },
  {
    id: 'tahu-tempe-goreng-gurih',
    nama: 'Tahu & Tempe Goreng Bawang Renyah',
    deskripsi: 'Lauk protein nabati harian yang gurih renyah di luar dan lembut di dalam.',
    porsi: '2 porsi',
    waktuMasak: '12 menit',
    tingkatKesulitan: 'Sangat Mudah',
    gambar: '/images/menu/batagor-bandung.jpg',
    bahan: [
      { id: 'tahu', jumlah: 1 },
      { id: 'tempe', jumlah: 1 },
      { id: 'bawang', jumlah: 1 },
      { id: 'minyak', jumlah: 1 }
    ],
    langkah: [
      'Potong tahu dan tempe sesuai selera, balur dengan ulekan bawang merah dan sedikit air garam.',
      'Panaskan minyak cukup banyak dengan api sedang.',
      'Goreng tempe hingga kuning keemasan dan renyah, lalu tiriskan.',
      'Goreng tahu sampai bagian luarnya berkulit garing, angkat dan nikmati hangat.'
    ]
  },
  {
    id: 'mie-nyemek-telur-pedas',
    nama: 'Mie Nyemek Telur Pedas Kuah Kental',
    deskripsi: 'Mie instan dimasak gaya warkop dengan kuah nyemek kental gurih, cabai melimpah, dan telur setengah matang.',
    porsi: '1 porsi',
    waktuMasak: '8 menit',
    tingkatKesulitan: 'Sangat Mudah',
    gambar: '/images/menu/indomie-warkop-spesial.jpg',
    bahan: [
      { id: 'mie-instan', jumlah: 1 },
      { id: 'telur', jumlah: 1 },
      { id: 'bawang', jumlah: 1 },
      { id: 'cabai', jumlah: 1 },
      { id: 'minyak', jumlah: 1 }
    ],
    langkah: [
      'Panaskan sedikit minyak, tumis irisan bawang dan cabai rawit sampai layu dan harum.',
      'Tuangkan 250ml air, tunggu hingga mendidih.',
      'Masukkan mie instan dan bumbunya, lalu ceplok telur langsung ke dalam kuah.',
      'Masak hingga kuah menyusut menjadi nyemek kental dan telur matang sesuai selera.'
    ]
  },
  {
    id: 'ayam-goreng-tepung-krispi',
    nama: 'Ayam Goreng Tepung Krispi Gurih',
    deskripsi: 'Fillet ayam empuk dibalut adonan tepung gurih berlapis garing keemasan.',
    porsi: '2 porsi',
    waktuMasak: '20 menit',
    tingkatKesulitan: 'Sedang',
    gambar: '/images/menu/fried-chicken.jpg',
    bahan: [
      { id: 'ayam', jumlah: 1 },
      { id: 'tepung', jumlah: 1 },
      { id: 'telur', jumlah: 1 },
      { id: 'bawang', jumlah: 1 },
      { id: 'minyak', jumlah: 1 }
    ],
    langkah: [
      'Lumuri potongan ayam dengan ulekan bawang merah dan diamkan 10 menit.',
      'Celupkan ayam ke dalam kocokan telur, lalu gulingkan ke tepung terigu sambil ditekan-tekan agar keriting.',
      'Goreng dalam minyak panas api sedang hingga cokelat keemasan dan matang merata.',
      'Tiriskan dan sajikan dengan cabai rawit.'
    ]
  },
  {
    id: 'udang-tumis-cabai-bawang',
    nama: 'Udang Tumis Bawang Cabai Rawit',
    deskripsi: 'Udang segar manis ditumis gurih dengan aroma bawang merah dan letupan cabai rawit merah.',
    porsi: '2 porsi',
    waktuMasak: '10 menit',
    tingkatKesulitan: 'Mudah',
    gambar: '/images/menu/udang-seafood.jpg',
    bahan: [
      { id: 'udang', jumlah: 1 },
      { id: 'bawang', jumlah: 1 },
      { id: 'cabai', jumlah: 1 },
      { id: 'minyak', jumlah: 1 }
    ],
    langkah: [
      'Bersihkan udang, buang kotoran punggung dan kepalanya.',
      'Panaskan minyak, tumis banyak irisan bawang merah dan cabai rawit sampai harum wangi.',
      'Masukkan udang, tumis cepat selama 3-4 menit sampai udang berubah warna kemerahan dan matang juicy.',
      'Angkat dan sajikan langsung bersama nasi putih hangat.'
    ]
  },
  {
    id: 'cumi-tumis-pedas-segar',
    nama: 'Cumi-cumi Tumis Pedas Segar',
    deskripsi: 'Cumi-cumi segar kenyal empuk dimasak pedas gurih dengan bawang dan cabai melimpah.',
    porsi: '2 porsi',
    waktuMasak: '8 menit',
    tingkatKesulitan: 'Mudah',
    gambar: '/images/menu/cumi-saus-padang.jpg',
    bahan: [
      { id: 'cumi', jumlah: 1 },
      { id: 'bawang', jumlah: 1 },
      { id: 'cabai', jumlah: 1 },
      { id: 'minyak', jumlah: 1 }
    ],
    langkah: [
      'Bersihkan cumi, potong cincin dan kerat permukaannya.',
      'Panaskan minyak, tumis irisan bawang dan cabai rawit hingga matang harum.',
      'Masukkan potongan cumi, tumis dengan api besar selama 2-3 menit saja agar tekstur cumi tetap empuk dan tidak alot.',
      'Sajikan hangat di piring saji.'
    ]
  },
  {
    id: 'ikan-goreng-sambal-bawang',
    nama: 'Ikan Goreng Sambal Bawang Rawit',
    deskripsi: 'Ikan segar digoreng garing renyah disiram ulekan sambal bawang mentah minyak panas.',
    porsi: '1-2 porsi',
    waktuMasak: '15 menit',
    tingkatKesulitan: 'Mudah',
    gambar: '/images/menu/ikan-kembung-bakar.jpg',
    bahan: [
      { id: 'ikan', jumlah: 1 },
      { id: 'bawang', jumlah: 1 },
      { id: 'cabai', jumlah: 1 },
      { id: 'minyak', jumlah: 1 }
    ],
    langkah: [
      'Bersihkan ikan, kerat badannya lalu beri sedikit ulekan bawang dan garam.',
      'Goreng ikan dalam minyak panas terendam sampai matang kecokelatan dan renyah.',
      'Ulek kasar cabai rawit dan bawang merah, siram dengan 2 sendok minyak sisa menggoreng ikan yang masih mendidih.',
      'Siramkan sambal bawang di atas ikan goreng garing.'
    ]
  },
  {
    id: 'perkedel-kentang-telur-gurih',
    nama: 'Perkedel Kentang Goreng Balut Telur',
    deskripsi: 'Olahan kentang lembut dibumbui bawang goreng lalu dibalut kocokan telur renyah berenda.',
    porsi: '3-4 porsi',
    waktuMasak: '25 menit',
    tingkatKesulitan: 'Sedang',
    gambar: '/images/menu/bakwan-jagung-renyah.jpg',
    bahan: [
      { id: 'kentang', jumlah: 1 },
      { id: 'telur', jumlah: 1 },
      { id: 'bawang', jumlah: 1 },
      { id: 'minyak', jumlah: 1 }
    ],
    langkah: [
      'Kupas kentang, potong-potong lalu goreng dalam minyak sampai empuk matang.',
      'Tumbuk kentang hangat hingga halus lembut bersama tumisan bawang merah halus.',
      'Bentuk bulat pipih sesuai selera.',
      'Celupkan ke kocokan telur, lalu goreng di minyak panas sedang sampai kuning keemasan.'
    ]
  },
  {
    id: 'daging-sapi-tumis-pedas',
    nama: 'Tumis Daging Sapi Iris Bawang Pedas',
    deskripsi: 'Irisan tipis daging sapi empuk dimasak cepat dengan harum bawang dan cabai rawit pedas meresap.',
    porsi: '2 porsi',
    waktuMasak: '15 menit',
    tingkatKesulitan: 'Mudah',
    gambar: '/images/menu/sate-maranggi-sapi.jpg',
    bahan: [
      { id: 'daging-sapi', jumlah: 1 },
      { id: 'bawang', jumlah: 1 },
      { id: 'cabai', jumlah: 1 },
      { id: 'minyak', jumlah: 1 }
    ],
    langkah: [
      'Iris daging sapi tipis berlawanan arah serat agar empuk saat dimasak.',
      'Panaskan minyak, tumis bawang merah dan cabai rawit sampai harum layu.',
      'Masukkan irisan daging sapi, tumis cepat di atas api besar sampai berubah warna kecokelatan dan matang sempurna.',
      'Angkat dan sajikan selagi panas mengepul.'
    ]
  },
  {
    id: 'sop-daging-kentang-wortel',
    nama: 'Sop Bening Daging Sapi Kentang Wortel',
    deskripsi: 'Kuah kaldu sapi alami yang kaya rasa dengan potongan kentang empuk dan wortel manis.',
    porsi: '3 porsi',
    waktuMasak: '35 menit',
    tingkatKesulitan: 'Sedang',
    gambar: '/images/menu/sop-iga.jpg',
    bahan: [
      { id: 'daging-sapi', jumlah: 1 },
      { id: 'kentang', jumlah: 1 },
      { id: 'wortel', jumlah: 1 },
      { id: 'bawang', jumlah: 1 }
    ],
    langkah: [
      'Rebus potongan daging sapi dengan api kecil sampai empuk dan mengeluarkan kaldu gurih bening.',
      'Tumis irisan bawang merah dengan sedikit minyak hingga harum, masukkan ke dalam rebusan kuah kaldu.',
      'Masukkan potongan kentang dan wortel, rebus hingga keduanya empuk.',
      'Koreksi rasa, angkat dan sajikan dalam mangkuk hangat.'
    ]
  },
  {
    id: 'singkong-goreng-merekah',
    nama: 'Singkong Goreng Merekah Gurih Bawang',
    deskripsi: 'Camilan singkong empuk merekah dengan bagian luar renyah dan bagian dalam gurih pulen.',
    porsi: '3-4 porsi',
    waktuMasak: '25 menit',
    tingkatKesulitan: 'Mudah',
    gambar: '/images/menu/cireng-rujak-crispy.jpg',
    bahan: [
      { id: 'singkong', jumlah: 1 },
      { id: 'bawang', jumlah: 1 },
      { id: 'minyak', jumlah: 1 }
    ],
    langkah: [
      'Potong singkong, kukus atau rebus bersama bawang merah geprek hingga setengah empuk.',
      'Angkat singkong dan rendam sebentar dalam air es dingin hingga merekah mekar.',
      'Goreng singkong dalam minyak panas terendam sampai berwarna kuning keemasan renyah.',
      'Tiriskan dan sajikan hangat.'
    ]
  },
  {
    id: 'ubi-goreng-tepung-renyah',
    nama: 'Ubi Goreng Balut Tepung Crispy',
    deskripsi: 'Ubi jalar manis empuk dilapisi adonan tepung garing keemasan yang nikmat sebagai teman santai.',
    porsi: '3 porsi',
    waktuMasak: '15 menit',
    tingkatKesulitan: 'Sangat Mudah',
    gambar: '/images/menu/pisang-goreng-keju.jpg',
    bahan: [
      { id: 'ubi', jumlah: 1 },
      { id: 'tepung', jumlah: 1 },
      { id: 'minyak', jumlah: 1 }
    ],
    langkah: [
      'Kupas ubi jalar manis, potong memanjang seperti stik tebal atau pipih lebar.',
      'Buat adonan tepung terigu encer kental dengan air dingin.',
      'Celupkan potongan ubi ke dalam adonan tepung hingga rata.',
      'Goreng di minyak panas hingga permukaan tepung matang garing dan ubi di dalam lembut legit.'
    ]
  },
  {
    id: 'telur-dadar-tepung-bawang',
    nama: 'Telur Dadar Bawang Cabai Mekar',
    deskripsi: 'Telur dadar tebal mekar berenda dengan campuran tepung, irisan bawang melimpah, dan cabai rawit pedas.',
    porsi: '2 porsi',
    waktuMasak: '8 menit',
    tingkatKesulitan: 'Sangat Mudah',
    gambar: '/images/menu/martabak-telor-bebek.jpg',
    bahan: [
      { id: 'telur', jumlah: 1 },
      { id: 'tepung', jumlah: 1 },
      { id: 'bawang', jumlah: 1 },
      { id: 'cabai', jumlah: 1 },
      { id: 'minyak', jumlah: 1 }
    ],
    langkah: [
      'Kocok lepas telur, campurkan 1 sendok makan tepung terigu yang dilarutkan sedikit air agar dadar tebal mekar.',
      'Tambahkan irisan bawang merah dan cabai rawit merah ke dalam kocokan telur.',
      'Panaskan minyak cukup banyak di wajan cekung.',
      'Tuang adonan telur dari ketinggian agar terbentuk renda mekar garing, balik sekali saat sisi bawah matang kecokelatan.'
    ]
  },
  {
    id: 'sup-ayam-wortel-kentang',
    nama: 'Sup Ayam Bening Wortel & Kentang',
    deskripsi: 'Sup kaldu ayam rumahan yang hangat, menyehatkan, penuh gizi dengan sayuran segar.',
    porsi: '2-3 porsi',
    waktuMasak: '25 menit',
    tingkatKesulitan: 'Mudah',
    gambar: '/images/menu/soto-ayam.jpg',
    bahan: [
      { id: 'ayam', jumlah: 1 },
      { id: 'wortel', jumlah: 1 },
      { id: 'kentang', jumlah: 1 },
      { id: 'bawang', jumlah: 1 }
    ],
    langkah: [
      'Rebus potongan ayam hingga mengeluarkan kaldu bersih, buang buih yang mengapung di atasnya.',
      'Tumis irisan bawang merah sebentar hingga wangi, masukkan ke dalam air rebusan sup.',
      'Masukkan kentang dan wortel, masak bersama ayam hingga sayuran empuk matang.',
      'Angkat dan sajikan hangat berkuah segar.'
    ]
  },
  {
    id: 'orak-arik-telur-wortel',
    nama: 'Orak-Arik Telur & Wortel Serut',
    deskripsi: 'Tumisan kilat bergizi tinggi perpaduan serutan wortel manis renyah dengan telur lembut berbutir gurih.',
    porsi: '2 porsi',
    waktuMasak: '7 menit',
    tingkatKesulitan: 'Sangat Mudah',
    gambar: '/images/menu/gado-gado.jpg',
    bahan: [
      { id: 'telur', jumlah: 1 },
      { id: 'wortel', jumlah: 1 },
      { id: 'bawang', jumlah: 1 },
      { id: 'minyak', jumlah: 1 }
    ],
    langkah: [
      'Serut kasar wortel segar seukuran korek api.',
      'Panaskan minyak, tumis bawang merah hingga harum kekuningan.',
      'Masukkan serutan wortel, masak selama 2 menit hingga layu sedikit.',
      'Masukkan telur kocok, aduk cepat (orak-arik) hingga telur matang menyatu dengan wortel.'
    ]
  },
  {
    id: 'sambal-tempe-bawang-rawit',
    nama: 'Sambal Tempe Bejek Bawang Rawit',
    deskripsi: 'Tempe goreng panas langsung dibejek ulek bersama cabai rawit merah dan bawang gurih.',
    porsi: '2 porsi',
    waktuMasak: '10 menit',
    tingkatKesulitan: 'Sangat Mudah',
    gambar: '/images/menu/ayam-penyet-sambal.jpg',
    bahan: [
      { id: 'tempe', jumlah: 1 },
      { id: 'bawang', jumlah: 1 },
      { id: 'cabai', jumlah: 1 },
      { id: 'minyak', jumlah: 1 }
    ],
    langkah: [
      'Potong tempe, goreng dalam minyak panas hingga kuning kecokelatan matang garing.',
      'Ulek kasar bawang merah dan cabai rawit merah di cobek bersama sedikit garam.',
      'Siram ulekan sambal dengan sesendok minyak panas sisa gorengan tempe.',
      'Letakkan tempe hangat di atas sambal, lalu bejek/ulek kasar hingga bumbu meresap ke dalam tempe.'
    ]
  },
  {
    id: 'bakwan-sayur-bayam-wortel',
    nama: 'Bakwan Renyah Sayur Bayam & Wortel',
    deskripsi: 'Gorengan bakwan renyah krispi dengan isian sayur bayam segar, wortel manis, dan adonan tepung beraroma bawang.',
    porsi: '3-4 porsi',
    waktuMasak: '15 menit',
    tingkatKesulitan: 'Mudah',
    gambar: '/images/menu/bakwan-jagung-renyah.jpg',
    bahan: [
      { id: 'tepung', jumlah: 1 },
      { id: 'bayam', jumlah: 1 },
      { id: 'wortel', jumlah: 1 },
      { id: 'bawang', jumlah: 1 },
      { id: 'minyak', jumlah: 1 }
    ],
    langkah: [
      'Iris kasar daun bayam dan serut wortel tipis memanjang.',
      'Campur tepung terigu, ulekan bawang merah, dan air dingin secukupnya hingga menjadi adonan kental.',
      'Masukkan irisan bayam dan wortel ke dalam adonan, aduk rata.',
      'Goreng per sendok sayur di minyak panas hingga kering renyah dan kuning keemasan.'
    ]
  },
  {
    id: 'tumis-tahu-pedas-bawang',
    nama: 'Tumis Tahu Putih Pedas Bawang Rawit',
    deskripsi: 'Potongan tahu putih lembut ditumis gurih bersalut minyak cabai rawit pedas dan bawang harum.',
    porsi: '2 porsi',
    waktuMasak: '10 menit',
    tingkatKesulitan: 'Sangat Mudah',
    gambar: '/images/menu/tahu-gejrot-cirebon.jpg',
    bahan: [
      { id: 'tahu', jumlah: 1 },
      { id: 'bawang', jumlah: 1 },
      { id: 'cabai', jumlah: 1 },
      { id: 'minyak', jumlah: 1 }
    ],
    langkah: [
      'Potong tahu putih bentuk dadu, goreng sebentar setengah matang agar tidak hancur saat ditumis.',
      'Panaskan minyak, tumis irisan bawang merah dan cabai rawit merah hingga harum dan layu.',
      'Masukkan potongan tahu goreng, aduk perlahan agar bumbu pedas membalut permukaan tahu dengan sempurna.',
      'Angkat dan sajikan hangat.'
    ]
  }
];

// Write bahan.json and resep.json
fs.writeFileSync('src/data/bahan.json', JSON.stringify(rawBahan20, null, 2), 'utf8');
fs.writeFileSync('src/data/resep.json', JSON.stringify(resepList, null, 2), 'utf8');

console.log('SUCCESS: Generated exactly 20 distinct raw ingredients and 20 matching recipes!');
