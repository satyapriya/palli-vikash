export interface GalleryImage {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
}

export interface NewGalleryImage {
  title: string;
  category: string;
  description: string;
  imageFile: File;
}

export interface Category {
  id: string;
  name: string;
  createdAt?: Date;
}

