import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DownloadButton } from "@/components/download-button"

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-none shadow-lg overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600" />
        <CardHeader className="bg-gradient-to-r from-teal-50 to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <CardTitle className="text-xl text-gray-800 dark:text-gray-100">Queue Dashboard</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Download the complete source code
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              This package includes both the login page and dashboard with all necessary components and styles.
            </p>

            <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Included Files:</h3>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>• Login Page with dynamic queue simulation</li>
                <li>• Dashboard with drag-and-drop queue management</li>
                <li>• Shared components and utilities</li>
                <li>• Complete styling with Tailwind CSS</li>
                <li>• Animations with Framer Motion</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-center">
          <DownloadButton />
        </CardFooter>
      </Card>
    </div>
  )
}
