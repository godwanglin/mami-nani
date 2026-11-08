import {
  Utensils,
  CookingPot,
  Flame,
  Store,
  Clock,
  Wallet,
  Sparkles,
  Search,
  SearchX,
  ChefHat,
  Check,
  CheckCheck,
  Wheat,
  Egg,
  Drumstick,
  Leaf,
  Carrot,
  Soup,
  Droplets,
  CircleDot,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  X,
  Delete,
  Trophy,
  Award,
  Heart,
  Plus,
  Trash2,
  Activity,
  Zap,
  PartyPopper,
  CheckCircle2
} from 'lucide-react';

// Pemetaan kategori bahan ke ikon Lucide
export const getBahanIcon = (kategori) => {
  switch (kategori) {
    case 'karbo': return Wheat;
    case 'protein': return Egg;
    case 'sayur': return Leaf;
    case 'bumbu': return Droplets;
    default: return CircleDot;
  }
};

// Pemetaan kategori menu jadi ke ikon Lucide
export const getMenuIcon = (kategori) => {
  switch (kategori) {
    case 'makan-siang': return Utensils;
    case 'makan-malam': return Soup;
    case 'sarapan': return Egg;
    case 'cemilan': return Carrot;
    case 'minuman': return Droplets;
    default: return Utensils;
  }
};

export {
  Utensils,
  CookingPot,
  Flame,
  Store,
  Clock,
  Wallet,
  Sparkles,
  Search,
  SearchX,
  ChefHat,
  Check,
  CheckCheck,
  Wheat,
  Egg,
  Drumstick,
  Leaf,
  Carrot,
  Soup,
  Droplets,
  CircleDot,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  X,
  Delete,
  Trophy,
  Award,
  Heart,
  Plus,
  Trash2,
  Activity,
  Zap,
  PartyPopper,
  CheckCircle2
};
