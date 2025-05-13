"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Martini,
  GlassWater,
  Beer,
  Wine,
  LogIn,
  User,
  Lock,
  Clock,
  Users,
  Car,
  Utensils,
  Coffee,
  Stethoscope,
  Scissors,
  ShoppingBag,
  Ticket,
  Sparkles,
  Timer,
  Info,
  UserPlus,
  UserCheck,
  Bell,
  ArrowUp,
  ArrowDown,
  Plus,
  Beef,
  Spade,
  Sandwich,
  Soup,
  IceCream,
  Salad,
  Store,
  Dumbbell,
  Shirt,
  Laptop,
  Smartphone,
  Gamepad,
  Popcorn,
  Film,
  Music,
  Brush,
  Wrench,
  Hammer,
  Home,
  Plane,
  Bus,
  BookOpen,
  Palette,
  Camera,
  Headphones,
  Heart,
  Pill,
  Syringe,
  Thermometer,
  Gift,
  ShoppingCart,
  Pizza,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ToastProvider, ToastViewport } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

// Service/Store type
type ServiceLocation = {
  id: string
  name: string
  type: "drinks" | "food" | "service" | "healthcare" | "retail" | "entertainment" | "other"
  description: string
  queueLength: number
  servingRate: number // minutes per customer
  estimatedWait: number
  icon: React.ReactNode
  color: string
  address: string
  openTime: string
  closeTime: string
  popularity: number // 1-10 scale
  lastUpdated: number // timestamp of last update
  activity: QueueActivity[] // recent activity
  serviceEfficiency: number // 0.5-1.5 multiplier for service rate (random variations)
  menuItems?: MenuItem[] // Menu items for the store
}

// Queue activity type
type QueueActivity = {
  id: string
  type: "join" | "leave" | "skip" | "return"
  timestamp: number
  personName?: string
}

// Menu item type
type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  iconName: string
  icon: React.ReactNode
}

