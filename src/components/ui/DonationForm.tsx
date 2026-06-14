import { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Loader2 } from 'lucide-react';

interface DonationFormProps {
  onSubmit: (data: { amount: number; name: string; email: string }) => void;
  loading: boolean;
}

export const DonationForm = ({ onSubmit, loading }: DonationFormProps) => {
  const [formData, setFormData] = useState({
    amount: 1000,
    name: '',
    email: '',
  });

  const presets = [1000, 5000, 10000, 25000, 50000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Amount Selector */}
      <div>
        <Label className="text-lg font-semibold">Donation Amount</Label>
        <div className="grid grid-cols-5 gap-2 mt-2 mb-4">
          {presets.map((preset) => (
            <Button
              key={preset}
              type="button"
              variant={formData.amount === preset ? 'default' : 'outline'}
              className="h-12"
              onClick={() => setFormData({ ...formData, amount: preset })}
            >
              ₹{preset}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Custom amount"
            value={formData.amount !== presets.includes(formData.amount as number) ? formData.amount : ''}
            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) || 0 })}
            min={10}
            className="flex-1"
          />
          <Button type="button" variant="outline" size="sm">
            Custom
          </Button>
        </div>
      </div>

      {/* Donor Info */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
          />
        </div>
        <div>
          <Label htmlFor="email">Email (for receipt)</Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
          />
        </div>
      </div>

      <Button type="submit" className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          '💳 Donate Securely with Razorpay'
        )}
      </Button>
    </form>
  );
};

