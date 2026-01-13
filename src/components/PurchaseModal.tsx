import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { serverService } from '@/lib/auth';

interface PurchaseModalProps {
  open: boolean;
  onClose: () => void;
  plan: { name: string; price: string } | null;
  userId: string;
  onSuccess: () => void;
}

export default function PurchaseModal({ open, onClose, plan, userId, onSuccess }: PurchaseModalProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    setTimeout(() => {
      serverService.createServer(userId, plan?.name || 'Starter');
      setProcessing(false);
      setSuccess(true);
      
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccess(false);
        setCardNumber('');
        setCardExpiry('');
        setCardCvv('');
        setCardHolder('');
      }, 2000);
    }, 1500);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  if (success) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <Icon name="CheckCircle" size={48} className="text-green-600" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-center">Успешно!</h3>
            <p className="text-center text-muted-foreground">
              Сервер создан и готов к работе
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Оплата тарифа {plan?.name}</DialogTitle>
          <DialogDescription>
            Стоимость: {plan?.price}/месяц
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card-number">Номер карты</Label>
            <Input
              id="card-number"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="card-expiry">Срок действия</Label>
              <Input
                id="card-expiry"
                type="text"
                placeholder="MM/YY"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                maxLength={5}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-cvv">CVV</Label>
              <Input
                id="card-cvv"
                type="text"
                placeholder="123"
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                maxLength={3}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-holder">Имя владельца</Label>
            <Input
              id="card-holder"
              type="text"
              placeholder="IVAN IVANOV"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={processing}>
            {processing ? (
              <>
                <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                Обработка...
              </>
            ) : (
              <>
                <Icon name="CreditCard" size={16} className="mr-2" />
                Оплатить {plan?.price}
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
