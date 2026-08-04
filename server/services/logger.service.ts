import { getDb } from '../db';
import { activityLogs } from '../../drizzle/schema';
import type { InsertActivityLog } from '../../drizzle/schema';

export interface LogEntry {
  userId?: number;
  action: string;
  details?: string;
  ipAddress?: string;
}

/**
 * تسجيل نشاط في قاعدة البيانات
 */
export async function logActivity(entry: LogEntry) {
  try {
    const db = await getDb();
    if (!db) return;

    await db.insert(activityLogs).values({
      userId: entry.userId,
      action: entry.action,
      details: entry.details,
      ipAddress: entry.ipAddress,
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}

/**
 * تسجيل خطأ
 */
export function logError(context: string, error: any) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(`[${context}] Error:`, errorMessage);
  
  // يمكن إضافة تسجيل إضافي هنا (مثل إرسال إلى خدمة خارجية)
}

/**
 * تسجيل معلومة
 */
export function logInfo(context: string, message: string, data?: any) {
  console.log(`[${context}] ${message}`, data || '');
}

/**
 * تسجيل تحذير
 */
export function logWarn(context: string, message: string, data?: any) {
  console.warn(`[${context}] ${message}`, data || '');
}

export default {
  logActivity,
  logError,
  logInfo,
  logWarn,
};
