
export interface NetworkMetrics {
  reach: number;
  interactions: number;
  engagementRate: number; // Stored as percentage (e.g., 23.32)
  followers: number; // For networks where this is cumulative
  profileVisits: number;
  clicks: number; // Link clicks
  views: number; // Impressions/Visualizations
  contacts: number;
}

export interface LinkedinMetrics extends NetworkMetrics {
  uniqueImpressions?: number;
  reactions?: number;
  comments?: number;
  shares?: number;
}

export interface MonthlyData {
  id: string; // "YYYY-MM"
  month: string;
  year: number;
  monthName: string;
  
  instagram: NetworkMetrics;
  facebook: NetworkMetrics;
  linkedin: LinkedinMetrics;
  
  total: {
    followerIncrease: number;
    followerIncreasePercent: number;
    reach: number;
    interactions: number;
    engagementRate: number;
  };
}

export interface PostData {
  id: string;
  title: string;
  month: string; // Lowercase name from source: "junho", "julho", etc.
  type: string; // "Podcast", "Reels", etc.
  reach: number;
  interactions: number;
  engagement: number; // Percentage
  link?: string; // URL do post
}

export type NetworkType = 'all' | 'instagram' | 'facebook' | 'linkedin';

export interface DateRange {
  startYear: number;
  startMonth: string;
  endYear: number;
  endMonth: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role?: 'admin' | 'editor' | 'viewer';
}
