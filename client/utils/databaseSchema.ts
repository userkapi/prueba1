// Database schema definitions for TIOSKAP
// This file defines the structure for when connecting to a real database (Neon/Supabase)

export interface DatabaseSchema {
  users: User;
  stories: Story;
  reactions: Reaction;
  mood_entries: MoodEntry;
  goals: Goal;
  goal_milestones: GoalMilestone;
  groups: SupportGroup;
  group_members: GroupMember;
  group_messages: GroupMessage;
  group_events: GroupEvent;
  notifications: Notification;
  moderation_logs: ModerationLog;
  crisis_alerts: CrisisAlert;
  user_sessions: UserSession;
  offline_actions: OfflineAction;
  accessibility_settings: AccessibilitySettings;
  theme_settings: ThemeSettings;
}

// User table
export interface User {
  id: string; // UUID primary key
  email?: string; // Optional for anonymous users
  username: string;
  display_name: string;
  role: 'user' | 'moderator' | 'admin';
  avatar_color: string; // Hex color
  is_anonymous: boolean;
  subscription_type: 'free' | 'premium' | 'professional';
  subscription_expires_at?: Date;
  
  // Stats
  stories_count: number;
  reactions_given: number;
  reactions_received: number;
  login_streak: number;
  karma_points: number;
  
  // Preferences
  language: 'es' | 'en';
  theme: 'light' | 'dark' | 'auto';
  notifications_email: boolean;
  notifications_push: boolean;
  crisis_alerts_enabled: boolean;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
  last_login_at: Date;
  deleted_at?: Date; // Soft delete
  
  // Password (hashed)
  password_hash?: string; // Only for non-anonymous users
  password_salt?: string;
  
  // Verification
  email_verified: boolean;
  verification_token?: string;
  reset_password_token?: string;
  reset_password_expires?: Date;
}

// Stories (Desahogos) table
export interface Story {
  id: string; // UUID primary key
  user_id: string; // Foreign key to users
  content: string;
  mood: 1 | 2 | 3 | 4 | 5;
  category: string;
  tags: string[]; // JSON array
  is_anonymous: boolean;
  word_count: number;
  estimated_read_time: number; // minutes
  
  // Moderation
  moderation_status: 'pending' | 'approved' | 'rejected' | 'flagged';
  moderation_score: number;
  moderation_flags: string[]; // JSON array
  moderated_by?: string; // User ID of moderator
  moderated_at?: Date;
  
  // Engagement
  reactions_count: number;
  reports_count: number;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date; // Soft delete
  
  // SEO/Search
  search_vector?: string; // Full-text search vector
}

// Reactions table
export interface Reaction {
  id: string; // UUID primary key
  story_id: string; // Foreign key to stories
  user_id: string; // Foreign key to users
  reaction_type: 'heart' | 'hug' | 'support' | 'strength' | 'hope';
  
  // Timestamps
  created_at: Date;
  
  // Unique constraint on (story_id, user_id)
}

// Mood entries table
export interface MoodEntry {
  id: string; // UUID primary key
  user_id: string; // Foreign key to users
  date: Date; // Date of the entry (unique per user per day)
  mood: 1 | 2 | 3 | 4 | 5;
  energy: number; // 1-10
  anxiety: number; // 1-10
  sleep_quality: number; // 1-10
  activities: string[]; // JSON array
  notes?: string;
  triggers?: string[]; // JSON array
  gratitude?: string[]; // JSON array
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

// Goals table
export interface Goal {
  id: string; // UUID primary key
  user_id: string; // Foreign key to users
  title: string;
  description: string;
  category: 'mental_health' | 'social' | 'personal' | 'health' | 'learning' | 'creative';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  status: 'active' | 'completed' | 'paused' | 'archived';
  progress: number; // 0-100
  target_date?: Date;
  reminder_frequency?: 'daily' | 'weekly' | 'monthly';
  max_members?: number;
  tags: string[]; // JSON array
  notes: string[]; // JSON array
  is_public: boolean;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
  completed_at?: Date;
}

// Goal milestones table
export interface GoalMilestone {
  id: string; // UUID primary key
  goal_id: string; // Foreign key to goals
  title: string;
  description: string;
  order_index: number;
  points: number;
  is_completed: boolean;
  completed_at?: Date;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

// Support groups table
export interface SupportGroup {
  id: string; // UUID primary key
  name: string;
  description: string;
  category: 'mental_health' | 'anxiety' | 'depression' | 'addiction' | 'grief' | 'relationships' | 'youth' | 'general';
  privacy: 'public' | 'private' | 'invite_only';
  cover_color: string; // Hex color
  created_by: string; // Foreign key to users
  member_count: number;
  max_members: number;
  rules: string[]; // JSON array
  tags: string[]; // JSON array
  is_active: boolean;
  karma_score: number;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
  last_activity_at: Date;
}

// Group members table
export interface GroupMember {
  id: string; // UUID primary key
  group_id: string; // Foreign key to groups
  user_id: string; // Foreign key to users
  role: 'member' | 'moderator' | 'admin' | 'leader';
  karma_points: number;
  contribution_score: number;
  
