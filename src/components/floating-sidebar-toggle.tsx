"use client"

import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { PanelLeftIcon } from "lucide-react"

/**
 * Bouton de bascule de la sidebar, fixé en permanence en haut à gauche de
 * l'écran (indépendant du décalage du contenu quand la sidebar s'ouvre/ferme).
 */
export function FloatingSidebarToggle() {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      className="fixed left-2 top-2 z-50 h-8 w-8"
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      aria-label="Afficher ou masquer le menu"
    >
      <PanelLeftIcon />
    </Button>
  )
}
