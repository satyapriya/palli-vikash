import { httpsCallable } from 'firebase/functions';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getApp } from 'firebase/app';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, AdminAction } from '@/types/user';
import { getAuth, onAuthStateChanged } from "firebase/auth";



const app = getApp();
const functions = getFunctions(app, "us-central1");

// Uncomment for local emulator
// connectFunctionsEmulator(functions, 'localhost', 5001);

export const makeAdmin = httpsCallable(functions, 'makeAdmin');
export const removeAdmin = async (uid: string) => {
  const auth = getAuth(app);
  const user = auth.currentUser;
  if (!user) throw new Error('Not logged in');

  const idToken = await user.getIdToken();
  const response = await fetch('https://us-central1-palli-vikash.cloudfunctions.net/adminRemoveAdmin', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uid }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return response.json() as Promise<{ success: boolean; message: string }>;
};
export const listAdmins = async () => {
  const auth = getAuth(app);
  const user = auth.currentUser;
  if (!user) throw new Error('Not logged in');

  const idToken = await user.getIdToken();
  const response = await fetch('https://adminlistadmins-4wkqfwlpja-uc.a.run.app', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return response.json() as Promise<{ admins: User[] }>;
};




export const isCurrentUserAdmin = async (firestoreFirst = false): Promise<boolean> => {
  const firebaseAuth = getAuth(app);
  const firestoreDb = db;
// Removed problematic listener - using component effect instead
  console.log("🔥 isCurrentUserAdmin called");
  const user = firebaseAuth.currentUser;
  if (!user) {
    console.log("❌ No user on check");
    return false;
  }
  console.log("✅ User found:", user.uid, user.email);

  try {
    // 🔥 PRIORITY 1: Firestore check (supports manual isAdmin: true setup)
    if (firestoreFirst) {
      const userDocRef = doc(firestoreDb, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data() as any;
        if (userData.isAdmin === true) {
          console.log("✅ Firestore admin confirmed:", user.uid);
          return true;
        }
      }
    }

    // 🔥 PRIORITY 2: Token refresh + server check
    await user.getIdToken(true);
    console.log("✅ Token refreshed for:", user.uid);

    const result = await listAdmins();
    const data = result.admins || [];

    const isServerAdmin = data.some(admin => admin.uid === user.uid);
    console.log("✅ Server admin check:", isServerAdmin);
    return isServerAdmin;
  } catch (err) {
    console.error("Admin check error:", err);
    return false;
  }
};


export const manageAdminRole = async (uid: string, action: AdminAction): Promise<{success: boolean; message: string}> => {
  let callable;
  switch (action) {
    case 'makeAdmin': callable = makeAdmin; break;
    case 'removeAdmin': callable = removeAdmin; break;
    default: throw new Error('Invalid action');
  }
  const { data } = await callable({ uid });
  return data as {success: boolean; message: string};
};

