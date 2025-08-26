import type { FormEvent, ReactNode } from "react"
import Dialog from "../Utils/dialog"

type Props = {
  title: string
  onClose: () => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  children: ReactNode
  footer?: ReactNode
};

export default function FormModal({ title, onClose, onSubmit, children, footer }: Props) {
  return (
    <Dialog onClose={onClose}>
      {/** biome-ignore lint/a11y/useKeyWithClickEvents: <Linter capricieux> */}
      <form
        onSubmit={onSubmit}
        className="relative bg-[#1e1e1e] text-white border border-[#2a2a2a] rounded-xl p-6 space-y-6 w-full max-w-screen-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Titre */}
        <h2 className="text-xl font-semibold">{title}</h2>

        {/* Formulaire */}
        <div className="space-y-4">{children}</div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t border-[#2a2a2a]">
          {footer ?? (
            <>
              <button type="button" className="ghost" onClick={onClose}>
                Annuler
              </button>
              <button className="btn btn-primary" type="submit">Valider</button>
            </>
          )}
        </div>
      </form>
    </Dialog>
  )
}