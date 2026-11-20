export interface DigitalProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  fullDescription: string;
  price: number;
  discountPrice: number | null;
  category: string;
  version: string;
  thumbnail: string | null;
  previewVideo: string | null;
  gallery: string[];
  features: string[];
  compatibility: string[];
  featured: boolean;
  status: 'published';
  artwork?: 'orbit' | 'type' | 'forms' | 'signal' | 'grid' | 'flow';
}
