import axios from 'axios';
import { BOT_CONFIG } from '@shared/bot-constants';
import { logError } from './logger.service';

const TELEGRAM_API = axios.create({
  baseURL: `${BOT_CONFIG.TELEGRAM_API_URL}${BOT_CONFIG.TELEGRAM_BOT_TOKEN}`,
  timeout: 10000,
});

export interface TelegramMessage {
  chat_id: number | string;
  text: string;
  parse_mode?: 'Markdown' | 'HTML';
  reply_markup?: any;
  disable_web_page_preview?: boolean;
}

export interface TelegramPhoto {
  chat_id: number | string;
  photo: string;
  caption?: string;
  parse_mode?: 'Markdown' | 'HTML';
  reply_markup?: any;
}

export interface TelegramInvoice {
  chat_id: number | string;
  title: string;
  description: string;
  payload: string;
  provider_token: string;
  currency: string;
  prices: Array<{ label: string; amount: number }>;
  start_parameter?: string;
}

/**
 * إرسال رسالة نصية
 */
export async function sendMessage(params: TelegramMessage) {
  try {
    const response = await TELEGRAM_API.post('/sendMessage', params);
    return response.data;
  } catch (error) {
    logError('sendMessage', error);
    throw error;
  }
}

/**
 * تعديل رسالة موجودة
 */
export async function editMessage(chatId: number | string, messageId: number, text: string, replyMarkup?: any) {
  try {
    const response = await TELEGRAM_API.post('/editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      text,
      reply_markup: replyMarkup,
      parse_mode: 'HTML',
    });
    return response.data;
  } catch (error) {
    logError('editMessage', error);
    throw error;
  }
}

/**
 * إرسال صورة
 */
export async function sendPhoto(params: TelegramPhoto) {
  try {
    const response = await TELEGRAM_API.post('/sendPhoto', params);
    return response.data;
  } catch (error) {
    logError('sendPhoto', error);
    throw error;
  }
}

/**
 * إرسال فاتورة (للدفع)
 */
export async function sendInvoice(params: TelegramInvoice) {
  try {
    const response = await TELEGRAM_API.post('/sendInvoice', params);
    return response.data;
  } catch (error) {
    logError('sendInvoice', error);
    throw error;
  }
}

/**
 * الإجابة على استعلام callback
 */
export async function answerCallbackQuery(callbackQueryId: string, text: string, showAlert = false) {
  try {
    const response = await TELEGRAM_API.post('/answerCallbackQuery', {
      callback_query_id: callbackQueryId,
      text,
      show_alert: showAlert,
    });
    return response.data;
  } catch (error) {
    logError('answerCallbackQuery', error);
    throw error;
  }
}

/**
 * التحقق من اشتراك المستخدم في قناة
 */
export async function checkChannelSubscription(userId: number, channelId: string): Promise<boolean> {
  try {
    const response = await TELEGRAM_API.post('/getChatMember', {
      chat_id: channelId,
      user_id: userId,
    });

    if (response.data.ok) {
      const status = response.data.result.status;
      return ['member', 'administrator', 'creator'].includes(status);
    }
    return false;
  } catch (error) {
    logError('checkChannelSubscription', error);
    return false;
  }
}

/**
 * الحصول على معلومات المستخدم
 */
export async function getUserInfo(userId: number) {
  try {
    const response = await TELEGRAM_API.post('/getChat', {
      chat_id: userId,
    });
    return response.data.result;
  } catch (error) {
    logError('getUserInfo', error);
    throw error;
  }
}

/**
 * الحصول على معلومات البوت
 */
export async function getBotInfo() {
  try {
    const response = await TELEGRAM_API.post('/getMe');
    return response.data.result;
  } catch (error) {
    logError('getBotInfo', error);
    throw error;
  }
}

/**
 * إرسال رسالة جماعية لعدة مستخدمين
 */
export async function broadcastMessage(userIds: number[], message: TelegramMessage) {
  const results = [];
  for (const userId of userIds) {
    try {
      const result = await sendMessage({
        ...message,
        chat_id: userId,
      });
      results.push({ userId, success: true, result });
    } catch (error) {
      results.push({ userId, success: false, error });
    }
  }
  return results;
}

/**
 * حذف رسالة
 */
export async function deleteMessage(chatId: number | string, messageId: number) {
  try {
    const response = await TELEGRAM_API.post('/deleteMessage', {
      chat_id: chatId,
      message_id: messageId,
    });
    return response.data;
  } catch (error) {
    logError('deleteMessage', error);
    throw error;
  }
}

/**
 * إرسال ملصق
 */
export async function sendSticker(chatId: number | string, stickerId: string) {
  try {
    const response = await TELEGRAM_API.post('/sendSticker', {
      chat_id: chatId,
      sticker: stickerId,
    });
    return response.data;
  } catch (error) {
    logError('sendSticker', error);
    throw error;
  }
}

export default {
  sendMessage,
  editMessage,
  sendPhoto,
  sendInvoice,
  answerCallbackQuery,
  checkChannelSubscription,
  getUserInfo,
  getBotInfo,
  broadcastMessage,
  deleteMessage,
  sendSticker,
};
