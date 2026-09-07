// Deprecated legacy database stub retained for backwards compatibility (Migrated to Neon Database)
export const supabase = {
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null }),
        maybeSingle: async () => ({ data: null }),
      }),
    }),
  }),
};
