/**
 * Icon - Componente de iconos usando lucide-react
 */
import React from 'react';
import {
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  UserCheck,
  Clock,
  LogOut,
  Menu,
  X,
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  ArrowLeft,
  ArrowRight,
  Check,
  AlertCircle,
  Info,
  Search,
  Filter,
  Settings,
  Home,
  Activity,
  Folder,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  MoreHorizontal,
  Loader2,
  RefreshCw,
  Lock,
  Unlock,
  User,
  FileText,
  BarChart2,
  List,
  Grid,
  Bell,
  Mail,
  Phone,
  MapPin,
  Star,
  Heart,
  Share2,
  Download,
  Upload,
  Printer,
  Camera,
  Image,
  Video,
  Music,
  File,
  FolderPlus,
  Archive,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize2,
  ExternalLink,
  Link,
  Copy,
  Clipboard,
  Send,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Award,
  Target,
  Zap,
  Layers,
  Box,
  Server,
  Database,
  Cloud,
  CloudOff,
  Wifi,
  WifiOff,
  Smartphone,
  Tablet,
  Monitor,
  Cpu,
  HardDrive,
  Keyboard,
  Mouse,
  Speaker,
  Mic,
  Headphones,
  Volume2,
  VolumeX,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  FastForward,
  Rewind,
  Repeat,
  Shuffle,
  Disc,
  Radio,
  Tv,
  Film,
  BookOpen,
  Bookmark,
  BookMarked,
  GraduationCap,
  FlaskConical,
  Lightbulb,
  Rocket,
  Globe,
  Map,
  Compass,
  Anchor,
  Plane,
  Car,
  Bike,
  Footprints,
  TreeDeciduous,
  Flower2,
  Leaf,
  Sun,
  Moon,
  CloudMoon,
  CloudSun,
  Snowflake,
  Umbrella,
  Droplets,
  Wind,
  Waves,
  Mountain,
  Building,
  Building2,
  Store,
  ShoppingCart,
  CreditCard,
  Wallet,
  PiggyBank,
  LineChart,
  PieChart,
  BarChart,
  EyeOff,
  Power,
  ToggleLeft,
  ToggleRight,
  CircleDot,
  Square,
  Triangle,
  Hexagon,
  Octagon,
  Diamond,
  Smile,
  Frown,
  Meh,
  Angry,
  Skull,
  Ghost,
  Bug,
  Feather,
  Crown,
  Gem,
  Sparkles,
  Wand2,
  Hammer,
  Wrench,
  PenTool,
  Brush,
  Palette,
  SprayCan,
  Highlighter,
  Eraser,
  Type,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ListOrdered,
  IndentDecrease,
  IndentIncrease,
  Quote,
  Code,
  Code2,
  Terminal,
  Microscope,
  Telescope,
  Binoculars,
  Crosshair,
  Circle,
  Pentagon,
  Bot,
  type LucideProps
} from 'lucide-react';

export type IconName =
  | 'DollarSign'
  | 'Users'
  | 'TrendingUp'
  | 'TrendingDown'
  | 'Minus'
  | 'UserCheck'
  | 'Clock'
  | 'LogOut'
  | 'Menu'
  | 'X'
  | 'Plus'
  | 'Edit'
  | 'Trash2'
  | 'Eye'
  | 'Save'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'Check'
  | 'AlertCircle'
  | 'Info'
  | 'Search'
  | 'Filter'
  | 'Settings'
  | 'Home'
  | 'Activity'
  | 'Folder'
  | 'Calendar'
  | 'ChevronLeft'
  | 'ChevronRight'
  | 'ChevronDown'
  | 'ChevronUp'
  | 'MoreVertical'
  | 'MoreHorizontal'
  | 'Loader'
  | 'RefreshCw'
  | 'Lock'
  | 'Unlock'
  | 'User'
  | 'FileText'
  | 'BarChart2'
  | 'List'
  | 'Grid'
  | 'Bell'
  | 'Mail'
  | 'Phone'
  | 'MapPin'
  | 'Star'
  | 'Heart'
  | 'Share2'
  | 'Download'
  | 'Upload'
  | 'Printer'
  | 'Camera'
  | 'Image'
  | 'Video'
  | 'Music'
  | 'File'
  | 'FolderPlus'
  | 'Archive'
  | 'RotateCcw'
  | 'ZoomIn'
  | 'ZoomOut'
  | 'Maximize'
  | 'Minimize'
  | 'ExternalLink'
  | 'Link'
  | 'Copy'
  | 'Clipboard'
  | 'Send'
  | 'MessageSquare'
  | 'ThumbsUp'
  | 'ThumbsDown'
  | 'Award'
  | 'Target'
  | 'Zap'
  | 'Layers'
  | 'Box'
  | 'Server'
  | 'Database'
  | 'Cloud'
  | 'CloudOff'
  | 'Wifi'
  | 'WifiOff'
  | 'Smartphone'
  | 'Tablet'
  | 'Monitor'
  | 'Cpu'
  | 'HardDrive'
  | 'Keyboard'
  | 'Mouse'
  | 'Speaker'
  | 'Mic'
  | 'Headphones'
  | 'Volume2'
  | 'VolumeX'
  | 'Pause'
  | 'Play'
  | 'SkipBack'
  | 'SkipForward'
  | 'FastForward'
  | 'Rewind'
  | 'Repeat'
  | 'Shuffle'
  | 'Disc'
  | 'Radio'
  | 'Tv'
  | 'Film'
  | 'BookOpen'
  | 'Bookmark'
  | 'BookMarked'
  | 'GraduationCap'
  | 'FlaskConical'
  | 'Lightbulb'
  | 'Rocket'
  | 'Globe'
  | 'Map'
  | 'Compass'
  | 'Anchor'
  | 'Plane'
  | 'Car'
  | 'Bike'
  | 'Footprints'
  | 'TreeDeciduous'
  | 'Flower2'
  | 'Leaf'
  | 'Sun'
  | 'Moon'
  | 'CloudMoon'
  | 'CloudSun'
  | 'Snowflake'
  | 'Umbrella'
  | 'Droplets'
  | 'Wind'
  | 'Waves'
  | 'Mountain'
  | 'Building'
  | 'Building2'
  | 'Store'
  | 'ShoppingCart'
  | 'CreditCard'
  | 'Wallet'
  | 'PiggyBank'
  | 'LineChart'
  | 'PieChart'
  | 'BarChart'
  | 'EyeOff'
  | 'Power'
  | 'ToggleLeft'
  | 'ToggleRight'
  | 'CircleDot'
  | 'Square'
  | 'Triangle'
  | 'Hexagon'
  | 'Octagon'
  | 'Diamond'
  | 'Smile'
  | 'Frown'
  | 'Meh'
  | 'Angry'
  | 'Skull'
  | 'Ghost'
  | 'Bot'
  | 'Bug'
  | 'Feather'
  | 'Crown'
  | 'Gem'
  | 'Sparkles'
  | 'Wand2'
  | 'Hammer'
  | 'Wrench'
  | 'PenTool'
  | 'Brush'
  | 'Palette'
  | 'SprayCan'
  | 'Highlighter'
  | 'Eraser'
  | 'Type'
  | 'Bold'
  | 'Italic'
  | 'Underline'
  | 'Strikethrough'
  | 'AlignLeft'
  | 'AlignCenter'
  | 'AlignRight'
  | 'AlignJustify'
  | 'ListOrdered'
  | 'IndentDecrease'
  | 'IndentIncrease'
  | 'Quote'
  | 'Code'
  | 'Code2'
  | 'Terminal'
  | 'Microscope'
  | 'Telescope'
  | 'Binoculars'
  | 'Crosshair'
  | 'Circle'
  | 'Pentagon';

