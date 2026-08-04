/**
 * Bot Constants and Configuration
 * جميع الثوابت والإعدادات المتعلقة بالبوت
 */

export const BOT_CONFIG = {
  // Telegram API
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
  TELEGRAM_API_URL: 'https://api.telegram.org/bot',
  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET || 'your-secret-key',
  
  // Server
  PORT: parseInt(process.env.PORT || '3000'),
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: 60000, // 1 minute
  RATE_LIMIT_MAX_REQUESTS: 30, // max 30 requests per minute
  
  // Points Configuration
  REFERRAL_POINTS: 1,
  VIP_FEATURE_COST: 15,
  
  // Payment
  TELEGRAM_STARS_PROVIDER_TOKEN: process.env.TELEGRAM_STARS_PROVIDER_TOKEN || '',
  
  // Admin
  ADMIN_IDS: (process.env.ADMIN_IDS || '').split(',').filter(Boolean).map(Number),
};

// Button Types
export const BUTTON_TYPES = {
  ADMIN: 'admin',
  VIP: 'vip',
  USER: 'user',
  FUN: 'fun',
  PAYMENT: 'payment',
} as const;

// Callback Data Patterns
export const CALLBACKS = {
  // Admin
  ADMIN_PANEL: 'admin_panel',
  USERS_LIST: 'users_list',
  BAN_USER: 'ban_user',
  UNBAN_USER: 'unban_user',
  BROADCAST: 'broadcast',
  TOGGLE_BOT: 'toggle_bot',
  TOGGLE_MODE: 'toggle_mode',
  MANAGE_CHANNELS: 'manage_channels',
  MANAGE_BUTTONS: 'manage_buttons',
  
  // VIP Features
  VIP_MENU: 'vip_menu',
  EXTRACT_PHOTOS: 'extract_photos',
  EXTRACT_NUMBERS: 'extract_numbers',
  EXTRACT_MESSAGES: 'extract_messages',
  FORMAT_PHONE: 'format_phone',
  PHISHING_IMAGE: 'phishing_image',
  PHISHING_FILE: 'phishing_file',
  RECORD_AUDIO: 'record_audio',
  RECORD_VIDEO: 'record_video',
  
  // Fun
  JOKES: 'jokes',
  FAKE_REPORT: 'fake_report',
  SCREENSHOT: 'screenshot',
  
  // Points
  SHOW_POINTS: 'show_points',
  BUY_POINTS: 'buy_points',
  BUY_VIP: 'buy_vip',
  REFERRAL_LINK: 'referral_link',
  
  // Navigation
  BACK: 'back',
  CANCEL: 'cancel',
} as const;

// Messages
export const MESSAGES = {
  WELCOME: '👋 مرحباً بك في البوت!',
  MUST_SUBSCRIBE: '❌ يجب أن تشترك في القنوات التالية أولاً:',
  SUBSCRIBE_BUTTON: '✅ اشترك الآن',
  ADMIN_MENU: '🔧 لوحة التحكم - اختر ما تريد:',
  VIP_MENU: '💎 الخدمات المتقدمة (VIP) - 15 نقطة لكل خدمة',
  INSUFFICIENT_POINTS: '❌ رصيدك لا يكفي. اجمع نقاط بدعوة أصدقائك!',
  BOT_DISABLED: '🚫 البوت معطل حالياً.',
  PAID_MODE_ENABLED: '💰 تم تفعيل الوضع المدفوع.',
  FREE_MODE_ENABLED: '🆓 تم تفعيل الوضع المجاني.',
  POINTS_ADDED: '✅ تم إضافة {points} نقطة إلى رصيدك!',
  PAYMENT_RECEIVED: '💳 شكراً للدفع! تم إضافة {points} نقطة.',
  ERROR: '⚠️ حدث خطأ. حاول لاحقاً.',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_WEBHOOK: 'Invalid webhook signature',
  USER_BANNED: 'User is banned',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
  BOT_DISABLED: 'Bot is currently disabled',
  INVALID_INPUT: 'Invalid input provided',
  DATABASE_ERROR: 'Database error occurred',
  TELEGRAM_API_ERROR: 'Telegram API error',
} as const;

export default BOT_CONFIG;
