import { router, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import { getDb } from '../db';
import { users, botButtons, telegramChannels, payments } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

/**
 * التحقق من أن المستخدم مشرف
 */
async function isAdmin(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    return user[0]?.role === 'admin';
  } catch {
    return false;
  }
}

export const adminRouter = router({
  // إحصائيات عامة
  getStats: protectedProcedure.query(async ({ ctx }) => {
    if (!(await isAdmin(ctx.user.id))) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }

    const db = await getDb();
    if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

    const totalUsers = await db.select().from(users);
    const totalPayments = await db.select().from(payments);
    const totalRevenue = totalPayments.reduce((sum, p) => sum + (parseFloat(p.amount as any) || 0), 0);

    return {
      totalUsers: totalUsers.length,
      totalPayments: totalPayments.length,
      totalRevenue,
      bannedUsers: totalUsers.filter(u => u.isBanned).length,
    };
  }),

  // إدارة الأزرار
  getButtons: protectedProcedure.query(async ({ ctx }) => {
    if (!(await isAdmin(ctx.user.id))) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }

    const db = await getDb();
    if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

    return await db.select().from(botButtons).orderBy(botButtons.order);
  }),

  addButton: protectedProcedure
    .input(
      z.object({
        buttonText: z.string().min(1),
        buttonCallback: z.string().min(1),
        buttonType: z.enum(['admin', 'vip', 'user', 'fun', 'payment']),
        requiredPoints: z.number().default(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!(await isAdmin(ctx.user.id))) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

      const result = await db.insert(botButtons).values({
        buttonText: input.buttonText,
        buttonCallback: input.buttonCallback,
        buttonType: input.buttonType,
        requiredPoints: input.requiredPoints,
        isActive: true,
        order: 0,
      });

      return { success: true };
    }),

  deleteButton: protectedProcedure
    .input(z.object({ buttonId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!(await isAdmin(ctx.user.id))) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

      await db.delete(botButtons).where(eq(botButtons.id, input.buttonId));
      return { success: true };
    }),

  // إدارة القنوات
  getChannels: protectedProcedure.query(async ({ ctx }) => {
    if (!(await isAdmin(ctx.user.id))) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }

    const db = await getDb();
    if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

    return await db.select().from(telegramChannels);
  }),

  addChannel: protectedProcedure
    .input(
      z.object({
        channelId: z.string().min(1),
        channelName: z.string().min(1),
        channelLink: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!(await isAdmin(ctx.user.id))) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

      await db.insert(telegramChannels).values({
        channelId: input.channelId,
        channelName: input.channelName,
        channelLink: input.channelLink,
        isRequired: true,
      });

      return { success: true };
    }),

  deleteChannel: protectedProcedure
    .input(z.object({ channelId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!(await isAdmin(ctx.user.id))) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

      await db.delete(telegramChannels).where(eq(telegramChannels.id, input.channelId));
      return { success: true };
    }),

  // إدارة المستخدمين
  getUsers: protectedProcedure.query(async ({ ctx }) => {
    if (!(await isAdmin(ctx.user.id))) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }

    const db = await getDb();
    if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

    return await db.select().from(users).limit(100);
  }),

  banUser: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!(await isAdmin(ctx.user.id))) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

      await db.update(users).set({ isBanned: true }).where(eq(users.id, input.userId));
      return { success: true };
    }),

  unbanUser: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!(await isAdmin(ctx.user.id))) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

      await db.update(users).set({ isBanned: false }).where(eq(users.id, input.userId));
      return { success: true };
    }),

  // الدفعات
  getPayments: protectedProcedure.query(async ({ ctx }) => {
    if (!(await isAdmin(ctx.user.id))) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }

    const db = await getDb();
    if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

    return await db.select().from(payments).limit(50);
  }),
});

export default adminRouter;
