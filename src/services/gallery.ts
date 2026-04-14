import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  orderBy,
  QueryDocumentSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadImage } from '@/lib/cloudinary';
import type { GalleryImage, NewGalleryImage, Category } from '@/types/gallery';

export const getGalleryImages = async (category?: string): Promise<GalleryImage[]> => {
  let q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
  if (category) {
    q = query(q, where('category', '==', category));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc: QueryDocumentSnapshot) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as GalleryImage;
  });
};

export const createCategory = async (name: string): Promise<void> => {
  await addDoc(collection(db, 'categories'), {
    name,
    createdAt: serverTimestamp(),
  });
};

export const getCategories = async (): Promise<string[]> => {
  const snapshot = await getDocs(query(collection(db, 'categories'), orderBy('name')));
  return snapshot.docs.map((doc: QueryDocumentSnapshot) => doc.data() as Category).map(c => c.name).sort();
};

export const addGalleryImage = async (formData: NewGalleryImage): Promise<string> => {
  const { imageFile, ...data } = formData;
  const normalizedData = {
    ...data,
    category: data.category.trim(), // Fix whitespace issues
  };
  const imageUrl = await uploadImage(imageFile);
  const docRef = await addDoc(collection(db, 'gallery'), {
    ...normalizedData,
    imageUrl,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getGalleryImage = async (id: string): Promise<GalleryImage | null> => {
  const docSnap = await getDoc(doc(db, 'gallery', id));
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as GalleryImage;
  }
  return null;
};

export const deleteGalleryImage = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'gallery', id));
};

