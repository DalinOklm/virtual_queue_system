"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Star, Send, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ToastProvider, ToastViewport } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

// Rating component
export default function RatingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [rating, setRating] = useState<number | null>(null)
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serviceData, setServiceData] = useState<any>(null)

  // Load service data from localStorage
  useEffect(() => {
    const savedService = localStorage.getItem("selectedService")
    if (savedService) {
      try {
        const parsedService = JSON.parse(savedService)
        setServiceData(parsedService)
      } catch (e) {
        console.error("Failed to parse saved service", e)
      }
    } else {
      // If no service is selected, redirect to login
      router.push("/login")
    }
  }, [router])

  const handleRatingClick = (value: number) => {
    setRating(value)
  }

  const handleRatingHover = (value: number) => {
    setHoveredRating(value)
  }

  const handleRatingLeave = () => {
    setHoveredRating(null)
  }

  const handleSubmit = () => {
    if (!rating) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      // Save rating to localStorage
      const ratingData = {
        storeId: serviceData?.id,
        storeName: serviceData?.name,
        rating,
        comment,
        timestamp: Date.now(),
      }

      // Get existing ratings or initialize empty array
      const existingRatingsJson = localStorage.getItem("userRatings")
      const existingRatings = existingRatingsJson ? JSON.parse(existingRatingsJson) : []

      // Add new rating
      const updatedRatings = [...existingRatings, ratingData]

      // Save to localStorage
      localStorage.setItem("userRatings", JSON.stringify(updatedRatings))

      setIsSubmitting(false)

      toast({
        title: "Thank You!",
        description: "Your feedback has been submitted successfully",
        variant: "default",
      })

      // Redirect back to dashboard after a short delay
      setTimeout(() => {
        router.push("/")
      }, 1500)
    }, 1000)
  }

  if (!serviceData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="mx-auto h-8 w-8 border-2 border-teal-500 border-opacity-30 border-t-teal-500 rounded-full"
          />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading service data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <ToastProvider>
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="mb-6 rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Rate Your Experience</CardTitle>
              <CardDescription>How was your experience at {serviceData.name}?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <motion.button
                      key={value}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRatingClick(value)}
                      onMouseEnter={() => handleRatingHover(value)}
                      onMouseLeave={handleRatingLeave}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-10 w-10 ${
                          (hoveredRating !== null ? value <= hoveredRating : value <= (rating || 0))
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        } transition-colors`}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <Textarea
                  placeholder="Share your thoughts about your experience (optional)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="resize-none h-32"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !rating}
                className="w-full gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="h-4 w-4 border-2 border-white border-opacity-30 border-t-white rounded-full"
                  />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>{isSubmitting ? "Submitting..." : "Submit Rating"}</span>
              </Button>
            </CardFooter>
          </Card>
        </div>
        <ToastViewport />
      </ToastProvider>
    </div>
  )
}
