"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Save } from "lucide-react"
import { updateRegion } from "@/lib/firebase"

interface EditRegionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  region: any
  onRegionUpdated: () => void
}

export default function EditRegionDialog({ open, onOpenChange, region, onRegionUpdated }: EditRegionDialogProps) {
  const [editableRegion, setEditableRegion] = useState(region)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      await updateRegion(region.id, editableRegion)
      onRegionUpdated()
      onOpenChange(false)
    } catch (error) {
      console.error("Erro ao salvar região:", error)
      setError(`Erro ao salvar região: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Região: {region.name}</DialogTitle>
          <DialogDescription>Atualize os dados desta região. Clique em salvar quando terminar.</DialogDescription>
        </DialogHeader>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input
              id="name"
              value={editableRegion.name}
              onChange={(e) => setEditableRegion({ ...editableRegion, name: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hospitals" className="text-right">
              Hospitais
            </Label>
            <Input
              id="hospitals"
              type="number"
              value={editableRegion.hospitals}
              onChange={(e) => setEditableRegion({ ...editableRegion, hospitals: Number(e.target.value) })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="urbanAccessIndex" className="text-right">
              Índice de Acesso Urbano
            </Label>
            <Input
              id="urbanAccessIndex"
              type="number"
              value={editableRegion.urbanAccessIndex}
              onChange={(e) => setEditableRegion({ ...editableRegion, urbanAccessIndex: Number(e.target.value) })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ruralAccessIndex" className="text-right">
              Índice de Acesso Rural
            </Label>
            <Input
              id="ruralAccessIndex"
              type="number"
              value={editableRegion.ruralAccessIndex}
              onChange={(e) => setEditableRegion({ ...editableRegion, ruralAccessIndex: Number(e.target.value) })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="doctors" className="text-right">
              Médicos
            </Label>
            <Input
              id="doctors"
              type="number"
              value={editableRegion.doctors}
              onChange={(e) => setEditableRegion({ ...editableRegion, doctors: Number(e.target.value) })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="beds" className="text-right">
              Leitos
            </Label>
            <Input
              id="beds"
              type="number"
              value={editableRegion.beds}
              onChange={(e) => setEditableRegion({ ...editableRegion, beds: Number(e.target.value) })}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {saving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
