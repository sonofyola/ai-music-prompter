export const schema = {
  "tables": {
    "users": {
      "type": "collection",
      "fields": {
        "name": {
          "type": "string",
          "indexed": true
        },
        "email": {
          "type": "string",
          "indexed": true
        },
        "is_admin": {
          "type": "boolean",
          "indexed": true
        },
        "created_at": {
          "type": "string",
          "indexed": true
        },
        "last_login": {
          "type": "string",
          "indexed": false
        }
      }
    },
    "maintenance": {
      "type": "collection",
      "fields": {
        "enabled": {
          "type": "boolean",
          "indexed": true
        },
        "message": {
          "type": "string",
          "indexed": true
        },
        "timestamp": {
          "type": "number",
          "indexed": true
        },
        "adminEmail": {
          "type": "string",
          "indexed": true
        }
      }
    },
    "user_profiles": {
      "type": "collection",
      "fields": {
        "email": {
          "type": "string",
          "indexed": true
        },
        "created_at": {
          "type": "string",
          "indexed": false
        },
        "usage_count": {
          "type": "number",
          "indexed": false
        },
        "last_reset_date": {
          "type": "string",
          "indexed": false
        },
        "stripe_customer_id": {
          "type": "string",
          "indexed": false
        },
        "subscription_status": {
          "type": "string",
          "indexed": true
        },
        "upgraded_at": {
          "type": "string",
          "indexed": false
        },
        "upgraded_by": {
          "type": "string",
          "indexed": false
        }
      }
    },
    "prompt_history": {
      "type": "collection",
      "fields": {
        "name": {
          "type": "string",
          "indexed": true
        },
        "user_id": {
          "type": "string",
          "indexed": true
        },
        "form_data": {
          "type": "string",
          "indexed": false
        },
        "created_at": {
          "type": "string",
          "indexed": true
        },
        "generated_prompt": {
          "type": "string",
          "indexed": false
        }
      }
    },
    "collected_emails": {
      "type": "collection",
      "fields": {
        "tier": {
          "type": "string",
          "indexed": true
        },
        "email": {
          "type": "string",
          "indexed": true
        },
        "source": {
          "type": "string",
          "indexed": true
        },
        "timestamp": {
          "type": "string",
          "indexed": true
        }
      }
    }
  },
  "version": 4,
  "project_id": "4e424624-5175-44ea-8548-fdf8f1f26d93"
};