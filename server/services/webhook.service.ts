import crypto from 'crypto';
import { BOT_CONFIG } from '@shared/bot-constants';
import { logError } from './logger.service';

/**
 * التحقق من صحة توقيع Webhook
 * يتحقق من أن الطلب يأتي من Telegram بالفعل
 */
export function verifyWebhookSignature(
  body: string,
  signature: string | undefined
): boolean {
  if (!signature) {
    logError('verifyWebhookSignature', 'Missing signature header');
    return false;
  }

  try {
    const secretKey = crypto
      .createHash('sha256')
      .update(BOT_CONFIG.WEBHOOK_SECRET)
      .digest();

    const hash = crypto
      .createHmac('sha256', secretKey)
      .update(body)
      .digest('hex');

    return hash === signature;
  } catch (error) {
    logError('verifyWebhookSignature', error);
    return false;
  }
}

/**
 * معالجة webhook من Telegram
 */
export interface WebhookUpdate {
  update_id: number;
  message?: {
    message_id: number;
    date: number;
    chat: {
      id: number;
      type: string;
      first_name?: string;
      username?: string;
    };
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      username?: string;
    };
    text?: string;
    photo?: any[];
    document?: any;
    video?: any;
    audio?: any;
  };
  callback_query?: {
    id: string;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      username?: string;
    };
    chat_instance: string;
    data: string;
    message?: {
      message_id: number;
      chat: {
        id: number;
      };
    };
  };
  pre_checkout_query?: {
    id: string;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
    };
    currency: string;
    total_amount: number;
    invoice_payload: string;
  };
  successful_payment?: {
    currency: string;
    total_amount: number;
    invoice_payload: string;
    telegram_payment_charge_id: string;
    provider_payment_charge_id: string;
  };
}

/**
 * استخراج معرف المستخدم من الـ update
 */
export function extractUserId(update: WebhookUpdate): number | null {
  if (update.message?.from?.id) {
    return update.message.from.id;
  }
  if (update.callback_query?.from?.id) {
    return update.callback_query.from.id;
  }
  if (update.pre_checkout_query?.from?.id) {
    return update.pre_checkout_query.from.id;
  }
  return null;
}

/**
 * استخراج معرف المحادثة من الـ update
 */
export function extractChatId(update: WebhookUpdate): number | null {
  if (update.message?.chat?.id) {
    return update.message.chat.id;
  }
  if (update.callback_query?.message?.chat?.id) {
    return update.callback_query.message.chat.id;
  }
  return null;
}

/**
 * التحقق من أن المستخدم ليس محظوراً
 */
export async function isUserBanned(userId: number): Promise<boolean> {
  try {
    const { getDb } = await import('../db');
    const { users } = await import('../../drizzle/schema');
    const { eq } = await import('drizzle-orm');

    const db = await getDb();
    if (!db) return false;

    const user = await db
      .select()
      .from(users)
      .where(eq(users.telegramUserId, userId))
      .limit(1);

    return user.length > 0 && (user[0].isBanned ?? false);
  } catch (error) {
    logError('isUserBanned', error);
    return false;
  }
}

/**
 * التحقق من أن المستخدم مشترك في جميع القنوات الإجبارية
 */
export async function isUserSubscribedToAllChannels(userId: number): Promise<boolean> {
  try {
    const { getDb } = await import('../db');
    const { telegramChannels } = await import('../../drizzle/schema');
    const { checkChannelSubscription } = await import('./telegram.service');

    const db = await getDb();
    if (!db) return false;

    const { eq } = await import('drizzle-orm');
    const channels = await db
      .select()
      .from(telegramChannels)
      .where(eq(telegramChannels.isRequired, true));

    if (channels.length === 0) return true;

    for (const channel of channels) {
      const isSubscribed = await checkChannelSubscription(userId, channel.channelId);
      if (!isSubscribed) {
        return false;
      }
    }

    return true;
  } catch (error) {
    logError('isUserSubscribedToAllChannels', error);
    return false;
  }
}

export default {
  verifyWebhookSignature,
  extractUserId,
  extractChatId,
  isUserBanned,
  isUserSubscribedToAllChannels,
};
