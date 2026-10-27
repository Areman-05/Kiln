"use client"

import dynamic from "next/dynamic"
import "@/kiln/kiln.css"

const KilnApp = dynamic(() => import("@/kiln/App"), { ssr: false })

export default function HomePage() {
  return <KilnApp />
}