  // Timestamps
  joined_at: Date;
  last_active_at: Date;
  
  // Unique constraint on (group_id, user_id)
}

// Group messages table
export interface GroupMessage {
  id: string; // UUID primary key
  group_id: string; // Foreign key to groups
  user_id: string; // Foreign key to users
  content: string;
  is_anonymous: boolean;
  is_pinned: boolean;
  is_moderated: boolean;
  reactions: Record<string, string[]>; // JSON object
  reply_to?: string; // Foreign key to another message
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date; // Soft delete
}

// Group events table
export interface GroupEvent {
  id: string; // UUID primary key
  group_id: string; // Foreign key to groups
  created_by: string; // Foreign key to users
  title: string;
  description: string;
  event_type: 'chat' | 'video_call' | 'workshop' | 'meditation' | 'support_circle';
  start_time: Date;
  end_time: Date;
  max_participants?: number;
  meeting_link?: string;
  is_recurring: boolean;
  recurrence_pattern?: string; // JSON
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
  cancelled_at?: Date;
}

// Notifications table
export interface Notification {
  id: string; // UUID primary key
  user_id: string; // Foreign key to users
  type: 'info' | 'success' | 'warning' | 'error' | 'crisis';
  category: 'reaction' | 'crisis' | 'system' | 'community' | 'achievement' | 'reminder';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  is_read: boolean;
  action_url?: string;
  action_text?: string;
  auto_delete_after?: number; // seconds
  
  // Timestamps
  created_at: Date;
  read_at?: Date;
  expires_at?: Date;
}

// Moderation logs table
export interface ModerationLog {
  id: string; // UUID primary key
  content_id: string; // ID of moderated content
  content_type: 'story' | 'comment' | 'message' | 'profile';
  user_id: string; // Foreign key to users (content author)
  moderator_id?: string; // Foreign key to users (moderator)
  action: 'approve' | 'reject' | 'flag' | 'hide' | 'remove' | 'warn' | 'suspend';
  reason: string;
  ai_confidence?: number;
  ai_flags?: string[]; // JSON array
  is_automated: boolean;
  
  // Timestamps
  created_at: Date;
}

// Crisis alerts table
export interface CrisisAlert {
  id: string; // UUID primary key
  user_id: string; // Foreign key to users
  content_id?: string; // Foreign key to story/message
  content_type?: 'story' | 'message' | 'chat';
  alert_level: 'low' | 'medium' | 'high' | 'critical';
  keywords_detected: string[]; // JSON array
  ai_confidence: number;
  status: 'pending' | 'reviewed' | 'contacted' | 'resolved' | 'escalated';
  assigned_to?: string; // Foreign key to users (crisis counselor)
  notes?: string;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
  resolved_at?: Date;
}

// User sessions table (for authentication)
export interface UserSession {
  id: string; // UUID primary key
  user_id: string; // Foreign key to users
  session_token: string; // Hashed
  device_info?: string;
  ip_address?: string;
  user_agent?: string;
  
  // Timestamps
  created_at: Date;
  last_accessed_at: Date;
  expires_at: Date;
}

// Offline actions table (for sync)
export interface OfflineAction {
  id: string; // UUID primary key
  user_id: string; // Foreign key to users
  action_type: 'story_create' | 'story_react' | 'mood_entry' | 'goal_update' | 'notification_mark_read';
  action_data: Record<string, any>; // JSON
  is_synced: boolean;
  sync_attempts: number;
  
