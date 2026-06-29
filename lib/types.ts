export type Severity = 'Critical' | 'High' | 'Medium' | 'Low'
export type CommentRole = 'Player' | 'Moderator' | 'Admin' | 'Guest' | 'Google'

export interface GameTag {
  id: string
  name: string
  color: string
}

export interface IssueComment {
  id: string
  author: string
  role: CommentRole
  message: string
  createdAt: string
}

export interface IssueRecord {
  id: string
  slug: string
  game: string
  patch: string
  severity: Severity
  title: string
  summary: string
  content: string[]
  affected: number
  fixes: number
  reportedAgo: string
  reportedAt: string
  aiSource: string
  keywords: string[]
  metaTitle: string
  metaDescription: string
  status: 'Live' | 'Investigating' | 'Resolved'
  comments: IssueComment[]
}

export interface CommunityPost {
  id: string
  user: string
  avatar: string
  game: string
  title: string
  message: string
  helpful: number
  replies: number
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  topic: string
  message: string
  createdAt: string
  status: 'Unread' | 'In Review' | 'Answered'
}

export interface VisitorRecord {
  id: string
  ip: string
  location: string
  page: string
  referrer: string
  timestamp: string
  visitedAt: string
  session: string
  type: 'New' | 'Return'
}

export interface UserRecord {
  id: string
  name: string
  email: string
  role: 'User' | 'Moderator' | 'Admin'
  joinedAt: string
  status: 'Active' | 'Flagged' | 'Banned'
  reportedMessages: number
}

export interface SiteSettings {
  title: string
  description: string
  keywords: string[]
  games: string[]
  scheduledSlots: ScheduledSlot[]
  canonicalUrl: string
  ogImage: string
  favicon: string
  launchDate?: string
  brandMark?: string
  headerLinks?: SiteLink[]
  footerLinks?: SiteLink[]
  socialLinks?: SiteLink[]
  contactEmail?: string
  brandTagline?: string
  smtpEnabled: boolean
  otpRequired: boolean
  smtpHost: string
  smtpPort: string
  smtpSender: string
  adminReceivers: string[]
}

export interface SiteLink {
  label: string
  href: string
}

export interface BlogCategory {
  id: string
  slug: string
  name: string
  description: string
  accent: string
  order: number
  icon?: string
}

export type BlogContentBlock =
  | {
      type: 'paragraph'
      text: string
    }
  | {
      type: 'heading'
      level: 2 | 3 | 4
      text: string
    }
  | {
      type: 'image'
      src: string
      alt: string
      caption?: string
      credit?: string
    }
  | {
      type: 'video'
      src: string
      title: string
      caption?: string
    }
  | {
      type: 'quote'
      text: string
      by?: string
    }
  | {
      type: 'list'
      items: string[]
    }

export interface BlogPostRecord {
  id: string
  slug: string
  categoryId: string
  categorySlug?: string
  categoryName?: string
  title: string
  excerpt: string
  summary?: string
  content: BlogContentBlock[]
  tags: string[]
  heroImage: string
  heroImageAlt: string
  heroVideoUrl?: string
  galleryImages: string[]
  author: string
  status: 'published' | 'draft' | 'archived'
  featured: boolean
  featuredOrder: number
  publishedAt: string
  updatedAt: string
  readTime: string
  seoTitle: string
  seoDescription: string
  canonicalPath?: string
  metaTitle?: string
  metaDescription?: string
  videoLinks?: string[]
  imageLinks?: string[]
  sourceLinks?: string[]
  games?: string[]
  slotTime?: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  passwordHash: string
  role: 'user' | 'admin' | 'moderator'
  verified: boolean
  createdAt: string
}

export interface PendingSignup {
  id: string
  name: string
  email: string
  passwordHash: string
  otpCode: string
  expiresAt: string
  createdAt: string
}

export interface AuthSession {
  token: string
  userId: string
  createdAt: string
}

export interface ScheduledSlot {
  id: string
  time: string
  games: string[]
  title?: string
}

export interface PostRecord {
  id: string
  slug: string
  games: string[]
  slotTime: string
  title: string
  summary: string
  content: string[]
  keywords: string[]
  metaTitle: string
  metaDescription: string
  publishedAt: string
  status: 'scheduled' | 'published'
}

export interface SlotDraft {
  time: string
  games: string[]
  title?: string
}
