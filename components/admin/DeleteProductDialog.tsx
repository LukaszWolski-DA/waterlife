'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

/**
 * Dialog do potwierdzenia usunięcia produktu
 */

interface DeleteProductDialogProps {
  open: boolean;
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteProductDialog({
  open,
  productName,
  onConfirm,
  onCancel,
}: DeleteProductDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Czy na pewno chcesz usunąć ten produkt?</AlertDialogTitle>
          <AlertDialogDescription>
            Produkt <strong className="text-foreground">{productName}</strong> zostanie trwale usunięty.
            Tej operacji nie można cofnąć.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Anuluj</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Usuń produkt
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