// Sample service locations with diverse businesses
const initialServiceLocations: ServiceLocation[] = [
  {
    id: "downtown-bar",
    name: "Downtown Lounge",
    type: "drinks",
    description: "Premium cocktail bar with signature drinks",
    queueLength: 32,
    servingRate: 3.5,
    estimatedWait: 15,
    icon: <Martini className="h-5 w-5" />,
    color: "teal",
    address: "123 Main Street, New York",
    openTime: "5:00 PM",
    closeTime: "2:00 AM",
    popularity: 9,
    lastUpdated: Date.now(),
    activity: [],
    serviceEfficiency: 1.0,
    menuItems: [
      {
        id: "martini-classic",
        name: "Classic Martini",
        description: "Gin, dry vermouth, olive or lemon twist",
        price: 12.99,
        iconName: "cocktail",
        icon: <Martini className="h-5 w-5" />,
      },
      {
        id: "manhattan",
        name: "Manhattan",
        description: "Whiskey, sweet vermouth, bitters",
        price: 14.99,
        iconName: "whisky",
        icon: <GlassWater className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "whisky-tasting",
    name: "Whisky & Co.",
    type: "drinks",
    description: "Whisky tasting and premium spirits",
    queueLength: 17,
    servingRate: 4.2,
    estimatedWait: 8,
    icon: <GlassWater className="h-5 w-5" />,
    color: "amber",
    address: "456 Park Avenue, New York",
    openTime: "4:00 PM",
    closeTime: "12:00 AM",
    popularity: 8,
    lastUpdated: Date.now(),
    activity: [],
    serviceEfficiency: 1.0,
    menuItems: [
      {
        id: "scotch-flight",
        name: "Scotch Flight",
        description: "Tasting of 3 premium single malts",
        price: 24.99,
        iconName: "whisky",
        icon: <GlassWater className="h-5 w-5" />,
      },
      {
        id: "bourbon-neat",
        name: "Bourbon Neat",
        description: "Premium Kentucky bourbon, served neat",
        price: 16.99,
        iconName: "whisky",
        icon: <GlassWater className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "burger-joint",
    name: "Gourmet Burgers",
    type: "food",
    description: "Artisanal burgers and craft sides",
    queueLength: 45,
    servingRate: 6.5,
    estimatedWait: 22,
    icon: <Utensils className="h-5 w-5" />,
    color: "orange",
    address: "789 Broadway, New York",
    openTime: "11:00 AM",
    closeTime: "10:00 PM",
    popularity: 10,
    lastUpdated: Date.now(),
    activity: [],
    serviceEfficiency: 1.0,
    menuItems: [
      {
        id: "classic-burger",
        name: "Classic Burger",
        description: "Beef patty, lettuce, tomato, special sauce",
        price: 12.99,
        iconName: "burger",
        icon: <Utensils className="h-5 w-5" />,
      },
      {
        id: "truffle-fries",
        name: "Truffle Fries",
        description: "Hand-cut fries with truffle oil and parmesan",
        price: 8.99,
        iconName: "general",
        icon: <Utensils className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "coffee-house",
    name: "Artisan Coffee",
    type: "drinks",
    description: "Specialty coffee and pastries",
    queueLength: 12,
    servingRate: 2.0,
    estimatedWait: 6,
    icon: <Coffee className="h-5 w-5" />,
    color: "brown",
    address: "321 Village Lane, Brooklyn",
    openTime: "7:00 AM",
    closeTime: "7:00 PM",
    popularity: 7,
    lastUpdated: Date.now(),
    activity: [],
    serviceEfficiency: 1.0,
    menuItems: [
      {
        id: "pour-over",
        name: "Pour Over Coffee",
        description: "Single-origin beans, hand poured",
        price: 5.99,
        iconName: "coffee",
        icon: <Coffee className="h-5 w-5" />,
      },
      {
        id: "croissant",
        name: "Butter Croissant",
        description: "Flaky, buttery French pastry",
        price: 4.5,
        iconName: "general",
        icon: <Utensils className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "car-wash",
    name: "Express Car Wash",
    type: "service",
    description: "Premium car washing services",
    queueLength: 8,
    servingRate: 15.0,
    estimatedWait: 35,
    icon: <Car className="h-5 w-5" />,
    color: "blue",
    address: "555 Auto Drive, Queens",
    openTime: "8:00 AM",
    closeTime: "6:00 PM",
    popularity: 6,
    lastUpdated: Date.now(),
    activity: [],
    serviceEfficiency: 1.0,
    menuItems: [
      {
        id: "basic-wash",
        name: "Basic Wash",
        description: "Exterior wash and quick dry",
        price: 14.99,
        iconName: "car",
        icon: <Car className="h-5 w-5" />,
      },
      {
        id: "deluxe-wash",
        name: "Deluxe Wash",
        description: "Exterior wash, wax, and interior vacuum",
        price: 24.99,
        iconName: "car",
        icon: <Car className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "urgent-care",
    name: "City Urgent Care",
    type: "healthcare",
    description: "Walk-in medical services",
    queueLength: 23,
    servingRate: 12.0,
    estimatedWait: 45,
    icon: <Stethoscope className="h-5 w-5" />,
    color: "red",
    address: "100 Health Avenue, Manhattan",
    openTime: "24 hours",
    closeTime: "24 hours",
    popularity: 8,
    lastUpdated: Date.now(),
    activity: [],
    serviceEfficiency: 1.0,
    menuItems: [
      {
        id: "basic-checkup",
        name: "Basic Checkup",
        description: "General health assessment",
        price: 75.0,
        iconName: "general",
        icon: <Stethoscope className="h-5 w-5" />,
      },
      {
        id: "flu-shot",
        name: "Flu Shot",
        description: "Seasonal influenza vaccination",
        price: 35.0,
        iconName: "vaccination",
        icon: <Stethoscope className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "salon",
    name: "Chic Hair Salon",
    type: "service",
    description: "Hair styling and beauty services",
    queueLength: 5,
    servingRate: 30.0,
    estimatedWait: 60,
    icon: <Scissors className="h-5 w-5" />,
    color: "pink",
    address: "200 Fashion Street, SoHo",
    openTime: "9:00 AM",
    closeTime: "8:00 PM",
    popularity: 7,
    lastUpdated: Date.now(),
    activity: [],
    serviceEfficiency: 1.0,
    menuItems: [
      {
        id: "haircut",
        name: "Haircut & Style",
        description: "Professional cut and styling",
        price: 65.0,
        iconName: "salon",
        icon: <Scissors className="h-5 w-5" />,
      },
      {
        id: "color",
        name: "Hair Color",
        description: "Full color treatment",
        price: 85.0,
        iconName: "salon",
        icon: <Scissors className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "market-stall",
    name: "Farmers Market Drinks",
    type: "drinks",
    description: "Fresh juices and smoothies",
    queueLength: 15,
    servingRate: 2.5,
    estimatedWait: 10,
    icon: <Wine className="h-5 w-5" />,
    color: "green",
    address: "Union Square Market, Manhattan",
    openTime: "8:00 AM",
    closeTime: "3:00 PM",
    popularity: 9,
    lastUpdated: Date.now(),
    activity: [],
    serviceEfficiency: 1.0,
    menuItems: [
      {
        id: "green-juice",
        name: "Green Juice",
        description: "Kale, cucumber, apple, ginger",
        price: 7.99,
        iconName: "water",
        icon: <GlassWater className="h-5 w-5" />,
      },
      {
        id: "berry-smoothie",
        name: "Berry Smoothie",
        description: "Mixed berries, banana, almond milk",
        price: 8.99,
        iconName: "water",
        icon: <GlassWater className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "brewery",
    name: "Riverside Brewery",
    type: "drinks",
    description: "Craft beers and brewery tours",
    queueLength: 28,
    servingRate: 5.0,
    estimatedWait: 18,
    icon: <Beer className="h-5 w-5" />,
    color: "yellow",
    address: "75 River Road, Brooklyn",
    openTime: "12:00 PM",
    closeTime: "11:00 PM",
    popularity: 9,
    lastUpdated: Date.now(),
    activity: [],
    serviceEfficiency: 1.0,
    menuItems: [
      {
        id: "ipa",
        name: "House IPA",
        description: "Hoppy India Pale Ale, 6.5% ABV",
        price: 7.99,
        iconName: "beer",
        icon: <Beer className="h-5 w-5" />,
      },
      {
        id: "stout",
        name: "Chocolate Stout",
        description: "Rich, dark stout with chocolate notes, 5.8% ABV",
        price: 8.99,
        iconName: "beer",
        icon: <Beer className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "retail-store",
    name: "Tech Gadgets",
    type: "retail",
    description: "Latest electronics and accessories",
    queueLength: 40,
    servingRate: 8.0,
    estimatedWait: 30,
    icon: <ShoppingBag className="h-5 w-5" />,
    color: "indigo",
    address: "500 Tech Plaza, Manhattan",
    openTime: "10:00 AM",
    closeTime: "9:00 PM",
    popularity: 8,
    lastUpdated: Date.now(),
    activity: [],
    serviceEfficiency: 1.0,
    menuItems: [
      {
        id: "phone-case",
        name: "Premium Phone Case",
        description: "Durable case for latest smartphone models",
        price: 29.99,
        iconName: "mobile",
        icon: <ShoppingBag className="h-5 w-5" />,
      },
      {
        id: "wireless-charger",
        name: "Wireless Charger",
        description: "Fast wireless charging pad",
        price: 39.99,
        iconName: "electronics",
        icon: <ShoppingBag className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "concert-venue",
    name: "City Concert Hall",
    type: "entertainment",
    description: "Live music and performances",
    queueLength: 120,
    servingRate: 0.5,
    estimatedWait: 60,
    icon: <Ticket className="h-5 w-5" />,
    color: "purple",
    address: "1000 Entertainment Blvd, Manhattan",
    openTime: "6:00 PM",
    closeTime: "11:00 PM",
    popularity: 10,
    lastUpdated: Date.now(),
    activity: [],
    serviceEfficiency: 1.0,
    menuItems: [
      {
        id: "general-admission",
        name: "General Admission",
        description: "Standard entry ticket",
        price: 49.99,
        iconName: "ticket",
        icon: <Ticket className="h-5 w-5" />,
      },
      {
        id: "vip-pass",
        name: "VIP Pass",
        description: "Premium seating and backstage access",
        price: 149.99,
        iconName: "ticket",
        icon: <Ticket className="h-5 w-5" />,
      },
    ],
  },
]

// Random name generator for queue activity
const generateRandomName = () => {
  const firstNames = [
    "Alex",
    "Jamie",
    "Jordan",
    "Taylor",
    "Casey",
    "Riley",
    "Avery",
    "Morgan",
    "Quinn",
    "Blake",
    "Sam",
    "Drew",
    "Reese",
    "Parker",
    "Skyler",
    "Charlie",
    "Finley",
    "Dakota",
    "Hayden",
    "Rowan",
    "Sophia",
    "Liam",
    "Olivia",
    "Noah",
    "Emma",
    "Jackson",
    "Ava",
    "Lucas",
    "Isabella",
    "Ethan",
    "Mia",
    "Mason",
    "Harper",
    "Logan",
    "Evelyn",
    "Elijah",
    "Abigail",
    "James",
    "Amelia",
  ]

  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
    "Taylor",
    "Moore",
    "Jackson",
    "Martin",
    "Lee",
    "Perez",
    "Thompson",
    "White",
    "Harris",
    "Sanchez",
    "Clark",
    "Ramirez",
    "Lewis",
    "Robinson",
    "Walker",
    "Young",
    "Allen",
    "King",
    "Wright",
    "Scott",
    "Torres",
    "Nguyen",
    "Hill",
    "Flores",
  ]

  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`
}

// Get color class based on service type
const getColorClass = (color: string, element: "bg" | "text" | "border") => {
  const colorMap: Record<string, Record<string, string>> = {
    teal: {
      bg: "bg-teal-100 dark:bg-teal-900/30",
      text: "text-teal-700 dark:text-teal-300",
      border: "border-teal-200 dark:border-teal-800",
    },
    amber: {
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-700 dark:text-amber-300",
      border: "border-amber-200 dark:border-amber-800",
    },
    orange: {
      bg: "bg-orange-100 dark:bg-orange-900/30",
      text: "text-orange-700 dark:text-orange-300",
      border: "border-orange-200 dark:border-orange-800",
    },
    brown: {
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      text: "text-yellow-800 dark:text-yellow-300",
      border: "border-yellow-200 dark:border-yellow-800",
    },
    blue: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-700 dark:text-blue-300",
      border: "border-blue-200 dark:border-blue-800",
    },
    red: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-700 dark:text-red-300",
      border: "border-red-200 dark:border-red-800",
    },
    pink: {
      bg: "bg-pink-100 dark:bg-pink-900/30",
      text: "text-pink-700 dark:text-pink-300",
      border: "border-pink-200 dark:border-pink-800",
    },
    green: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-700 dark:text-green-300",
      border: "border-green-200 dark:border-green-800",
    },
    yellow: {
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      text: "text-yellow-700 dark:text-yellow-300",
      border: "border-yellow-200 dark:border-yellow-800",
    },
    indigo: {
      bg: "bg-indigo-100 dark:bg-indigo-900/30",
      text: "text-indigo-700 dark:text-indigo-300",
      border: "border-indigo-200 dark:border-indigo-800",
    },
    purple: {
      bg: "bg-purple-100 dark:bg-purple-900/30",
      text: "text-purple-700 dark:text-purple-300",
      border: "border-purple-200 dark:border-purple-800",
    },
  }

  return colorMap[color]?.[element] || colorMap.teal[element]
}

// Safely clone React element with new props
const safeCloneElement = (element: React.ReactNode, props: Record<string, any>) => {
  if (React.isValidElement(element)) {
    return React.cloneElement(element, props)
  }
  return <Info {...props} />
}

// Get icon with color
const getColoredIcon = (service: ServiceLocation) => {
  const className = `h-5 w-5 ${getColorClass(service.color, "text")}`
  return safeCloneElement(service.icon, { className })
}

// Format time ago
const formatTimeAgo = (timestamp: number) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)

  if (seconds < 5) return "just now"
  if (seconds < 60) return `${seconds} seconds ago`

  const minutes = Math.floor(seconds / 60)
  if (minutes === 1) return "1 minute ago"
  if (minutes < 60) return `${minutes} minutes ago`

  const hours = Math.floor(minutes / 60)
  if (hours === 1) return "1 hour ago"
  return `${hours} hours ago`
}

// Format price to currency
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price)
}

// Get icon component based on type
const getIconComponent = (type: string) => {
  switch (type) {
    case "drinks":
      return <Martini className="h-5 w-5" />
    case "food":
      return <Utensils className="h-5 w-5" />
    case "service":
      return <Scissors className="h-5 w-5" />
    case "healthcare":
      return <Stethoscope className="h-5 w-5" />
    case "retail":
      return <ShoppingBag className="h-5 w-5" />
    case "entertainment":
      return <Ticket className="h-5 w-5" />
    default:
      return <Info className="h-5 w-5" />
  }
}

// Get specific icon based on type and name
const getSpecificIcon = (type: string, name: string) => {
  if (type === "drinks") {
    if (name.toLowerCase().includes("coffee")) {
      return <Coffee className="h-5 w-5" />
    } else if (name.toLowerCase().includes("beer") || name.toLowerCase().includes("brewery")) {
      return <Beer className="h-5 w-5" />
    } else if (name.toLowerCase().includes("whisky") || name.toLowerCase().includes("bourbon")) {
      return <GlassWater className="h-5 w-5" />
    } else if (name.toLowerCase().includes("wine")) {
      return <Wine className="h-5 w-5" />
    } else {
      return <Martini className="h-5 w-5" />
    }
  } else if (type === "service" && name.toLowerCase().includes("car")) {
    return <Car className="h-5 w-5" />
  } else {
    return getIconComponent(type)
  }
}

// Icon mapping for all icons
const iconMapping: Record<string, Record<string, React.ReactNode>> = {
  drinks: {
    cocktail: <Martini className="h-5 w-5" />,
    whisky: <GlassWater className="h-5 w-5" />,
    beer: <Beer className="h-5 w-5" />,
    wine: <Wine className="h-5 w-5" />,
    coffee: <Coffee className="h-5 w-5" />,
    water: <GlassWater className="h-5 w-5" />,
    general: <Martini className="h-5 w-5" />,
  },
  food: {
    general: <Utensils className="h-5 w-5" />,
    pizza: <Pizza className="h-5 w-5" />,
    burger: <Beef className="h-5 w-5" />,
    sandwich: <Sandwich className="h-5 w-5" />,
    soup: <Soup className="h-5 w-5" />,
    icecream: <IceCream className="h-5 w-5" />,
    salad: <Salad className="h-5 w-5" />,
  },
  service: {
    general: <Scissors className="h-5 w-5" />,
    car: <Car className="h-5 w-5" />,
    spa: <Spade className="h-5 w-5" />,
    salon: <Brush className="h-5 w-5" />,
    repair: <Wrench className="h-5 w-5" />,
    construction: <Hammer className="h-5 w-5" />,
    cleaning: <Home className="h-5 w-5" />,
  },
  healthcare: {
    general: <Stethoscope className="h-5 w-5" />,
    pharmacy: <Pill className="h-5 w-5" />,
    vaccination: <Syringe className="h-5 w-5" />,
    checkup: <Thermometer className="h-5 w-5" />,
    heart: <Heart className="h-5 w-5" />,
  },
  retail: {
    general: <ShoppingBag className="h-5 w-5" />,
    clothing: <Shirt className="h-5 w-5" />,
    electronics: <Laptop className="h-5 w-5" />,
    mobile: <Smartphone className="h-5 w-5" />,
    grocery: <ShoppingCart className="h-5 w-5" />,
    gift: <Gift className="h-5 w-5" />,
    book: <BookOpen className="h-5 w-5" />,
  },
  entertainment: {
    general: <Ticket className="h-5 w-5" />,
    movie: <Film className="h-5 w-5" />,
    game: <Gamepad className="h-5 w-5" />,
    music: <Music className="h-5 w-5" />,
    concert: <Headphones className="h-5 w-5" />,
    theater: <Popcorn className="h-5 w-5" />,
  },
  other: {
    general: <Store className="h-5 w-5" />,
    fitness: <Dumbbell className="h-5 w-5" />,
    education: <BookOpen className="h-5 w-5" />,
    art: <Palette className="h-5 w-5" />,
    photography: <Camera className="h-5 w-5" />,
    travel: <Plane className="h-5 w-5" />,
    transport: <Bus className="h-5 w-5" />,
  },
}

// Get icon by name and type
const getIconByName = (iconName: string, type: string): React.ReactNode => {
  return iconMapping[type]?.[iconName] || iconMapping[type]?.general || <Info className="h-5 w-5" />
}

// Icon selection component
const IconSelector = ({
  type,
  selectedIcon,
  onSelectIcon,
}: {
  type: string
  selectedIcon: string
  onSelectIcon: (icon: string) => void
}) => {
  // Define icon groups based on service type
  const iconGroups: Record<string, { name: string; icon: React.ReactNode }[]> = {
    drinks: [
      { name: "cocktail", icon: <Martini className="h-5 w-5" /> },
      { name: "whisky", icon: <GlassWater className="h-5 w-5" /> },
      { name: "beer", icon: <Beer className="h-5 w-5" /> },
      { name: "wine", icon: <Wine className="h-5 w-5" /> },
      { name: "coffee", icon: <Coffee className="h-5 w-5" /> },
      { name: "water", icon: <GlassWater className="h-5 w-5" /> },
    ],
    food: [
      { name: "general", icon: <Utensils className="h-5 w-5" /> },
      { name: "pizza", icon: <Pizza className="h-5 w-5" /> },
      { name: "burger", icon: <Beef className="h-5 w-5" /> },
      { name: "sandwich", icon: <Sandwich className="h-5 w-5" /> },
      { name: "soup", icon: <Soup className="h-5 w-5" /> },
      { name: "icecream", icon: <IceCream className="h-5 w-5" /> },
      { name: "salad", icon: <Salad className="h-5 w-5" /> },
    ],
    service: [
      { name: "general", icon: <Scissors className="h-5 w-5" /> },
      { name: "car", icon: <Car className="h-5 w-5" /> },
      { name: "spa", icon: <Spade className="h-5 w-5" /> },
      { name: "salon", icon: <Brush className="h-5 w-5" /> },
      { name: "repair", icon: <Wrench className="h-5 w-5" /> },
      { name: "construction", icon: <Hammer className="h-5 w-5" /> },
      { name: "cleaning", icon: <Home className="h-5 w-5" /> },
    ],
    healthcare: [
      { name: "general", icon: <Stethoscope className="h-5 w-5" /> },
      { name: "pharmacy", icon: <Pill className="h-5 w-5" /> },
      { name: "vaccination", icon: <Syringe className="h-5 w-5" /> },
      { name: "checkup", icon: <Thermometer className="h-5 w-5" /> },
      { name: "heart", icon: <Heart className="h-5 w-5" /> },
    ],
    retail: [
      { name: "general", icon: <ShoppingBag className="h-5 w-5" /> },
      { name: "clothing", icon: <Shirt className="h-5 w-5" /> },
      { name: "electronics", icon: <Laptop className="h-5 w-5" /> },
      { name: "mobile", icon: <Smartphone className="h-5 w-5" /> },
      { name: "grocery", icon: <ShoppingCart className="h-5 w-5" /> },
      { name: "gift", icon: <Gift className="h-5 w-5" /> },
      { name: "book", icon: <BookOpen className="h-5 w-5" /> },
    ],
    entertainment: [
      { name: "general", icon: <Ticket className="h-5 w-5" /> },
      { name: "movie", icon: <Film className="h-5 w-5" /> },
      { name: "game", icon: <Gamepad className="h-5 w-5" /> },
      { name: "music", icon: <Music className="h-5 w-5" /> },
      { name: "concert", icon: <Headphones className="h-5 w-5" /> },
      { name: "theater", icon: <Popcorn className="h-5 w-5" /> },
    ],
    other: [
      { name: "general", icon: <Store className="h-5 w-5" /> },
      { name: "fitness", icon: <Dumbbell className="h-5 w-5" /> },
      { name: "education", icon: <BookOpen className="h-5 w-5" /> },
      { name: "art", icon: <Palette className="h-5 w-5" /> },
      { name: "photography", icon: <Camera className="h-5 w-5" /> },
      { name: "travel", icon: <Plane className="h-5 w-5" /> },
      { name: "transport", icon: <Bus className="h-5 w-5" /> },
    ],
  }

  // Get icons for the selected type
  const icons = iconGroups[type] || iconGroups.other

  return (
    <div className="space-y-2">
      <Label className="text-gray-700 dark:text-gray-300">Select Icon</Label>
      <div className="grid grid-cols-6 gap-2">
        {icons.map((item) => (
          <div
            key={item.name}
            onClick={() => onSelectIcon(item.name)}
            className={`p-3 rounded-md border cursor-pointer flex items-center justify-center transition-all ${
              selectedIcon === item.name
                ? "border-teal-500 bg-teal-50 dark:bg-teal-900/30 ring-1 ring-teal-500"
                : "border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-700"
            }`}
          >
            {React.cloneElement(item.icon as React.ReactElement, {
              className: `h-5 w-5 ${selectedIcon === item.name ? "text-teal-600 dark:text-teal-400" : "text-gray-600 dark:text-gray-400"}`,
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

// Available service types
const serviceTypes = [
  { value: "drinks", label: "Drinks & Beverages" },
  { value: "food", label: "Food & Restaurants" },
  { value: "service", label: "Services" },
  { value: "healthcare", label: "Healthcare" },
  { value: "retail", label: "Retail" },
  { value: "entertainment", label: "Entertainment" },
  { value: "other", label: "Other" },
]

// Available colors
const colorOptions = [
  { value: "teal", label: "Teal" },
  { value: "amber", label: "Amber" },
  { value: "orange", label: "Orange" },
  { value: "brown", label: "Brown" },
  { value: "blue", label: "Blue" },
  { value: "red", label: "Red" },
  { value: "pink", label: "Pink" },
  { value: "green", label: "Green" },
  { value: "yellow", label: "Yellow" },
  { value: "indigo", label: "Indigo" },
  { value: "purple", label: "Purple" },
]

// Time options for select
const timeOptions = Array.from({ length: 24 * 4 }).map((_, index) => {
  const hour = Math.floor(index / 4)
  const minute = (index % 4) * 15
  const period = hour >= 12 ? "PM" : "AM"
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  const displayMinute = minute.toString().padStart(2, "0")
  return {
    value: `${displayHour}:${displayMinute} ${period}`,
    label: `${displayHour}:${displayMinute} ${period}`,
  }
})

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [selectedService, setSelectedService] = useState<ServiceLocation | null>(null)
  const [selectedMenuItems, setSelectedMenuItems] = useState<{ id: string; quantity: number }[]>([])
  const [liquidLevel, setLiquidLevel] = useState(50)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [serviceLocations, setServiceLocations] = useState<ServiceLocation[]>(initialServiceLocations)
  const [queueUpdates, setQueueUpdates] = useState<{ id: string; type: string; change: number }[]>([])
  const [activityLog, setActivityLog] = useState<{ id: string; message: string; timestamp: number }[]>([])
  const { toast } = useToast()

  // Refs for tracking animation states
  const animatingServices = useRef<Set<string>>(new Set())

  // Load custom stores from localStorage
  useEffect(() => {
    const customStoresJson = localStorage.getItem("customStores")
    if (customStoresJson) {
      try {
        const customStores = JSON.parse(customStoresJson)
        // Ensure icon is properly set for each custom store
        const processedCustomStores = customStores.map((store: any) => {
          // Convert icon from string to React element if needed
          if (typeof store.icon === "string" || !store.icon) {
            return {
              ...store,
              icon: getIconComponent(store.type),
            }
          }
          return store
        })

        setServiceLocations([...initialServiceLocations, ...processedCustomStores])
      } catch (e) {
        console.error("Failed to parse custom stores", e)
      }
    }
  }, [])

  // Animate liquid level
  useEffect(() => {
    const interval = setInterval(() => {
      setLiquidLevel((prev) => {
        const newLevel = prev + (Math.random() * 2 - 1)
        return Math.max(30, Math.min(70, newLevel))
      })
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Simulate queue movements
  useEffect(() => {
    // Update service efficiency randomly every minute
    const efficiencyInterval = setInterval(() => {
      setServiceLocations((prev) =>
        prev.map((service) => ({
          ...service,
          serviceEfficiency: Math.max(0.5, Math.min(1.5, service.serviceEfficiency + (Math.random() * 0.4 - 0.2))),
        })),
      )
    }, 60000)

    // Simulate people joining queues
    const joinInterval = setInterval(() => {
      setServiceLocations((prev) => {
        // Select 1-3 random services to have people join
        const numServices = Math.floor(Math.random() * 3) + 1
        const serviceIndices = new Set<number>()

        while (serviceIndices.size < numServices) {
          serviceIndices.add(Math.floor(Math.random() * prev.length))
        }

        return prev.map((service, index) => {
          if (!serviceIndices.has(index)) return service

          // Higher popularity = higher chance of new people
          const joinProbability = service.popularity / 10
          if (Math.random() > joinProbability) return service

          // Add 1-3 people to the queue
          const peopleJoining = Math.floor(Math.random() * 3) + 1
          const personName = generateRandomName()

          // Add to queue updates for animation
          const newUpdate = {
            id: service.id,
            type: "join",
            change: peopleJoining,
          }
          setQueueUpdates((updates) => [...updates, newUpdate])

          // Add to activity log
          const newActivity = {
            id: service.id,
            message: `${personName} joined the queue at ${service.name}`,
            timestamp: Date.now(),
          }
          setActivityLog((log) => [newActivity, ...log].slice(0, 20))

          // Show toast for selected service
          if (selectedService?.id === service.id) {
            toast({
              title: "Queue Update",
              description: `${peopleJoining} new ${peopleJoining === 1 ? "person" : "people"} joined the line at ${service.name}`,
              variant: "default",
            })
          }

          // Add to service activity
          const newServiceActivity: QueueActivity = {
            id: crypto.randomUUID(),
            type: "join",
            timestamp: Date.now(),
            personName,
          }

          // Calculate new wait time
          const newQueueLength = service.queueLength + peopleJoining
          const newEstimatedWait = Math.ceil((newQueueLength * service.servingRate * service.serviceEfficiency) / 3)

          return {
            ...service,
            queueLength: newQueueLength,
            estimatedWait: newEstimatedWait,
            lastUpdated: Date.now(),
            activity: [newServiceActivity, ...service.activity].slice(0, 10),
          }
        })
      })
    }, 5000) // Every 5 seconds

    // Simulate people being served
    const serveInterval = setInterval(() => {
      setServiceLocations((prev) => {
        // Process each service
        return prev.map((service) => {
          // Skip if queue is empty
          if (service.queueLength === 0) return service

          // Calculate service probability based on service rate
          // Faster service rate = higher probability of serving someone
          const baseServiceProbability = 1 / (service.servingRate * 2)
          const adjustedProbability = baseServiceProbability * service.serviceEfficiency

          if (Math.random() > adjustedProbability) return service

          // Serve 1 person
          const personName = generateRandomName()

          // Add to queue updates for animation
          const newUpdate = {
            id: service.id,
            type: "leave",
            change: 1,
          }
          setQueueUpdates((updates) => [...updates, newUpdate])

          // Add to activity log
          const newActivity = {
            id: service.id,
            message: `${personName} was served at ${service.name}`,
            timestamp: Date.now(),
          }
          setActivityLog((log) => [newActivity, ...log].slice(0, 20))

          // Show toast for selected service
          if (selectedService?.id === service.id) {
            toast({
              title: "Queue Update",
              description: `${personName} has been served at ${service.name}`,
              variant: "default",
            })
          }

          // Add to service activity
          const newServiceActivity: QueueActivity = {
            id: crypto.randomUUID(),
            type: "leave",
            timestamp: Date.now(),
            personName,
          }

          // Calculate new wait time
          const newQueueLength = Math.max(0, service.queueLength - 1)
          const newEstimatedWait = Math.ceil((newQueueLength * service.servingRate * service.serviceEfficiency) / 3)

          return {
            ...service,
            queueLength: newQueueLength,
            estimatedWait: newEstimatedWait,
            lastUpdated: Date.now(),
            activity: [newServiceActivity, ...service.activity].slice(0, 10),
          }
        })
      })
    }, 3000) // Every 3 seconds

    // Clean up queue updates after animation
    const cleanupInterval = setInterval(() => {
      setQueueUpdates([])
    }, 2000)

    return () => {
      clearInterval(joinInterval)
      clearInterval(serveInterval)
      clearInterval(cleanupInterval)
      clearInterval(efficiencyInterval)
    }
  }, [selectedService, toast])

  // Handle menu item selection
  const handleMenuItemSelect = (itemId: string) => {
    setSelectedMenuItems((prev) => {
      // Check if item is already selected
      const existingItem = prev.find((item) => item.id === itemId)

      if (existingItem) {
        // Increment quantity if already selected
        return prev.map((item) => (item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        // Add new item with quantity 1
        return [...prev, { id: itemId, quantity: 1 }]
      }
    })
  }

  // Handle menu item quantity change
  const handleMenuItemQuantityChange = (itemId: string, change: number) => {
    setSelectedMenuItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === itemId) {
            const newQuantity = Math.max(0, item.quantity + change)
            return { ...item, quantity: newQuantity }
          }
          return item
        })
        .filter((item) => item.quantity > 0) // Remove items with quantity 0
    })
  }

  // Calculate total price of selected items
  const calculateTotalPrice = (): number => {
    if (!selectedService || !selectedMenuItems.length) return 0

    return selectedMenuItems.reduce((total, selectedItem) => {
      const menuItem = selectedService.menuItems?.find((item) => item.id === selectedItem.id)
      if (menuItem) {
        return total + menuItem.price * selectedItem.quantity
      }
      return total
    }, 0)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (!username) {
      setError("Please enter your username")
      return
    }

    if (!password) {
      setError("Please enter your password")
      return
    }

    if (!selectedService) {
      setError("Please select a service to join")
      return
    }

    setIsLoading(true)
    setError("")

    // Create user data to save
    const userData = {
      name: username,
      joinedAt: Date.now(),
      paymentStatus: selectedMenuItems.length > 0 ? "unpaid" : "no-payment-needed",
      totalAmount: calculateTotalPrice(),
    }

    // Save selected service, menu items, and user data to localStorage
    const serviceWithSelectedItems = {
      ...selectedService,
      selectedItems: selectedMenuItems,
      userData: userData,
    }
    localStorage.setItem("selectedService", JSON.stringify(serviceWithSelectedItems))

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false)
      router.push("/")
    }, 1500)
  }

  // Navigate to create store page
  const handleCreateStore = () => {
    router.push("/create-store")
  }

  // Filter services based on search term
  const filteredServices = searchTerm
    ? serviceLocations.filter(
        (service) =>
          service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : serviceLocations

  // Liquid animation for the selected service
  const LiquidAnimation = () => {
    if (!selectedService) return null

    // Different animations based on service type
    if (selectedService.type === "drinks") {
      if (selectedService.name.includes("Whisky") || selectedService.name.includes("Bourbon")) {
        return (
          <div className="relative h-20 w-16 mx-auto">
            <div className="absolute inset-0 flex items-center justify-center">
              <GlassWater className={`h-16 w-16 text-gray-300`} />
            </div>
            <div
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-b-lg transition-all duration-500 ease-in-out`}
              style={{ height: `${30 + liquidLevel * 0.3}%` }}
            ></div>
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-1 bg-amber-500"
              animate={{
                height: [0, 10, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                repeatDelay: 3,
              }}
            />
          </div>
        )
      } else if (selectedService.name.includes("Beer") || selectedService.name.includes("Brewery")) {
        return (
          <div className="relative h-20 w-16 mx-auto">
            <div className="absolute inset-0 flex items-center justify-center">
              <Beer className={`h-16 w-16 text-gray-300`} />
            </div>
            <div
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-b from-yellow-200 to-yellow-500 rounded-b-lg transition-all duration-500 ease-in-out`}
              style={{ height: `${20 + liquidLevel * 0.5}%` }}
            ></div>
            <div
              className="absolute left-0 right-0 bg-white transition-all duration-300 ease-in-out"
              style={{
                height: `${Math.max(0, Math.min(15, liquidLevel * 0.15))}%`,
                bottom: `${20 + liquidLevel * 0.5}%`,
              }}
            ></div>
          </div>
        )
      } else if (selectedService.name.includes("Coffee")) {
        return (
          <div className="relative h-20 w-16 mx-auto">
            <div className="absolute inset-0 flex items-center justify-center">
              <Coffee className={`h-16 w-16 text-gray-300`} />
            </div>
            <div
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-r from-yellow-800 to-yellow-900 rounded-b-lg transition-all duration-500 ease-in-out`}
              style={{ height: `${20 + liquidLevel * 0.4}%` }}
            ></div>
            <motion.div
              className="absolute top-1/4 left-1/4 h-1 w-1 rounded-full bg-white opacity-80"
              animate={{
                y: [0, 3, 0],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </div>
        )
      } else {
        return (
          <div className="relative h-20 w-20 mx-auto">
            <div className="absolute inset-0 flex items-center justify-center">
              <Martini className={`h-16 w-16 text-gray-300`} />
            </div>
            <div
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-r from-teal-400 to-teal-500 rounded-b-full transition-all duration-500 ease-in-out`}
              style={{ height: `${20 + liquidLevel * 0.4}%` }}
            ></div>
            <motion.div
              className="absolute top-1/4 left-1/4 h-2 w-2 rounded-full bg-white opacity-70"
              animate={{
                y: [0, 5, 0],
                opacity: [0.7, 0.9, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </div>
        )
      }
    } else {
      // Generic animation for non-drink services
      return (
        <div className="relative h-20 w-20 mx-auto flex items-center justify-center">
          <div
            className={`h-16 w-16 rounded-full ${getColorClass(selectedService.color, "bg")} flex items-center justify-center`}
          >
            {React.cloneElement(selectedService.icon as React.ReactElement, {
              className: `h-10 w-10 ${getColorClass(selectedService.color, "text")}`,
            })}
          </div>
          <motion.div
            className={`absolute inset-0 rounded-full ${getColorClass(selectedService.color, "border")} border-2 opacity-70`}
            animate={{ scale: [1, 1.1, 1], opacity: [0.7, 0.2, 0.7] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </div>
      )
    }
  }

  // Get queue update animation for a service
  const getQueueUpdateAnimation = (serviceId: string) => {
    const updates = queueUpdates.filter((update) => update.id === serviceId)
    if (updates.length === 0) return null

    return updates.map((update, index) => {
      const isJoin = update.type === "join"

      return (
        <motion.div
          key={`${serviceId}-${update.type}-${index}`}
          initial={{ opacity: 0, y: isJoin ? 20 : 0, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: isJoin ? 0 : -20, scale: 0.8 }}
          className={`absolute right-2 ${isJoin ? "bottom-2" : "top-2"} px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 z-10
            ${
              isJoin
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
            }`}
        >
          {isJoin ? (
            <>
              <UserPlus className="h-3 w-3" />
              <span>+{update.change}</span>
            </>
          ) : (
            <>
              <UserCheck className="h-3 w-3" />
              <span>-{update.change}</span>
            </>
          )}
        </motion.div>
      )
    })
  }

  // Get wait time change indicator
  const getWaitTimeIndicator = (service: ServiceLocation) => {
    const previousService = serviceLocations.find((s) => s.id === service.id)
    if (!previousService) return null

    // Check if wait time has changed in the last minute
    const hasRecentChange = Date.now() - service.lastUpdated < 60000
    if (!hasRecentChange) return null

    const previousWaitTime = previousService.estimatedWait
    const currentWaitTime = service.estimatedWait

    if (previousWaitTime === currentWaitTime) return null

    const isIncreasing = currentWaitTime > previousWaitTime

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`ml-1 ${isIncreasing ? "text-red-500 dark:text-red-400" : "text-green-500 dark:text-green-400"}`}
      >
        {isIncreasing ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <ToastProvider>
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Virtual Queue System</h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Browse available services and join a virtual line
                  </p>
                </div>
                <Button
                  onClick={handleCreateStore}
                  className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Store</span>
                </Button>
              </div>
            </motion.div>
          </header>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left side - Service listings (70%) */}
            <motion.div
              className="lg:w-[70%]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="overflow-hidden border-none shadow-lg">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600" />
                <CardHeader className="bg-gradient-to-r from-teal-50 to-gray-50 dark:from-gray-800 dark:to-gray-900">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl text-gray-800 dark:text-gray-100">Available Services</CardTitle>
                    <div className="relative">
                      <Input
                        placeholder="Search services..."
                        className="w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Select a service to join its virtual queue
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <AnimatePresence>
                        {filteredServices.map((service) => (
                          <motion.div
                            key={service.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedService(service)}
                            className={`cursor-pointer rounded-lg border relative ${
                              selectedService?.id === service.id
                                ? `${getColorClass(service.color, "border")} ring-2 ring-offset-2 ${getColorClass(
                                    service.color,
                                    "text",
                                  ).replace("text", "ring")}`
                                : "border-gray-200 dark:border-gray-700"
                            } overflow-hidden transition-all duration-200`}
                          >
                            <div
                              className={`p-4 ${
                                selectedService?.id === service.id
                                  ? getColorClass(service.color, "bg")
                                  : "bg-white dark:bg-gray-800"
                              }`}
                            >
                              {/* Queue update animations */}
                              <AnimatePresence>{getQueueUpdateAnimation(service.id)}</AnimatePresence>

                              <div className="flex items-start gap-4">
                                <div
                                  className={`p-3 rounded-full ${getColorClass(service.color, "bg")} ${getColorClass(
                                    service.color,
                                    "border",
                                  )}`}
                                >
                                  {getColoredIcon(service)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{service.name}</h3>
                                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {service.description}
                                      </p>
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className={`${getColorClass(service.color, "bg")} ${getColorClass(
                                        service.color,
                                        "text",
                                      )} border-none`}
                                    >
                                      {service.type}
                                    </Badge>
                                  </div>

                                  <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                                    <motion.div
                                      className="flex flex-col"
                                      animate={{
                                        scale: queueUpdates.some((u) => u.id === service.id) ? [1, 1.05, 1] : 1,
                                      }}
                                      transition={{ duration: 0.3 }}
                                    >
                                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                        <Users className="h-3.5 w-3.5" />
                                        <span>Queue Size</span>
                                      </div>
                                      <span className="font-medium text-gray-900 dark:text-gray-100">
                                        {service.queueLength} people
                                      </span>
                                    </motion.div>
                                    <div className="flex flex-col">
                                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                        <Timer className="h-3.5 w-3.5" />
                                        <span>Service Rate</span>
                                      </div>
                                      <span className="font-medium text-gray-900 dark:text-gray-100">
                                        {service.servingRate.toFixed(1)} min/person
                                      </span>
                                    </div>
                                    <div className="flex flex-col">
                                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>Est. Wait</span>
                                      </div>
                                      <div className="flex items-center">
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                          {service.estimatedWait} min
                                        </span>
                                        {getWaitTimeIndicator(service)}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mt-4 flex justify-between items-center">
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      {service.openTime} - {service.closeTime}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="text-xs text-gray-500 dark:text-gray-400">
                                        Updated {formatTimeAgo(service.lastUpdated)}
                                      </div>
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <div className="flex items-center">
                                              <div className="flex">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                  <Sparkles
                                                    key={i}
                                                    className={`h-3.5 w-3.5 ${
                                                      i < Math.ceil(service.popularity / 2)
                                                        ? getColorClass(service.color, "text")
                                                        : "text-gray-300 dark:text-gray-600"
                                                    }`}
                                                  />
                                                ))}
                                              </div>
                                            </div>
                                          </TooltipTrigger>
                                          <TooltipContent side="top">
                                            <p>Popularity: {service.popularity}/10</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Activity Feed */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6"
              >
                <Card className="border-none shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bell className="h-4 w-4 text-teal-600" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[150px]">
                      <div className="space-y-3">
                      <AnimatePresence initial={false}>
                        {activityLog.map((activity, index) => {
                          //console.log(`KEY CHECK ${index}:`, `${activity.id}-${activity.timestamp}`);
                          return (
                            <motion.div
                              key={`${activity.id}-${activity.timestamp}-${index}`}
                              initial={{ opacity: 0, y: -10, height: 0 }}
                              animate={{ opacity: 1, y: 0, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="flex items-center gap-2 text-sm"
                            >
                              <div className="w-16 text-xs text-gray-500 dark:text-gray-400">
                                {formatTimeAgo(activity.timestamp)}
                              </div>
                              <div className="flex-1 text-gray-700 dark:text-gray-300">
                                {activity.message}
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>


                        {activityLog.length === 0 && (
                          <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                            No recent activity
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Right side - Login form (30%) */}
            <motion.div
              className="lg:w-[30%]"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="overflow-hidden border-none shadow-lg sticky top-8">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600" />
                <CardHeader className="bg-gradient-to-r from-teal-50 to-gray-50 dark:from-gray-800 dark:to-gray-900">
                  <CardTitle className="text-xl text-gray-800 dark:text-gray-100">Join Queue</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Sign in to join the selected virtual line
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-6">
                  <AnimatePresence mode="wait">
                    {selectedService ? (
                      <motion.div
                        key="selected-service"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="mb-6"
                      >
                        <div
                          className={`p-4 rounded-lg ${getColorClass(selectedService.color, "bg")} ${getColorClass(
                            selectedService.color,
                            "border",
                          )} border`}
                        >
                          <div className="flex items-center gap-4">
                            <LiquidAnimation />
                            <div>
                              <h3 className={`font-medium ${getColorClass(selectedService.color, "text")}`}>
                                {selectedService.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedService.address}</p>
                              <div className="mt-2 flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className={`${getColorClass(selectedService.color, "bg")} border-none`}
                                >
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span className={getColorClass(selectedService.color, "text")}>
                                    ~{selectedService.estimatedWait} min wait
                                  </span>
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={`${getColorClass(selectedService.color, "bg")} border-none`}
                                >
                                  <Users className="h-3 w-3 mr-1" />
                                  <span className={getColorClass(selectedService.color, "text")}>
                                    {selectedService.queueLength} in line
                                  </span>
                                </Badge>
                              </div>

                              {/* Menu Items Selection */}
                              {selectedService.menuItems && selectedService.menuItems.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Select items:</p>
                                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                    {selectedService.menuItems.map((item) => {
                                      const selectedItem = selectedMenuItems.find((si) => si.id === item.id)
                                      const quantity = selectedItem?.quantity || 0

                                      return (
                                        <div
                                          key={item.id}
                                          className="flex items-center justify-between p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                                        >
                                          <div className="flex items-center gap-2">
                                            <div
                                              className={`p-1.5 rounded-full ${getColorClass(selectedService.color, "bg")}`}
                                            >
                                              {typeof item.icon === "object" && React.isValidElement(item.icon) ? (
                                                React.cloneElement(item.icon as React.ReactElement, {
                                                  className: `h-3.5 w-3.5 ${getColorClass(selectedService.color, "text")}`,
                                                })
                                              ) : (
                                                <Info
                                                  className={`h-3.5 w-3.5 ${getColorClass(selectedService.color, "text")}`}
                                                />
                                              )}
                                            </div>
                                            <div>
                                              <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                                                {item.name}
                                              </p>
                                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatPrice(item.price)}
                                              </p>
                                            </div>
                                          </div>

                                          <div className="flex items-center gap-1">
                                            {quantity > 0 ? (
                                              <>
                                                <Button
                                                  variant="outline"
                                                  size="icon"
                                                  className="h-6 w-6"
                                                  onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleMenuItemQuantityChange(item.id, -1)
                                                  }}
                                                >
                                                  <ArrowDown className="h-3 w-3" />
                                                </Button>
                                                <span className="w-6 text-center text-xs">{quantity}</span>
                                                <Button
                                                  variant="outline"
                                                  size="icon"
                                                  className="h-6 w-6"
                                                  onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleMenuItemQuantityChange(item.id, 1)
                                                  }}
                                                >
                                                  <Plus className="h-3 w-3" />
                                                </Button>
                                              </>
                                            ) : (
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-6 text-xs px-2"
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  handleMenuItemSelect(item.id)
                                                }}
                                              >
                                                Add
                                              </Button>
                                            )}
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>

                                  {selectedMenuItems.length > 0 && (
                                    <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                                      <div className="flex justify-between items-center text-sm font-medium">
                                        <span className="text-gray-700 dark:text-gray-300">Total:</span>
                                        <span className={`${getColorClass(selectedService.color, "text")}`}>
                                          {formatPrice(calculateTotalPrice())}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Recent activity for selected service */}
                              {selectedService.activity.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Recent activity:</p>
                                  <div className="space-y-1">
                                    {selectedService.activity.slice(0, 3).map((activity) => (
                                      <div key={activity.id} className="text-xs flex items-center gap-1">
                                        {activity.type === "join" ? (
                                          <UserPlus className="h-3 w-3 text-green-500 dark:text-green-400" />
                                        ) : (
                                          <UserCheck className="h-3 w-3 text-blue-500 dark:text-blue-400" />
                                        )}
                                        <span className="text-gray-600 dark:text-gray-400">
                                          {activity.type === "join" ? "Joined" : "Served"}: {activity.personName}
                                        </span>
                                        <span className="text-gray-400 dark:text-gray-500">
                                          ({formatTimeAgo(activity.timestamp)})
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="no-selection"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center gap-3">
                          <Info className="h-5 w-5 text-teal-500" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Please select a service from the list to join its virtual queue
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleLogin}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">
                          Username
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                          <Input
                            id="username"
                            placeholder="Enter your username"
                            className="pl-10"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                          <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            className="pl-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                      </div>

                      {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                          {error}
                        </div>
                      )}
                    </div>
                  </form>
                </CardContent>

                <CardFooter className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-4">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white gap-2"
                    onClick={handleLogin}
                    disabled={isLoading || !selectedService}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="h-4 w-4 border-2 border-white border-opacity-30 border-t-white rounded-full"
                        />
                        <span>Joining Queue...</span>
                      </div>
                    ) : (
                      <>
                        {selectedMenuItems.length > 0 ? (
                          <>
                            <LogIn className="h-4 w-4" />
                            <span>Join Queue & Choose Payment</span>
                          </>
                        ) : (
                          <>
                            <LogIn className="h-4 w-4" />
                            <span>{selectedService ? "Join Virtual Queue" : "Select a Service First"}</span>
                          </>
                        )}
                      </>
                    )}
                  </Button>

                  <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Don't have an account?{" "}
                    <a href="#" className="text-teal-600 dark:text-teal-400 hover:underline">
                      Sign up
                    </a>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
        <ToastViewport />
      </ToastProvider>
    </div>
  )
}
