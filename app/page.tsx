"use client"

import { CardContent } from "@/components/ui/card"

import { CardFooter } from "@/components/ui/card"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Martini,
  GlassWater,
  Beer,
  LogOut,
  User,
  Clock,
  Utensils,
  Coffee,
  Stethoscope,
  Scissors,
  ShoppingBag,
  Ticket,
  GripVertical,
  MoreHorizontal,
  RefreshCw,
  Settings,
  CreditCard,
  Banknote,
  Check,
  AlertTriangle,
  Smartphone,
  UserCog,
  type LucideIcon,
  Shield,
} from "lucide-react"
import { motion, Reorder, useDragControls } from "framer-motion"
import { Card, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ToastProvider } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Service/Store type
type ServiceLocation = {
  id: string
  name: string
  type: "drinks" | "food" | "service" | "healthcare" | "retail" | "entertainment" | "other"
  description: string
  queueLength: number
  servingRate: number // minutes per customer
  estimatedWait: number
  iconName: string // Store icon name instead of React element
  color: string
  address: string
  openTime: string
  closeTime: string
  popularity: number // 1-10 scale
  lastUpdated: number // timestamp of last update
  activity: QueueActivity[] // recent activity
  serviceEfficiency: number // 0.5-1.5 multiplier for service rate (random variations)
  menuItems?: MenuItem[] // Optional menu items
  userData?: {
    name: string
    joinedAt?: number
    paymentStatus?: "unpaid" | "paid-online" | "pay-at-counter" | "no-payment-needed"
    totalAmount?: number
  }
}

// Menu item type
type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  iconName: string // Store icon name instead of React element
}

// Queue activity type
type QueueActivity = {
  id: string
  type: "join" | "leave" | "skip" | "return"
  timestamp: number
  personName?: string
}

// Queue person type
type QueuePerson = {
  id: string
  name: string
  position: number
  joinedAt: number
  estimatedServiceTime: number
  status: "waiting" | "being-served" | "served" | "skipped"
  priority: "normal" | "vip" | "urgent"
  notes?: string
  selectedItems?: MenuItem[] // Optional selected items
  paymentStatus: "unpaid" | "paid-online" | "pay-at-counter" | "no-payment-needed"
  totalAmount: number
  isCurrentUser?: boolean // Flag to identify current user
}

// Map of icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  Martini,
  GlassWater,
  Beer,
  User,
  Utensils,
  Coffee,
  Stethoscope,
  Scissors,
  ShoppingBag,
  Ticket,
}

