import { TRPCError } from "@trpc/server";
import { env } from "next-runtime-env";
import { z } from "zod";

import * as integrationsRepo from "@kan/db/repository/integration.repo";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const urls = {
  trello: "https://api.trello.com/1",
};

export const apiKeys = {
  trello: process.env.TRELLO_APP_API_KEY,
};

export const integrationRouter = createTRPCRouter({
  providers: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    if (!user)
      throw new TRPCError({
        message: "User not authenticated",
        code: "UNAUTHORIZED",
      });

    const integrations = await integrationsRepo.getProvidersForUser(
      ctx.db,
      user.id,
    );

    return integrations;
  }),
  disconnect: protectedProcedure
    .meta({
      openapi: {
        summary: "Disconnect integration",
        method: "POST",
        path: "/integration/disconnect",
        description: "Disconnects an integration",
        tags: ["Integration"],
        protect: true,
      },
    })
    .input(z.object({ provider: z.enum(["trello"]) }))
    .output(z.object({}))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;

      if (!user)
        throw new TRPCError({
          message: "User not authenticated",
          code: "UNAUTHORIZED",
        });

      const integration = await integrationsRepo.getProviderForUser(
        ctx.db,
        user.id,
        input.provider,
      );

      if (!integration)
        throw new TRPCError({
          message: "Integration not found",
          code: "NOT_FOUND",
        });

      await integrationsRepo.deleteProviderForUser(
        ctx.db,
        user.id,
        input.provider,
      );

      return {};
    }),
  getAuthorizationUrl: protectedProcedure
    .meta({
      openapi: {
        summary: "Get authorization URL for an integration",
        method: "GET",
        path: "/integration/authorize",
        description: "Retrieves the authorization URL for an integration",
        tags: ["Integration"],
        protect: true,
      },
    })
    .input(z.object({ provider: z.enum(["trello"]) }))
    .output(z.object({ url: z.string() }))
    .query(async ({ ctx, input }) => {
      const apiKey = apiKeys[input.provider];

      if (!apiKey)
        throw new TRPCError({
          message: `${input.provider.at(0)?.toUpperCase() + input.provider.slice(1)} API key not set in environment variables`,
          code: "INTERNAL_SERVER_ERROR",
        });

      const user = ctx.user;

      if (!user)
        throw new TRPCError({
          message: "User not authenticated",
          code: "UNAUTHORIZED",
        });

      const integration = await integrationsRepo.getProviderForUser(
        ctx.db,
        user.id,
        input.provider,
      );

      if (integration)
        throw new TRPCError({
          message: `${input.provider.at(0)?.toUpperCase() + input.provider.slice(1)} integration already exists`,
          code: "BAD_REQUEST",
        });

      if (input.provider === "trello") {
        const url = `${urls[input.provider]}/authorize?key=${apiKey}&expiration=never&response_type=token&scope=read&return_url=${env("NEXT_PUBLIC_BASE_URL")}/settings/trello/authorize&callback_method=fragment`;
        return { url };
      }

      throw new TRPCError({
        message: "Invalid provider",
        code: "BAD_REQUEST",
      });
    }),
});
