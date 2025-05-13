"use client"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import JSZip from "jszip"
import { saveAs } from "file-saver"

export function DownloadButton() {
  const handleDownload = async () => {
    const zip = new JSZip()

    // Add app directory
    const appFolder = zip.folder("app")

    // Add page files
    const pageContent = await fetch("/app/page.tsx").then((res) => res.text())
    const loginPageContent = await fetch("/app/login/page.tsx").then((res) => res.text())
    const layoutContent = await fetch("/app/layout.tsx").then((res) => res.text())
    const globalsContent = await fetch("/app/globals.css").then((res) => res.text())

    appFolder?.file("page.tsx", pageContent)
    appFolder?.file("layout.tsx", layoutContent)
    appFolder?.file("globals.css", globalsContent)

    // Add login folder
    const loginFolder = appFolder?.folder("login")
    loginFolder?.file("page.tsx", loginPageContent)

    // Add components directory
    const componentsFolder = zip.folder("components")

    // Add theme provider
    const themeProviderContent = await fetch("/components/theme-provider.tsx").then((res) => res.text())
    componentsFolder?.file("theme-provider.tsx", themeProviderContent)

    // Add UI components folder
    const uiFolder = componentsFolder?.folder("ui")

    // Add package.json and other config files
    const packageJsonContent = JSON.stringify({
      name: "queue-dashboard",
      version: "0.1.0",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint",
      },
      dependencies: {
        next: "^14.0.0",
        react: "^18.2.0",
        "react-dom": "^18.2.0",
        "framer-motion": "^10.16.4",
        "lucide-react": "^0.292.0",
        "class-variance-authority": "^0.7.0",
        clsx: "^2.0.0",
        "tailwind-merge": "^2.0.0",
        "tailwindcss-animate": "^1.0.7",
        "file-saver": "^2.0.5",
        jszip: "^3.10.1",
      },
      devDependencies: {
        typescript: "^5.2.2",
        autoprefixer: "^10.4.16",
        postcss: "^8.4.31",
        tailwindcss: "^3.3.5",
        "@types/node": "^20.8.10",
        "@types/react": "^18.2.36",
        "@types/react-dom": "^18.2.14",
        "@types/file-saver": "^2.0.5",
        eslint: "^8.53.0",
        "eslint-config-next": "^14.0.0",
      },
    })

    zip.file("package.json", packageJsonContent)

    // Generate the zip file
    const content = await zip.generateAsync({ type: "blob" })

    // Save the zip file
    saveAs(content, "queue-dashboard.zip")
  }

  return (
    <Button onClick={handleDownload} className="gap-2">
      <Download className="h-4 w-4" />
      <span>Download Source Code</span>
    </Button>
  )
}