  // Timestamps
  created_at: Date;
  synced_at?: Date;
  last_attempt_at?: Date;
}

// Accessibility settings table
export interface AccessibilitySettings {
  id: string; // UUID primary key
  user_id: string; // Foreign key to users
  
  // Visual settings
  high_contrast: boolean;
  reduced_motion: boolean;
  font_size: number;
  line_height: number;
  letter_spacing: number;
  color_blindness_filter: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'monochrome';
  focus_indicators: boolean;
  dyslexia_font: boolean;
  
  // Navigation settings
  keyboard_navigation: boolean;
  skip_links: boolean;
  arrow_key_navigation: boolean;
  breadcrumbs: boolean;
  
  // Audio settings
  sound_enabled: boolean;
  voice_announcements: boolean;
  text_to_speech: boolean;
  sound_volume: number;
  
  // Motor settings
  click_target_size: number;
  click_delay: number;
  sticky_keys: boolean;
  
  // Cognitive settings
  simplified_interface: boolean;
  help_text: boolean;
  confirm_actions: boolean;
  auto_save: boolean;
  reading_guide: boolean;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

// Theme settings table
export interface ThemeSettings {
  id: string; // UUID primary key
  user_id: string; // Foreign key to users
  theme_name: string;
  
  // Colors (JSON object)
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
    accent: string;
    muted: string;
    border: string;
    therapeutic: string;
    comfort: string;
    warm: string;
  };
  
  // Typography
  font_family: string;
  font_size: number;
  line_height: number;
  font_weight: number;
  
  // Layout
  border_radius: number;
  spacing: number;
  container_width: string;
  sidebar_width: number;
  
  // Effects
  animations_enabled: boolean;
  blur_enabled: boolean;
  shadows_enabled: boolean;
  gradients_enabled: boolean;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

// SQL Migration Scripts
export const migrationScripts = {
  // Create users table
  createUsersTable: `
    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE,
      username VARCHAR(100) NOT NULL,
      display_name VARCHAR(100) NOT NULL,
      role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
      avatar_color VARCHAR(7) NOT NULL,
      is_anonymous BOOLEAN DEFAULT false,
      subscription_type VARCHAR(20) DEFAULT 'free' CHECK (subscription_type IN ('free', 'premium', 'professional')),
      subscription_expires_at TIMESTAMP,
      
      stories_count INTEGER DEFAULT 0,
      reactions_given INTEGER DEFAULT 0,
      reactions_received INTEGER DEFAULT 0,
      login_streak INTEGER DEFAULT 0,
      karma_points INTEGER DEFAULT 0,
      
      language VARCHAR(2) DEFAULT 'es' CHECK (language IN ('es', 'en')),
      theme VARCHAR(10) DEFAULT 'auto' CHECK (theme IN ('light', 'dark', 'auto')),
      notifications_email BOOLEAN DEFAULT true,
      notifications_push BOOLEAN DEFAULT true,
      crisis_alerts_enabled BOOLEAN DEFAULT false,
      
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      last_login_at TIMESTAMP,
      deleted_at TIMESTAMP,
      
      password_hash VARCHAR(255),
      password_salt VARCHAR(255),
      
      email_verified BOOLEAN DEFAULT false,
      verification_token VARCHAR(255),
      reset_password_token VARCHAR(255),
      reset_password_expires TIMESTAMP
    );
    
    CREATE INDEX idx_users_email ON users(email);
    CREATE INDEX idx_users_username ON users(username);
    CREATE INDEX idx_users_created_at ON users(created_at);
  `,

  // Create stories table
  createStoriesTable: `
    CREATE TABLE stories (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      mood INTEGER CHECK (mood BETWEEN 1 AND 5),
      category VARCHAR(50) NOT NULL,
      tags JSONB DEFAULT '[]',
      is_anonymous BOOLEAN DEFAULT true,
      word_count INTEGER DEFAULT 0,
      estimated_read_time INTEGER DEFAULT 1,
      
      moderation_status VARCHAR(20) DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'flagged')),
      moderation_score DECIMAL(3,2) DEFAULT 0,
      moderation_flags JSONB DEFAULT '[]',
      moderated_by UUID REFERENCES users(id),
      moderated_at TIMESTAMP,
      
      reactions_count INTEGER DEFAULT 0,
      reports_count INTEGER DEFAULT 0,
      
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      deleted_at TIMESTAMP,
      
      search_vector tsvector
    );
    
    CREATE INDEX idx_stories_user_id ON stories(user_id);
    CREATE INDEX idx_stories_created_at ON stories(created_at);
    CREATE INDEX idx_stories_category ON stories(category);
    CREATE INDEX idx_stories_mood ON stories(mood);
    CREATE INDEX idx_stories_moderation_status ON stories(moderation_status);
    CREATE INDEX idx_stories_search_vector ON stories USING GIN(search_vector);
  `,

  // Add more table creation scripts...
  createReactionsTable: `
    CREATE TABLE reactions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      reaction_type VARCHAR(20) NOT NULL CHECK (reaction_type IN ('heart', 'hug', 'support', 'strength', 'hope')),
      created_at TIMESTAMP DEFAULT NOW(),
      
      UNIQUE(story_id, user_id)
    );
    
    CREATE INDEX idx_reactions_story_id ON reactions(story_id);
    CREATE INDEX idx_reactions_user_id ON reactions(user_id);
  `,

  // Add trigger for updating search vector
  createSearchTrigger: `
    CREATE OR REPLACE FUNCTION update_stories_search_vector()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.search_vector = to_tsvector('spanish', NEW.content || ' ' || NEW.category || ' ' || array_to_string(NEW.tags, ' '));
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    
    CREATE TRIGGER trigger_update_stories_search_vector
      BEFORE INSERT OR UPDATE ON stories
      FOR EACH ROW EXECUTE FUNCTION update_stories_search_vector();
  `
};

// Database connection utility
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
}

// API interface for database operations
export interface DatabaseAPI {
  // Users
  createUser(userData: Partial<User>): Promise<User>;
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;

