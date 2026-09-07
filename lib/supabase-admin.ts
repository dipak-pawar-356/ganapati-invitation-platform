// Deprecated legacy database stub retained for backwards compatibility (Migrated to Neon Database)
export const supabaseAdmin = {
  from: () => ({
    select: () => ({
      eq: () => ({
        order: () => ({
          limit: async () => ({ data: [] }),
        }),
        maybeSingle: async () => ({ data: null }),
      }),
    }),
  }),
};
