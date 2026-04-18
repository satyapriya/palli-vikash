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
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { User } from '@/types/user';
import { Donation } from '@/types/donation';
import { formatDate, getStatusColor } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

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
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      setLoading(true);
      const admin = await isCurrentUserAdmin();
      setIsAdmin(admin);
      if (!admin) {
        toast({ title: 'Access Denied', description: 'Admin login required', variant: 'destructive' });
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
        <div className="flex gap-2">
          <Button onClick={loadStats} disabled={statsLoading} variant="outline">
            {statsLoading ? 'Loading...' : 'Refresh Stats'}
          </Button>
          <Button onClick={loadDonations} disabled={donationsLoading} variant="outline">
            Refresh Donations
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{stats.totalAmount.toLocaleString()}</div>
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
            <div className="text-3xl font-bold">₹{avgDonation.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs: Donations & Admin Management */}
      <Tabs defaultValue="donations" className="w-full">
        <TabsList>
          <TabsTrigger value="donations">Recent Donations</TabsTrigger>
          <TabsTrigger value="admins">Admin Management ({admins.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="donations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions (Limited to 50)</CardTitle>
            </CardHeader>
            <CardContent>
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
                      <TableCell>₹{donation.amount.toLocaleString()}</TableCell>
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
                        No recent donations. Test via /donate!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="admins" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Users ({admins.length}/{users.length})</CardTitle>
              <CardDescription>Manage admin roles for authorized users</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.uid}>
                      <TableCell className="font-mono text-sm">{user.uid.slice(0, 8)}...</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.isAdmin ? 'default' : 'secondary'}>
                          {user.isAdmin ? 'Admin' : 'User'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toggleAdmin(user.uid, user.isAdmin)}
                          disabled={user.uid === auth.currentUser?.uid}
                        >
                          {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No users yet. Donations will create user docs.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

