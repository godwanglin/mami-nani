import { useState, useMemo, useEffect, useRef } from 'react';
import bahanData from './data/bahan.json';
import menuData from './data/menu.json';
import resepData from './data/resep.json';
import {
  Utensils,
  CookingPot,
  Wallet,
  Flame,
  Store,
  Clock,
  Search,
  SearchX,
  ChefHat,
  Check,
  CheckCheck,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  X,
  Sparkles,
  Delete,
  Trophy,
  Award,
  Heart,
  Plus,
  Trash2,
  Activity,
  Zap,
  PartyPopper,
  CheckCircle2,
  getBahanIcon,
  getMenuIcon
} from './lib/icons';

const bahanMap = Object.fromEntries(bahanData.map((b) => [b.id, b]));

function formatRupiah(num) {
  return 'Rp ' + Number(num).toLocaleString('id-ID');
}

function formatTakaran(jumlah, satuan, nama) {
  if (!satuan) return nama;
  const s = satuan.trim();
  if (/^\d/.test(s)) {
    if (jumlah === 1) return `${s} ${nama}`;
    return `${jumlah}x (${s}) ${nama}`;
  }
  return `${jumlah} ${s} ${nama}`;
}

const SEASONING_BAHAN = [
  'garam',
  'micin',
  'kaldu-bubuk',
  'lada-bubuk',
  'gula-pasir',
  'saus-tiram',
  'saus-sambal',
  'terasi'
];

const STAPLE_BAHAN = [
  'beras',
  'telur',
  'bawang',
  'minyak',
  'cabai',
  'garam',
  'micin',
  'kaldu-bubuk',
  'lada-bubuk',
  'gula-pasir'
];

const STORAGE_KEYS = {
  mode: 'mami_mode_v1',
  budget: 'mami_budget_v1',
  selectedBahan: 'mami_selected_bahan_v3',
  chosenMeals: 'mami_chosen_meals_v3'
};

const menuMap = Object.fromEntries(menuData.map((m) => [m.id, m]));
const resepMap = Object.fromEntries(resepData.map((r) => [r.id, r]));

function loadPersistedMode() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.mode);
    if (raw === 'menu' || raw === 'resep') return raw;
  } catch {
    // ignore storage errors
  }
  return 'menu';
}

function loadPersistedBudget() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.budget);
    if (raw !== null) {
      const parsed = Number(raw);
      if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 1000000) {
        return parsed;
      }
    }
  } catch {
    // ignore storage errors
  }
  return 20000;
}

function loadPersistedSelectedBahan() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.selectedBahan);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length > 0) {
        return new Set(arr.filter((id) => Boolean(bahanMap[id])));
      }
    }
  } catch {
    // ignore storage errors
  }
  return new Set(); // Default bersih / kosong — hanya berisi bahan yang secara eksplisit dicentang user!
}

