import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getDonations } from '@/services/donations';
import { Donation, DonationStatus } from '@/types/donation';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';

const AdminDashboard = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      setLoading(true);
      const data = await getDonations();
      setDonations(data);
    } catch (err) {
      setError('Failed to load donations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalDonations = donations.length;

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error) return <div className="text-destructive text-center p-8">{error}</div>;

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Donation analytics and management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDonations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Donation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalDonations > 0 ? '₹' + Math.round(totalAmount / totalDonations).toLocaleString() : '₹0'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Donations Table */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Donations</CardTitle>
              <CardDescription>Latest transactions from donors</CardDescription>
            </div>
            <Button onClick={loadDonations} variant="outline">Refresh</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Payment ID</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell className="font-medium">
                    {donation.donorName}
                    <p className="text-sm text-muted-foreground">{donation.donorEmail}</p>
                  </TableCell>
                  <TableCell>₹{donation.amount.toLocaleString()}</TableCell>
                  <TableCell>{formatDate(donation.timestamp)}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {donation.razorpayPaymentId.slice(-8)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(donation.status)} variant="secondary">
                      {donation.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {donations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No donations yet. Make a test donation!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;

