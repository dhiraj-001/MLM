import { RefreshCw } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center">
        <RefreshCw className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading quiz...</p>
      </div>
    </div>
  )
}
