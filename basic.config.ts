export const schema = {
  project_id: "4e424624-5175-44ea-8548-fdf8f1f26d93",
  version: 0,
  tables: {
    user_profiles: {
      type: 'collection',
      fields: {
        email: {
          type: 'string',
        },
        subscription_status: {
          type: 'string', // 'free', 'premium', 'unlimited'
        },
        usage_count: {
          type: 'number',
        },
        last_reset_date: {
          type: 'string',
        },
        created_at: {
          type: 'string',
        },
        stripe_customer_id: {
          type: 'string',
        },
      },
    },
    prompt_history: {
      type: 'collection',
      fields: {
        user_id: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
        form_data: {
          type: 'string', // JSON string
        },
        generated_prompt: {
          type: 'string',
        },
        created_at: {
          type: 'string',
        },
      },
    },
  },
}