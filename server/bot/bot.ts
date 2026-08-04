import axios from 'axios';
import { BOT_CONFIG, CALLBACKS, MESSAGES } from '@shared/bot-constants';
import { getDb } from '../db';
import { users, telegramChannels, botButtons, payments } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

const TELEGRAM_API = `${BOT_CONFIG.TELEGRAM_API_URL}${BOT_CONFIG.TELEGRAM_BOT_TOKEN}`;
let lastUpdateId = 0;

/**
 * إرسال رسالة
 */
async function sendMsg(chatId: number | string, text: string, markup?: any) {
  try {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      reply_markup: markup,
    });
  } catch (error) {
    console.error('sendMsg error:', error);
  }
}

/**
 * الإجابة على callback
 */
async function answerCallback(queryId: string, text: string) {
  try {
    await axios.post(`${TELEGRAM_API}/answerCallbackQuery`, {
      callback_query_id: queryId,
      text,
      show_alert: false,
    });
  } catch (error) {
    console.error('answerCallback error:', error);
  }
}

/**
 * التحقق من اشتراك المستخدم في قناة
 */
async function checkSubscription(userId: number, channelId: string): Promise<boolean> {
  try {
    const res = await axios.post(`${TELEGRAM_API}/getChatMember`, {
      chat_id: channelId,
      user_id: userId,
    });
    return res.data.ok && ['member', 'administrator', 'creator'].includes(res.data.result.status);
  } catch {
    return false;
  }
}

/**
 * التحقق من الاشتراك الإجباري
 */
async function checkMandatorySubscription(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return true;

  try {
    const channels = await db.select().from(telegramChannels).where(eq(telegramChannels.isRequired, true));
    
    for (const ch of channels) {
      const isSubscribed = await checkSubscription(userId, ch.channelId);
      if (!isSubscribed) return false;
    }
    return true;
  } catch {
    return true;
  }
}

/**
 * معالج الرسائل
 */
async function handleMessage(msg: any) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;
  const text = msg.text || '';

  // التحقق من الاشتراك
  const isSubscribed = await checkMandatorySubscription(userId);
  if (!isSubscribed) {
    const db = await getDb();
    if (db) {
      const channels = await db.select().from(telegramChannels).where(eq(telegramChannels.isRequired, true));
      const buttons = channels.map(ch => [{
        text: `اشترك في ${ch.channelName || ch.channelId}`,
        url: ch.channelLink || `https://t.me/${ch.channelId}`,
      }]);
      
      let msg = '❌ يجب الاشتراك في القنوات التالية أولاً:\n\n';
      channels.forEach(ch => msg += `• ${ch.channelName || ch.channelId}\n`);
      msg += '\n✅ بعد الاشتراك، أرسل /start';
      
      await sendMsg(chatId, msg, { inline_keyboard: buttons });
    }
    return;
  }

  // أوامر
  if (text === '/start') {
    const db = await getDb();
    if (db) {
      // إضافة المستخدم
      const existing = await db.select().from(users).where(eq(users.telegramUserId, userId)).limit(1);
      if (existing.length === 0) {
        try {
          const userRecord: any = {
            openId: `telegram_${userId}`,
            telegramUserId: userId,
            name: msg.from.first_name || `User ${userId}`,
            lastSignedIn: new Date(),
          };
          await db.insert(users).values(userRecord);
        } catch (e) {
          // User might already exist
        }
      }

      // عرض الأزرار الرئيسية
      const buttons = await db.select().from(botButtons).where(eq(botButtons.isActive, true));
      const keyboard = buttons.map(b => [{ text: b.buttonText, callback_data: b.buttonCallback }]);

      await sendMsg(chatId, '👋 مرحباً بك!', { inline_keyboard: keyboard });
    }
  } else if (text === '/admin') {
    if (BOT_CONFIG.ADMIN_IDS.includes(userId)) {
      const adminButtons = [
        [{ text: '👥 المستخدمين', callback_data: 'admin_users' }],
        [{ text: '📢 إذاعة', callback_data: 'admin_broadcast' }],
        [{ text: '📡 القنوات', callback_data: 'admin_channels' }],
        [{ text: '🔧 الأزرار', callback_data: 'admin_buttons' }],
        [{ text: '💰 الدفعات', callback_data: 'admin_payments' }],
      ];
      await sendMsg(chatId, '🔧 لوحة التحكم:', { inline_keyboard: adminButtons });
    }
  } else if (text === '/vip') {
    const db = await getDb();
    if (db) {
      const user = await db.select().from(users).where(eq(users.telegramUserId, userId)).limit(1);
      const points = user[0]?.points || 0;

      const vipButtons = [
        [{ text: '📸 سحب الصور', callback_data: 'vip_photos' }],
        [{ text: '📞 سحب الأرقام', callback_data: 'vip_numbers' }],
        [{ text: '💬 سحب الرسائل', callback_data: 'vip_messages' }],
        [{ text: '🎬 تصوير', callback_data: 'vip_video' }],
        [{ text: '😂 نكت', callback_data: 'vip_jokes' }],
        [{ text: `💎 النقاط: ${points}`, callback_data: 'show_points' }],
      ];
      await sendMsg(chatId, `💎 الخدمات المتقدمة\n💰 رصيدك: ${points} نقطة`, { inline_keyboard: vipButtons });
    }
  } else if (text === '/points') {
    const db = await getDb();
    if (db) {
      const user = await db.select().from(users).where(eq(users.telegramUserId, userId)).limit(1);
      const points = user[0]?.points || 0;
      await sendMsg(chatId, `💎 رصيدك: <b>${points}</b> نقطة`);
    }
  }
}

