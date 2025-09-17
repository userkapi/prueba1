import { neon } from '@neondatabase/serverless';

// Initialize the database connection safely
const CONNECTION_STRING = import.meta.env.VITE_DATABASE_URL as string | undefined;
export const isDbConfigured = Boolean(CONNECTION_STRING);
export const sql = isDbConfigured ? neon(CONNECTION_STRING as string) : (null as any);
function ensureDbConfigured() {
  if (!isDbConfigured) {
    throw new Error('Database is not configured. Set VITE_DATABASE_URL environment variable to your Neon connection string.');
  }
}

// Database operations for users
export const db = {
  // User operations
  async createUser(userData: {
    username: string;
    display_name: string;
    avatar_color: string;
    email?: string | null;
    is_anonymous?: boolean;
  }) {
    // Validate required fields
    if (!userData.username || !userData.display_name || !userData.avatar_color) {
      throw new Error('Missing required fields: username, display_name, and avatar_color are required');
    }

    ensureDbConfigured();
    try {
      const [user] = await sql`
        INSERT INTO users (username, display_name, avatar_color, email, is_anonymous)
        VALUES (
          ${userData.username},
          ${userData.display_name},
          ${userData.avatar_color},
          ${userData.email || null},
          ${userData.is_anonymous || false}
        )
        RETURNING *
      `;
      return user;
    } catch (error) {
      console.error('Database error creating user:', error);
      throw error;
    }
  },

  async getUserById(id: string) {
    ensureDbConfigured();
    const [user] = await sql`
      SELECT * FROM users WHERE id = ${id} AND deleted_at IS NULL
    `;
    return user;
  },

  async getUserByEmail(email: string) {
    ensureDbConfigured();
    const [user] = await sql`
      SELECT * FROM users WHERE email = ${email} AND deleted_at IS NULL
    `;
    return user;
  },

  async updateUser(id: string, updates: Record<string, any>) {
    ensureDbConfigured();
    if (Object.keys(updates).length === 0) {
      return await this.getUserById(id);
    }

    // Handle common update scenarios individually to avoid SQL injection
    const allowedFields = [
      'username', 'display_name', 'email', 'avatar_color', 'role',
      'subscription_type', 'subscription_expires_at', 'language', 'theme',
      'notifications_email', 'notifications_push', 'crisis_alerts_enabled',
      'last_login_at', 'stories_count', 'reactions_given', 'reactions_received',
      'login_streak', 'karma_points', 'deleted_at'
    ];

    // Filter to only allowed fields
    const safeUpdates = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {} as Record<string, any>);

    if (Object.keys(safeUpdates).length === 0) {
      return await this.getUserById(id);
    }

    // Simple approach: update one field at a time for safety
    let user = await this.getUserById(id);

    for (const [key, value] of Object.entries(safeUpdates)) {
      const query = `UPDATE users SET ${key} = $2, updated_at = NOW() WHERE id = $1 RETURNING *`;
      const result = await sql.query(query, [id, value]);
      user = result[0];
    }

    return user;
  },

  // Story operations
  async createStory(storyData: {
    user_id: string;
    content: string;
    mood: number;
    category: string;
    tags?: string[];
    is_anonymous?: boolean;
  }) {
    ensureDbConfigured();
    const word_count = storyData.content.split(/\s+/).length;
    const estimated_read_time = Math.max(1, Math.ceil(word_count / 200));

    const [story] = await sql`
      INSERT INTO stories (user_id, content, mood, category, tags, is_anonymous, word_count, estimated_read_time)
      VALUES (
        ${storyData.user_id}, 
        ${storyData.content}, 
        ${storyData.mood}, 
        ${storyData.category}, 
        ${JSON.stringify(storyData.tags || [])}, 
        ${storyData.is_anonymous || true},
        ${word_count},
        ${estimated_read_time}
      )
      RETURNING *
    `;
    return story;
  },

  async getStories(filters: {
    limit?: number;
    offset?: number;
    category?: string;
    mood?: number;
    user_id?: string;
  } = {}) {
    const { limit = 20, offset = 0, category, mood, user_id } = filters;

    // Use a simple approach: fetch all approved stories first, then filter
    ensureDbConfigured();
    const stories = await sql`
      SELECT s.*, u.username, u.display_name, u.avatar_color
      FROM stories s
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.deleted_at IS NULL AND (s.moderation_status = 'approved' OR s.moderation_status = 'pending')
      ORDER BY s.created_at DESC
    `;

    // Apply filters in JavaScript for simplicity and to avoid SQL injection
    let filteredStories = stories;

    if (category) {
      filteredStories = filteredStories.filter(story => story.category === category);
    }

    if (mood) {
      filteredStories = filteredStories.filter(story => story.mood === mood);
    }

    if (user_id) {
      filteredStories = filteredStories.filter(story => story.user_id === user_id);
    }

    // Apply pagination
    return filteredStories.slice(offset, offset + limit);
  },

  async getStoryById(id: string) {
    ensureDbConfigured();
    const [story] = await sql`
      SELECT s.*, u.username, u.display_name, u.avatar_color
      FROM stories s
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.id = ${id} AND s.deleted_at IS NULL
    `;
    return story;
  },

  // Reaction operations
  async addReaction(storyId: string, userId: string, reactionType: string) {
    ensureDbConfigured();
    try {
      const [reaction] = await sql`
        INSERT INTO reactions (story_id, user_id, reaction_type)
        VALUES (${storyId}, ${userId}, ${reactionType})
        ON CONFLICT (story_id, user_id) 
        DO UPDATE SET reaction_type = ${reactionType}, created_at = NOW()
        RETURNING *
      `;

      // Update reaction count
      await sql`
        UPDATE stories 
        SET reactions_count = (
          SELECT COUNT(*) FROM reactions WHERE story_id = ${storyId}
        )
        WHERE id = ${storyId}
      `;

      return reaction;
    } catch (error) {
      console.error('Error adding reaction:', error);
      throw error;
    }
  },

  async removeReaction(storyId: string, userId: string) {
    ensureDbConfigured();
    await sql`
      DELETE FROM reactions 
      WHERE story_id = ${storyId} AND user_id = ${userId}
    `;

    // Update reaction count
    await sql`
      UPDATE stories 
      SET reactions_count = (
        SELECT COUNT(*) FROM reactions WHERE story_id = ${storyId}
      )
      WHERE id = ${storyId}
    `;
  },

  async getUserReactions(userId: string, storyIds: string[]) {
    if (storyIds.length === 0) return [];
    
    ensureDbConfigured();
    const reactions = await sql`
      SELECT story_id, reaction_type
      FROM reactions 
      WHERE user_id = ${userId} AND story_id = ANY(${storyIds})
    `;
    
    return reactions;
  },

  // Notification operations
  async createNotification(notificationData: {
    user_id: string;
    type: string;
    category: string;
    title: string;
    message: string;
    priority?: string;
    action_url?: string;
    action_text?: string;
    auto_delete_after?: number;
  }) {
    ensureDbConfigured();
    const [notification] = await sql`
      INSERT INTO notifications (
        user_id, type, category, title, message, priority, 
        action_url, action_text, auto_delete_after
      )
      VALUES (
        ${notificationData.user_id}, 
        ${notificationData.type}, 
        ${notificationData.category}, 
        ${notificationData.title}, 
        ${notificationData.message},
        ${notificationData.priority || 'medium'},
        ${notificationData.action_url || null},
        ${notificationData.action_text || null},
        ${notificationData.auto_delete_after || null}
      )
      RETURNING *
    `;
    return notification;
  },

  async getUserNotifications(userId: string, limit = 50) {
    ensureDbConfigured();
    const notifications = await sql`
      SELECT * FROM notifications
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
    return notifications;
  },

  async markNotificationAsRead(id: string) {
    ensureDbConfigured();
    const [notification] = await sql`
      UPDATE notifications 
      SET is_read = true, read_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return notification;
  },

  // Helper function to test connection
  async testConnection() {
    try {
      ensureDbConfigured();
      const [result] = await sql`SELECT NOW() as current_time`;
      return { success: true, time: result.current_time };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default db;