export interface IconProps {
  name?: IconName;
  size?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
}

const iconComponents: Record<IconName, React.ComponentType<LucideProps>> = {
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  UserCheck,
  Clock,
  LogOut,
  Menu,
  X,
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  ArrowLeft,
  ArrowRight,
  Check,
  AlertCircle,
  Info,
  Search,
  Filter,
  Settings,
  Home,
  Activity,
  Folder,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  MoreHorizontal,
  Loader: Loader2,
  RefreshCw,
  Lock,
  Unlock,
  User,
  FileText,
  BarChart2,
  List,
  Grid,
  Bell,
  Mail,
  Phone,
  MapPin,
  Star,
  Heart,
  Share2,
  Download,
  Upload,
  Printer,
  Camera,
  Image,
  Video,
  Music,
  File,
  FolderPlus,
  Archive,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize: Minimize2,
  ExternalLink,
  Link,
  Copy,
  Clipboard,
  Send,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Award,
  Target,
  Zap,
  Layers,
  Box,
  Server,
  Database,
  Cloud,
  CloudOff,
  Wifi,
  WifiOff,
  Smartphone,
  Tablet,
  Monitor,
  Cpu,
  HardDrive,
  Keyboard,
  Mouse,
  Speaker,
  Mic,
  Headphones,
  Volume2,
  VolumeX,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  FastForward,
  Rewind,
  Repeat,
  Shuffle,
  Disc,
  Radio,
  Tv,
  Film,
  BookOpen,
  Bookmark,
  BookMarked,
  GraduationCap,
  FlaskConical,
  Lightbulb,
  Rocket,
  Globe,
  Map,
  Compass,
  Anchor,
  Plane,
  Car,
  Bike,
  Footprints,
  TreeDeciduous,
  Flower2,
  Leaf,
  Sun,
  Moon,
  CloudMoon,
  CloudSun,
  Snowflake,
  Umbrella,
  Droplets,
  Wind,
  Waves,
  Mountain,
  Building,
  Building2,
  Store,
  ShoppingCart,
  CreditCard,
  Wallet,
  PiggyBank,
  LineChart,
  PieChart,
  BarChart,
  EyeOff,
  Power,
  ToggleLeft,
  ToggleRight,
  CircleDot,
  Square,
  Triangle,
  Hexagon,
  Octagon,
  Diamond,
  Smile,
  Frown,
  Meh,
  Angry,
  Skull,
  Ghost,
  Bot,
  Bug,
  Feather,
  Crown,
  Gem,
  Sparkles,
  Wand2,
  Hammer,
  Wrench,
  PenTool,
  Brush,
  Palette,
  SprayCan,
  Highlighter,
  Eraser,
  Type,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ListOrdered,
  IndentDecrease,
  IndentIncrease,
  Quote,
  Code,
  Code2,
  Terminal,
  Microscope,
  Telescope,
  Binoculars,
  Crosshair,
  Circle,
  Pentagon,
};

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 16, 
  color, 
  className = '', 
  strokeWidth = 2 
}) => {
  if (!name) {
    return null;
  }

  const IconComponent = iconComponents[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
    />
  );
};

export default Icon;