// Get icon component by name
const getIconByName = (iconName: string): LucideIcon => {
  return iconMap[iconName] || User
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

// Get icon with color
const getColoredIcon = (service: ServiceLocation) => {
  const IconComponent = getIconByName(service.iconName)
  return <IconComponent className={`h-5 w-5 ${getColorClass(service.color, "text")}`} />
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

// Update the formatPrice function to use South African Rand
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(price)
}

// Update the generateQueuePeople function to include payment status and amount
const generateQueuePeople = (count: number, serviceRate: number): QueuePerson[] => {
  return Array.from({ length: count }).map((_, index) => ({
    id: crypto.randomUUID(),
    name: generateRandomName(),
    position: index + 1,
    joinedAt: Date.now() - Math.floor(Math.random() * 3600000), // Joined within the last hour
    estimatedServiceTime: Math.ceil(serviceRate * (0.8 + Math.random() * 0.4)), // Random variation in service time
    status: "waiting",
    priority: Math.random() > 0.9 ? (Math.random() > 0.5 ? "vip" : "urgent") : "normal",
    notes: Math.random() > 0.7 ? `Special request: ${Math.random() > 0.5 ? "No ice" : "Extra service"}` : undefined,
    paymentStatus: Math.random() > 0.6 ? (Math.random() > 0.5 ? "paid-online" : "pay-at-counter") : "unpaid",
    totalAmount: Math.floor(Math.random() * 200) + 50, // Random amount between 50 and 250 ZAR
  }))
}

// Liquid animation component
const LiquidAnimation = ({ type, color }: { type: string; color: string }) => {
  const [liquidLevel, setLiquidLevel] = useState(50)

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

  // Different animations based on service type
  if (type === "drinks") {
    if (color === "amber") {
      // Whisky
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
    } else if (color === "yellow") {
      // Beer
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
    } else if (color === "brown") {
      // Coffee
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
      // Cocktail
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
    const IconComponent =
      type === "food"
        ? Utensils
        : type === "healthcare"
          ? Stethoscope
          : type === "service"
            ? Scissors
            : type === "retail"
              ? ShoppingBag
              : type === "entertainment"
                ? Ticket
                : User

    return (
      <div className="relative h-20 w-20 mx-auto flex items-center justify-center">
        <div className={`h-16 w-16 rounded-full ${getColorClass(color, "bg")} flex items-center justify-center`}>
          <IconComponent className={`h-10 w-10 ${getColorClass(color, "text")}`} />
        </div>
        <motion.div
          className={`absolute inset-0 rounded-full ${getColorClass(color, "border")} border-2 opacity-70`}
          animate={{ scale: [1, 1.1, 1], opacity: [0.7, 0.2, 0.7] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      </div>
    )
  }
}

// Time adjustment dialog component for admin
const TimeAdjustmentDialog = ({
  open,
  onOpenChange,
  onAdjustTime,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdjustTime: (minutes: number) => void
}) => {
  const [minutes, setMinutes] = useState(5)
  const [isAddition, setIsAddition] = useState(true)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isAddition ? "Add Time to Queue" : "Reduce Time from Queue"}</DialogTitle>
          <DialogDescription>
            {isAddition
              ? "Add minutes to everyone's estimated wait time"
              : "Reduce minutes from everyone's estimated wait time"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={isAddition ? "default" : "outline"}
              onClick={() => setIsAddition(true)}
              className={isAddition ? "bg-teal-500 hover:bg-teal-600" : ""}
            >
              Add Time
            </Button>
            <Button
              variant={!isAddition ? "default" : "outline"}
              onClick={() => setIsAddition(false)}
              className={!isAddition ? "bg-red-500 hover:bg-red-600" : ""}
            >
              Reduce Time
            </Button>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="minutes">Minutes to {isAddition ? "add" : "reduce"}</Label>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setMinutes((prev) => Math.max(1, prev - 1))}>
                -
              </Button>
              <Input
                id="minutes"
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(Math.max(1, Number.parseInt(e.target.value) || 1))}
                className="text-center"
                min={1}
              />
              <Button variant="outline" size="icon" onClick={() => setMinutes((prev) => prev + 1)}>
                +
              </Button>
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            <p>
              This will {isAddition ? "add" : "reduce"} {minutes} minutes to the estimated wait time for all customers
              in the queue.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onAdjustTime(isAddition ? minutes : -minutes)
              onOpenChange(false)
            }}
            className={isAddition ? "bg-teal-500 hover:bg-teal-600" : "bg-red-500 hover:bg-red-600"}
          >
            {isAddition ? "Add Time" : "Reduce Time"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Leave queue confirmation dialog
const LeaveQueueDialog = ({
  open,
  onOpenChange,
  onConfirmLeave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirmLeave: () => void
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Leave Queue</DialogTitle>
          <DialogDescription>Are you sure you want to leave the queue? This action cannot be undone.</DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="sm:flex-1">
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirmLeave()
              onOpenChange(false)
            }}
            variant="destructive"
            className="sm:flex-1"
          >
            Leave Queue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Edit user details dialog
const EditDetailsDialog = ({
  open,
  onOpenChange,
  person,
  onSaveDetails,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  person: QueuePerson | null
  onSaveDetails: (name: string, notes: string) => void
}) => {
  const [name, setName] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (person && open) {
      setName(person.name)
      setNotes(person.notes || "")
    }
  }, [person, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Your Details</DialogTitle>
          <DialogDescription>Update your information in the queue</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Special Requests/Notes</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests or notes"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (name.trim()) {
                onSaveDetails(name, notes)
                onOpenChange(false)
              }
            }}
            disabled={!name.trim()}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Add the PaymentDialog component at the top level
