# 🤖 Telegram Bot Server - تعليمات الإعداد

## المتطلبات

- Node.js 18+
- MySQL/TiDB
- Telegram Bot Token
- حساب Render (للاستضافة)

## الإعداد المحلي

### 1. تثبيت المتطلبات

```bash
pnpm install
```

### 2. إعداد متغيرات البيئة

أنشئ ملف `.env` في الجذر:

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token_here
WEBHOOK_SECRET=your_secret_key
ADMIN_IDS=123456789,987654321

# Database
DATABASE_URL=mysql://user:password@localhost:3306/telegram_bot

# OAuth (Manus)
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im

# API Keys
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_api_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your_frontend_key
```

### 3. تشغيل البوت

```bash
# Development
pnpm dev

# Production
pnpm build
pnpm start
```

## الاستضافة على Render

### 1. إنشاء خدمة جديدة

- اذهب إلى [render.com](https://render.com)
- اختر "New +" ثم "Web Service"
- اربط مستودع GitHub الخاص بك

### 2. إعداد البيئة

أضف متغيرات البيئة التالية في إعدادات Render:

| المتغير | القيمة |
|--------|--------|
| `TELEGRAM_BOT_TOKEN` | رمز البوت من BotFather |
| `DATABASE_URL` | رابط قاعدة البيانات |
| `ADMIN_IDS` | معرفات المشرفين (مفصولة بفاصلة) |
| `NODE_ENV` | production |

### 3. النشر

- اختر "Create Web Service"
- سيتم النشر تلقائياً عند كل push إلى الفرع الرئيسي

## استخدام البوت

### الأوامر الأساسية

- `/start` - بدء البوت
- `/admin` - لوحة التحكم (للمشرفين فقط)
- `/vip` - الخدمات المتقدمة
- `/points` - عرض رصيد النقاط
- `/referral` - رابط الإحالة

### الأزرار الرئيسية

يمكن إضافة وتعديل الأزرار من قاعدة البيانات في جدول `botButtons`:

```sql
INSERT INTO botButtons (buttonText, buttonCallback, buttonType, requiredPoints, isActive, `order`)
VALUES ('اسم الزر', 'callback_data', 'user', 0, true, 1);
```

### إضافة قنوات إجبارية

```sql
INSERT INTO telegramChannels (channelId, channelName, channelLink, isRequired)
VALUES ('@channel_name', 'اسم القناة', 'https://t.me/channel_name', true);
```

## البنية

```
telegram-bot-server/
├── server/
│   ├── bot/
│   │   └── bot.ts           # البوت الرئيسي (polling)
│   ├── services/
│   │   ├── telegram.service.ts   # خدمة Telegram API
│   │   ├── logger.service.ts     # تسجيل الأنشطة
│   │   └── webhook.service.ts    # معالجة Webhook
│   ├── db.ts                # قاعدة البيانات
│   └── routers.ts           # API routes
├── drizzle/
│   └── schema.ts            # نموذج قاعدة البيانات
├── shared/
│   └── bot-constants.ts     # الثوابت والإعدادات
└── client/
    └── src/                 # واجهة المستخدم (React)
```

## الميزات

✅ **40+ زر قابل للإدارة**
- أزرار المستخدم العادية
- أزرار VIP (نكت، بلاغات وهمية، إلخ)
- أزرار الإدارة

✅ **نظام النقاط والإحالة**
- جمع النقاط عبر الإحالات
- شراء النقاط بـ Telegram Stars
- نظام VIP مدفوع

✅ **اشتراك إجباري في القنوات**
- التحقق التلقائي من الاشتراك
- إدارة القنوات من قاعدة البيانات

✅ **لوحة تحكم إدارية**
- إدارة المستخدمين
- إرسال رسائل جماعية
- إدارة الأزرار والقنوات

✅ **تسجيل الأنشطة والأخطاء**
- جميع الأنشطة مسجلة في قاعدة البيانات
- تتبع الدفعات والمعاملات

## استكشاف الأخطاء

### البوت لا يستجيب

1. تحقق من صحة `TELEGRAM_BOT_TOKEN`
2. تأكد من اتصال قاعدة البيانات
3. افحص السجلات: `tail -f .manus-logs/devserver.log`

### مشاكل الاشتراك الإجباري

1. تحقق من معرفات القنوات في `telegramChannels`
2. تأكد من أن البوت عضو في القنوات
3. اختبر الاشتراك يدوياً

### مشاكل الدفع

1. تحقق من `TELEGRAM_STARS_PROVIDER_TOKEN`
2. تأكد من أن الفاتورة تحتوي على `invoice_payload` صحيح
3. افحص جدول `payments` للمعاملات

## الدعم

للمساعدة أو الإبلاغ عن أخطاء، يرجى فتح issue في المستودع.
