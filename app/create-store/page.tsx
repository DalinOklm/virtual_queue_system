"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Martini,
  GlassWater,
  Beer,
  Wine,
  Coffee,
  Car,
  Utensils,
  Pizza,
  BeefIcon as Burger,
  Sandwich,
  Soup,
  IceCream,
  Salad,
  Stethoscope,
  Scissors,
  ShoppingBag,
  Ticket,
  Save,
  ArrowLeft,
  Clock,
  MapPin,
  Users,
  Timer,
  Info,
  AlertCircle,
  Check,
  Store,
  Dumbbell,
  Shirt,
  Laptop,
  Smartphone,
  Gamepad,
  Popcorn,
  Film,
  Music,
  SpadeIcon as Spa,
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
  Plus,
  Trash2,
  Edit,
  DollarSign,
  FileText,
  ShoppingBasket,
} from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToastProvider, ToastViewport } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

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
  activity: any[] // recent activity
  serviceEfficiency: number // 0.5-1.5 multiplier for service rate (random variations)
  menuItems?: MenuItem[] // Menu items for the store
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

// Get colored icon
const getColoredIcon = (icon: React.ReactNode, color: string) => {
  const className = `h-5 w-5 ${getColorClass(color, "text")}`
  return React.cloneElement(icon as React.ReactElement, { className })
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
    burger: <Burger className="h-5 w-5" />,
    sandwich: <Sandwich className="h-5 w-5" />,
    soup: <Soup className="h-5 w-5" />,
    icecream: <IceCream className="h-5 w-5" />,
    salad: <Salad className="h-5 w-5" />,
  },
  service: {
    general: <Scissors className="h-5 w-5" />,
    car: <Car className="h-5 w-5" />,
    spa: <Spa className="h-5 w-5" />,
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
      { name: "burger", icon: <Burger className="h-5 w-5" /> },
      { name: "sandwich", icon: <Sandwich className="h-5 w-5" /> },
      { name: "soup", icon: <Soup className="h-5 w-5" /> },
      { name: "icecream", icon: <IceCream className="h-5 w-5" /> },
      { name: "salad", icon: <Salad className="h-5 w-5" /> },
    ],
    service: [
      { name: "general", icon: <Scissors className="h-5 w-5" /> },
      { name: "car", icon: <Car className="h-5 w-5" /> },
      { name: "spa", icon: <Spa className="h-5 w-5" /> },
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

// Format price to currency
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price)
}