/**
 * معالج الأزرار (callbacks)
 */
async function handleCallback(query: any) {
  const userId = query.from.id;
  const chatId = query.message.chat.id;
  const data = query.data;

  await answerCallback(query.id, '✅');

  const db = await getDb();
  if (!db) return;

  // أزرار VIP
  if (data === 'vip_jokes') {
    const jokes = [
      '😂 ليش الدجاجة عبرت الطريق؟ عشان ما حد وقفها!',
      '😂 كم سنة تدرس الرياضيات؟ ما أدري، بس الأرقام ما تنتهي!',
      '😂 شنو الفرق بين الحب والزواج؟ الحب أعمى والزواج أعمى وأطرش!',
    ];
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    await sendMsg(chatId, joke);
  }

  // عرض النقاط
  if (data === 'show_points') {
    const user = await db.select().from(users).where(eq(users.telegramUserId, userId)).limit(1);
    const points = user[0]?.points || 0;
    await sendMsg(chatId, `💎 رصيدك الحالي: <b>${points}</b> نقطة`);
  }

  // أزرار الإدارة
  if (data === 'admin_users') {
    const allUsers = await db.select().from(users);
    const count = allUsers.length;
    await sendMsg(chatId, `👥 إجمالي المستخدمين: <b>${count}</b>`);
  }

  if (data === 'admin_channels') {
    const channels = await db.select().from(telegramChannels);
    let msg = '📡 القنوات الإجبارية:\n\n';
    channels.forEach(ch => msg += `• ${ch.channelName || ch.channelId}\n`);
    await sendMsg(chatId, msg || 'لا توجد قنوات');
  }
}

/**
 * معالج الدفعات
 */
async function handlePayment(msg: any) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;
  const payment = msg.successful_payment;

  if (payment) {
    const db = await getDb();
    if (db) {
      const points = parseInt(payment.invoice_payload.split('_')[1]) || 10;
      
      // إضافة النقاط
      const user = await db.select().from(users).where(eq(users.telegramUserId, userId)).limit(1);
      if (user[0]) {
        const newPoints = (user[0].points || 0) + points;
        await db.update(users).set({ points: newPoints }).where(eq(users.telegramUserId, userId));
        
        // تسجيل الدفعة
        const paymentRecord: any = {
          userId: user[0].id,
          points,
          paymentMethod: 'telegram_stars',
          status: 'completed',
          transactionId: payment.telegram_payment_charge_id,
        };
        await db.insert(payments).values(paymentRecord);

        await sendMsg(chatId, `✅ شكراً للدفع!\n💎 تم إضافة ${points} نقطة\n💰 رصيدك الجديد: ${newPoints} نقطة`);
      }
    }
  }
}

/**
 * جلب التحديثات من Telegram
 */
async function getUpdates() {
  try {
    const res = await axios.post(`${TELEGRAM_API}/getUpdates`, {
      offset: lastUpdateId + 1,
      timeout: 30,
    });

    const updates = res.data.result || [];
    for (const update of updates) {
      lastUpdateId = update.update_id;

      if (update.message) {
        await handleMessage(update.message);
      }
      if (update.callback_query) {
        await handleCallback(update.callback_query);
      }
      if (update.message?.successful_payment) {
        await handlePayment(update.message);
      }
    }
  } catch (error) {
    console.error('getUpdates error:', error);
  }
}

/**
 * بدء البوت
 */
export async function initTelegramBot() {
  console.log('🤖 Telegram Bot started with polling...');
  
  // إضافة الأزرار الافتراضية
  const { seedDefaultButtons } = await import('./seed-buttons');
  await seedDefaultButtons();
  
  // جلب التحديثات بشكل مستمر
  setInterval(getUpdates, 1000);
}

export default { initTelegramBot };
