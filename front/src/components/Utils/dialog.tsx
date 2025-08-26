import { mdiClose } from "@mdi/js"
import Icon from "@mdi/react"
import { motion } from "motion/react"
import type { ReactNode } from "react"
import { createPortal } from "react-dom"

type Props = {
  children: ReactNode
  onClose: () => void
  /** Si true, un clic à l’extérieur de la modale la ferme (par défaut : true) */
  closeOnOutsideClick?: boolean
}

/**
 * Modale réutilisable avec halo bleu, fond sombre et fermeture contrôlée.
 */
export default function Dialog({ children, onClose, closeOnOutsideClick = true }: Props) {
  const handleBackdropClick = () => {
    if (closeOnOutsideClick) onClose()
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center px-4 py-10 overflow-y-auto  "
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onClick={handleBackdropClick}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose()
      }}
    >
      
      {/* Animation de la modale */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.2,
          ease: "easeInOut",
        }}
       
      >

      <dialog
        open
        className="
        relative 
        flex
        justify-center
        max-w-5xl 
        max-h-fit 
        overflow-auto
        bg-white
        text-black         
        rounded-xl p-6 
        shadow-xl 
        overflow-hidden
        border-4
        border-black
      "
        
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >

        {/* Bouton de fermeture */}
        
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer la modale"
          className="cursor-pointer ghost absolute top-4 right-4 text-black hover:text-black p-2 z-20"
        >
          <Icon path={mdiClose} size={1} />

        </button>

        {/* Contenu */}
        <div className="relative z-10">{children}</div>
      </dialog>
      </motion.div>
    </div>,
    document.body
  )
}