  // Stories
  createStory(storyData: Partial<Story>): Promise<Story>;
  getStories(filters: StoryFilters): Promise<Story[]>;
  getStoryById(id: string): Promise<Story | null>;
  updateStory(id: string, updates: Partial<Story>): Promise<Story>;
  deleteStory(id: string): Promise<void>;

  // Reactions
  addReaction(storyId: string, userId: string, type: string): Promise<Reaction>;
  removeReaction(storyId: string, userId: string): Promise<void>;
  getUserReactions(userId: string): Promise<Reaction[]>;

  // Mood tracking
  addMoodEntry(moodData: Partial<MoodEntry>): Promise<MoodEntry>;
  getMoodEntries(userId: string, dateRange?: { from: Date; to: Date }): Promise<MoodEntry[]>;
  updateMoodEntry(id: string, updates: Partial<MoodEntry>): Promise<MoodEntry>;

  // Goals
  createGoal(goalData: Partial<Goal>): Promise<Goal>;
  getUserGoals(userId: string): Promise<Goal[]>;
  updateGoal(id: string, updates: Partial<Goal>): Promise<Goal>;
  deleteGoal(id: string): Promise<void>;

  // Groups
  createGroup(groupData: Partial<SupportGroup>): Promise<SupportGroup>;
  getGroups(filters: GroupFilters): Promise<SupportGroup[]>;
  joinGroup(groupId: string, userId: string): Promise<GroupMember>;
  leaveGroup(groupId: string, userId: string): Promise<void>;

  // Notifications
  createNotification(notificationData: Partial<Notification>): Promise<Notification>;
  getUserNotifications(userId: string): Promise<Notification[]>;
  markNotificationAsRead(id: string): Promise<void>;

  // Crisis alerts
  createCrisisAlert(alertData: Partial<CrisisAlert>): Promise<CrisisAlert>;
  getCrisisAlerts(filters: CrisisAlertFilters): Promise<CrisisAlert[]>;
  updateCrisisAlert(id: string, updates: Partial<CrisisAlert>): Promise<CrisisAlert>;
}

export interface StoryFilters {
  userId?: string;
  category?: string;
  mood?: number;
  tags?: string[];
  search?: string;
  dateRange?: { from: Date; to: Date };
  limit?: number;
  offset?: number;
}

export interface GroupFilters {
  category?: string;
  privacy?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CrisisAlertFilters {
  status?: string;
  alertLevel?: string;
  assignedTo?: string;
  dateRange?: { from: Date; to: Date };
  limit?: number;
  offset?: number;
}