function loadPersistedChosenMeals() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.chosenMeals);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr
      .map((entry) => {
        if (!entry || !entry.id || !entry.type) return null;
        if (entry.type === 'menu') {
          const fresh = menuMap[entry.id];
          if (!fresh) return null;
          return {
            uid: `menu:${fresh.id}`,
            type: 'menu',
            id: fresh.id,
            nama: fresh.nama,
            gambar: fresh.gambar || `/images/menu/${fresh.id}.jpg`,
            harga: fresh.harga,
            kalori: fresh.kalori,
            bahanIds: fresh.bahanUtama || []
          };
        }
        if (entry.type === 'resep') {
          const fresh = resepMap[entry.id];
          if (!fresh) return null;
          let totalHarga = 0;
          let totalKalori = 0;
          for (const b of fresh.bahan || []) {
            const ref = bahanMap[b.id];
            if (ref) {
              totalHarga += ref.harga * (b.jumlah || 1);
              totalKalori += ref.kalori * (b.jumlah || 1);
            }
          }
          return {
            uid: `resep:${fresh.id}`,
            type: 'resep',
            id: fresh.id,
            nama: fresh.nama,
            gambar: fresh.gambar || `/images/resep/${fresh.id}.jpg`,
            harga: totalHarga,
            kalori: totalKalori,
            bahanIds: (fresh.bahan || []).map((b) => b.id)
          };
        }
        return null;
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

const CATEGORIES = [
  { id: 'semua', label: 'Semua' },
  { id: 'protein', label: 'Protein' },
  { id: 'sayur', label: 'Sayur' },
  { id: 'karbo', label: 'Karbo' },
  { id: 'bumbu', label: 'Bumbu' }
];

const AKG_DAILY = {
  kalori: 2150,
  protein: 60,
  karbo: 325,
  lemak: 67,
  serat: 30
};

function computeNutritionSummary(meals) {
  if (!meals || meals.length === 0) {
    return {
      totalKalori: 0,
      totalHarga: 0,
      karboG: 0,
      proteinG: 0,
      lemakG: 0,
      seratG: 0,
      pctKarbo: 50,
      pctProtein: 20,
      pctLemak: 30,
      akgKalori: 0,
      akgProtein: 0,
      akgKarbo: 0,
      akgLemak: 0,
      akgSerat: 0,
      score: 0,
      statusLabel: 'Belum Ada Asupan',
      statusSub: 'Pilih minimal 1 menu atau resep terlebih dahulu.',
      microTags: [],
      adviceText: ''
    };
  }

  let totalKalori = 0;
  let totalHarga = 0;
  let carbKcal = 0;
  let protKcal = 0;
  let fatKcal = 0;
  let seratTotal = 0;
  const allBahanIds = new Set();

  const leanProteins = new Set(['ayam', 'ikan', 'udang', 'cumi', 'kerang', 'kepiting', 'ikan-teri']);
  const richProteins = new Set(['daging-sapi', 'telur', 'sosis']);
  const fiberCarbs = new Set(['ubi', 'singkong', 'jagung', 'pisang']);

  for (const m of meals) {
    const kcal = Number(m.kalori) || 0;
    const harga = Number(m.harga) || 0;
    totalKalori += kcal;
    totalHarga += harga;

    const bids = Array.isArray(m.bahanIds) ? m.bahanIds : [];
    let wCarb = 0;
    let wProt = 0;
    let wFat = 0;
    let mealSerat = 0;

    if (bids.length === 0) {
      wCarb = 52;
      wProt = 20;
      wFat = 28;
      mealSerat = 2.5;
    } else {
      for (const bid of bids) {
        allBahanIds.add(bid);
        const ref = bahanMap[bid];
        const kat = ref?.kategori;
        if (kat === 'karbo') {
          if (bid === 'mie-instan') {
            wCarb += 110; wProt += 22; wFat += 68; mealSerat += 1.8;
          } else if (fiberCarbs.has(bid)) {
            wCarb += 130; wProt += 12; wFat += 8; mealSerat += 3.6;
          } else {
            wCarb += 145; wProt += 16; wFat += 10; mealSerat += 1.6;
          }
        } else if (kat === 'protein') {
          if (leanProteins.has(bid)) {
            wCarb += 6; wProt += 115; wFat += 45;
          } else if (richProteins.has(bid)) {
            wCarb += 8; wProt += 85; wFat += 95;
          } else if (bid === 'kacang-hijau') {
            wCarb += 110; wProt += 56; wFat += 12; mealSerat += 4.6;
          } else if (bid === 'kacang-tanah') {
            wCarb += 32; wProt += 64; wFat += 125; mealSerat += 2.6;
          } else {
            wCarb += 28; wProt += 72; wFat += 48; mealSerat += 2.8;
          }
        } else if (kat === 'sayur') {
          wCarb += 24; wProt += 12; wFat += 4; mealSerat += 2.8;
        } else {
          if (bid === 'minyak' || bid === 'santan') {
            wCarb += 6; wProt += 4; wFat += 115; mealSerat += 0.2;
          } else if (bid === 'keju') {
            wCarb += 6; wProt += 36; wFat += 85;
          } else if (bid === 'kecap-manis' || bid === 'gula-merah') {
            wCarb += 65; wProt += 4; wFat += 2;
          } else if (bid === 'gula-pasir') {
            wCarb += 45; wProt += 0; wFat += 0; mealSerat += 0;
          } else if (bid === 'garam' || bid === 'micin') {
            wCarb += 0; wProt += 0; wFat += 0; mealSerat += 0;
          } else if (bid === 'kaldu-bubuk' || bid === 'lada-bubuk') {
            wCarb += 2; wProt += 2; wFat += 1; mealSerat += 0.1;
          } else if (bid === 'saus-tiram' || bid === 'saus-sambal') {
            wCarb += 12; wProt += 2; wFat += 1; mealSerat += 0.2;
          } else if (bid === 'terasi') {
            wCarb += 2; wProt += 8; wFat += 2; mealSerat += 0.1;
          } else {
            wCarb += 10; wProt += 3; wFat += 1; mealSerat += 0.5;
          }
        }
      }
    }

    const wSum = wCarb + wProt + wFat || 1;
    carbKcal += kcal * (wCarb / wSum);
    protKcal += kcal * (wProt / wSum);
    fatKcal += kcal * (wFat / wSum);
    seratTotal += Math.min(11, Math.max(1, mealSerat));
  }

  const karboG = Math.max(1, Math.round(carbKcal / 4));
  const proteinG = Math.max(1, Math.round(protKcal / 4));
  const lemakG = Math.max(1, Math.round(fatKcal / 9));
  const seratG = Math.round(seratTotal * 10) / 10;

  const macroKcalSum = carbKcal + protKcal + fatKcal || 1;
  const pctKarbo = Math.round((carbKcal / macroKcalSum) * 100);
  const pctProtein = Math.round((protKcal / macroKcalSum) * 100);
  const pctLemak = Math.max(0, 100 - pctKarbo - pctProtein);

  const akgKalori = Math.round((totalKalori / AKG_DAILY.kalori) * 100);
  const akgProtein = Math.round((proteinG / AKG_DAILY.protein) * 100);
  const akgKarbo = Math.round((karboG / AKG_DAILY.karbo) * 100);
  const akgLemak = Math.round((lemakG / AKG_DAILY.lemak) * 100);
  const akgSerat = Math.round((seratG / AKG_DAILY.serat) * 100);

  // NutriMeter Balance Score (58 - 98)
  let macroPts = 26;
  if (pctProtein >= 15) macroPts += 8;
  if (pctLemak <= 38) macroPts += 6;
  const protPts = Math.min(24, Math.round((proteinG / 22) * 24));
  const fiberPts = Math.min(22, Math.round((seratG / 6.5) * 22));
  const varietyPts = Math.min(14, Math.round((allBahanIds.size / 5) * 14));
  const score = Math.max(60, Math.min(98, macroPts + protPts + fiberPts + varietyPts));

  let statusLabel = 'Gizi Cukup Baik';
  let statusSub = 'Energi harian terisi baik, bisa ditambah sayur atau buah segar.';
  if (score >= 88) {
    statusLabel = 'Gizi Sangat Seimbang!';
    statusSub = 'Kombinasi protein, serat, dan energi pilihanmu hari ini juara banget!';
  } else if (score >= 76) {
    statusLabel = 'Nutrisi Mantap & Terjaga';
    statusSub = 'Komposisi makronutrisi sudah proporsional untuk mendukung aktivitasmu.';
  }

  const microTags = [];
  const vitCSet = ['kangkung', 'bayam', 'wortel', 'tomat', 'cabai', 'jeruk-nipis', 'brokoli', 'sawi-hijau', 'kol', 'pare'];
  const ironSet = ['daging-sapi', 'ayam', 'ikan', 'telur', 'kerang', 'kepiting', 'bayam', 'kangkung', 'kacang-hijau'];
  const calcSet = ['ikan-teri', 'keju', 'tahu', 'tempe', 'udang', 'brokoli', 'sosis'];
  const antiOxSet = ['bawang-putih', 'bawang', 'kunyit', 'serai', 'cabai', 'tomat', 'jamur-tiram'];
  const complexCarbSet = ['beras', 'ubi', 'singkong', 'kentang', 'jagung', 'pisang', 'kacang-hijau'];

  if (vitCSet.some((id) => allBahanIds.has(id))) microTags.push('Vitamin A & C');
  if (ironSet.some((id) => allBahanIds.has(id))) microTags.push('Zat Besi & B12');
  if (calcSet.some((id) => allBahanIds.has(id))) microTags.push('Kalsium & Fosfor');
  if (antiOxSet.some((id) => allBahanIds.has(id))) microTags.push('Antioksidan Alami');
  if (complexCarbSet.some((id) => allBahanIds.has(id))) microTags.push('Sumber Energi Aktif');
  if (microTags.length === 0) microTags.push('Energi Harian', 'Mineral Esensial');

  let adviceText = 'Jangan lupa minum minimal 8 gelas air putih hari ini agar metabolisme dan penyerapan nutrisimu makin optimal!';
  if (seratG < 4) {
    adviceText = 'Energi dan rasa sudah mantap! Di jam makan berikutnya, tambahkan porsi sayur hijau atau buah segar supaya kebutuhan serat harianmu makin lengkap.';
  } else if (proteinG >= 24 && seratG >= 5) {
    adviceText = 'Pilihan makanmu hari ini super seimbang — tinggi protein sekaligus kaya serat! Pertahankan pola makan hemat dan bergizi seperti ini ya!';
  }

  return {
    totalKalori,
    totalHarga,
    karboG,
    proteinG,
    lemakG,
    seratG,
    pctKarbo,
    pctProtein,
    pctLemak,
    akgKalori,
    akgProtein,
    akgKarbo,
    akgLemak,
    akgSerat,
    score,
    statusLabel,
    statusSub,
    microTags,
    adviceText
  };
}

const MAMI_TYPEWRITER_LINES = [
  { before: 'Udah makan belum? ', highlight: 'MAMI bantuin.', after: ' ♡' },
  { before: 'Makan enak & sehat ', highlight: 'nggak harus mahal!', after: ' ✨' },
  { before: 'Beli atau masak? ', highlight: 'Yuk atur bareng!', after: ' 🌷' },
  { before: 'Sayang badanmu, ', highlight: 'sayang isi dompetmu.', after: ' ♡' }
];

const HEALTHY_FEATURED_CONFIG = [
  { id: 'sayur-bening-jagung', tag: 'Rendah Kalori' },
  { id: 'tumis-brokoli-udang', tag: 'Tinggi Protein' },
  { id: 'capcay-sayur-komplit', tag: 'Kaya Serat' },
  { id: 'gado-gado-komplit', tag: 'Gizi Seimbang' },
  { id: 'sayur-asem-segar', tag: 'Segar & Hemat' }
];

const MAMI_MASCOT_IDLES = [
  {
    id: 'breathing-blink',
    src: '/images/mascot/maskot_idle_1_breathing_blink.svg',
    alt: 'Maskot MAMI bernapas dan berkedip'
  },
  {
    id: 'happy-bounce',
    src: '/images/mascot/maskot_idle_2_happy_bounce.svg',
    alt: 'Maskot MAMI melompat senang'
  },
  {
    id: 'yummy-munch',
    src: '/images/mascot/maskot_idle_3_yummy_munch.svg',
    alt: 'Maskot MAMI menikmati makanan sehat'
  },
  {
    id: 'curious-tilt',
    src: '/images/mascot/maskot_idle_4_curious_tilt.svg',
    alt: 'Maskot MAMI penasaran'
  },
  {
    id: 'sleepy-nod',
    src: '/images/mascot/maskot_idle_5_sleepy_nod.svg',
    alt: 'Maskot MAMI mengantuk lucu'
  }
];

function MamiIdleMascot({ activeIndex, className = '' }) {
  return (
    <div className={`mami-idle-stage ${className}`}>
      {MAMI_MASCOT_IDLES.map((idle, idx) => (
        <img
          key={idle.id}
          src={idle.src}
          alt={idle.alt}
          className={`mami-idle-layer ${idx === activeIndex ? 'is-active' : ''}`}
          draggable={false}
        />
      ))}
    </div>
  );
}

export default function App() {
  // Navigation: 'welcome' | 'home' | 'pilih-bahan' | 'hasil' | 'detail' | 'selesai'
  const [step, setStep] = useState('welcome');
  const [direction, setDirection] = useState('forward'); // 'forward' | 'backward'

  // Random Mascot Idle switcher (min 3 seconds, max 10 seconds)
  const [mascotIdleIdx, setMascotIdleIdx] = useState(0);

  useEffect(() => {
    const randomDurationMs = Math.floor(Math.random() * (10000 - 3000 + 1)) + 3000;
    const idleTimer = setTimeout(() => {
      setMascotIdleIdx((prev) => {
        const candidates = MAMI_MASCOT_IDLES
          .map((_, idx) => idx)
          .filter((idx) => idx !== prev);
        return candidates[Math.floor(Math.random() * candidates.length)];
      });
    }, randomDurationMs);

    return () => clearTimeout(idleTimer);
  }, [mascotIdleIdx]);

  // Typewriter animation for Welcome Home Page (segmented with pink highlight)
  const [twIndex, setTwIndex] = useState(0);
  const [twCharCount, setTwCharCount] = useState(0);
  const [twDeleting, setTwDeleting] = useState(false);

  const currentTwSegments = useMemo(() => {
    const line = MAMI_TYPEWRITER_LINES[twIndex];
    const beforeChars = Array.from(line.before);
    const highlightChars = Array.from(line.highlight);
    const afterChars = Array.from(line.after);
    return {
      beforeChars,
      highlightChars,
      afterChars,
      totalChars: beforeChars.length + highlightChars.length + afterChars.length
    };
  }, [twIndex]);

  useEffect(() => {
    if (step !== 'welcome') return undefined;
    const { totalChars } = currentTwSegments;
    let timer;
    if (!twDeleting) {
      if (twCharCount < totalChars) {
        timer = setTimeout(() => {
          setTwCharCount((prev) => prev + 1);
        }, 42);
      } else {
        timer = setTimeout(() => {
          setTwDeleting(true);
        }, 2400);
      }
    } else if (twCharCount > 0) {
      timer = setTimeout(() => {
        setTwCharCount((prev) => prev - 1);
      }, 20);
    } else {
      setTwDeleting(false);
      setTwIndex((prev) => (prev + 1) % MAMI_TYPEWRITER_LINES.length);
    }
    return () => clearTimeout(timer);
  }, [step, twCharCount, twDeleting, currentTwSegments]);

  const typedTwParts = useMemo(() => {
    const { beforeChars, highlightChars, afterChars } = currentTwSegments;
    const before = beforeChars.slice(0, Math.min(twCharCount, beforeChars.length)).join('');
    const hlLen = Math.max(0, Math.min(twCharCount - beforeChars.length, highlightChars.length));
    const highlight = highlightChars.slice(0, hlLen).join('');
    const afterLen = Math.max(0, twCharCount - beforeChars.length - highlightChars.length);
    const after = afterChars.slice(0, afterLen).join('');
    return { before, highlight, after };
  }, [currentTwSegments, twCharCount]);

  const healthyRecommendations = useMemo(() => {
    return HEALTHY_FEATURED_CONFIG
      .map((cfg) => {
        const found = menuData.find((m) => m.id === cfg.id);
        return found ? { ...found, healthyTag: cfg.tag } : null;
      })
      .filter(Boolean);
  }, []);

  // Preferences with localStorage persistence
  const [mode, setMode] = useState(loadPersistedMode); // 'menu' | 'resep'
  const [budget, setBudget] = useState(loadPersistedBudget);
  const [selectedBahan, setSelectedBahan] = useState(loadPersistedSelectedBahan);

  // Sync state to localStorage whenever changed
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.mode, mode);
    } catch {
      // ignore
    }
  }, [mode]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.budget, String(budget));
    } catch {
      // ignore
    }
  }, [budget]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.selectedBahan,
        JSON.stringify(Array.from(selectedBahan))
      );
    } catch {
      // ignore
    }
  }, [selectedBahan]);

  // Custom Virtual Keypad State with smooth exit animation
  const [isKeypadVisible, setIsKeypadVisible] = useState(false);
  const [isKeypadClosing, setIsKeypadClosing] = useState(false);

  const openKeypad = () => {
    setIsKeypadClosing(false);
    setIsKeypadVisible(true);
  };

  const closeKeypad = () => {
    if (isKeypadClosing || !isKeypadVisible) return;
    setIsKeypadClosing(true);
    setTimeout(() => {
      setIsKeypadVisible(false);
      setIsKeypadClosing(false);
    }, 230);
  };

  // Detail screen state & Chosen daily meals for NutriMeter with localStorage persistence
  const [selectedDetail, setSelectedDetail] = useState(null); // { type: 'resep' | 'menu', data: object }
  const [detailPrevStep, setDetailPrevStep] = useState('hasil');
  const [chosenMeals, setChosenMeals] = useState(loadPersistedChosenMeals); // Array<{ uid, type, id, nama, gambar, harga, kalori, bahanIds }>
  const [selesaiPrevStep, setSelesaiPrevStep] = useState('hasil');

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.chosenMeals,
        JSON.stringify(chosenMeals.map((m) => ({ id: m.id, type: m.type })))
      );
    } catch {
      // ignore
    }
  }, [chosenMeals]);

  const normalizeChosenItem = (item, type) => {
    if (type === 'menu') {
      return {
        uid: `menu:${item.id}`,
        type: 'menu',
        id: item.id,
        nama: item.nama,
        gambar: item.gambar || `/images/menu/${item.id}.jpg`,
        harga: item.harga,
        kalori: item.kalori,
        bahanIds: item.bahanUtama || []
      };
    }
    return {
      uid: `resep:${item.id}`,
      type: 'resep',
      id: item.id,
      nama: item.nama,
      gambar: item.gambar || `/images/resep/${item.id}.jpg`,
      harga: item.totalHarga,
      kalori: item.totalKalori,
      bahanIds: (item.bahan || []).map((b) => b.id)
    };
  };

  const isMealChosen = (id, type) => {
    const uid = `${type}:${id}`;
    return chosenMeals.some((m) => m.uid === uid);
  };

  const toggleChooseMeal = (item, type, e) => {
    if (e) e.stopPropagation();
    const norm = normalizeChosenItem(item, type);
    setChosenMeals((prev) => {
      const exists = prev.some((m) => m.uid === norm.uid);
      if (exists) return prev.filter((m) => m.uid !== norm.uid);
      return [...prev, norm];
    });
  };

  const nutriSummary = useMemo(() => computeNutritionSummary(chosenMeals), [chosenMeals]);

  // Search & Filters
  const [bahanCategory, setBahanCategory] = useState('semua');
  const [bahanSearch, setBahanSearch] = useState('');
  const [resultSearch, setResultSearch] = useState('');

  // Navigation handlers
  const goTo = (nextStep, dir = 'forward') => {
    setDirection(dir);
    setStep(nextStep);
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
    const screenEl = document.querySelector('.screen');
    if (screenEl) {
      screenEl.scrollTop = 0;
    }
  };

  const handleAyoLanjutkan = () => {
    if (mode === 'resep') {
      goTo('pilih-bahan', 'forward');
    } else {
      goTo('hasil', 'forward');
    }
  };

  const handleOpenDetail = (item, type, fromStep = 'hasil') => {
    setDetailPrevStep(fromStep);
    setSelectedDetail({ type, data: item });
    goTo('detail', 'forward');
  };

  const handleFinishFromDetail = (item, type) => {
    const norm = normalizeChosenItem(item, type);
    setChosenMeals((prev) => {
      if (prev.some((m) => m.uid === norm.uid)) return prev;
      return [...prev, norm];
    });
    setSelesaiPrevStep('detail');
    goTo('selesai', 'forward');
  };

  const handleSaveAndPickMore = (item, type) => {
    const norm = normalizeChosenItem(item, type);
    setChosenMeals((prev) => {
      if (prev.some((m) => m.uid === norm.uid)) return prev;
      return [...prev, norm];
    });
    goTo('hasil', 'backward');
  };

  const handleFinishFromHasil = () => {
    if (chosenMeals.length === 0) return;
    setSelesaiPrevStep('hasil');
    goTo('selesai', 'forward');
  };

  const handleRemoveChosenMeal = (uid) => {
    setChosenMeals((prev) => {
      const next = prev.filter((m) => m.uid !== uid);
      if (next.length === 0) {
        goTo(detailPrevStep === 'welcome' && selesaiPrevStep === 'detail' ? 'welcome' : 'hasil', 'backward');
      }
      return next;
    });
  };

  const handleMulaiBaru = () => {
    setSelectedBahan(new Set());
    setChosenMeals([]);
    setSelectedDetail(null);
    setResultSearch('');
    setBahanSearch('');
    try {
      window.localStorage.removeItem(STORAGE_KEYS.selectedBahan);
      window.localStorage.removeItem(STORAGE_KEYS.chosenMeals);
    } catch {
      // ignore
    }
    goTo('welcome', 'backward');
  };

  const handleBack = () => {
    if (step === 'selesai') {
      if (selesaiPrevStep === 'detail' && selectedDetail) {
        goTo('detail', 'backward');
      } else {
        goTo('hasil', 'backward');
      }
    } else if (step === 'detail') {
      goTo(detailPrevStep || 'hasil', 'backward');
    } else if (step === 'hasil') {
      if (mode === 'resep') {
        goTo('pilih-bahan', 'backward');
      } else {
        goTo('home', 'backward');
      }
    } else if (step === 'pilih-bahan') {
      goTo('home', 'backward');
    } else if (step === 'home') {
      goTo('welcome', 'backward');
    }
  };

  // Virtual Keypad Handlers
  const handleKeypadPress = (val) => {
    const currentStr = String(budget);
    let nextStr = currentStr;

    if (val === '000') {
      if (budget === 0) return;
      nextStr = currentStr + '000';
    } else if (val === '0') {
      if (budget === 0) return;
      nextStr = currentStr + '0';
    } else {
      if (budget === 0) {
        nextStr = val;
      } else {
        nextStr = currentStr + val;
      }
    }

    const num = Number(nextStr);
    if (num > 1000000) {
      setBudget(1000000);
    } else {
      setBudget(num);
    }
  };

  const handleKeypadDelete = () => {
    const currentStr = String(budget);
    if (currentStr.length <= 1) {
      setBudget(0);
    } else {
      setBudget(Number(currentStr.slice(0, -1)));
    }
  };

  const handleQuickAdd = (amount) => {
    setBudget((prev) => Math.min(1000000, prev + amount));
  };

  const handleClearBudget = () => {
    setBudget(0);
  };

  // Bahan handlers
  const toggleBahan = (id) => {
    setSelectedBahan((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedBahan(new Set(bahanData.map((b) => b.id)));
  };

  const handleResetBahan = () => {
    setSelectedBahan(new Set());
  };

  const handleSelectStaples = () => {
    setSelectedBahan(new Set(STAPLE_BAHAN));
  };

  const handleSelectSeasonings = () => {
    setSelectedBahan((prev) => {
      const next = new Set(prev);
      SEASONING_BAHAN.forEach((id) => next.add(id));
      return next;
    });
  };

  // Filtered Bahan
  const filteredBahan = useMemo(() => {
    let list = bahanData;
    if (bahanCategory !== 'semua') {
      list = list.filter((b) => b.kategori === bahanCategory);
    }
    const q = bahanSearch.trim().toLowerCase();
    if (q) {
      list = list.filter((b) => b.nama.toLowerCase().includes(q));
    }
    return list;
  }, [bahanCategory, bahanSearch]);

  // Filter Menu Jadi
  const menuHasil = useMemo(() => {
    const q = resultSearch.trim().toLowerCase();
    return menuData
      .filter((m) => m.harga <= budget)
      .filter((m) => {
        if (!q) return true;
        const matchBahanUtama = (m.bahanUtama || []).some((id) => {
          const namaBahan = bahanMap[id]?.nama || id;
          return namaBahan.toLowerCase().includes(q) || id.toLowerCase().includes(q);
        });
        return (
          m.nama.toLowerCase().includes(q) ||
          m.tempat.toLowerCase().includes(q) ||
          m.kategori.toLowerCase().includes(q) ||
          matchBahanUtama
        );
      })
      .sort((a, b) => b.harga - a.harga);
  }, [budget, resultSearch]);

  // Progressive infinite scroll auto-load (+20 on scroll)
  const [visibleMenuLimit, setVisibleMenuLimit] = useState(20);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    setVisibleMenuLimit(20);
  }, [budget, resultSearch, mode]);

  const visibleMenuHasil = useMemo(() => {
    return menuHasil.slice(0, visibleMenuLimit);
  }, [menuHasil, visibleMenuLimit]);

  useEffect(() => {
    if (visibleMenuLimit >= menuHasil.length) return;

    let observer = null;
    const sentinel = loadMoreRef.current;
    if (sentinel && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setVisibleMenuLimit((prev) => Math.min(prev + 20, menuHasil.length));
          }
        },
        { rootMargin: '400px' }
      );
      observer.observe(sentinel);
    }

    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      if (docHeight - (scrollY + windowHeight) < 450) {
        setVisibleMenuLimit((prev) => Math.min(prev + 20, menuHasil.length));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (observer && sentinel) observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [visibleMenuLimit, menuHasil.length]);

  // Hitung semua resep beserta status ketersediaan bahan — HANYA YANG BERSANGKUTAN DENGAN BAHAN PILIHAN USER
  const semuaResepTerhitung = useMemo(() => {
    const q = resultSearch.trim().toLowerCase();

    // Jika user belum memilih bahan apa pun di dapur -> resep kosong
    if (selectedBahan.size === 0) return [];

    // Pisahkan bahan yang dipilih user: Bahan Utama (karbo/protein/sayur) vs Bumbu/Penyedap
    const userMainIds = new Set();
    const userBumbuIds = new Set();

    for (const bid of selectedBahan) {
      const kat = bahanMap[bid]?.kategori;
      if (kat && kat !== 'bumbu') {
        userMainIds.add(bid);
      } else {
        userBumbuIds.add(bid);
      }
    }

    return resepData
      .filter((resep) => {
        // Ambil semua ID bahan utama yang ada pada resep ini (bukan bumbu)
        const recipeMainIds = resep.bahan
          .map((b) => b.id)
          .filter((id) => bahanMap[id] && bahanMap[id].kategori !== 'bumbu');

        // ATURAN RELEVANSI MUTLAK (TIDAK ADA RESEP NYANGKUT):
        // 1. Jika user memilih minimal 1 bahan utama (misal: ayam):
        //    Resep WAJIB mengandung minimal salah satu bahan utama yang dipilih user!
        //    (Resep singkong, ikan, sapi, tahu, ubi TIDAK AKAN PERNAH muncul jika user hanya memilih ayam!)
        if (userMainIds.size > 0) {
          const hasChosenMain = recipeMainIds.some((id) => userMainIds.has(id));
          if (!hasChosenMain) return false;
        } else {
          // 2. Jika user HANYA memilih bumbu dapur (misal: bawang, cabai):
          //    Hanya boleh tampilkan olahan bumbu murni (seperti sambal korek)
          //    Jangan tampilkan resep berkarbohidrat/berprotein besar yang tidak dipilih!
          if (recipeMainIds.length > 0) return false;
        }

        // Filter kata kunci pencarian jika ada
        if (q) {
          const matchName = resep.nama.toLowerCase().includes(q);
          const matchBahan = resep.bahan.some((b) => {
            const bNama = bahanMap[b.id]?.nama || b.id;
            return bNama.toLowerCase().includes(q);
          });
          if (!matchName && !matchBahan) return false;
        }

        return true;
      })
      .map((resep) => {
        let totalHarga = 0;
        let totalKalori = 0;
        let semuaBahanAda = true;
        let kurangCount = 0;
        let cocokUtamaCount = 0;
        let cocokTotalCount = 0;
        const bahanList = [];

        for (const item of resep.bahan) {
          const dipunyai = selectedBahan.has(item.id);
          const ref = bahanMap[item.id];
          if (!dipunyai) {
            semuaBahanAda = false;
            kurangCount += 1;
          } else {
            cocokTotalCount += 1;
            if (ref && ref.kategori !== 'bumbu') {
              cocokUtamaCount += 1;
            }
          }
          if (ref) {
            totalHarga += ref.harga * (item.jumlah || 1);
            totalKalori += ref.kalori * (item.jumlah || 1);
            bahanList.push({
              id: item.id,
              nama: ref.nama,
              satuan: ref.satuan,
              jumlah: item.jumlah,
              kategori: ref.kategori,
              ada: dipunyai
            });
          }
        }

        return {
          ...resep,
          waktu: resep.waktu || parseInt(resep.waktuMasak, 10) || 15,
          totalHarga,
          totalKalori,
          bisaDimasak: semuaBahanAda,
          kurangCount,
          cocokUtamaCount,
          cocokTotalCount,
          bahanList
        };
      });
  }, [selectedBahan, resultSearch]);

  // Resep yang BISA LANGSUNG DIMASAK (Semua bahan lengkap dimiliki user)
  const resepHasil = useMemo(() => {
    return semuaResepTerhitung
      .filter((r) => r.bisaDimasak && r.totalHarga <= budget)
      .sort((a, b) => a.totalHarga - b.totalHarga);
  }, [semuaResepTerhitung, budget]);

  // Resep olahan yang RELEVAN DENGAN BAHAN USER (Bahan utama cocok, tapi masih kurang bumbu/bahan pendukung)
  const resepHampirCocok = useMemo(() => {
    if (selectedBahan.size === 0) return [];
    return semuaResepTerhitung
      .filter((r) => !r.bisaDimasak && r.totalHarga <= budget)
      .sort((a, b) => {
        // 1. Yang bahan utamanya paling banyak cocok
        if (b.cocokUtamaCount !== a.cocokUtamaCount) return b.cocokUtamaCount - a.cocokUtamaCount;
        // 2. Yang kekurangan bahannya paling sedikit
        if (a.kurangCount !== b.kurangCount) return a.kurangCount - b.kurangCount;
        return a.totalHarga - b.totalHarga;
      });
  }, [selectedBahan, semuaResepTerhitung, budget]);

  // Gabungan resep relevan: yang siap masak berada di atas, disusul ide olahan relevan
  const resepToDisplay = useMemo(() => {
    return [...resepHasil, ...resepHampirCocok];
  }, [resepHasil, resepHampirCocok]);

  const handleLengkapiBahanResep = (resepItem, e) => {
    if (e) e.stopPropagation();
    setSelectedBahan((prev) => {
      const next = new Set(prev);
      for (const b of resepItem.bahanList) {
        next.add(b.id);
      }
      return next;
    });
    if (selectedDetail && selectedDetail.type === 'resep' && selectedDetail.data.id === resepItem.id) {
      setSelectedDetail({
        type: 'resep',
        data: {
          ...resepItem,
          bisaDimasak: true,
          kurangCount: 0,
          bahanList: resepItem.bahanList.map((b) => ({ ...b, ada: true }))
        }
      });
    }
  };

  const chips = [10000, 20000, 30000, 50000, 100000];

  return (
    <div className="wrapper">
      <div className="phone">
        <div className="screen">
          {/* =========================================
              SCREEN 0: LANDING / WELCOME HOME PAGE (MAMI)
             ========================================= */}
          {step === 'welcome' && (
            <div className={`step-container welcome-step ${direction}`} key="step-welcome">
              {/* Top-Left Brand Header */}
              <header className="welcome-header">
                <div className="welcome-logo-wrap">
                  <img
                    src="/images/mascot/maskot_idle_1_breathing_blink.svg"
                    alt="Logo MAMI"
                    className="welcome-logo-img"
                  />
                </div>
                <div className="welcome-brand-text">
                  <h1 className="welcome-brand-title">MAMI</h1>
                  <p className="welcome-brand-sub">Makan &amp; Money Intelligence</p>
                </div>
              </header>

              {/* Main Rounded Card Container */}
              <section className="welcome-main-card">
                {/* Upper Row: Enlarged Animated Mascot on LEFT + Mixed Pink Highlighted Tagline on RIGHT */}
                <div className="welcome-dialogue-row">
                  <div className="welcome-mascot-figure">
                    <MamiIdleMascot activeIndex={mascotIdleIdx} />
                  </div>

                  <div className="welcome-dialogue-col">
                    <div className="welcome-pill-badge">
                      <span role="img" aria-label="tulip">🌷</span>
                      <span>Teman makan yang selalu ada</span>
                    </div>

                    <div className="welcome-typewriter-box" aria-live="polite">
                      <h2 className="welcome-typewriter-heading">
                        {typedTwParts.before && <span>{typedTwParts.before}</span>}
                        {typedTwParts.highlight && (
                          <mark className="welcome-pink-highlight">{typedTwParts.highlight}</mark>
                        )}
                        {typedTwParts.after && (
                          <span className="welcome-pink-accent">{typedTwParts.after}</span>
                        )}
                        <span className="welcome-typewriter-cursor" aria-hidden="true">|</span>
                      </h2>
                    </div>

                    <p className="welcome-warm-sub">
                      Makan yang cukup, ya. Jangan cuma kenyang,{' '}
                      <span className="welcome-sub-highlight">tapi juga sehat &amp; ramah di kantong</span>{' '}
                      setiap hari. ♡
                    </p>
                  </div>
                </div>

                {/* Lower Row: 1-Line Compact Healthy Food Recommendation Cards (No Extra Outer Card Box) */}
                <div className="welcome-healthy-grid">
                  {healthyRecommendations.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="welcome-food-card"
                      onClick={() => handleOpenDetail(item, 'menu', 'welcome')}
                    >
                      <div className="welcome-food-img-wrap">
                        {item.gambar ? (
                          <img
                            src={item.gambar}
                            alt={item.nama}
                            className="welcome-food-img"
                            loading="lazy"
                          />
                        ) : (
                          <div className="welcome-food-fallback">
                            {getMenuIcon(item.id, item.bahanIds, 22)}
                          </div>
                        )}
                        <span className="welcome-food-tag">{item.healthyTag}</span>
                        <span className="welcome-food-price">{formatRupiah(item.harga)}</span>
                      </div>

                      <div className="welcome-food-body">
                        <h4 className="welcome-food-name">{item.nama}</h4>
                        <div className="welcome-food-meta">
                          <span className="welcome-food-kcal">
                            <Flame size={11} strokeWidth={2.5} />
                            {item.kalori} kkal
                          </span>
                          <span className="welcome-food-link">
                            <ChevronRight size={12} strokeWidth={2.8} />
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Bottom CTA Button Outside Card -> Navigate to Existing Setup Page */}
              <div className="welcome-cta-wrap">
                <button
                  type="button"
                  className="btn-welcome-start"
                  onClick={() => goTo('home', 'forward')}
                >
                  <span>Mulai Sekarang</span>
                  <ArrowRight size={20} strokeWidth={2.7} />
                </button>
              </div>
            </div>
          )}

          {/* =========================================
              SCREEN 1: ATUR PREFERENSI & BUDGET (EXISTING PAGE)
             ========================================= */}
          {step === 'home' && (
            <div className={`step-container ${direction}`} key="step-home">
              {/* Header */}
              <header className="brand">
                <div
                  className="brand-left brand-clickable"
                  onClick={() => goTo('welcome', 'backward')}
                  role="button"
                  tabIndex={0}
                  title="Kembali ke Beranda MAMI"
                >
                  <div className="brand-mascot brand-mascot-img-wrap">
                    <MamiIdleMascot activeIndex={mascotIdleIdx} />
                  </div>
                  <div>
                    <h1 className="brand-title">MAMI</h1>
                    <p className="brand-sub">Makan &amp; Money Intelligence</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-nav-back"
                  onClick={() => goTo('welcome', 'backward')}
                  aria-label="Kembali ke Beranda"
                >
                  <ArrowLeft size={15} strokeWidth={2.5} />
                  <span>Beranda</span>
                </button>
              </header>

              {/* Greeting Card */}
              <section className="hero-card">
                <div className="hero-badge">Hemat & Praktis</div>
                <h2 className="hero-title">Mau makan apa hari ini?</h2>
                <p className="hero-desc">
                  Tentukan budget dan cara makanmu, kami pilihkan menu yang paling pas untuk dompetmu.
                </p>
              </section>

              {/* Pilihan Cara Makan */}
              <section className="form-group">
                <label className="section-label">Pilih cara makan</label>
                <div className="mode-cards">
                  <button
                    type="button"
                    className={`mode-card ${mode === 'menu' ? 'active' : ''}`}
                    onClick={() => setMode('menu')}
                  >
                    <div className="mode-card-icon">
                      <Utensils size={20} strokeWidth={2.5} />
                    </div>
                    <div className="mode-card-text">
                      <div className="mode-card-title">Tinggal Makan</div>
                      <div className="mode-card-sub">Siap santap / beli di luar</div>
                    </div>
                    <div className={`mode-check ${mode === 'menu' ? 'checked' : ''}`}>
                      {mode === 'menu' && <Check size={12} strokeWidth={3} />}
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`mode-card ${mode === 'resep' ? 'active' : ''}`}
                    onClick={() => setMode('resep')}
                  >
                    <div className="mode-card-icon">
                      <CookingPot size={20} strokeWidth={2.5} />
                    </div>
                    <div className="mode-card-text">
                      <div className="mode-card-title">Masak Sendiri</div>
                      <div className="mode-card-sub">Racik dari bahan di dapur</div>
                    </div>
                    <div className={`mode-check ${mode === 'resep' ? 'checked' : ''}`}>
                      {mode === 'resep' && <Check size={12} strokeWidth={3} />}
                    </div>
                  </button>
                </div>
              </section>

              {/* Budget Input Card with Custom Virtual Keypad Trigger */}
              <section className="form-group">
                <label className="section-label" htmlFor="budgetDisplayInput">
                  <span>Tentukan budget kamu</span>
                  <span className="budget-val-highlight">{formatRupiah(budget)}</span>
                </label>
                <div className="budget-card">
                  <div
                    className="budget-row budget-row-interactive"
                    onClick={openKeypad}
                    role="button"
                    tabIndex={0}
                    title="Klik untuk membuka keyboard angka custom"
                  >
                    <span className="currency">Rp</span>
                    <input
                      id="budgetDisplayInput"
                      className="budget-input cursor-pointer"
                      type="text"
                      readOnly
                      inputMode="none"
                      value={Number(budget).toLocaleString('id-ID')}
                      onClick={openKeypad}
                      tabIndex={-1}
                      aria-label="Budget kamu (klik untuk membuka keyboard custom)"
                    />
                    <span className="budget-edit-badge">
                      Ketik
                    </span>
                  </div>
                  <div className="chips">
                    {chips.map((val) => (
                      <button
                        key={val}
                        type="button"
                        className={`chip ${budget === val ? 'active' : ''}`}
                        onClick={() => setBudget(val)}
                      >
                        {val >= 1000 ? `${val / 1000}rb` : val}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Action Button: Ayo Lanjutkan */}
              <div className="home-action-wrap">
                <button
                  type="button"
                  className="btn-primary-large"
                  onClick={handleAyoLanjutkan}
                >
                  <span>Ayo Lanjutkan</span>
                  <ArrowRight size={18} strokeWidth={2.5} />
                </button>
                <p className="action-hint">
                  {mode === 'resep'
                    ? 'Lanjut ke pemilihan bahan di dapurmu'
                    : 'Lanjut melihat daftar menu siap santap'}
                </p>
              </div>
            </div>
          )}

          {/* =========================================
              SCREEN 2: PILIH BAHAN (MODE MASAK SENDIRI)
             ========================================= */}
          {step === 'pilih-bahan' && (
            <div className={`step-container ${direction}`} key="step-pilih-bahan">
              {/* Sticky Top Controls */}
              <div className="sticky-header sticky-header-bahan">
                {/* Top Navigation */}
                <header className="step-nav">
                  <button
                    type="button"
                    className="btn-nav-back"
                    onClick={handleBack}
                    aria-label="Kembali ke menu utama"
                  >
                    <ArrowLeft size={16} strokeWidth={2.5} />
                    <span>Kembali</span>
                  </button>
                  <div className="nav-title-wrap">
                    <div className="nav-title">Bahan di Dapur</div>
                    <div className="nav-step-indicator">Langkah 2 dari 2</div>
                  </div>
                  <div className="nav-count-badge">
                    {selectedBahan.size} dipilih
                  </div>
                </header>

                {/* Search Bar Bahan */}
                <div className="search-bar-wrap">
                  <Search size={15} className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Cari bahan (misal: garam, micin, telur)..."
                    value={bahanSearch}
                    onChange={(e) => setBahanSearch(e.target.value)}
                  />
                  {bahanSearch && (
                    <button
                      type="button"
                      className="btn-clear-search"
                      onClick={() => setBahanSearch('')}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Quick Actions Bar */}
                <div className="quick-actions-bar">
                  <div className="quick-actions-left">
                    <button
                      type="button"
                      className="action-pill-btn"
                      onClick={handleSelectAll}
                    >
                      <CheckCheck size={12} />
                      Pilih Semua
                    </button>
                    <button
                      type="button"
                      className="action-pill-btn"
                      onClick={handleSelectStaples}
                    >
                      <Sparkles size={12} />
                      Bahan Pokok
                    </button>
                    <button
                      type="button"
                      className="action-pill-btn"
                      onClick={handleSelectSeasonings}
                      title="Pilih penyedap rasa dapur (garam, micin, kaldu, lada, dll)"
                    >
                      <Sparkles size={12} />
                      Penyedap Rasa
                    </button>
                  </div>
                  <button
                    type="button"
                    className="action-pill-btn text-muted"
                    onClick={handleResetBahan}
                  >
                    <RotateCcw size={12} />
                    Reset
                  </button>
                </div>

                {/* Category Filter Scroll */}
                <div className="category-scroll">
                  {CATEGORIES.map((cat) => {
                    const count = cat.id === 'semua'
                      ? bahanData.length
                      : bahanData.filter((b) => b.kategori === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        className={`category-pill ${bahanCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setBahanCategory(cat.id)}
                      >
                        <span>{cat.label}</span>
                        <span className="cat-count">{count}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Selected Chips Bar — Memastikan tidak ada state bahan nyangkut & user bisa melihat/hapus langsung */}
                {selectedBahan.size > 0 && (
                  <div className="selected-chips-strip">
                    <div className="selected-chips-header">
                      <span className="selected-chips-title">
                        Bahan Dipilih ({selectedBahan.size}):
                      </span>
                      <button
                        type="button"
                        className="selected-chips-clear"
                        onClick={handleResetBahan}
                      >
                        Reset Semua
                      </button>
                    </div>
                    <div className="selected-chips-list">
                      {Array.from(selectedBahan).map((id) => {
                        const bRef = bahanMap[id];
                        return (
                          <span key={id} className="selected-chip-badge">
                            <span>{bRef?.nama || id}</span>
                            <button
                              type="button"
                              className="selected-chip-remove"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBahan(id);
                              }}
                              title={`Hapus ${bRef?.nama || id}`}
                            >
                              <X size={10} strokeWidth={2.5} />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Bahan Grid */}
              <div className="bahan-grid-scroll">
                {filteredBahan.length === 0 ? (
                  <div className="search-empty">
                    Tidak ada bahan dengan kata kunci &quot;{bahanSearch}&quot;
                  </div>
                ) : (
                  <div className="bahan-grid" key={bahanCategory}>
                    {filteredBahan.map((b) => {
                      const isChecked = selectedBahan.has(b.id);
                      const Icon = getBahanIcon(b.kategori);
                      return (
                        <div
                          key={b.id}
                          className={`bahan-item ${isChecked ? 'checked' : ''}`}
                          onClick={() => toggleBahan(b.id)}
                          role="checkbox"
                          aria-checked={isChecked}
                          tabIndex={0}
                        >
                          <div className="bahan-thumb-wrap">
                            <img
                              src={b.gambar || `/images/bahan/${b.id}.jpg`}
                              alt={b.nama}
                              className="bahan-thumb-img"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                if (e.currentTarget.nextElementSibling) {
                                  e.currentTarget.nextElementSibling.style.display = 'grid';
                                }
                              }}
                            />
                            <div className="bahan-icon-wrap bahan-icon-fallback" style={{ display: 'none' }}>
                              <Icon size={18} strokeWidth={2.5} />
                            </div>
                            <div className={`bahan-check-badge ${isChecked ? 'active' : ''}`}>
                              {isChecked ? <Check size={12} strokeWidth={3} /> : null}
                            </div>
                          </div>
                          <div className="bahan-info">
                            <div className="bahan-name">{b.nama}</div>
                            <div className="bahan-sub">
                              {formatRupiah(b.harga)} · {b.kalori} kkal
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Floating Bottom Bar: Lihat Resep */}
              <div className="bottom-bar">
                <div className="bottom-bar-info">
                  <span className="bottom-bar-label">
                    {selectedBahan.size === 0
                      ? 'Pilih bahan di atas:'
                      : resepHasil.length > 0
                      ? 'Resep siap masak:'
                      : resepHampirCocok.length > 0
                      ? 'Ide olahan bahanmu:'
                      : 'Resep cocok:'}
                  </span>
                  <span className="bottom-bar-count">
                    {selectedBahan.size === 0
                      ? '0 bahan dipilih'
                      : resepHasil.length > 0
                      ? `${resepHasil.length} resep`
                      : resepHampirCocok.length > 0
                      ? `${resepHampirCocok.length} olahan`
                      : '0 resep'}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-primary-medium"
                  onClick={() => goTo('hasil', 'forward')}
                  disabled={selectedBahan.size === 0}
                  style={selectedBahan.size === 0 ? { opacity: 0.65, cursor: 'not-allowed' } : undefined}
                >
                  <span>Lihat Resep</span>
                  <ArrowRight size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}

          {/* =========================================
              SCREEN 3: HASIL REKOMENDASI (MENU / RESEP)
             ========================================= */}
          {step === 'hasil' && (
            <div className={`step-container ${direction}`} key="step-hasil">
              {/* Sticky Controls Header - Batas sticky sampai meta row */}
              <div className="sticky-header sticky-header-hasil">
                {/* Top Navigation */}
                <header className="step-nav">
                  <button
                    type="button"
                    className="btn-nav-back"
                    onClick={handleBack}
                    aria-label="Kembali"
                  >
                    <ArrowLeft size={16} strokeWidth={2.5} />
                    <span>Kembali</span>
                  </button>
                  <div className="nav-title-wrap">
                    <div className="nav-title">
                      {mode === 'menu' ? 'Menu Siap Santap' : 'Resep Masak Sendiri'}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="nav-budget-badge"
                    onClick={openKeypad}
                    title="Klik untuk ubah budget dengan numpad"
                  >
                    {formatRupiah(budget)}
                  </button>
                </header>

                {/* Mode Switch Tabs */}
                <nav className="tabs">
                  <button
                    type="button"
                    className={`tab-btn ${mode === 'menu' ? 'active' : ''}`}
                    onClick={() => setMode('menu')}
                  >
                    <Utensils size={14} strokeWidth={2.5} />
                    Tinggal Makan
                  </button>
                  <button
                    type="button"
                    className={`tab-btn ${mode === 'resep' ? 'active' : ''}`}
                    onClick={() => setMode('resep')}
                  >
                    <CookingPot size={14} strokeWidth={2.5} />
                    Masak Sendiri
                  </button>
                </nav>

                {/* Search Bar Hasil */}
                <div className="search-bar-wrap">
                  <Search size={15} className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder={
                      mode === 'menu'
                        ? 'Cari nama menu atau tempat...'
                        : 'Cari resep atau bahan masakan...'
                    }
                    value={resultSearch}
                    onChange={(e) => setResultSearch(e.target.value)}
                  />
                  {resultSearch && (
                    <button
                      type="button"
                      className="btn-clear-search"
                      onClick={() => setResultSearch('')}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Mode Masak Sendiri: Ubah Bahan Quick Button */}
                {mode === 'resep' && (
                  <div className="resep-bahan-summary-strip">
                    <div className="summary-strip-left">
                      <span className="summary-strip-count">
                        {selectedBahan.size > 0 ? `${selectedBahan.size} bahan aktif` : 'Belum ada bahan'}
                      </span>
                      <span className="summary-strip-names">
                        {selectedBahan.size > 0
                          ? Array.from(selectedBahan).map((id) => bahanMap[id]?.nama || id).join(', ')
                          : 'Pilih bahan dapur untuk melihat resep masakan'}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn-edit-bahan"
                      onClick={() => goTo('pilih-bahan', 'backward')}
                    >
                      {selectedBahan.size > 0 ? 'Ubah Bahan' : 'Pilih Bahan'}
                    </button>
                  </div>
                )}

                {/* Results Meta Row (Batas Sticky) */}
                <div className="results-meta-row">
                  <span className="results-meta-text">
                    {mode === 'menu'
                      ? `Menampilkan ${menuHasil.length} menu (≤ ${formatRupiah(budget)})`
                      : resepHasil.length > 0 && resepHampirCocok.length > 0
                      ? `Menampilkan ${resepHasil.length} resep siap masak & ${resepHampirCocok.length} ide olahan relevan`
                      : resepHasil.length > 0
                      ? `Menampilkan ${resepHasil.length} resep siap masak`
                      : resepHampirCocok.length > 0
                      ? `Menampilkan ${resepHampirCocok.length} ide olahan dari bahan pilihanmu`
                      : 'Menampilkan 0 resep yang cocok'}
                  </span>
                  {resultSearch && (
                    <span className="search-keyword-tag">
                      Kata kunci: &quot;{resultSearch}&quot;
                    </span>
                  )}
                </div>
              </div>

              {/* Results List */}
              <section className={`results-list-wrap ${chosenMeals.length > 0 ? 'has-bottom-bar' : ''}`}>
                <div className="list" key={mode}>
                  {mode === 'menu' ? (
                    menuHasil.length === 0 ? (
                      <div className="empty">
                        <SearchX size={36} strokeWidth={1.5} className="empty-icon" />
                        <div className="empty-title">
                          {resultSearch ? 'Menu tidak ditemukan' : 'Budget belum cukup'}
                        </div>
                        <div className="empty-sub">
                          {resultSearch
                            ? `Tidak ada menu yang sesuai dengan kata kunci "${resultSearch}".`
                            : 'Coba naikkan budget kamu atau beralih ke mode Masak Sendiri.'}
                        </div>
                        <div className="empty-actions">
                          {resultSearch ? (
                            <button
                              type="button"
                              className="empty-btn-primary"
                              onClick={() => setResultSearch('')}
                            >
                              Hapus Pencarian
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="empty-btn-primary"
                              onClick={openKeypad}
                            >
                              Ubah Budget
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <>
                        {visibleMenuHasil.map((m) => {
                          const Icon = getMenuIcon(m.kategori);
                          const picked = isMealChosen(m.id, 'menu');
                          return (
                            <article
                              key={m.id}
                              className={`card card-clickable ${picked ? 'card-picked' : ''}`}
                              onClick={() => handleOpenDetail(m, 'menu')}
                            >
                              <div className="card-thumb-wrap">
                                <img
                                  src={m.gambar || `/images/menu/${m.id}.jpg`}
                                  alt={m.nama}
                                  className="card-thumb-img"
                                  loading="lazy"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    if (e.currentTarget.nextElementSibling) {
                                      e.currentTarget.nextElementSibling.style.display = 'grid';
                                    }
                                  }}
                                />
                                <div className="card-icon card-icon-fallback" style={{ display: 'none' }}>
                                  <Icon size={24} strokeWidth={2} />
                                </div>
                                <button
                                  type="button"
                                  className={`card-pick-btn ${picked ? 'picked' : ''}`}
                                  onClick={(e) => toggleChooseMeal(m, 'menu', e)}
                                  title={picked ? 'Batal pilih menu ini' : 'Pilih menu ini untuk hari ini'}
                                >
                                  {picked ? (
                                    <>
                                      <Check size={11} strokeWidth={3} />
                                      <span>Dipilih</span>
                                    </>
                                  ) : (
                                    <>
                                      <Plus size={11} strokeWidth={2.8} />
                                      <span>Pilih</span>
                                    </>
                                  )}
                                </button>
                                <div className="card-price-badge">{formatRupiah(m.harga)}</div>
                              </div>
                              <div className="card-body">
                                <div className="card-top">
                                  <span className="card-title">{m.nama}</span>
                                </div>
                                <div className="card-meta">
                                  <span className="pill">
                                    <Flame size={11} strokeWidth={2.5} />
                                    {m.kalori} kkal
                                  </span>
                                  <span className="pill-sub">
                                    <Store size={11} strokeWidth={2.5} />
                                    {m.tempat}
                                  </span>
                                </div>
                                <div className="card-footer-action">
                                  <span className="footer-action-text">Lihat detail menu</span>
                                  <ChevronRight size={14} className="footer-chevron" />
                                </div>
                              </div>
                            </article>
                          );
                        })}
                        {menuHasil.length > visibleMenuLimit && (
                          <div className="auto-load-sentinel-wrap" ref={loadMoreRef}>
                            <div className="auto-load-indicator">
                              <span className="auto-load-spinner" />
                              <span>Memuat 20 menu lainnya... ({visibleMenuHasil.length} dari {menuHasil.length})</span>
                            </div>
                          </div>
                        )}
                        {visibleMenuLimit >= menuHasil.length && menuHasil.length > 20 && (
                          <div className="end-of-results">
                            <span>Semua {menuHasil.length} menu telah ditampilkan</span>
                          </div>
                        )}
                      </>
                    )
                  ) : resepHasil.length === 0 && resepHampirCocok.length === 0 ? (
                    <div className="empty">
                      <ChefHat size={36} strokeWidth={1.5} className="empty-icon" />
                      <div className="empty-title">Belum ada resep yang cocok</div>
                      <div className="empty-sub">
                        {resultSearch
                          ? `Tidak ada resep dengan kata kunci "${resultSearch}".`
                          : selectedBahan.size === 0
                          ? 'Kamu belum memilih satu pun bahan di dapur. Pilih minimal 1 bahan untuk melihat olahan makanan.'
                          : 'Total harga bahan olahan melebihi budget kamu saat ini. Coba naikkan sedikit budget kamu.'}
                      </div>
                      <div className="empty-actions">
                        {resultSearch ? (
                          <button
                            type="button"
                            className="empty-btn-primary"
                            onClick={() => setResultSearch('')}
                          >
                            Hapus Pencarian
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="empty-btn-primary"
                              onClick={() => goTo('pilih-bahan', 'backward')}
                            >
                              Pilih / Tambah Bahan
                            </button>
                            <button
                              type="button"
                              className="empty-btn-secondary"
                              onClick={() => handleSelectAll()}
                            >
                              Pilih Semua Bahan
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      {resepHasil.length === 0 && resepHampirCocok.length > 0 && (
                        <div className="partial-match-banner">
                          <Sparkles size={15} className="partial-banner-icon" />
                          <span>
                            Berikut olahan dari bahan pilihanmu — klik <strong>Lengkapi Bahan</strong> pada resep untuk mencentang bumbu pendukungnya otomatis.
                          </span>
                        </div>
                      )}
                      {resepToDisplay.map((r) => {
                        const picked = isMealChosen(r.id, 'resep');
                        return (
                          <article
                            key={r.id}
                            className={`card resep-card card-clickable ${picked ? 'card-picked' : ''}`}
                            onClick={() => handleOpenDetail(r, 'resep')}
                          >
                            <div className="card-thumb-wrap">
                              <img
                                src={r.gambar || `/images/resep/${r.id}.jpg`}
                                alt={r.nama}
                                className="card-thumb-img"
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  if (e.currentTarget.nextElementSibling) {
                                    e.currentTarget.nextElementSibling.style.display = 'grid';
                                  }
                                }}
                              />
                              <div className="card-icon card-icon-fallback" style={{ display: 'none' }}>
                                <CookingPot size={24} strokeWidth={2} />
                              </div>
                              <button
                                type="button"
                                className={`card-pick-btn ${picked ? 'picked' : ''}`}
                                onClick={(e) => toggleChooseMeal(r, 'resep', e)}
                                title={picked ? 'Batal pilih resep ini' : 'Pilih resep ini untuk hari ini'}
                              >
                                {picked ? (
                                  <>
                                    <Check size={11} strokeWidth={3} />
                                    <span>Dipilih</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus size={11} strokeWidth={2.8} />
                                    <span>Pilih</span>
                                  </>
                                )}
                              </button>
                              <div className="card-price-badge">{formatRupiah(r.totalHarga)}</div>
                            </div>
                            <div className="card-body">
                              <div className="card-top">
                                <span className="card-title">{r.nama}</span>
                              </div>
                              <div className="card-meta">
                                <span className="pill">
                                  <Flame size={11} strokeWidth={2.5} />
                                  {r.totalKalori} kkal
                                </span>
                                <span className="pill">
                                  <Clock size={11} strokeWidth={2.5} />
                                  {r.waktu} mnt
                                </span>
                                {r.bisaDimasak ? (
                                  <span className="pill pill-success">
                                    <Check size={11} strokeWidth={2.5} />
                                    Bahan lengkap
                                  </span>
                                ) : (
                                  <span className="pill pill-partial">
                                    Kurang {r.kurangCount} bahan
                                  </span>
                                )}
                              </div>

                              {/* Footer Action Card */}
                              {!r.bisaDimasak ? (
                                <div className="card-footer-action">
                                  <button
                                    type="button"
                                    className="btn-complete-inline"
                                    onClick={(e) => handleLengkapiBahanResep(r, e)}
                                  >
                                    + Lengkapi Bahan
                                  </button>
                                  <ChevronRight size={14} className="footer-chevron" />
                                </div>
                              ) : (
                                <div className="card-footer-action">
                                  <span className="footer-action-text">
                                    Lihat resep & {r.langkah.length} langkah
                                  </span>
                                  <ChevronRight size={14} className="footer-chevron" />
                                </div>
                              )}
                            </div>
                          </article>
                        );
                      })}
                    </>
                  )}
                </div>
              </section>

              {/* Floating Bottom Bar: Lanjut Selesai (saat user memilih >= 1 menu/resep) */}
              {chosenMeals.length > 0 && (
                <div className="bottom-bar">
                  <div className="bottom-bar-info">
                    <span className="bottom-bar-label">
                      Pilihan hari ini ({chosenMeals.length} hidangan):
                    </span>
                    <span className="bottom-bar-count">
                      {nutriSummary.totalKalori} kkal · {formatRupiah(nutriSummary.totalHarga)}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn-primary-medium"
                    onClick={handleFinishFromHasil}
                  >
                    <span>Lanjut Selesai</span>
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* =========================================
              SCREEN 4: DETAIL RESEP / MENU
             ========================================= */}
          {step === 'detail' && selectedDetail && (
            <div className={`step-container ${direction}`} key="step-detail">
              {/* Sticky Top Navigation */}
              <div className="sticky-header sticky-header-detail">
                <header className="step-nav">
                  <button
                    type="button"
                    className="btn-nav-back"
                    onClick={handleBack}
                    aria-label="Kembali ke daftar"
                  >
                    <ArrowLeft size={16} strokeWidth={2.5} />
                    <span>Kembali</span>
                  </button>
                  <div className="nav-title-wrap">
                    <div className="nav-title">
                      {selectedDetail.type === 'resep' ? 'Detail Resep' : 'Detail Menu'}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="nav-budget-badge"
                    onClick={openKeypad}
                    title="Klik untuk ubah budget"
                  >
                    {formatRupiah(budget)}
                  </button>
                </header>
              </div>

              {selectedDetail.type === 'resep' ? (
                /* DETAIL RESEP MASAK SENDIRI */
                <div className="detail-content detail-with-bar">
                  {/* Hero Card */}
                  <div className="detail-hero-card">
                    {selectedDetail.data.gambar && (
                      <div className="detail-hero-thumb-wrap">
                        <img
                          src={selectedDetail.data.gambar}
                          alt={selectedDetail.data.nama}
                          className="detail-hero-thumb-img"
                        />
                      </div>
                    )}
                    {selectedDetail.data.bisaDimasak ? (
                      <div className="detail-hero-badge">
                        <Check size={12} strokeWidth={3} /> Bahan Lengkap
                      </div>
                    ) : (
                      <div className="detail-hero-badge badge-partial">
                        Kurang {selectedDetail.data.kurangCount} bahan pendukung
                      </div>
                    )}
                    <h2 className="detail-title">{selectedDetail.data.nama}</h2>
                    <div className="detail-price-row">
                      <span className="detail-price">{formatRupiah(selectedDetail.data.totalHarga)}</span>
                      <span className="detail-budget-sisa">
                        {budget >= selectedDetail.data.totalHarga
                          ? `Hemat ${formatRupiah(budget - selectedDetail.data.totalHarga)}`
                          : 'Sesuai budget'}
                      </span>
                    </div>
                    {!selectedDetail.data.bisaDimasak && (
                      <button
                        type="button"
                        className="btn-complete-detail"
                        onClick={(e) => handleLengkapiBahanResep(selectedDetail.data, e)}
                      >
                        <CheckCheck size={14} strokeWidth={2.5} />
                        <span>Centang Semua Bahan Resep Ini</span>
                      </button>
                    )}
                  </div>

                  {/* Quick Stats Grid */}
                  <div className="detail-stats-grid">
                    <div className="stat-card">
                      <Clock size={16} className="stat-icon" />
                      <div className="stat-val">{selectedDetail.data.waktu} Mnt</div>
                      <div className="stat-lbl">Waktu Masak</div>
                    </div>
                    <div className="stat-card">
                      <Flame size={16} className="stat-icon" />
                      <div className="stat-val">{selectedDetail.data.totalKalori} kkal</div>
                      <div className="stat-lbl">Total Kalori</div>
                    </div>
                    <div className="stat-card">
                      <CookingPot size={16} className="stat-icon" />
                      <div className="stat-val">{selectedDetail.data.bahanList.length} Bahan</div>
                      <div className="stat-lbl">Komposisi</div>
                    </div>
                  </div>

                  {/* Bahan yang Dibutuhkan */}
                  <div className="detail-section-card">
                    <div className="detail-card-header">
                      <span className="detail-card-title">Bahan yang Dibutuhkan</span>
                      <span className="detail-card-badge">{selectedDetail.data.bahanList.length} bahan</span>
                    </div>
                    <div className="detail-bahan-list">
                      {selectedDetail.data.bahanList.map((b) => {
                        const ref = bahanMap[b.id];
                        const hargaTotalBahan = (ref?.harga || 0) * (b.jumlah || 1);
                        const kaloriTotalBahan = (ref?.kalori || 0) * (b.jumlah || 1);
                        const Icon = getBahanIcon(ref?.kategori);
                        return (
                          <div key={b.id} className="detail-bahan-item">
                            <div className="detail-bahan-thumb-wrap">
                              <img
                                src={ref?.gambar || `/images/bahan/${b.id}.jpg`}
                                alt={b.nama}
                                className="detail-bahan-thumb-img"
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  if (e.currentTarget.nextElementSibling) {
                                    e.currentTarget.nextElementSibling.style.display = 'grid';
                                  }
                                }}
                              />
                              <div className="detail-bahan-icon" style={{ display: 'none' }}>
                                <Icon size={14} strokeWidth={2.5} />
                              </div>
                            </div>
                            <div className="detail-bahan-info">
                              <div className="detail-bahan-name">
                                {formatTakaran(b.jumlah, b.satuan, b.nama)}
                              </div>
                              <div className="detail-bahan-sub">
                                {kaloriTotalBahan} kkal
                              </div>
                            </div>
                            <div className="detail-bahan-price">
                              {formatRupiah(hargaTotalBahan)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step-by-Step Langkah Memasak */}
                  <div className="detail-section-card">
                    <div className="detail-card-header">
                      <span className="detail-card-title">Langkah-Langkah Memasak</span>
                      <span className="detail-card-badge">{selectedDetail.data.langkah.length} Langkah</span>
                    </div>
                    <ol className="detail-steps-list">
                      {selectedDetail.data.langkah.map((stepText, idx) => (
                        <li key={idx} className="detail-step-item">
                          <div className="detail-step-num">{idx + 1}</div>
                          <div className="detail-step-content">
                            <div className="detail-step-title">Langkah {idx + 1}</div>
                            <div className="detail-step-text">{stepText}</div>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Tips Box */}
                  <div className="detail-tips-box">
                    <Sparkles size={16} className="tips-icon" />
                    <div className="tips-text">
                      <strong>Tips Memasak:</strong> Masak dengan api sedang dan aduk merata agar bumbu meresap sempurna!
                    </div>
                  </div>
                </div>
              ) : (
                /* DETAIL MENU SIAP SANTAP */
                <div className="detail-content detail-with-bar">
                  <div className="detail-hero-card">
                    {selectedDetail.data.gambar && (
                      <div className="detail-hero-thumb-wrap">
                        <img
                          src={selectedDetail.data.gambar}
                          alt={selectedDetail.data.nama}
                          className="detail-hero-thumb-img"
                        />
                      </div>
                    )}
                    <div className="detail-hero-badge">
                      <Store size={12} strokeWidth={2.5} /> {selectedDetail.data.tempat}
                    </div>
                    <h2 className="detail-title">{selectedDetail.data.nama}</h2>
                    <div className="detail-price-row">
                      <span className="detail-price">{formatRupiah(selectedDetail.data.harga)}</span>
                      <span className="detail-budget-sisa">
                        {budget >= selectedDetail.data.harga
                          ? `Hemat ${formatRupiah(budget - selectedDetail.data.harga)}`
                          : 'Sesuai budget'}
                      </span>
                    </div>
                  </div>

                  {/* Quick Stats Grid */}
                  <div className="detail-stats-grid">
                    <div className="stat-card">
                      <Flame size={16} className="stat-icon" />
                      <div className="stat-val">{selectedDetail.data.kalori} kkal</div>
                      <div className="stat-lbl">Estimasi Energi</div>
                    </div>
                    <div className="stat-card">
                      <Store size={16} className="stat-icon" />
                      <div className="stat-val">{selectedDetail.data.tempat}</div>
                      <div className="stat-lbl">Tipe Penjual</div>
                    </div>
                    <div className="stat-card">
                      <Utensils size={16} className="stat-icon" />
                      <div className="stat-val">{selectedDetail.data.kategori}</div>
                      <div className="stat-lbl">Waktu Santap</div>
                    </div>
                  </div>

                  {/* Komposisi Bahan Utama Menu */}
                  {Array.isArray(selectedDetail.data.bahanUtama) && selectedDetail.data.bahanUtama.length > 0 && (
                    <div className="detail-section-card">
                      <div className="detail-card-header">
                        <span className="detail-card-title">Komposisi Bahan Utama</span>
                        <span className="detail-card-badge">{selectedDetail.data.bahanUtama.length} bahan</span>
                      </div>
                      <div className="detail-bahan-list">
                        {selectedDetail.data.bahanUtama.map((bid) => {
                          const ref = bahanMap[bid];
                          if (!ref) return null;
                          const Icon = getBahanIcon(ref.kategori);
                          return (
                            <div key={bid} className="detail-bahan-item">
                              <div className="detail-bahan-thumb-wrap">
                                <img
                                  src={ref.gambar || `/images/bahan/${bid}.jpg`}
                                  alt={ref.nama}
                                  className="detail-bahan-thumb-img"
                                  loading="lazy"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    if (e.currentTarget.nextElementSibling) {
                                      e.currentTarget.nextElementSibling.style.display = 'grid';
                                    }
                                  }}
                                />
                                <div className="detail-bahan-icon" style={{ display: 'none' }}>
                                  <Icon size={14} strokeWidth={2.5} />
                                </div>
                              </div>
                              <div className="detail-bahan-info">
                                <div className="detail-bahan-name">{ref.nama}</div>
                                <div className="detail-bahan-sub">Kategori: {ref.kategori}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Detail Info Card */}
                  <div className="detail-section-card">
                    <div className="detail-card-header">
                      <span className="detail-card-title">Informasi & Rekomendasi</span>
                    </div>
                    <div className="menu-info-body">
                      <p className="menu-info-text">
                        Menu ini siap saji dan langsung dapat dinikmati tanpa perlu memasak di dapur. Pilihan tepat saat lapar dan ingin hemat waktu.
                      </p>
                      <div className="menu-info-highlight">
                        <span className="highlight-label">Waktu Makan:</span>
                        <span className="highlight-val">{selectedDetail.data.kategori.replace('-', ' ')}</span>
                      </div>
                      <div className="menu-info-highlight">
                        <span className="highlight-label">Status Anggaran:</span>
                        <span className="highlight-val text-success">
                          Hemat {formatRupiah(budget - selectedDetail.data.harga)} dari budget kamu
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Floating Bottom Bar on Detail: Tambah Lagi atau Lanjut Selesai & Lihat Nutrisi */}
              <div className="bottom-bar detail-bottom-bar">
                <button
                  type="button"
                  className="btn-pick-secondary"
                  onClick={() => handleSaveAndPickMore(selectedDetail.data, selectedDetail.type)}
                >
                  <Plus size={14} strokeWidth={2.8} />
                  <span>Tambah Menu Lain</span>
                </button>
                <button
                  type="button"
                  className="btn-primary-medium"
                  onClick={() => handleFinishFromDetail(selectedDetail.data, selectedDetail.type)}
                >
                  <span>Selesai & Nutrisi</span>
                  <ArrowRight size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}

          {/* =========================================
              SCREEN 5: SELESAI — AFFIRMATION & NUTRIMETER
             ========================================= */}
          {step === 'selesai' && (
            <div className={`step-container ${direction}`} key="step-selesai">
              {/* Sticky Top Navigation */}
              <div className="sticky-header sticky-header-detail">
                <header className="step-nav">
                  <button
                    type="button"
                    className="btn-nav-back"
                    onClick={handleBack}
                    aria-label="Kembali"
                  >
                    <ArrowLeft size={16} strokeWidth={2.5} />
                    <span>Kembali</span>
                  </button>
                  <div className="nav-title-wrap">
                    <div className="nav-title">Selesai & NutriMeter</div>
                  </div>
                  <div className="nav-count-badge">
                    {chosenMeals.length} Hidangan
                  </div>
                </header>
              </div>

              <div className="detail-content selesai-content">
                {/* 1. Affirmation Hero Card */}
                <section className="selesai-hero-card">
                  <div className="selesai-mascot-wrap">
                    <MamiIdleMascot activeIndex={mascotIdleIdx} />
                  </div>
                  <div className="selesai-badge">
                    <Sparkles size={12} strokeWidth={2.5} />
                    <span>Misi Makan Hari Ini Tuntas!</span>
                  </div>
                  <h2 className="selesai-title">Yeay, You Did It! 🎉</h2>
                  <p className="selesai-desc">
                    Keren banget! Kamu udah berhasil memilih asupan lezat yang tetap ramah di dompet. Berikut rincian total nutrisi yang kamu dapat hari ini:
                  </p>
                  <div className="selesai-summary-pills">
                    <span className="selesai-sum-pill">
                      <Flame size={12} strokeWidth={2.5} />
                      <strong>{nutriSummary.totalKalori} kkal</strong> energi
                    </span>
                    <span className="selesai-sum-pill">
                      Total <strong>{formatRupiah(nutriSummary.totalHarga)}</strong>
                    </span>
                    {budget >= nutriSummary.totalHarga && (
                      <span className="selesai-sum-pill pill-hemat">
                        <CheckCircle2 size={12} strokeWidth={2.5} />
                        Hemat {formatRupiah(budget - nutriSummary.totalHarga)}
                      </span>
                    )}
                  </div>
                </section>

                {/* 2. Visual NutriMeter Gauge & Balance Card */}
                <section className="nutrimeter-card">
                  <div className="detail-card-header">
                    <div className="nutri-header-left">
                      <Activity size={16} className="nutri-header-icon" />
                      <span className="detail-card-title">NutriMeter Hari Ini</span>
                    </div>
                    <span className="detail-card-badge">Skor {nutriSummary.score}/100</span>
                  </div>

                  {/* Ring Gauge + Status */}
                  <div className="nutri-gauge-row">
                    <div className="nutri-ring-box">
                      <svg viewBox="0 0 100 100" className="nutri-ring-svg">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          className="nutri-ring-track"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          className="nutri-ring-fill"
                          strokeDasharray={`${(nutriSummary.score / 100) * 251.2} 251.2`}
                        />
                      </svg>
                      <div className="nutri-ring-center">
                        <span className="nutri-ring-num">{nutriSummary.score}</span>
                        <span className="nutri-ring-max">/100</span>
                      </div>
                    </div>

                    <div className="nutri-status-info">
                      <div className="nutri-status-badge">
                        <Award size={13} strokeWidth={2.5} />
                        <span>Indeks Keseimbangan Gizi</span>
                      </div>
                      <h3 className="nutri-status-title">{nutriSummary.statusLabel}</h3>
                      <p className="nutri-status-sub">{nutriSummary.statusSub}</p>
                    </div>
                  </div>

                  {/* 4-Zone Spectrum Bar */}
                  <div className="nutri-spectrum-wrap">
                    <div className="nutri-spectrum-bar">
                      <div
                        className="nutri-spectrum-pin"
                        style={{ left: `${Math.min(96, Math.max(6, nutriSummary.score))}%` }}
                      />
                    </div>
                    <div className="nutri-spectrum-labels">
                      <span>Ringan</span>
                      <span>Cukup</span>
                      <span>Seimbang</span>
                      <span>Juara</span>
                    </div>
                  </div>

                  {/* Macro Split Bar (Isi Piringmu) */}
                  <div className="macro-split-box">
                    <div className="macro-split-title">Proporsi Sumber Energi Piringmu</div>
                    <div className="macro-split-bar">
                      <div
                        className="macro-seg seg-karbo"
                        style={{ width: `${nutriSummary.pctKarbo}%` }}
                        title={`Karbohidrat ${nutriSummary.pctKarbo}%`}
                      />
                      <div
                        className="macro-seg seg-protein"
                        style={{ width: `${nutriSummary.pctProtein}%` }}
                        title={`Protein ${nutriSummary.pctProtein}%`}
                      />
                      <div
                        className="macro-seg seg-lemak"
                        style={{ width: `${nutriSummary.pctLemak}%` }}
                        title={`Lemak ${nutriSummary.pctLemak}%`}
                      />
                    </div>
                    <div className="macro-legend">
                      <span className="macro-legend-item">
                        <i className="dot dot-karbo" />
                        Karbo {nutriSummary.pctKarbo}%
                      </span>
                      <span className="macro-legend-item">
                        <i className="dot dot-protein" />
                        Protein {nutriSummary.pctProtein}%
                      </span>
                      <span className="macro-legend-item">
                        <i className="dot dot-lemak" />
                        Lemak {nutriSummary.pctLemak}%
                      </span>
                    </div>
                  </div>
                </section>

                {/* 3. Detailed Nutrient Progress Meters (% AKG) */}
                <section className="detail-section-card">
                  <div className="detail-card-header">
                    <span className="detail-card-title">Rincian Nutrisi & % AKG</span>
                    <span className="detail-card-badge">Acuan 2.150 kkal/hari</span>
                  </div>

                  <div className="nutri-meters-list">
                    {/* Energi */}
                    <div className="nutri-meter-item">
                      <div className="nutri-meter-top">
                        <span className="nutri-meter-name">
                          <Flame size={13} className="nm-icon nm-kalori" />
                          Energi Total
                        </span>
                        <span className="nutri-meter-val">
                          <strong>{nutriSummary.totalKalori} kkal</strong> / {AKG_DAILY.kalori} kkal
                          <em className="nm-pct">{nutriSummary.akgKalori}% AKG</em>
                        </span>
                      </div>
                      <div className="nutri-progress-track">
                        <div
                          className="nutri-progress-fill fill-kalori"
                          style={{ width: `${Math.min(100, nutriSummary.akgKalori)}%` }}
                        />
                      </div>
                    </div>

                    {/* Protein */}
                    <div className="nutri-meter-item">
                      <div className="nutri-meter-top">
                        <span className="nutri-meter-name">
                          <Zap size={13} className="nm-icon nm-protein" />
                          Protein Pembangun Otot
                        </span>
                        <span className="nutri-meter-val">
                          <strong>{nutriSummary.proteinG} g</strong> / {AKG_DAILY.protein} g
                          <em className="nm-pct">{nutriSummary.akgProtein}% AKG</em>
                        </span>
                      </div>
                      <div className="nutri-progress-track">
                        <div
                          className="nutri-progress-fill fill-protein"
                          style={{ width: `${Math.min(100, nutriSummary.akgProtein)}%` }}
                        />
                      </div>
                    </div>

                    {/* Karbohidrat */}
                    <div className="nutri-meter-item">
                      <div className="nutri-meter-top">
                        <span className="nutri-meter-name">
                          <Utensils size={13} className="nm-icon nm-karbo" />
                          Karbohidrat Tenaga Utama
                        </span>
                        <span className="nutri-meter-val">
                          <strong>{nutriSummary.karboG} g</strong> / {AKG_DAILY.karbo} g
                          <em className="nm-pct">{nutriSummary.akgKarbo}% AKG</em>
                        </span>
                      </div>
                      <div className="nutri-progress-track">
                        <div
                          className="nutri-progress-fill fill-karbo"
                          style={{ width: `${Math.min(100, nutriSummary.akgKarbo)}%` }}
                        />
                      </div>
                    </div>

                    {/* Lemak */}
                    <div className="nutri-meter-item">
                      <div className="nutri-meter-top">
                        <span className="nutri-meter-name">
                          <Heart size={13} className="nm-icon nm-lemak" />
                          Lemak & Penyerapan Vitamin
                        </span>
                        <span className="nutri-meter-val">
                          <strong>{nutriSummary.lemakG} g</strong> / {AKG_DAILY.lemak} g
                          <em className="nm-pct">{nutriSummary.akgLemak}% AKG</em>
                        </span>
                      </div>
                      <div className="nutri-progress-track">
                        <div
                          className="nutri-progress-fill fill-lemak"
                          style={{ width: `${Math.min(100, nutriSummary.akgLemak)}%` }}
                        />
                      </div>
                    </div>

                    {/* Serat */}
                    <div className="nutri-meter-item">
                      <div className="nutri-meter-top">
                        <span className="nutri-meter-name">
                          <Sparkles size={13} className="nm-icon nm-serat" />
                          Serat Pangan & Sayuran
                        </span>
                        <span className="nutri-meter-val">
                          <strong>{nutriSummary.seratG} g</strong> / {AKG_DAILY.serat} g
                          <em className="nm-pct">{nutriSummary.akgSerat}% AKG</em>
                        </span>
                      </div>
                      <div className="nutri-progress-track">
                        <div
                          className="nutri-progress-fill fill-serat"
                          style={{ width: `${Math.min(100, nutriSummary.akgSerat)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Micronutrient Badges */}
                  <div className="micro-benefits-wrap">
                    <div className="micro-benefits-label">Kandungan Mikronutrisi Aktif:</div>
                    <div className="micro-benefits-tags">
                      {nutriSummary.microTags.map((tag) => (
                        <span key={tag} className="micro-tag">
                          <Check size={11} strokeWidth={3} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </section>

                {/* 4. Hidangan yang Kamu Santap Hari Ini */}
                <section className="detail-section-card">
                  <div className="detail-card-header">
                    <span className="detail-card-title">Asupan Pilihanmu Hari Ini</span>
                    <button
                      type="button"
                      className="btn-add-more-inline"
                      onClick={() => goTo('hasil', 'backward')}
                    >
                      <Plus size={12} strokeWidth={2.8} />
                      <span>Tambah Menu</span>
                    </button>
                  </div>
                  <div className="detail-bahan-list">
                    {chosenMeals.map((cm) => (
                      <div key={cm.uid} className="detail-bahan-item">
                        <div className="detail-bahan-thumb-wrap">
                          <img
                            src={cm.gambar}
                            alt={cm.nama}
                            className="detail-bahan-thumb-img"
                            loading="lazy"
                          />
                        </div>
                        <div className="detail-bahan-info">
                          <div className="detail-bahan-name">{cm.nama}</div>
                          <div className="detail-bahan-sub">
                            {cm.type === 'menu' ? 'Beli Siap Santap' : 'Masak Sendiri'} · {cm.kalori} kkal · {formatRupiah(cm.harga)}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn-remove-meal"
                          onClick={() => handleRemoveChosenMeal(cm.uid)}
                          title="Hapus dari daftar hari ini"
                          aria-label="Hapus hidangan"
                        >
                          <Trash2 size={14} strokeWidth={2.2} />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 5. Pesan NutriMeter & Tombol Selesai Akhir */}
                <div className="detail-tips-box">
                  <Trophy size={18} className="tips-icon" />
                  <div className="tips-text">
                    <strong>Catatan NutriMeter:</strong> {nutriSummary.adviceText}
                  </div>
                </div>

                <div className="selesai-actions-bottom">
                  <button
                    type="button"
                    className="btn-primary-large"
                    onClick={handleMulaiBaru}
                  >
                    <CheckCircle2 size={18} strokeWidth={2.5} />
                    <span>Selesai & Kembali ke Beranda</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =========================================
            CUSTOM VIRTUAL KEYPAD BOTTOM SHEET
           ========================================= */}
        {isKeypadVisible && (
          <div
            className={`keypad-overlay ${isKeypadClosing ? 'closing' : ''}`}
            onClick={closeKeypad}
          >
            <div
              className={`keypad-sheet ${isKeypadClosing ? 'closing' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="keypad-drag-bar" />
              <div className="keypad-header">
                <div className="keypad-title-wrap">
                  <div className="keypad-title">Atur Budget</div>
                  <div className="keypad-subtitle">Gunakan keyboard angka di bawah</div>
                </div>
                <button
                  type="button"
                  className="btn-keypad-close"
                  onClick={closeKeypad}
                  aria-label="Tutup keyboard"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Display Angka di Keypad */}
              <div className="keypad-display">
                <span className="keypad-display-cur">Rp</span>
                <span className="keypad-display-num">
                  {Number(budget).toLocaleString('id-ID')}
                </span>
                <span className="keypad-blinking-cursor">|</span>
              </div>

              {/* Quick Add Chips */}
              <div className="keypad-quick-bar">
                <button type="button" className="keypad-chip" onClick={() => handleQuickAdd(5000)}>+5rb</button>
                <button type="button" className="keypad-chip" onClick={() => handleQuickAdd(10000)}>+10rb</button>
                <button type="button" className="keypad-chip" onClick={() => handleQuickAdd(20000)}>+20rb</button>
                <button type="button" className="keypad-chip" onClick={() => handleQuickAdd(50000)}>+50rb</button>
                <button type="button" className="keypad-chip chip-reset" onClick={handleClearBudget}>Reset</button>
              </div>

              {/* Grid Tombol Numpad */}
              <div className="keypad-grid">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '000', '0'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    className="keypad-key"
                    onClick={() => handleKeypadPress(val)}
                  >
                    {val}
                  </button>
                ))}
                <button
                  type="button"
                  className="keypad-key keypad-key-delete"
                  onClick={handleKeypadDelete}
                  aria-label="Hapus digit terakhir"
                >
                  <Delete size={20} strokeWidth={2.2} />
                </button>
              </div>

              {/* Tombol Terapkan */}
              <button
                type="button"
                className="btn-keypad-done"
                onClick={closeKeypad}
              >
                <span>Terapkan Budget ({formatRupiah(budget)})</span>
                <Check size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
