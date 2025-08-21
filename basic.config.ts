export const schema = {
  project_id: "4e424624-5175-44ea-8548-fdf8f1f26d93",
  version: 0,
  tables: {
    user_profiles: {
      type: 'collection' as const,
      fields: {
        email: {
          type: 'string' as const,
        },
        subscription_status: {
          type: 'string' as const, // 'free', 'premium', 'unlimited'
        },
        usage_count: {
          type: 'number' as const,
        },
        last_reset_date: {
          type: 'string' as const,
        },
        created_at: {
          type: 'string' as const,
        },
        stripe_customer_id: {
          type: 'string' as const,
        },
      },
    },
    prompt_history: {
      type: 'collection' as const,
      fields: {
        user_id: {
          type: 'string' as const,
        },
        name: {
          type: 'string' as const,
        },
        form_data: {
          type: 'string' as const, // JSON string
        },
        generated_prompt: {
          type: 'string' as const,
        },
        created_at: {
          type: 'string' as const,
        },
      },
    },
  },
} as const;
