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
export const removeAdmin = httpsCallable(functions, 'removeAdmin');
export const listAdmins = httpsCallable(functions, 'listAdmins');




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

    const { data } = await listAdmins() as { data: { admins: User[] } };

    return data.admins.some(admin => admin.uid === user.uid);
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

