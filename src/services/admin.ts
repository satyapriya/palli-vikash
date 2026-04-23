import { httpsCallable } from 'firebase/functions';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getApp } from 'firebase/app';
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




export const isCurrentUserAdmin = async (): Promise<boolean> => {
  try {
    const auth = getAuth(app);

    const user = auth.currentUser;
    if (!user) {
      console.log("❌ No user");
      return false;
    }

    // 🔥 FORCE TOKEN REFRESH (CRITICAL FIX)
    await user.getIdToken(true);

    console.log("✅ Token refreshed for:", user.uid);

    const result = await listAdmins();
    const data = result.admins || []; // Raw response from HTTP

    return data.some(admin => admin.uid === user.uid);
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

