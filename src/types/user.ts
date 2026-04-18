export interface User {
  uid: string;
  email: string;
  displayName?: string;
  isAdmin: boolean;
  createdAt?: Date;
}

export type AdminAction = 'makeAdmin' | 'removeAdmin' | 'listAdmins';

