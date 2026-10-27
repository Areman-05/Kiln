import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import KilnApp from "./kiln/App"
import "./kiln/kiln.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <KilnApp />
  </StrictMode>,
)
