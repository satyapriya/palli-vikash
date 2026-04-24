import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getDonations, getAdminStats } from '@/services/donations';
import { makeAdmin, removeAdmin, listAdmins, isCurrentUserAdmin } from '@/services/admin';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { Home, LogOut } from 'lucide-react';
import { User } from '@/types/user';
import { Donation } from '@/types/donation';
import { formatDate, getStatusColor } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  getDonationsFiltered,
  getAllDonors,
  getTrends,
  getDonationsForExport,
  getDonorStats
} from '@/services/donations';
import { DonorStats, Filters, TrendData, DonationType, PaymentMethod, DonationStatus } from '@/types/donation';
import { calcGrowthRate, exportToCSV, getDonorTags, formatCurrency } from '@/lib/utils';
import { Download, Filter, Users, TrendingUp } from 'lucide-react';

// Keep existing AdminStats
interface AdminStats {
  totalDonations: number;
  totalAmount: number;
}

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [donationsLoading, setDonationsLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<AdminStats>({ totalDonations: 0, totalAmount: 0 });
  const [admins, setAdmins] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  // New states for intelligence features
  const [filters, setFilters] = useState<Filters>({
    dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  });
  const [dateRangeOption, setDateRangeOption] = useState<'7d' | '30d' | 'custom'>('7d');
  const [customDateFrom, setCustomDateFrom] = useState('');
  const [customDateTo, setCustomDateTo] = useState('');
  const [donors, setDonors] = useState<DonorStats[]>([]);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [selectedDonor, setSelectedDonor] = useState<DonorStats | null>(null);
  const [loadingFilters, setLoadingFilters] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Dashboard auth state:', user?.uid || 'no user');
      if (user) {
        checkAdminStatus();
      } else {
        navigate('/login');
      }
    });
    return unsubscribe;
  }, []);

  const checkAdminStatus = async () => {
    try {
      setLoading(true);
      const admin = await isCurrentUserAdmin(true); // Firestore-first
      setIsAdmin(admin);
      if (!admin) {
        toast({ title: 'Access Denied', description: 'Admin login required (set users/{uid}/isAdmin=true)', variant: 'destructive' });
        navigate('/donate', { replace: true });
        return;
      }
      // Load admins/users
      loadAdmins();
      loadStats();
      loadDonations();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to verify admin status', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const loadAdmins = async () => {
    try {
      const { data } = await listAdmins();
      setAdmins(data.admins || []);
      
      // Load all users for toggle (simple for 2-3 users)
      const q = query(collection(db, 'users'));
      const snapshot = await getDocs(q);
      setUsers(snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User)));
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load admins' });
    }
  };

  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const newStats = await getAdminStats();
      setStats(newStats);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load stats' });
    } finally {
      setStatsLoading(false);
    }
  };

  const loadDonations = async () => {
    setDonationsLoading(true);
    try {
      const data = await getDonations();
      setDonations(data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load donations' });
    } finally {
      setDonationsLoading(false);
    }
  };

  const loadFilteredData = async () => {
    setLoadingFilters(true);
    try {
      const newDonations = await getDonationsFiltered(filters);
      const newDonors = await getAllDonors(filters);
      const newTrends = await getTrends('day');
      setDonations(newDonations);
      setDonors(newDonors);
      setTrends(newTrends);
    } catch (error) {
      console.error('Filter error:', error);
      toast({ title: 'Error', description: 'Failed to load filtered data. Check console.' , variant: 'destructive' });
    } finally {
      setLoadingFilters(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const exportDonations = () => {
    getDonationsForExport(filters).then(data => {
      exportToCSV(data, `donations-${new Date().toISOString().slice(0,10)}.csv`);
    });
  };

  const exportDonors = () => {
    exportToCSV(donors, `donors-${new Date().toISOString().slice(0,10)}.csv`);
  };

  const openDonorProfile = async (email: string) => {
    const stats = await getDonorStats(email, filters);
    setSelectedDonor(stats || null);
  };

  // Load initial data
  useEffect(() => {
    loadFilteredData();
  }, [filters]);

const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Logged out' });
      navigate('/');
    } catch (error) {
      toast({ title: 'Logout failed', variant: 'destructive' });
    }
  };

const toggleAdmin = async (uid: string, currentIsAdmin: boolean) => {
    try {
      const action = currentIsAdmin ? removeAdmin : makeAdmin;
      const { success, message } = await action({ uid });
      if (success) {
        toast({ title: 'Success', description: message });
        loadAdmins();
      } else {
        toast({ title: 'Error', description: message || 'Failed' }, { variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update role' }, { variant: 'destructive' });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Verifying admin access...</div>;
  }

  const avgDonation = stats.totalDonations > 0 ? Math.round(stats.totalAmount / stats.totalDonations) : 0;

  return (
    <div className="container mx-auto p-8 max-w-7xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Analytics • Donations • User Management</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate('/')}>
            <Home className="mr-2 h-4 w-4" />
          </Button>
          <Button onClick={loadStats} disabled={statsLoading} variant="outline">
            {statsLoading ? 'Loading...' : 'Refresh Stats'}
          </Button>
          <Button onClick={loadFilteredData} disabled={loadingFilters} variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            {loadingFilters ? 'Loading...' : 'Apply Filters'}
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Segmentation
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Date Range */}
            <div>
              <label className="text-sm font-medium mb-1 block">Date Range</label>
              <Select
                defaultValue="7d"
                onValueChange={(v) => {
                  const value = v as '7d' | '30d' | 'custom';
                  setDateRangeOption(value);
                  if (value === '7d') {
                    handleFilterChange({ dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), dateTo: undefined });
                  } else if (value === '30d') {
                    handleFilterChange({ dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), dateTo: undefined });
                  } else {
                    handleFilterChange({ dateFrom: customDateFrom ? new Date(customDateFrom) : undefined, dateTo: customDateTo ? new Date(customDateTo) : undefined });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              {dateRangeOption === 'custom' && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">From</label>
                    <input
                      type="date"
                      className="w-full px-2 py-1.5 text-sm border rounded-md"
                      value={customDateFrom}
                      onChange={(e) => {
                        setCustomDateFrom(e.target.value);
                        handleFilterChange({ dateFrom: e.target.value ? new Date(e.target.value) : undefined });
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">To</label>
                    <input
                      type="date"
                      className="w-full px-2 py-1.5 text-sm border rounded-md"
                      value={customDateTo}
                      onChange={(e) => {
                        setCustomDateTo(e.target.value);
                        handleFilterChange({ dateTo: e.target.value ? new Date(e.target.value) : undefined });
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            {/* Type */}
            <div>
              <label className="text-sm font-medium mb-1 block">Donation Type</label>
              <Select
                defaultValue="all"
                onValueChange={(v) => handleFilterChange({ type: v === 'all' ? undefined : v as DonationType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="one-time">One-time</SelectItem>
                  <SelectItem value="recurring">Recurring</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Payment Method */}
            <div>
              <label className="text-sm font-medium mb-1 block">Payment Method</label>
              <Select
                defaultValue="all"
                onValueChange={(v) => handleFilterChange({ paymentMethod: v === 'all' ? undefined : v as PaymentMethod })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Status */}
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select
                defaultValue="all"
                onValueChange={(v) => handleFilterChange({ status: v === 'all' ? undefined : v as DonationStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Dashboard Views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <TrendingUp className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="donations">
            Donations
          </TabsTrigger>
          <TabsTrigger value="donors">
            <Users className="mr-2 h-4 w-4" />
            Donors
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab: Stats + Charts */}
        <TabsContent value="overview" className="space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatCurrency(stats.totalAmount)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Count</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalDonations.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Donation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatCurrency(avgDonation)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Top Donor LTV</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{donors[0] ? formatCurrency(donors[0].totalAmount) : '₹0'}</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Donation Trends (7 days)</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {trends.length === 0 ? (
                  <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                    No data for trends
                  </div>
                ) : (
                  <ChartContainer config={{
                    amount: { label: 'Amount', color: 'hsl(var(--chart-1))' },
                    count: { label: 'Count', color: 'hsl(var(--chart-2))' }
                  }}>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={trends}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="amount" stroke="var(--color-amount)" name="Amount" />
                        <Line type="monotone" dataKey="count" stroke="var(--color-count)" name="Count" />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            {/* Top Donors Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Top 10 Donors LTV</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {donors.length === 0 ? (
                  <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                    No donors
                  </div>
                ) : (
                  <ChartContainer config={{
                    amount: { label: 'LTV', color: 'hsl(var(--chart-1))' }
                  }}>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={donors.slice(0,10).map(d => ({ name: d.name.slice(0,20), totalAmount: d.totalAmount }))}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="name" angle={-45} height={80} />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} formatter={(value) => [formatCurrency(value as number), 'LTV']} />
                        <Bar dataKey="totalAmount" fill="var(--color-amount)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Donations Tab */}
        <TabsContent value="donations" className="space-y-4">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-semibold">Filtered Donations ({donations.length})</h3>
            </div>
            <Button onClick={exportDonations} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Donor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>ID</TableHead>
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
                      <TableCell>{formatCurrency(donation.amount)}</TableCell>
                      <TableCell>{formatDate(donation.timestamp)}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {donation.razorpayPaymentId.slice(-8)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(donation.status)} variant="outline">
                          {donation.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {donations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No donations match filters. Test via /donate!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Donors Tab */}
        <TabsContent value="donors" className="space-y-4">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-semibold">Donor Intelligence ({donors.length})</h3>
            </div>
            <Button onClick={exportDonors} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Donors
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Donor</TableHead>
                    <TableHead>Total LTV</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Avg</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Last Donation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donors.map((donor) => (
                    <TableRow key={donor.email} className="hover:cursor-pointer" onClick={() => openDonorProfile(donor.email)}>
                      <TableCell className="font-medium">
                        {donor.name}
                        <p className="text-sm text-muted-foreground">{donor.email}</p>
                      </TableCell>
                      <TableCell>{formatCurrency(donor.totalAmount)}</TableCell>
                      <TableCell>{donor.donationCount}</TableCell>
                      <TableCell>{formatCurrency(donor.avgAmount)}</TableCell>
                      <TableCell>{donor.frequency}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {donor.tags.map(tag => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(donor.lastDonation)}</TableCell>
                    </TableRow>
                  ))}
                  {donors.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No donors found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Donor Profile Dialog */}
      <Dialog open={!!selectedDonor} onOpenChange={() => setSelectedDonor(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Donor Profile</DialogTitle>
          </DialogHeader>
          {selectedDonor && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p>{selectedDonor.email}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <p>{selectedDonor.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Total LTV:</span>
                  <p className="font-bold">{formatCurrency(selectedDonor.totalAmount)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Donations:</span>
                  <p>{selectedDonor.donationCount}</p>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground block mb-2">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {getDonorTags(selectedDonor).map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Notes</label>
                <textarea 
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500" 
                  rows={4}
                  defaultValue={selectedDonor.notes || ''}
                  placeholder="Add notes about this donor..."
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;

