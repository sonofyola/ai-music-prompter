export const schema = {
  tables: {
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
    }
  },
  version: 1,
  project_id: "4e424624-5175-44ea-8548-fdf8f1f26d93"
} as const;
