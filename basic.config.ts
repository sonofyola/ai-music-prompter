export const schema = {
  tables: {
    users: {
      type: 'collection' as const,
      fields: {
        email: {
          type: 'string' as const,
          indexed: true
        },
        name: {
          type: 'string' as const,
          indexed: true
        },
        subscription_status: {
          type: 'string' as const,
          indexed: true
        },
        usage_count: {
          type: 'number' as const,
          indexed: true
        },
        usage_limit: {
          type: 'number' as const,
          indexed: true
        },
        stripe_customer_id: {
          type: 'string' as const,
          indexed: true
        },
        subscription_end_date: {
          type: 'string' as const,
          indexed: true
        },
        created_at: {
          type: 'string' as const,
          indexed: true
        },
        last_active: {
          type: 'string' as const,
          indexed: true
        }
      }
    },
    maintenance: {
      type: 'collection' as const,
      fields: {
        enabled: {
          type: 'boolean' as const,
          indexed: true
        },
        message: {
          type: 'string' as const,
          indexed: true
        },
        timestamp: {
          type: 'number' as const,
          indexed: true
        },
        adminEmail: {
          type: 'string' as const,
          indexed: true
        }
      }
    },
    user_profiles: {
      type: 'collection' as const,
      fields: {
        email: {
          type: 'string' as const,
          indexed: true
        },
        created_at: {
          type: 'string' as const,
          indexed: false
        },
        upgraded_at: {
          type: 'string' as const,
          indexed: false
        },
        upgraded_by: {
          type: 'string' as const,
          indexed: false
        },
        usage_count: {
          type: 'number' as const,
          indexed: false
        },
        last_reset_date: {
          type: 'string' as const,
          indexed: false
        },
        stripe_customer_id: {
          type: 'string' as const,
          indexed: false
        },
        subscription_status: {
          type: 'string' as const,
          indexed: true
        }
      }
    },
    prompt_history: {
      type: 'collection' as const,
      fields: {
        name: {
          type: 'string' as const,
          indexed: true
        },
        user_id: {
          type: 'string' as const,
          indexed: true
        },
        form_data: {
          type: 'string' as const,
          indexed: false
        },
        created_at: {
          type: 'string' as const,
          indexed: true
        },
        generated_prompt: {
          type: 'string' as const,
          indexed: false
        }
      }
    },
    collected_emails: {
      type: 'collection' as const,
      fields: {
        tier: {
          type: 'string' as const,
          indexed: true
        },
        email: {
          type: 'string' as const,
          indexed: true
        },
        source: {
          type: 'string' as const,
          indexed: true
        },
        timestamp: {
          type: 'string' as const,
          indexed: true
        }
      }
    }
  },
  version: 5,
  project_id: "4e424624-5175-44ea-8548-fdf8f1f26d93"
};
