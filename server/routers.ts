import { COOKIE_NAME } from "../shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { askGemini, explainCodeStepByStep, evaluateUserCode } from "./ai";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  chat: router({
    ask: publicProcedure
      .input(z.object({ 
        prompt: z.string(),
        base64Image: z.string().optional(),
        mimeType: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          const reply = await askGemini(input.prompt, input.base64Image, input.mimeType);
          return { reply };
        } catch (error: any) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message || "An unexpected error occurred",
          });
        }
      }),
  }),

  docs: router({
    explain: publicProcedure
      .input(z.object({ code: z.string(), context: z.string() }))
      .mutation(async ({ input }) => {
        try {
          const explanation = await explainCodeStepByStep(input.code, input.context);
          return { explanation };
        } catch (error: any) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message || "An unexpected error occurred",
          });
        }
      }),
    evaluate: publicProcedure
      .input(z.object({ userCode: z.string(), goal: z.string() }))
      .mutation(async ({ input }) => {
        try {
          const result = await evaluateUserCode(input.userCode, input.goal);
          return result;
        } catch (error: any) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message || "An unexpected error occurred",
          });
        }
      }),
  }),
  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
