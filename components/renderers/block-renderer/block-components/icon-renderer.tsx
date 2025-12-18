/**
 * ========================================
 * ICON RENDERER
 * ========================================
 *
 * Renders icons based on V3.0 Schema icon names
 * Maps icon names to Lucide React icons
 */

import React from "react";
import {
  Search,
  ShoppingCart,
  ShoppingBag,
  Menu,
  X,
  Moon,
  Sun,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  User,
  Heart,
  Star,
  Clock,
  Calendar,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Github,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Check,
  AlertCircle,
  Info,
  HelpCircle,
  Settings,
  Home,
  Truck,
  CreditCard,
  Shield,
  RefreshCw,
  Gift,
  Tag,
  Percent,
  Eye,
  EyeOff,
  Copy,
  Share2,
  Send,
  Download,
  Upload,
  Trash2,
  Edit,
  Plus,
  Minus,
  Filter,
  Grid,
  List,
  LayoutGrid,
  RotateCcw,
  MessagesSquare,
  BadgeCheck,
  ShieldCheck,
  Headphones,
  type LucideIcon,
} from "lucide-react";

// Icon name to component mapping
const ICON_MAP: Record<string, LucideIcon> = {
  // Navigation
  search: Search,
  menu: Menu,
  close: X,
  x: X,
  chevron_down: ChevronDown,
  chevron_up: ChevronUp,
  chevron_left: ChevronLeft,
  chevron_right: ChevronRight,
  arrow_right: ArrowRight,
  arrow_left: ArrowLeft,
  home: Home,

  // E-commerce
  shopping_cart: ShoppingCart,
  cart: ShoppingCart,
  shopping_bag: ShoppingBag,
  bag: ShoppingBag,
  heart: Heart,
  wishlist: Heart,
  tag: Tag,
  percent: Percent,
  gift: Gift,
  truck: Truck,
  delivery: Truck,
  credit_card: CreditCard,
  payment: CreditCard,
  shield: Shield,
  secure: Shield,

  // User
  user: User,
  account: User,
  profile: User,

  // Theme
  moon: Moon,
  dark_mode: Moon,
  sun: Sun,
  light_mode: Sun,

  // Contact
  phone: Phone,
  call: Phone,
  mail: Mail,
  email: Mail,
  map_pin: MapPin,
  location: MapPin,
  globe: Globe,
  language: Globe,

  // Social Media
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
  github: Github,

  // Media
  play: Play,
  pause: Pause,
  volume: Volume2,
  volume_mute: VolumeX,
  eye: Eye,
  eye_off: EyeOff,

  // Actions
  check: Check,
  checkmark: Check,
  plus: Plus,
  add: Plus,
  minus: Minus,
  remove: Minus,
  edit: Edit,
  pencil: Edit,
  trash: Trash2,
  delete: Trash2,
  copy: Copy,
  share: Share2,
  share2: Share2,
  send: Send,
  download: Download,
  upload: Upload,
  refresh: RefreshCw,
  reload: RefreshCw,
  settings: Settings,
  filter: Filter,

  // Rating
  star: Star,
  rating: Star,

  // Time
  clock: Clock,
  time: Clock,
  calendar: Calendar,
  date: Calendar,

  // Status
  alert: AlertCircle,
  warning: AlertCircle,
  info: Info,
  help: HelpCircle,
  question: HelpCircle,

  // Layout
  grid: Grid,
  grid_view: LayoutGrid,
  list: List,
  list_view: List,

  // Badge/Trust Badge Icons
  rotate_ccw: RotateCcw,
  return: RotateCcw,
  refund: RotateCcw,
  money_back: RotateCcw,
  messages_square: MessagesSquare,
  chat: MessagesSquare,
  support: MessagesSquare,
  customer_support: MessagesSquare,
  badge_check: BadgeCheck,
  verified: BadgeCheck,
  quality: BadgeCheck,
  shield_check: ShieldCheck,
  warranty: ShieldCheck,
  protection: ShieldCheck,
  headphones: Headphones,
  customer_service: Headphones,
};

export interface IconRendererProps {
  icon: string;
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

/**
 * Render an icon by name
 */
export default function IconRenderer({
  icon,
  className = "",
  size,
  color,
  strokeWidth = 2,
  style,
}: IconRendererProps) {
  // Normalize icon name (convert to lowercase and replace hyphens with underscores)
  const normalizedIcon = icon?.toLowerCase().replace(/-/g, "_");

  const IconComponent = ICON_MAP[normalizedIcon];

  if (!IconComponent) {
    // Development warning
    if (process.env.NODE_ENV === "development") {
      console.warn(`Icon not found: ${icon} (normalized: ${normalizedIcon})`);
    }
    // Return an empty span as fallback
    return <span className={className} style={style} />;
  }

  return (
    <IconComponent
      className={className}
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      style={style}
    />
  );
}

/**
 * Check if an icon exists
 */
export function hasIcon(icon: string): boolean {
  const normalizedIcon = icon?.toLowerCase().replace(/-/g, "_");
  return normalizedIcon in ICON_MAP;
}

/**
 * Get all available icon names
 */
export function getAvailableIcons(): string[] {
  return Object.keys(ICON_MAP);
}
