import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Success', description: 'Logged in! Redirecting to admin...' });
      navigate('/admin');
    } catch (error: any) {
      toast({ title: 'Login Failed', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      // Create user doc
      await setDoc(doc(db, 'users', uid), {
        uid,
        email: userCredential.user.email!,
        isAdmin: false,
        createdAt: new Date().toISOString()
      });
      toast({ 
        title: 'Account Created! 🎉', 
        description: `UID: ${uid.slice(0,8)}... Set isAdmin: true in Firestore users/${uid}`
      });
      navigate('/admin');
    } catch (error: any) {
      toast({ title: 'Signup Failed', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const uid = result.user.uid;
      // Create/update user doc
      await setDoc(doc(db, 'users', uid), {
        uid,
        email: result.user.email!,
        displayName: result.user.displayName || '',
        isAdmin: false,
        createdAt: new Date().toISOString()
      }, { merge: true });
      toast({ title: 'Google Login Success', description: `UID: ${uid.slice(0,8)}...` });
      navigate('/admin');
    } catch (error: any) {
      toast({ title: 'Google Login Failed', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Logged out' });
      navigate('/');
    } catch (error) {
      toast({ title: 'Logout failed', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">🔐 Admin Login</CardTitle>
          <CardDescription className="text-center">
            Sign up/login → Set isAdmin=true in Firestore → Access /admin instantly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Login */}
          <Button onClick={handleGoogleLogin} className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="mr-2 h-5 w-5" />
            Continue with Google
          </Button>
          
          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or email</span>
            </div>
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailLogin} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email" 
                placeholder="admin@pallivikash.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password"
                placeholder="Strong password (8+ chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading || !email || !password}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>

          <Button type="button" variant="outline" className="w-full" onClick={handleEmailSignup} disabled={loading}>
            Create New Admin Account
          </Button>

          {auth.currentUser && (
            <div className="text-center p-2 bg-muted rounded-md">
              <p>✅ Logged in as {auth.currentUser.email}</p>
              <Button variant="destructive" size="sm" className="mt-1" onClick={handleLogout}>
                Logout
              </Button>

              <Button variant="destructive" size="sm" className="mt-1" onClick={() => navigate('/admin')}>
                Go to Admin
              </Button>
            </div>
          )}

          <div className="text-xs text-center text-muted-foreground p-2 border rounded-md bg-background/50">
            👉 <strong>After login:</strong> Firebase Console → Firestore → users/[UID] → isAdmin: true
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

