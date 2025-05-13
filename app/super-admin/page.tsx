"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  BarChart3,
  Users,
  Store,
  Star,
  Search,
  LogOut,
  Shield,
  RefreshCw,
  Edit,
  Plus,
  Eye,
  Settings,
} from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ToastProvider, ToastViewport } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Types
type StoreType = {
  id: string
  name: string
  type: string
  status: "active" | "inactive" | "suspended"
  queueLength: number
  ratings: number
  ratingCount: number
}

type User = {
  id: string
  name: string
  email: string
  role: "admin" | "store_manager" | "staff" | "customer"
  status: "active" | "inactive" | "suspended"
  lastActive: string
}

// Sample data
const sampleStores: StoreType[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `store-${i}`,
  name: `Store ${i + 1}`,
  type: ["food", "drinks", "retail", "service"][Math.floor(Math.random() * 4)],
  status: ["active", "inactive", "suspended"][Math.floor(Math.random() * 3)] as "active" | "inactive" | "suspended",
  queueLength: Math.floor(Math.random() * 30),
  ratings: Math.random() * 5,
  ratingCount: Math.floor(Math.random() * 100),
}))

const sampleUsers: User[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `user-${i}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: ["admin", "store_manager", "staff", "customer"][Math.floor(Math.random() * 4)] as
    | "admin"
    | "store_manager"
    | "staff"
    | "customer",
  status: ["active", "inactive", "suspended"][Math.floor(Math.random() * 3)] as "active" | "inactive" | "suspended",
  lastActive: `${Math.floor(Math.random() * 24)} hours ago`,
}))

// Dashboard component
export default function SuperAdminDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [stores, setStores] = useState<StoreType[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        setStores(sampleStores)
        setUsers(sampleUsers)
        setIsLoading(false)
      }, 1000)
    }

    loadData()
  }, [])

  // Filter stores based on search term
  const filteredStores = stores.filter((store) => store.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate overview statistics
  const totalActiveStores = stores.filter((store) => store.status === "active").length
  const totalActiveUsers = users.filter((user) => user.status === "active").length
  const totalCustomersInQueue = stores.reduce((sum, store) => sum + store.queueLength, 0)
  const averageRating = stores.length > 0 ? stores.reduce((sum, store) => sum + store.ratings, 0) / stores.length : 0

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setStores(sampleStores)
      setUsers(sampleUsers)
      setIsLoading(false)

      toast({
        title: "Data Refreshed",
        description: "Dashboard data has been updated",
        variant: "default",
      })
    }, 1000)
  }

  // Handle logout
  const handleLogout = () => {
    router.push("/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="mx-auto h-8 w-8 border-2 border-teal-500 border-opacity-30 border-t-teal-500 rounded-full"
          />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard data...</p>
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
                <div className="p-2 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Super Admin Dashboard</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manage all stores and users</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2" onClick={handleRefresh} disabled={isLoading}>
                  {isLoading ? (
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
                        <AvatarFallback>SA</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Super Admin</DropdownMenuLabel>
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
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="stores">Stores</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="ratings">Ratings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Active Stores
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{totalActiveStores}</div>
                      <div className="p-2 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300">
                        <Store className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {Math.round((totalActiveStores / stores.length) * 100)}% of total stores
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{totalActiveUsers}</div>
                      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        <Users className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {Math.round((totalActiveUsers / users.length) * 100)}% of total users
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Rating</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
                      <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
                        <Star className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="flex items-center mt-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(averageRating)
                              ? "text-yellow-400 fill-yellow-400"
                              : i < averageRating
                                ? "text-yellow-400 fill-yellow-400 opacity-50"
                                : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        ({stores.reduce((sum, store) => sum + store.ratingCount, 0)} ratings)
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Customers in Queue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{totalCustomersInQueue}</div>
                      <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                        <BarChart3 className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Avg. {Math.round(totalCustomersInQueue / totalActiveStores)} per store
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Busiest Stores</CardTitle>
                    <CardDescription>Stores with the longest queues</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        {stores
                          .sort((a, b) => b.queueLength - a.queueLength)
                          .slice(0, 5)
                          .map((store, index) => (
                            <div key={store.id} className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <span className="text-sm font-medium">{index + 1}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {store.name}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {store.queueLength} people in queue
                                </p>
                              </div>
                              <div>
                                <Badge
                                  variant="outline"
                                  className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-none"
                                >
                                  {store.queueLength} in queue
                                </Badge>
                              </div>
                            </div>
                          ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Rated Stores</CardTitle>
                    <CardDescription>Highest customer satisfaction</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        {stores
                          .sort((a, b) => b.ratings - a.ratings)
                          .slice(0, 5)
                          .map((store, index) => (
                            <div key={store.id} className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <span className="text-sm font-medium">{index + 1}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {store.name}
                                </h4>
                                <div className="flex items-center mt-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${
                                        i < Math.floor(store.ratings)
                                          ? "text-yellow-400 fill-yellow-400"
                                          : i < store.ratings
                                            ? "text-yellow-400 fill-yellow-400 opacity-50"
                                            : "text-gray-300 dark:text-gray-600"
                                      }`}
                                    />
                                  ))}
                                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                                    ({store.ratingCount})
                                  </span>
                                </div>
                              </div>
                              <div className="text-sm font-medium">{store.ratings.toFixed(1)}</div>
                            </div>
                          ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Stores Tab */}
            <TabsContent value="stores">
              <div className="flex justify-between items-center mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search stores..."
                    className="pl-10 w-[300px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Store</span>
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Store Management</CardTitle>
                  <CardDescription>Manage all stores in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Store</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Queue</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStores.map((store) => (
                        <TableRow key={store.id}>
                          <TableCell>
                            <div className="font-medium">{store.name}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {store.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{store.queueLength} people</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(store.ratings)
                                      ? "text-yellow-400 fill-yellow-400"
                                      : i < store.ratings
                                        ? "text-yellow-400 fill-yellow-400 opacity-50"
                                        : "text-gray-300 dark:text-gray-600"
                                  }`}
                                />
                              ))}
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                                ({store.ratingCount})
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`${
                                store.status === "active"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                  : store.status === "inactive"
                                    ? "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              } border-none capitalize`}
                            >
                              {store.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <div className="flex justify-between items-center mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    className="pl-10 w-[300px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Add User</span>
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage all users in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="font-medium">{user.name}</div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {user.role.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.lastActive}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`${
                                user.status === "active"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                  : user.status === "inactive"
                                    ? "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              } border-none capitalize`}
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Ratings Tab */}
            <TabsContent value="ratings">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Ratings</CardTitle>
                  <CardDescription>View and manage customer feedback</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
                            <div className="flex justify-center mt-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-5 w-5 ${
                                    i < Math.floor(averageRating)
                                      ? "text-yellow-400 fill-yellow-400"
                                      : i < averageRating
                                        ? "text-yellow-400 fill-yellow-400 opacity-50"
                                        : "text-gray-300 dark:text-gray-600"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                              Average rating across all stores
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <div className="text-3xl font-bold">
                              {stores.reduce((sum, store) => sum + store.ratingCount, 0)}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Total ratings submitted</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <div className="text-3xl font-bold">
                              {stores.filter((store) => store.ratings >= 4).length}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Stores with 4+ star rating</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Rating Distribution</h3>
                      <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const count = stores.filter((store) => Math.floor(store.ratings) === rating).length
                          const percentage = Math.round((count / stores.length) * 100)

                          return (
                            <div key={rating} className="flex items-center gap-3">
                              <div className="flex items-center w-16">
                                <span className="font-medium">{rating}</span>
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 ml-1" />
                              </div>
                              <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-yellow-400 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <div className="w-12 text-right text-sm text-gray-500 dark:text-gray-400">
                                {percentage}%
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        <ToastViewport />
      </ToastProvider>
    </div>
  )
}
