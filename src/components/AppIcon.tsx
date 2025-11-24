import type { IconType } from 'react-icons'
import {
  FiBell,
  FiCheck,
  FiChevronDown,
  FiChevronRight,
  FiClock,
  FiCreditCard,
  FiDollarSign,
  FiEdit2,
  FiGlobe,
  FiHeart,
  FiHelpCircle,
  FiLogOut,
  FiMail,
  FiMapPin,
  FiMoon,
  FiPackage,
  FiPhoneCall,
  FiRefreshCw,
  FiSearch,
  FiSettings,
  FiShoppingBag,
  FiShoppingCart,
  FiSliders,
  FiStar,
  FiSun,
  FiTrash2,
  FiVolume2,
  FiX,
} from 'react-icons/fi'
import { BsCarFront } from 'react-icons/bs'
import { GiMedicinePills } from 'react-icons/gi'
import { LuCoffee, LuUtensils } from 'react-icons/lu'
import { PiCake, PiCarProfile, PiMotorcycle, PiTaxi } from 'react-icons/pi'

const iconMap: Record<string, IconType> = {
  '☀️': FiSun,
  '🌙': FiMoon,
  '🔄': FiRefreshCw,
  '🎨': FiSliders,
  '🇬🇧': FiGlobe,
  '🇵🇰': FiGlobe,
  '🏍️': PiMotorcycle,
  '🚗': BsCarFront,
  '🛺': PiTaxi,
  '🚙': PiCarProfile,
  '🚕': PiTaxi,
  '💵': FiDollarSign,
  '💳': FiCreditCard,
  '📍': FiMapPin,
  '💖': FiHeart,
  '🕐': FiClock,
  '🔔': FiBell,
  '🔊': FiVolume2,
  '📞': FiPhoneCall,
  '🌐': FiGlobe,
  '❓': FiHelpCircle,
  '⚙️': FiSettings,
  '🚪': FiLogOut,
  '📦': FiPackage,
  '🛍️': FiShoppingBag,
  '🛒': FiShoppingCart,
  '🍽️': LuUtensils,
  '🍰': PiCake,
  '☕': LuCoffee,
  '💊': GiMedicinePills,
  '⭐': FiStar,
  '★': FiStar,
  '🔍': FiSearch,
  '💰': FiDollarSign,
  '🗑️': FiTrash2,
  '✏️': FiEdit2,
  '✓': FiCheck,
  '×': FiX,
  '📧': FiMail,
  '›': FiChevronRight,
  '⌄': FiChevronDown,
}

export function AppIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = iconMap[name]
  if (!IconComponent) {
    return (
      <span className={className} aria-hidden="true">
        {name}
      </span>
    )
  }
  return <IconComponent className={className} aria-hidden="true" focusable="false" />
}