export default function CreateStorePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("basic")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isMenuItemDialogOpen, setIsMenuItemDialogOpen] = useState(false)
  const [currentMenuItem, setCurrentMenuItem] = useState<Partial<MenuItem> & { index?: number }>({
    name: "",
    description: "",
    price: 0,
    iconName: "general",
  })
  const [isEditingMenuItem, setIsEditingMenuItem] = useState(false)

  // Form state
  const [storeData, setStoreData] = useState<Partial<ServiceLocation> & { selectedIconName?: string }>({
    name: "",
    type: "drinks",
    description: "",
    servingRate: 5,
    color: "teal",
    address: "",
    openTime: "9:00 AM",
    closeTime: "5:00 PM",
    popularity: 7,
    queueLength: 0,
    estimatedWait: 0,
    lastUpdated: Date.now(),
    activity: [],
    serviceEfficiency: 1.0,
    selectedIconName: "cocktail", // Default icon name
    menuItems: [], // Initialize empty menu items array
  })

  // Update icon when type or name changes
  useEffect(() => {
    if (storeData.type) {
      // Get the icon based on type and selected icon name
      const iconName = storeData.selectedIconName || "general"
      const icon = getIconByName(iconName, storeData.type)

      setStoreData((prev) => ({
        ...prev,
        icon: icon,
      }))
    }
  }, [storeData.type, storeData.selectedIconName])

  // Update estimated wait time when queue length or serving rate changes
  useEffect(() => {
    if (storeData.queueLength !== undefined && storeData.servingRate !== undefined) {
      setStoreData((prev) => ({
        ...prev,
        estimatedWait: Math.ceil((storeData.queueLength * storeData.servingRate) / 3),
      }))
    }
  }, [storeData.queueLength, storeData.servingRate])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setStoreData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setStoreData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSliderChange = (name: string, value: number[]) => {
    setStoreData((prev) => ({ ...prev, [name]: value[0] }))
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!storeData.name) errors.name = "Store name is required"
    if (!storeData.description) errors.description = "Description is required"
    if (!storeData.address) errors.address = "Address is required"
    if (!storeData.type) errors.type = "Service type is required"
    if (!storeData.openTime) errors.openTime = "Opening time is required"
    if (!storeData.closeTime) errors.closeTime = "Closing time is required"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      // Show error toast
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Create a complete store object
    const newStore: ServiceLocation = {
      id: crypto.randomUUID(),
      name: storeData.name || "",
      type: (storeData.type as any) || "other",
      description: storeData.description || "",
      queueLength: storeData.queueLength || 0,
      servingRate: storeData.servingRate || 5,
      estimatedWait: storeData.estimatedWait || 0,
      icon: storeData.icon || getIconComponent(storeData.type || "other"),
      color: storeData.color || "teal",
      address: storeData.address || "",
      openTime: storeData.openTime || "9:00 AM",
      closeTime: storeData.closeTime || "5:00 PM",
      popularity: storeData.popularity || 7,
      lastUpdated: Date.now(),
      activity: [],
      serviceEfficiency: 1.0,
      menuItems: storeData.menuItems || [],
    }

    // Simulate API call
    setTimeout(() => {
      // Get existing stores from localStorage
      const existingStoresJson = localStorage.getItem("customStores")
      const existingStores = existingStoresJson ? JSON.parse(existingStoresJson) : []

      // Add new store
      const updatedStores = [...existingStores, newStore]

      // Save to localStorage
      localStorage.setItem("customStores", JSON.stringify(updatedStores))

      setIsSubmitting(false)
      setFormSubmitted(true)

      // Show success toast
      toast({
        title: "Store Created",
        description: "Your store has been successfully created",
        variant: "default",
      })

      // Reset form after 2 seconds
      setTimeout(() => {
        setFormSubmitted(false)
        setStoreData({
          name: "",
          type: "drinks",
          description: "",
          servingRate: 5,
          color: "teal",
          address: "",
          openTime: "9:00 AM",
          closeTime: "5:00 PM",
          popularity: 7,
          queueLength: 0,
          estimatedWait: 0,
          lastUpdated: Date.now(),
          activity: [],
          serviceEfficiency: 1.0,
          selectedIconName: "cocktail",
          menuItems: [],
        })
        setActiveTab("basic")
      }, 2000)
    }, 1500)
  }

  const goToNextTab = () => {
    if (activeTab === "basic") {
      // Validate basic info before proceeding
      const errors: Record<string, string> = {}
      if (!storeData.name) errors.name = "Store name is required"
      if (!storeData.description) errors.description = "Description is required"
      if (!storeData.type) errors.type = "Service type is required"

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors)
        return
      }

      setActiveTab("details")
    } else if (activeTab === "details") {
      // Validate details before proceeding
      const errors: Record<string, string> = {}
      if (!storeData.address) errors.address = "Address is required"
      if (!storeData.openTime) errors.openTime = "Opening time is required"
      if (!storeData.closeTime) errors.closeTime = "Closing time is required"

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors)
        return
      }

      setActiveTab("menu")
    } else if (activeTab === "menu") {
      setActiveTab("preview")
    }
  }

  const goToPreviousTab = () => {
    if (activeTab === "details") {
      setActiveTab("basic")
    } else if (activeTab === "menu") {
      setActiveTab("details")
    } else if (activeTab === "preview") {
      setActiveTab("menu")
    }
  }

  // Add a handler for icon selection
  const handleIconSelect = (iconName: string) => {
    setStoreData((prev) => ({
      ...prev,
      selectedIconName: iconName,
    }))
  }

  // Handle menu item input change
  const handleMenuItemInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === "price") {
      // Convert to number and ensure it's not negative
      const numValue = Math.max(0, Number.parseFloat(value) || 0)
      setCurrentMenuItem((prev) => ({ ...prev, [name]: numValue }))
    } else {
      setCurrentMenuItem((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Handle menu item icon selection
  const handleMenuItemIconSelect = (iconName: string) => {
    setCurrentMenuItem((prev) => ({
      ...prev,
      iconName: iconName,
      icon: getIconByName(iconName, storeData.type || "other"),
    }))
  }

  // Add or update menu item
  const handleSaveMenuItem = () => {
    if (!currentMenuItem.name || !currentMenuItem.price) {
      toast({
        title: "Validation Error",
        description: "Item name and price are required",
      })
      toast({
        title: "Validation Error",
        description: "Item name and price are required",
        variant: "destructive",
      })
      return
    }

    // Create a new menu item with an ID
    const newMenuItem: MenuItem = {
      id: currentMenuItem.id || crypto.randomUUID(),
      name: currentMenuItem.name || "",
      description: currentMenuItem.description || "",
      price: currentMenuItem.price || 0,
      iconName: currentMenuItem.iconName || "general",
      icon: getIconByName(currentMenuItem.iconName || "general", storeData.type || "other") || (
        <Info className="h-5 w-5" />
      ),
    }

    // Add or update the menu item
    if (isEditingMenuItem && currentMenuItem.index !== undefined) {
      // Update existing item
      setStoreData((prev) => {
        const updatedMenuItems = [...(prev.menuItems || [])]
        updatedMenuItems[currentMenuItem.index] = newMenuItem
        return { ...prev, menuItems: updatedMenuItems }
      })
    } else {
      // Add new item
      setStoreData((prev) => ({
        ...prev,
        menuItems: [...(prev.menuItems || []), newMenuItem],
      }))
    }

    // Reset current menu item and close dialog
    setCurrentMenuItem({
      name: "",
      description: "",
      price: 0,
      iconName: "general",
    })
    setIsEditingMenuItem(false)
    setIsMenuItemDialogOpen(false)

    // Show success toast
    toast({
      title: isEditingMenuItem ? "Item Updated" : "Item Added",
      description: isEditingMenuItem ? "Menu item has been updated" : "Menu item has been added to your store",
      variant: "default",
    })
  }

  // Edit menu item
  const handleEditMenuItem = (item: MenuItem, index: number) => {
    setCurrentMenuItem({
      ...item,
      index,
    })
    setIsEditingMenuItem(true)
    setIsMenuItemDialogOpen(true)
  }

  // Delete menu item
  const handleDeleteMenuItem = (index: number) => {
    setStoreData((prev) => {
      const updatedMenuItems = [...(prev.menuItems || [])]
      updatedMenuItems.splice(index, 1)
      return { ...prev, menuItems: updatedMenuItems }
    })

    toast({
      title: "Item Removed",
      description: "Menu item has been removed from your store",
      variant: "default",
    })
  }

  // Open dialog to add new menu item
  const handleAddMenuItem = () => {
    setCurrentMenuItem({
      name: "",
      description: "",
      price: 0,
      iconName: "general",
      icon: getIconByName("general", storeData.type || "other"),
    })
    setIsEditingMenuItem(false)
    setIsMenuItemDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <ToastProvider>
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push("/login")} className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Create Your Store</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Add your business to our virtual queue system</p>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <Card className="border-none shadow-lg overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600" />
                <CardHeader className="bg-gradient-to-r from-teal-50 to-gray-50 dark:from-gray-800 dark:to-gray-900">
                  <CardTitle className="text-xl text-gray-800 dark:text-gray-100">Store Information</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Fill in the details about your business
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-6">
                      <TabsTrigger value="basic">Basic Info</TabsTrigger>
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="menu">Menu Items</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic">
                      <form className="space-y-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                              Store Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="name"
                              name="name"
                              placeholder="Enter your store name"
                              value={storeData.name}
                              onChange={handleInputChange}
                              className={cn(formErrors.name && "border-red-500")}
                            />
                            {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                          </div>

                          <div>
                            <Label htmlFor="type" className="text-gray-700 dark:text-gray-300">
                              Service Type <span className="text-red-500">*</span>
                            </Label>
                            <Select value={storeData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                              <SelectTrigger className={cn(formErrors.type && "border-red-500")}>
                                <SelectValue placeholder="Select service type" />
                              </SelectTrigger>
                              <SelectContent>
                                {serviceTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {formErrors.type && <p className="text-red-500 text-sm mt-1">{formErrors.type}</p>}
                          </div>

                          <div>
                            <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">
                              Description <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                              id="description"
                              name="description"
                              placeholder="Describe your business"
                              value={storeData.description}
                              onChange={handleInputChange}
                              className={cn("resize-none h-24", formErrors.description && "border-red-500")}
                            />
                            {formErrors.description && (
                              <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="color" className="text-gray-700 dark:text-gray-300">
                              Brand Color
                            </Label>
                            <Select
                              value={storeData.color}
                              onValueChange={(value) => handleSelectChange("color", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a color" />
                              </SelectTrigger>
                              <SelectContent>
                                {colorOptions.map((color) => (
                                  <SelectItem key={color.value} value={color.value}>
                                    <div className="flex items-center gap-2">
                                      <div className={`w-4 h-4 rounded-full ${getColorClass(color.value, "bg")}`}></div>
                                      <span>{color.label}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </form>
                    </TabsContent>

                    <TabsContent value="details">
                      <form className="space-y-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="address" className="text-gray-700 dark:text-gray-300">
                              Address <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="address"
                              name="address"
                              placeholder="Enter your store address"
                              value={storeData.address}
                              onChange={handleInputChange}
                              className={cn(formErrors.address && "border-red-500")}
                            />
                            {formErrors.address && <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="openTime" className="text-gray-700 dark:text-gray-300">
                                Opening Time <span className="text-red-500">*</span>
                              </Label>
                              <Select
                                value={storeData.openTime}
                                onValueChange={(value) => handleSelectChange("openTime", value)}
                              >
                                <SelectTrigger className={cn(formErrors.openTime && "border-red-500")}>
                                  <SelectValue placeholder="Select opening time" />
                                </SelectTrigger>
                                <SelectContent>
                                  {timeOptions.map((time) => (
                                    <SelectItem key={time.value} value={time.value}>
                                      {time.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {formErrors.openTime && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.openTime}</p>
                              )}
                            </div>

                            <div>
                              <Label htmlFor="closeTime" className="text-gray-700 dark:text-gray-300">
                                Closing Time <span className="text-red-500">*</span>
                              </Label>
                              <Select
                                value={storeData.closeTime}
                                onValueChange={(value) => handleSelectChange("closeTime", value)}
                              >
                                <SelectTrigger className={cn(formErrors.closeTime && "border-red-500")}>
                                  <SelectValue placeholder="Select closing time" />
                                </SelectTrigger>
                                <SelectContent>
                                  {timeOptions.map((time) => (
                                    <SelectItem key={time.value} value={time.value}>
                                      {time.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {formErrors.closeTime && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.closeTime}</p>
                              )}
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="servingRate" className="text-gray-700 dark:text-gray-300">
                              Service Rate (minutes per customer)
                            </Label>
                            <div className="pt-2">
                              <Slider
                                defaultValue={[storeData.servingRate || 5]}
                                min={1}
                                max={30}
                                step={0.5}
                                onValueChange={(value) => handleSliderChange("servingRate", value)}
                              />
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Fast (1 min)</span>
                                <span>Current: {storeData.servingRate} min</span>
                                <span>Slow (30 min)</span>
                              </div>
                            </div>
                          </div>

                          <IconSelector
                            type={storeData.type || "drinks"}
                            selectedIcon={storeData.selectedIconName || "cocktail"}
                            onSelectIcon={handleIconSelect}
                          />
                        </div>
                      </form>
                    </TabsContent>

                    <TabsContent value="menu">
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Menu Items</h3>
                          <Button onClick={handleAddMenuItem} className="gap-2">
                            <Plus className="h-4 w-4" />
                            <span>Add Item</span>
                          </Button>
                        </div>

                        {storeData.menuItems && storeData.menuItems.length > 0 ? (
                          <div className="space-y-4">
                            {storeData.menuItems.map((item, index) => (
                              <div
                                key={item.id}
                                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`p-2 rounded-full ${getColorClass(storeData.color || "teal", "bg")}`}>
                                    {getColoredIcon(item.icon, storeData.color || "teal")}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{item.name}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                          {item.description || "No description"}
                                        </p>
                                      </div>
                                      <Badge
                                        variant="outline"
                                        className={`${getColorClass(storeData.color || "teal", "bg")} border-none`}
                                      >
                                        <DollarSign className="h-3 w-3 mr-1" />
                                        <span className={getColorClass(storeData.color || "teal", "text")}>
                                          {formatPrice(item.price)}
                                        </span>
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleEditMenuItem(item, index)}
                                      className="h-8 w-8"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDeleteMenuItem(index)}
                                      className="h-8 w-8 text-red-500 hover:text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
                            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                              <FileText className="h-6 w-6 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No menu items yet</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-1 mb-4">
                              Add items that customers can select and pay for when joining the queue
                            </p>
                            <Button onClick={handleAddMenuItem} variant="outline" className="gap-2">
                              <Plus className="h-4 w-4" />
                              <span>Add Your First Item</span>
                            </Button>
                          </div>
                        )}

                        <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800 p-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300">
                              <ShoppingBasket className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-gray-100">Why Add Menu Items?</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Adding menu items allows customers to select and pay for items when joining your queue,
                                reducing wait times and improving service efficiency.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="preview">
                      <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                          <div className="flex items-start gap-4">
                            <div
                              className={`p-3 rounded-full ${getColorClass(storeData.color || "teal", "bg")} ${getColorClass(
                                storeData.color || "teal",
                                "border",
                              )}`}
                            >
                              {storeData.icon && getColoredIcon(storeData.icon, storeData.color || "teal")}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                    {storeData.name || "Your Store Name"}
                                  </h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {storeData.description || "Your store description will appear here"}
                                  </p>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={`${getColorClass(storeData.color || "teal", "bg")} ${getColorClass(
                                    storeData.color || "teal",
                                    "text",
                                  )} border-none`}
                                >
                                  {storeData.type || "service"}
                                </Badge>
                              </div>

                              <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                    <Users className="h-3.5 w-3.5" />
                                    <span>Queue Size</span>
                                  </div>
                                  <span className="font-medium text-gray-900 dark:text-gray-100">
                                    {storeData.queueLength || 0} people
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                    <Timer className="h-3.5 w-3.5" />
                                    <span>Service Rate</span>
                                  </div>
                                  <span className="font-medium text-gray-900 dark:text-gray-100">
                                    {storeData.servingRate?.toFixed(1) || "5.0"} min/person
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>Est. Wait</span>
                                  </div>
                                  <span className="font-medium text-gray-900 dark:text-gray-100">
                                    {storeData.estimatedWait || 0} min
                                  </span>
                                </div>
                              </div>

                              <div className="mt-4 flex justify-between items-center">
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {storeData.openTime || "9:00 AM"} - {storeData.closeTime || "5:00 PM"}
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    <MapPin className="h-3 w-3 inline mr-1" />
                                    {storeData.address || "Your address"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items Preview */}
                        {storeData.menuItems && storeData.menuItems.length > 0 && (
                          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Menu Items</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {storeData.menuItems.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-700"
                                >
                                  <div className={`p-2 rounded-full ${getColorClass(storeData.color || "teal", "bg")}`}>
                                    {typeof item.icon === "object" && React.isValidElement(item.icon) ? (
                                      getColoredIcon(item.icon, storeData.color || "teal")
                                    ) : (
                                      <Info className={`h-5 w-5 ${getColorClass(storeData.color || "teal", "text")}`} />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                      {item.name}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                      {item.description || "No description"}
                                    </p>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className={`${getColorClass(storeData.color || "teal", "bg")} border-none`}
                                  >
                                    <span className={getColorClass(storeData.color || "teal", "text")}>
                                      {formatPrice(item.price)}
                                    </span>
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300">
                              <Info className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-gray-100">Ready to Launch?</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Review your store details above. Once submitted, your store will be available for
                                customers to join the queue and order items.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-between">
                  {activeTab !== "basic" ? (
                    <Button variant="outline" onClick={goToPreviousTab}>
                      Back
                    </Button>
                  ) : (
                    <div></div>
                  )}

                  {activeTab !== "preview" ? (
                    <Button onClick={goToNextTab}>Continue</Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || formSubmitted}
                      className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="h-4 w-4 border-2 border-white border-opacity-30 border-t-white rounded-full"
                          />
                          <span>Creating Store...</span>
                        </div>
                      ) : formSubmitted ? (
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4" />
                          <span>Store Created!</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Save className="h-4 w-4" />
                          <span>Create Store</span>
                        </div>
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>

            {/* Info Section */}
            <div>
              <Card className="border-none shadow-lg overflow-hidden sticky top-8">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600" />
                <CardHeader className="bg-gradient-to-r from-teal-50 to-gray-50 dark:from-gray-800 dark:to-gray-900">
                  <CardTitle className="text-xl text-gray-800 dark:text-gray-100">Store Owner Guide</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Tips for setting up your virtual queue
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300">
                        <AlertCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">Why Join?</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Our virtual queue system helps you manage customer flow, reduce wait times, and improve
                          customer satisfaction.
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">Benefits</h3>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-teal-500 mt-0.5" />
                          <span>Reduce physical lines and crowding</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-teal-500 mt-0.5" />
                          <span>Customers can join remotely and arrive when it's their turn</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-teal-500 mt-0.5" />
                          <span>Pre-orders with payment reduce service time</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-teal-500 mt-0.5" />
                          <span>Collect valuable data on service times and customer flow</span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">Tips for Success</h3>
                      <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                        <p>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Menu Items:</span> Add your
                          most popular items with clear descriptions and accurate prices.
                        </p>
                        <p>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Service Rate:</span> Be
                          realistic about how long it takes to serve each customer.
                        </p>
                        <p>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Hours:</span> Keep your opening
                          hours updated to manage customer expectations.
                        </p>
                      </div>
                    </div>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full">
                          Need Help?
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="font-medium">Contact Support</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            If you need assistance setting up your store, our support team is available 24/7.
                          </p>
                          <div className="pt-2">
                            <Button size="sm" className="w-full">
                              Contact Support
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Menu Item Dialog */}
        <Dialog open={isMenuItemDialogOpen} onOpenChange={setIsMenuItemDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{isEditingMenuItem ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
              <DialogDescription>
                {isEditingMenuItem
                  ? "Update the details of this menu item"
                  : "Add an item that customers can select when joining the queue"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="item-name" className="text-gray-700 dark:text-gray-300">
                  Item Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="item-name"
                  name="name"
                  placeholder="Enter item name"
                  value={currentMenuItem.name}
                  onChange={handleMenuItemInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-description" className="text-gray-700 dark:text-gray-300">
                  Description
                </Label>
                <Textarea
                  id="item-description"
                  name="description"
                  placeholder="Describe this item"
                  value={currentMenuItem.description}
                  onChange={handleMenuItemInputChange}
                  className="resize-none h-20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-price" className="text-gray-700 dark:text-gray-300">
                  Price <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="item-price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={currentMenuItem.price}
                    onChange={handleMenuItemInputChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <IconSelector
                  type={storeData.type || "drinks"}
                  selectedIcon={currentMenuItem.iconName || "general"}
                  onSelectIcon={handleMenuItemIconSelect}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSaveMenuItem}>{isEditingMenuItem ? "Update Item" : "Add Item"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <ToastViewport />
      </ToastProvider>
    </div>
  )
}
