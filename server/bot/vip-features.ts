/**
 * خدمات VIP والأزرار الإضافية
 */

const JOKES = [
  '😂 ليش الدجاجة عبرت الطريق؟ عشان ما حد وقفها!',
  '😂 كم سنة تدرس الرياضيات؟ ما أدري، بس الأرقام ما تنتهي!',
  '😂 شنو الفرق بين الحب والزواج؟ الحب أعمى والزواج أعمى وأطرش!',
  '😂 ليش الكتاب حزين؟ عشان عنده كثير مشاكل!',
  '😂 شنو أسرع شي في العالم؟ الوقت... بس البطيخ أسرع!',
  '😂 الدكتور قال لي: انت عندك ضغط عالي. قلت: شكراً على الإطراء!',
  '😂 قال الأب لابنه: ليش ما تدرس؟ قال: أنت ما تشتغل ليش؟',
  '😂 البنت قالت لأبوها: بابا أنا بحب الولد هذا. قال: خلاص، لما تكبري شوي!',
  '😂 المعلم: من اخترع الكهرباء؟ الطالب: ما أدري، بس أنا أستخدمها كل يوم!',
  '😂 الشرطي: ليش تسوق بسرعة؟ قال: أنا بتأخر على الشغل!',
];

const FAKE_REPORTS = [
  'جاري الإبلاغ على الحساب... 📊',
  'تم إرسال البلاغ إلى الإدارة... ⏳',
  'جاري معالجة البلاغ... 🔄',
  'تم تسجيل البلاغ بنجاح... ✅',
  'البلاغ قيد المراجعة... 📋',
];

/**
 * الحصول على نكتة عشوائية
 */
export function getRandomJoke(): string {
  return JOKES[Math.floor(Math.random() * JOKES.length)];
}

/**
 * محاكاة بلاغ وهمي
 */
export function getFakeReport(): string {
  return FAKE_REPORTS[Math.floor(Math.random() * FAKE_REPORTS.length)];
}

/**
 * توليد رسالة سحب الصور (وهمية)
 */
export function getPhotoExtractionMessage(username: string): string {
  return `📸 جاري سحب صور ${username}...\n\n⏳ الرجاء الانتظار...`;
}

/**
 * توليد رسالة سحب الأرقام (وهمية)
 */
export function getNumberExtractionMessage(username: string): string {
  return `📞 جاري سحب أرقام ${username}...\n\n⏳ الرجاء الانتظار...`;
}

/**
 * توليد رسالة سحب الرسائل (وهمية)
 */
export function getMessageExtractionMessage(username: string): string {
  return `💬 جاري سحب رسائل ${username}...\n\n⏳ الرجاء الانتظار...`;
}

/**
 * توليد رسالة التصوير (وهمية)
 */
export function getVideoRecordingMessage(username: string): string {
  return `🎬 جاري تصوير ${username}...\n\n⏳ الرجاء الانتظار...`;
}

/**
 * توليد رسالة تسجيل الصوت (وهمية)
 */
export function getAudioRecordingMessage(username: string): string {
  return `🎤 جاري تسجيل صوت ${username}...\n\n⏳ الرجاء الانتظار...`;
}

/**
 * توليد رسالة الاختراق عبر صورة (وهمية)
 */
export function getImageHackingMessage(username: string): string {
  return `🖼️ جاري اختراق ${username} عبر صورة...\n\n⏳ الرجاء الانتظار...`;
}

/**
 * توليد رسالة الاختراق عبر ملف (وهمية)
 */
export function getFileHackingMessage(username: string): string {
  return `📄 جاري اختراق ${username} عبر ملف...\n\n⏳ الرجاء الانتظار...`;
}

/**
 * توليد رسالة سكرين شوت (وهمية)
 */
export function getScreenshotMessage(username: string): string {
  return `📸 جاري أخذ سكرين شوت من ${username}...\n\n⏳ الرجاء الانتظار...`;
}

/**
 * رسالة النجاح الوهمية
 */
export function getSuccessMessage(action: string): string {
  return `✅ تم ${action} بنجاح!\n\n📊 تم حفظ النتائج في قاعدة البيانات.`;
}

export default {
  getRandomJoke,
  getFakeReport,
  getPhotoExtractionMessage,
  getNumberExtractionMessage,
  getMessageExtractionMessage,
  getVideoRecordingMessage,
  getAudioRecordingMessage,
  getImageHackingMessage,
  getFileHackingMessage,
  getScreenshotMessage,
  getSuccessMessage,
};
