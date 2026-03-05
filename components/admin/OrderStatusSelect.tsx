'use client';

import { useState } from 'react';
import { OrderStatus, ORDER_STATUS_LABELS } from '@/types/order';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OrderStatusSelectProps {
  currentStatus: OrderStatus;
  orderId: string;
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => Promise<boolean>;
  disabled?: boolean;
}

// Kolory dla badge'y statusów
const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  processing: 'bg-purple-100 text-purple-800 border-purple-200',
  shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

export function OrderStatusSelect({
  currentStatus,
  orderId,
  onStatusChange,
  disabled = false,
}: OrderStatusSelectProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [localStatus, setLocalStatus] = useState<OrderStatus>(currentStatus);
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (newStatus === localStatus || isUpdating) return;

    setIsUpdating(true);

    try {
      let success = false;

      if (onStatusChange) {
        success = await onStatusChange(orderId, newStatus);
      } else {
        // Fallback - bezpośrednie wywołanie API
        const url = `/api/admin/orders/${orderId}/status`;
        const payload = { status: newStatus };

        const response = await fetch(url, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('❌ Błąd z API:', errorData);
        }

        success = response.ok;
      }

      if (success) {
        setLocalStatus(newStatus);
        toast({
          title: 'Status zaktualizowany',
          description: `Zamówienie zmienione na: ${ORDER_STATUS_LABELS[newStatus]}`,
        });
      } else {
        toast({
          title: 'Błąd',
          description: 'Nie udało się zaktualizować statusu zamówienia',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Błąd',
        description: 'Wystąpił błąd podczas aktualizacji statusu',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Select
        value={localStatus}
        onValueChange={(value) => handleStatusChange(value as OrderStatus)}
        disabled={disabled || isUpdating}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue>
            <div className="flex items-center gap-2">
              {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
              <Badge className={STATUS_COLORS[localStatus]} variant="outline">
                {ORDER_STATUS_LABELS[localStatus]}
              </Badge>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">
            <Badge className={STATUS_COLORS.pending} variant="outline">
              {ORDER_STATUS_LABELS.pending}
            </Badge>
          </SelectItem>
          <SelectItem value="confirmed">
            <Badge className={STATUS_COLORS.confirmed} variant="outline">
              {ORDER_STATUS_LABELS.confirmed}
            </Badge>
          </SelectItem>
          <SelectItem value="processing">
            <Badge className={STATUS_COLORS.processing} variant="outline">
              {ORDER_STATUS_LABELS.processing}
            </Badge>
          </SelectItem>
          <SelectItem value="shipped">
            <Badge className={STATUS_COLORS.shipped} variant="outline">
              {ORDER_STATUS_LABELS.shipped}
            </Badge>
          </SelectItem>
          <SelectItem value="delivered">
            <Badge className={STATUS_COLORS.delivered} variant="outline">
              {ORDER_STATUS_LABELS.delivered}
            </Badge>
          </SelectItem>
          <SelectItem value="cancelled">
            <Badge className={STATUS_COLORS.cancelled} variant="outline">
              {ORDER_STATUS_LABELS.cancelled}
            </Badge>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