const PaymentDialog = ({
  open,
  onOpenChange,
  person,
  onPaymentComplete,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  person: QueuePerson | null
  onPaymentComplete: () => void
}) => {
  const [paymentStep, setPaymentStep] = useState<"method" | "details" | "processing" | "complete" | "error">("method")
  const [paymentMethod, setPaymentMethod] = useState<"credit-card" | "debit-card" | "ewallet">("credit-card")
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setPaymentStep("method")
      setPaymentMethod("credit-card")
      setCardNumber("")
      setCardName("")
      setExpiryDate("")
      setCvv("")
      setErrorMessage("")
    }
  }, [open])

  const handleSelectPaymentMethod = (method: "credit-card" | "debit-card" | "ewallet") => {
    setPaymentMethod(method)
    setPaymentStep("details")
  }

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      setErrorMessage("Please fill in all payment details")
      return
    }

    if (cardNumber.length < 16) {
      setErrorMessage("Please enter a valid card number")
      return
    }

    if (cvv.length < 3) {
      setErrorMessage("Please enter a valid CVV")
      return
    }

    setErrorMessage("")
    setPaymentStep("processing")
    setIsProcessing(true)

    // Simulate payment processing with a small chance of failure
    setTimeout(
      () => {
        setIsProcessing(false)

        // 10% chance of payment failure for realism
        if (Math.random() < 0.1) {
          setPaymentStep("error")
        } else {
          setPaymentStep("complete")
        }
      },
      2000 + Math.random() * 1000,
    ) // Random processing time between 2-3 seconds
  }

  const handleRetry = () => {
    setPaymentStep("details")
  }

  const handleClose = () => {
    if (paymentStep === "complete") {
      onPaymentComplete()
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {paymentStep === "method" && "Select Payment Method"}
            {paymentStep === "details" &&
              `${paymentMethod === "credit-card" ? "Credit" : paymentMethod === "debit-card" ? "Debit" : "E-Wallet"} Card Payment`}
            {paymentStep === "processing" && "Processing Payment"}
            {paymentStep === "complete" && "Payment Complete"}
            {paymentStep === "error" && "Payment Failed"}
          </DialogTitle>
          <DialogDescription>
            {paymentStep === "method" && `Total amount: ${person ? formatPrice(person.totalAmount) : ""}`}
            {paymentStep === "details" &&
              `Please enter your ${paymentMethod === "ewallet" ? "e-wallet" : "card"} details`}
            {paymentStep === "processing" && "Please wait while we process your payment..."}
            {paymentStep === "complete" && "Your payment has been successfully processed."}
            {paymentStep === "error" && "There was an issue processing your payment."}
          </DialogDescription>
        </DialogHeader>

        {paymentStep === "method" && (
          <div className="grid gap-4 py-4">
            <div
              onClick={() => handleSelectPaymentMethod("credit-card")}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-500 cursor-pointer"
            >
              <div className="p-2 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Credit Card</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Pay with Visa, Mastercard, or American Express
                </p>
              </div>
            </div>

            <div
              onClick={() => handleSelectPaymentMethod("debit-card")}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-500 cursor-pointer"
            >
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Debit Card</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pay with your bank debit card</p>
              </div>
            </div>

            <div
              onClick={() => handleSelectPaymentMethod("ewallet")}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-500 cursor-pointer"
            >
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">E-Wallet</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pay with your digital wallet</p>
              </div>
            </div>
          </div>
        )}

        {paymentStep === "details" && (
          <form onSubmit={handleSubmitPayment}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                  placeholder="4242 4242 4242 4242"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    value={expiryDate}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "")
                      if (value.length <= 4) {
                        const month = value.slice(0, 2)
                        const year = value.slice(2, 4)
                        setExpiryDate(value.length > 2 ? `${month}/${year}` : month)
                      }
                    }}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                    placeholder="123"
                    required
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                  {errorMessage}
                </div>
              )}

              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                <p>For testing, use any future date and any 3 digits for CVV.</p>
                <p>Card number: 4242 4242 4242 4242 (success) or 4000 0000 0000 0002 (decline)</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setPaymentStep("method")}>
                Back
              </Button>
              <Button type="submit">Process Payment</Button>
            </DialogFooter>
          </form>
        )}

        {paymentStep === "processing" && (
          <div className="py-6 flex flex-col items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="h-12 w-12 border-2 border-teal-500 border-opacity-30 border-t-teal-500 rounded-full mb-4"
            />
            <p className="text-center text-gray-600 dark:text-gray-400">Processing your payment...</p>
            <p className="text-center text-gray-500 dark:text-gray-500 text-sm mt-2">Please do not close this window</p>
          </div>
        )}

        {paymentStep === "complete" && (
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-2">
              Your payment of {person ? formatPrice(person.totalAmount) : ""} has been successfully processed.
            </p>
            <p className="text-center text-gray-500 dark:text-gray-500 text-sm mb-6">
              A receipt has been sent to your email address.
            </p>
            <DialogFooter className="w-full">
              <Button onClick={handleClose} className="w-full">
                Close
              </Button>
            </DialogFooter>
          </div>
        )}

        {paymentStep === "error" && (
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-2">Your payment could not be processed.</p>
            <p className="text-center text-gray-500 dark:text-gray-500 text-sm mb-6">
              Please check your payment details and try again.
            </p>
            <DialogFooter className="w-full flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" onClick={handleClose} className="w-full">
                Cancel
              </Button>
              <Button onClick={handleRetry} className="w-full">
                Try Again
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Payment choice dialog component
const PaymentChoiceDialog = ({
  open,
  onOpenChange,
  person,
  onPaymentChoice,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  person: QueuePerson | null
  onPaymentChoice: (choice: "pay-online" | "pay-at-counter") => void
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Payment Required</DialogTitle>
          <DialogDescription>
            Please choose how you would like to pay for your order.
            {person && ` Total amount: ${formatPrice(person.totalAmount)}`}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div
            onClick={() => onPaymentChoice("pay-online")}
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-500 cursor-pointer"
          >
            <div className="p-2 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Pay Online Now</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Secure payment with credit/debit card or e-wallet
              </p>
            </div>
          </div>

          <div
            onClick={() => onPaymentChoice("pay-at-counter")}
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-500 cursor-pointer"
          >
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              <Banknote className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Pay at Counter</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pay when you arrive at the service location</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Update the UserQueueCard component to be simpler for the user view
const UserQueueCard = ({
  person,
  index,
  serviceColor,
  isCurrentUser,
}: {
  person: QueuePerson
  index: number
  serviceColor: string
  isCurrentUser: boolean
}) => {
  return (
    <div
      className={`p-3 rounded-lg border ${
        isCurrentUser
          ? `border-2 ${getColorClass(serviceColor, "border")} ring-2 ring-offset-2 ${getColorClass(serviceColor, "text").replace("text", "ring")}`
          : "border-gray-200 dark:border-gray-700"
      } bg-white dark:bg-gray-800 mb-2`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${getColorClass(
            serviceColor,
            "bg",
          )} ${getColorClass(serviceColor, "text")}`}
        >
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
              {isCurrentUser ? `${person.name} (You)` : person.name}
            </h4>
            {person.paymentStatus === "paid-online" && (
              <Badge
                variant="outline"
                className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-none"
              >
                Paid Online
              </Badge>
            )}
            {person.paymentStatus === "pay-at-counter" && (
              <Badge
                variant="outline"
                className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-none"
              >
                Pay at Counter
              </Badge>
            )}
          </div>
          <div className="mt-1 flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3" />
              <span>Est. service: {person.estimatedServiceTime} min</span>
            </div>
            {isCurrentUser && person.totalAmount > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Banknote className="h-3 w-3" />
                <span>{formatPrice(person.totalAmount)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Fix the AdminQueuePersonCard to improve drag functionality
const AdminQueuePersonCard = ({
  person,
  index,
  serviceColor,
  onPaymentAction,
}: {
  person: QueuePerson
  index: number
  serviceColor: string
  onPaymentAction: (personId: string, action: "pay-online" | "pay-at-counter") => void
}) => {
  return (
    <Reorder.Item
      value={person}
      id={person.id}
      className={`p-3 rounded-lg border ${
        person.isCurrentUser
          ? `border-2 ${getColorClass(serviceColor, "border")} ring-2 ring-offset-2 ${getColorClass(serviceColor, "text").replace("text", "ring")}`
          : `${getColorClass(serviceColor, "border")}`
      } bg-white dark:bg-gray-800 mb-2 group cursor-move`}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${getColorClass(
                  serviceColor,
                  "bg",
                )} ${getColorClass(serviceColor, "text")}`}
              >
                {index + 1}
              </div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                {person.isCurrentUser ? `${person.name} (You)` : person.name}
              </h4>
              {person.priority !== "normal" && (
                <Badge
                  variant="outline"
                  className={`${
                    person.priority === "vip"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  } border-none`}
                >
                  {person.priority.toUpperCase()}
                </Badge>
              )}

              {/* Payment status badge */}
              {person.paymentStatus === "paid-online" && (
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-none"
                >
                  Paid Online
                </Badge>
              )}
              {person.paymentStatus === "pay-at-counter" && (
                <Badge
                  variant="outline"
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-none"
                >
                  Pay at Counter
                </Badge>
              )}
              {person.isCurrentUser && person.paymentStatus === "unpaid" && person.totalAmount > 0 && (
                <Badge
                  variant="outline"
                  className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-none"
                >
                  Payment Required
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">{formatTimeAgo(person.joinedAt)}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {person.paymentStatus === "unpaid" && person.totalAmount > 0 && (
                    <>
                      <DropdownMenuItem onClick={() => onPaymentAction(person.id, "pay-online")}>
                        <CreditCard className="h-4 w-4 mr-2" />
                        <span>Pay Online</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onPaymentAction(person.id, "pay-at-counter")}>
                        <Banknote className="h-4 w-4 mr-2" />
                        <span>Pay at Counter</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem>Mark as Served</DropdownMenuItem>
                  <DropdownMenuItem>Skip</DropdownMenuItem>
                  <DropdownMenuItem>Edit Details</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600 dark:text-red-400">Remove</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="mt-1 flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3" />
              <span>Est. service: {person.estimatedServiceTime} min</span>
            </div>
            {person.totalAmount > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Banknote className="h-3 w-3" />
                <span>{formatPrice(person.totalAmount)}</span>
              </div>
            )}
            {person.notes && <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{person.notes}</div>}
          </div>
        </div>
      </div>
    </Reorder.Item>
  )
}

// Update the Dashboard component to include payment functionality
export default function Dashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const dragControls = useDragControls()

  // Try to get selected service from localStorage
  const [currentService, setCurrentService] = useState<ServiceLocation | null>(null)
  const [queuePeople, setQueuePeople] = useState<QueuePerson[]>([])
  const [activityLog, setActivityLog] = useState<{ id: string; message: string; timestamp: number }[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [viewMode, setViewMode] = useState<"user" | "admin" | "super-admin">("user") // Default to user view

  // Payment state
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<QueuePerson | null>(null)
  // Add a new state for payment choice dialog
  const [showPaymentChoiceDialog, setShowPaymentChoiceDialog] = useState(false)

  // Add these state variables inside the Dashboard component:
  const [timeAdjustmentDialogOpen, setTimeAdjustmentDialogOpen] = useState(false)
  const [leaveQueueDialogOpen, setLeaveQueueDialogOpen] = useState(false)
  const [editDetailsDialogOpen, setEditDetailsDialogOpen] = useState(false)
  const [showRatingPrompt, setShowRatingPrompt] = useState(false)

  // Load service from localStorage on mount
  useEffect(() => {
    const savedService = localStorage.getItem("selectedService")
    if (savedService) {
      try {
        const parsedService = JSON.parse(savedService)
        setCurrentService(parsedService)

        // Generate queue people based on the service
        const generatedQueue = generateQueuePeople(parsedService.queueLength, parsedService.servingRate)

        // Add the current user to the queue if userData exists
        if (parsedService.userData) {
          const userData = parsedService.userData
          const userQueuePerson: QueuePerson = {
            id: "current-user",
            name: userData.name,
            position: generatedQueue.length + 1,
            joinedAt: userData.joinedAt || Date.now(),
            estimatedServiceTime: Math.ceil(parsedService.servingRate * (0.8 + Math.random() * 0.4)),
            status: "waiting",
            priority: "normal",
            paymentStatus: userData.paymentStatus || "unpaid",
            totalAmount: userData.totalAmount || 0,
            isCurrentUser: true, // Flag to identify current user
          }

          setQueuePeople([...generatedQueue, userQueuePerson])

          // Add to activity log
          const newActivity = {
            id: crypto.randomUUID(),
            message: `You (${userData.name}) joined the queue`,
            timestamp: userData.joinedAt || Date.now(),
          }
          setActivityLog([newActivity])
        } else {
          setQueuePeople(generatedQueue)
        }
      } catch (e) {
        console.error("Failed to parse saved service", e)
      }
    } else {
      // If no service is selected, redirect to login
      router.push("/login")
    }
  }, [router])

  // Update the useEffect that loads service data to check if payment is needed
  useEffect(() => {
    // Check if the current user needs to make a payment
    const currentUser = queuePeople.find((person) => person.isCurrentUser)
    if (currentUser && currentUser.paymentStatus === "unpaid" && currentUser.totalAmount > 0) {
      // Show payment choice dialog after a short delay
      setTimeout(() => {
        setSelectedPerson(currentUser)
        setShowPaymentChoiceDialog(true)
      }, 1000)
    }
  }, [queuePeople])

  // Add these handler functions inside the Dashboard component:

  // Handle time adjustment for all queue members
  const handleAdjustTime = (minutesChange: number) => {
    setQueuePeople((prev) =>
      prev.map((person) => ({
        ...person,
        estimatedServiceTime: Math.max(1, person.estimatedServiceTime + minutesChange),
      })),
    )

    // Add to activity log
    const newActivity = {
      id: crypto.randomUUID(),
      message: `Admin ${minutesChange > 0 ? "added" : "reduced"} ${Math.abs(minutesChange)} minutes to everyone's wait time`,
      timestamp: Date.now(),
    }
    setActivityLog((log) => [newActivity, ...log].slice(0, 20))

    toast({
      title: "Queue Time Updated",
      description: `${minutesChange > 0 ? "Added" : "Reduced"} ${Math.abs(minutesChange)} minutes to everyone's wait time`,
      variant: "default",
    })
  }

  // Handle user leaving the queue
  const handleLeaveQueue = () => {
    const currentUser = queuePeople.find((person) => person.isCurrentUser)
    if (!currentUser) return

    // Remove user from queue
    setQueuePeople((prev) => prev.filter((person) => !person.isCurrentUser))

    // Add to activity log
    const newActivity = {
      id: crypto.randomUUID(),
      message: `${currentUser.name} left the queue`,
      timestamp: Date.now(),
    }
    setActivityLog((log) => [newActivity, ...log].slice(0, 20))

    toast({
      title: "Left Queue",
      description: "You have successfully left the queue",
      variant: "default",
    })

    // Redirect to login page after a short delay
    setTimeout(() => {
      localStorage.removeItem("selectedService")
      router.push("/login")
    }, 2000)
  }

  // Handle saving edited user details
  const handleSaveDetails = (name: string, notes: string) => {
    setQueuePeople((prev) =>
      prev.map((person) => (person.isCurrentUser ? { ...person, name, notes: notes || undefined } : person)),
    )

    // Add to activity log
    const newActivity = {
      id: crypto.randomUUID(),
      message: `${name} updated their details`,
      timestamp: Date.now(),
    }
    setActivityLog((log) => [newActivity, ...log].slice(0, 20))

    toast({
      title: "Details Updated",
      description: "Your details have been updated successfully",
      variant: "default",
    })
  }

  // Handle payment actions
  const handlePaymentAction = (personId: string, action: "pay-online" | "pay-at-counter") => {
    const person = queuePeople.find((p) => p.id === personId)
    if (!person) return

    if (action === "pay-online") {
      setSelectedPerson(person)
      setPaymentDialogOpen(true)
    } else {
      // Mark as pay at counter
      setQueuePeople((prev) => prev.map((p) => (p.id === personId ? { ...p, paymentStatus: "pay-at-counter" } : p)))

      // Add to activity log
      const newActivity = {
        id: crypto.randomUUID(),
        message: `${person.name} chose to pay at the counter`,
        timestamp: Date.now(),
      }
      setActivityLog((log) => [newActivity, ...log].slice(0, 20))

      toast({
        title: "Payment Option Selected",
        description: `${person.name} will pay at the counter`,
        variant: "default",
      })
    }
  }

  // Handle online payment completion
  const handlePaymentComplete = () => {
    if (!selectedPerson) return

    // Update person's payment status
    setQueuePeople((prev) => prev.map((p) => (p.id === selectedPerson.id ? { ...p, paymentStatus: "paid-online" } : p)))

    // Add to activity log
    const newActivity = {
      id: crypto.randomUUID(),
      message: selectedPerson.isCurrentUser
        ? `You paid ${formatPrice(selectedPerson.totalAmount)} online`
        : `${selectedPerson.name} paid ${formatPrice(selectedPerson.totalAmount)} online`,
      timestamp: Date.now(),
    }
    setActivityLog((log) => [newActivity, ...log].slice(0, 20))

    toast({
      title: "Payment Successful",
      description: `Payment of ${formatPrice(selectedPerson.totalAmount)} was successful`,
      variant: "default",
    })

    setSelectedPerson(null)
  }

  // Handle rating prompt
  const handleShowRating = () => {
    router.push("/rating")
  }

  // Simulate queue activity
  useEffect(() => {
    if (!currentService) return

    // Simulate people joining the queue
    const joinInterval = setInterval(() => {
      // Higher popularity = higher chance of new people
      const joinProbability = currentService.popularity / 20 // Lower probability for dashboard
      if (Math.random() > joinProbability) return

      const personName = generateRandomName()
      const totalAmount = Math.floor(Math.random() * 200) + 50 // Random amount between 50 and 250 ZAR
      const newPerson: QueuePerson = {
        id: crypto.randomUUID(),
        name: personName,
        position: queuePeople.length + 1,
        joinedAt: Date.now(),
        estimatedServiceTime: Math.ceil(currentService.servingRate * (0.8 + Math.random() * 0.4)),
        status: "waiting",
        priority: Math.random() > 0.9 ? (Math.random() > 0.5 ? "vip" : "urgent") : "normal",
        notes: Math.random() > 0.7 ? `Special request: ${Math.random() > 0.5 ? "No ice" : "Extra service"}` : undefined,
        paymentStatus: "unpaid",
        totalAmount: totalAmount,
      }

      setQueuePeople((prev) => [...prev, newPerson])

      // Add to activity log
      const newActivity = {
        id: crypto.randomUUID(),
        message: `${personName} joined the queue (${formatPrice(totalAmount)})`,
        timestamp: Date.now(),
      }
      setActivityLog((log) => [newActivity, ...log].slice(0, 20))

      toast({
        title: "New Customer",
        description: `${personName} has joined the queue`,
        variant: "default",
      })
    }, 15000) // Every 15 seconds

    // Simulate people being served
    const serveInterval = setInterval(() => {
      if (queuePeople.length === 0) return

      // Calculate service probability based on service rate
      const baseServiceProbability = 1 / (currentService.servingRate * 4)
      const adjustedProbability = baseServiceProbability * currentService.serviceEfficiency

      if (Math.random() > adjustedProbability) return

      // Serve the first person in the queue
      setQueuePeople((prev) => {
        if (prev.length === 0) return prev

        const person = prev[0]
        const personName = person.name
        const paymentStatus = person.paymentStatus
        const amount = person.totalAmount

        // Check if the current user is being served
        if (person.isCurrentUser) {
          // Show rating prompt
          setShowRatingPrompt(true)
        }

        // Add to activity log
        const newActivity = {
          id: crypto.randomUUID(),
          message: `${personName} has been served (${formatPrice(amount)})`,
          timestamp: Date.now(),
        }
        setActivityLog((log) => [newActivity, ...log].slice(0, 20))

        toast({
          title: "Customer Served",
          description: `${personName} has been served${paymentStatus === "paid-online" ? " (Paid Online)" : paymentStatus === "pay-at-counter" ? " (Paid at Counter)" : ""}`,
          variant: "default",
        })

        return prev.slice(1)
      })
    }, 10000) // Every 10 seconds

    return () => {
      clearInterval(joinInterval)
      clearInterval(serveInterval)
    }
  }, [currentService, queuePeople, toast, router])

  const handleLogout = () => {
    localStorage.removeItem("selectedService")
    router.push("/login")
  }

  const handleRefresh = () => {
    setIsRefreshing(true)

    // Simulate refresh
    setTimeout(() => {
      if (currentService) {
        // Keep the current user in the queue when refreshing
        const currentUser = queuePeople.find((person) => person.isCurrentUser)
        const newQueue = generateQueuePeople(currentService.queueLength, currentService.servingRate)

        if (currentUser) {
          setQueuePeople([...newQueue, currentUser])
        } else {
          setQueuePeople(newQueue)
        }
      }
      setIsRefreshing(false)

      toast({
        title: "Queue Refreshed",
        description: "The queue has been refreshed with the latest data",
        variant: "default",
      })
    }, 1000)
  }

  // Add the payment choice handler
  const handlePaymentChoice = (choice: "pay-online" | "pay-at-counter") => {
    setShowPaymentChoiceDialog(false)

    if (!selectedPerson) return

    if (choice === "pay-online") {
      setPaymentDialogOpen(true)
    } else {
      // Mark as pay at counter
      setQueuePeople((prev) =>
        prev.map((p) => (p.id === selectedPerson.id ? { ...p, paymentStatus: "pay-at-counter" } : p)),
      )

      // Add to activity log
      const newActivity = {
        id: crypto.randomUUID(),
        message: `You chose to pay at the counter (${formatPrice(selectedPerson.totalAmount)})`,
        timestamp: Date.now(),
      }
      setActivityLog((log) => [newActivity, ...log].slice(0, 20))

      toast({
        title: "Payment Option Selected",
        description: `You will pay ${formatPrice(selectedPerson.totalAmount)} at the counter`,
        variant: "default",
      })
    }
  }

  // Toggle between user and admin views
  const toggleViewMode = () => {
    if (viewMode === "user") {
      setViewMode("admin")
    } else if (viewMode === "admin") {
      setViewMode("super-admin")
      router.push("/super-admin")
    } else {
      setViewMode("user")
    }
  }

  // Find the current user in the queue
  const currentUser = queuePeople.find((person) => person.isCurrentUser)

  // Calculate people ahead of current user
  const peopleAheadOfUser = currentUser
    ? queuePeople.filter((p) => !p.isCurrentUser && queuePeople.indexOf(p) < queuePeople.indexOf(currentUser)).length
    : 0

  // Calculate estimated wait time for current user
  const estimatedWaitTimeForUser =
    currentUser && currentService
      ? Math.ceil((peopleAheadOfUser * currentService.servingRate * currentService.serviceEfficiency) / 3)
      : 0

  if (!currentService) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="mx-auto h-8 w-8 border-2 border-teal-500 border-opacity-30 border-t-teal-500 rounded-full"
          />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading queue data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <ToastProvider>
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${getColorClass(currentService.color, "bg")} ${getColorClass(
                    currentService.color,
                    "border",
                  )}`}
                >
                  {getColoredIcon(currentService)}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{currentService.name}</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{currentService.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2" onClick={toggleViewMode}>
                  {viewMode === "user" ? (
                    <>
                      <UserCog className="h-4 w-4" />
                      <span>Switch to Admin View</span>
                    </>
                  ) : viewMode === "admin" ? (
                    <>
                      <Shield className="h-4 w-4" />
                      <span>Switch to Super Admin</span>
                    </>
                  ) : (
                    <>
                      <User className="h-4 w-4" />
                      <span>Switch to User View</span>
                    </>
                  )}
                </Button>

                <Button variant="outline" size="sm" className="gap-2" onClick={handleRefresh} disabled={isRefreshing}>
                  {isRefreshing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="h-4 w-4"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  <span>Refresh</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/abstract-geometric-shapes.png" alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Settings className="h-4 w-4 mr-2" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          {viewMode === "user" ? (
            // User View
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User's Position in Queue */}
              <div className="lg:col-span-2">
                <Card className="shadow-lg border-none overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600" />
                  <CardHeader className="bg-gradient-to-r from-teal-50 to-gray-50 dark:from-gray-800 dark:to-gray-900">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Your Position in Queue</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Estimated wait time: {estimatedWaitTimeForUser} minutes
                    </p>
                  </CardHeader>
                  <div className="p-4">
                    {currentUser ? (
                      <UserQueueCard
                        person={currentUser}
                        index={queuePeople.indexOf(currentUser)}
                        serviceColor={currentService.color}
                        isCurrentUser={true}
                      />
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">You are not currently in the queue.</p>
                    )}
                  </div>
                  <CardFooter className="bg-gray-50 dark:bg-gray-800 border-t">
                    <div className="flex justify-between items-center w-full">
                      <Button variant="outline" onClick={() => setEditDetailsDialogOpen(true)}>
                        Edit Details
                      </Button>
                      <Button variant="destructive" onClick={() => setLeaveQueueDialogOpen(true)}>
                        Leave Queue
                      </Button>
                    </div>
                  </CardFooter>
                </Card>

                {/* Other Queue Members */}
                <Card className="shadow-lg border-none overflow-hidden mt-6">
                  <CardHeader className="bg-gray-50 dark:bg-gray-800">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Other Queue Members</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      There are {queuePeople.length - (currentUser ? 1 : 0)} people ahead of you.
                    </p>
                  </CardHeader>
                  <div className="p-4">
                    {queuePeople
                      .filter((person) => !person.isCurrentUser)
                      .map((person, index) => (
                        <UserQueueCard
                          key={person.id}
                          person={person}
                          index={index}
                          serviceColor={currentService.color}
                          isCurrentUser={false}
                        />
                      ))}
                    {queuePeople.filter((person) => !person.isCurrentUser).length === 0 && (
                      <p className="text-gray-500 dark:text-gray-400">No other customers in the queue.</p>
                    )}
                  </div>
                </Card>
              </div>

              {/* Service Details and Activity Log */}
              <div>
                <Card className="shadow-lg border-none overflow-hidden">
                  <CardHeader className="bg-gray-50 dark:bg-gray-800">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Service Details</h3>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Address:</span> {currentService.address}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Open Hours:</span> {currentService.openTime} -{" "}
                      {currentService.closeTime}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Estimated Wait:</span> {currentService.estimatedWait} minutes
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-none overflow-hidden mt-6">
                  <CardHeader className="bg-gray-50 dark:bg-gray-800">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Activity Log</h3>
                  </CardHeader>
                 <CardContent className="p-4">
                  {activityLog.map((activity, index) => {
                    //console.log(`KEY CHECK ${index}:`, `${activity.id}-${activity.timestamp}`);
                    return (
                      <div key={`${activity.id}-${activity.timestamp}-${index}`} className="mb-2 last:mb-0">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{activity.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
                      </div>
                    );
                  })}
                  
                  {activityLog.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400">No recent activity.</p>
                  )}
                </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            // Admin View
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <Card className="shadow-lg border-none overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600" />
                  <CardHeader className="bg-gradient-to-r from-teal-50 to-gray-50 dark:from-gray-800 dark:to-gray-900">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Queue Management</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Drag and drop to reorder the queue</p>
                  </CardHeader>
                  <div className="p-4">
                    <Reorder.Group axis="y" values={queuePeople} onReorder={setQueuePeople}>
                      {queuePeople.map((person, index) => (
                        <AdminQueuePersonCard
                          key={person.id}
                          person={person}
                          index={index}
                          serviceColor={currentService.color}
                          onPaymentAction={handlePaymentAction}
                        />
                      ))}
                    </Reorder.Group>
                    {queuePeople.length === 0 && (
                      <p className="text-gray-500 dark:text-gray-400">No customers in the queue.</p>
                    )}
                  </div>
                  <CardFooter className="bg-gray-50 dark:bg-gray-800 border-t">
                    <div className="flex justify-between items-center w-full">
                      <Button variant="outline" onClick={() => setTimeAdjustmentDialogOpen(true)}>
                        Adjust Time
                      </Button>
                      <Button variant="destructive">Clear Queue</Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>

              <div>
                <Card className="shadow-lg border-none overflow-hidden">
                  <CardHeader className="bg-gray-50 dark:bg-gray-800">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Activity Log</h3>
                  </CardHeader>
                 <CardContent className="p-4">
                {activityLog.map((activity, index) => {
                  ///console.log(`KEY CHECK ${index}:`, `${activity.id}-${activity.timestamp}`);
                  return (
                    <div key={`${activity.id}-${activity.timestamp}-${index}`} className="mb-2 last:mb-0">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{activity.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
                    </div>
                  );
                })}

                {activityLog.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400">No recent activity.</p>
                )}
              </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>

        {/* Dialogs */}
        <TimeAdjustmentDialog
          open={timeAdjustmentDialogOpen}
          onOpenChange={setTimeAdjustmentDialogOpen}
          onAdjustTime={handleAdjustTime}
        />

        <LeaveQueueDialog
          open={leaveQueueDialogOpen}
          onOpenChange={setLeaveQueueDialogOpen}
          onConfirmLeave={handleLeaveQueue}
        />

        <EditDetailsDialog
          open={editDetailsDialogOpen}
          onOpenChange={setEditDetailsDialogOpen}
          person={currentUser}
          onSaveDetails={handleSaveDetails}
        />

        <PaymentChoiceDialog
          open={showPaymentChoiceDialog}
          onOpenChange={setShowPaymentChoiceDialog}
          person={selectedPerson}
          onPaymentChoice={handlePaymentChoice}
        />

        <PaymentDialog
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          person={selectedPerson}
          onPaymentComplete={handlePaymentComplete}
        />
      </ToastProvider>
    </div>
  )
}
