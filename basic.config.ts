export const schema = {
  "tables": {
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
    },
    "users": {
      "type": "collection",
      "fields": {
        "email": {
          "type": "string",
          "indexed": true
        },
        "name": {
          "type": "string",
          "indexed": true
        },
        "created_at": {
          "type": "string",
          "indexed": true
        },
        "last_login": {
          "type": "string",
          "indexed": false
        },
        "is_admin": {
          "type": "boolean",
          "indexed": true
        }
      }
    }
  },
  "version": 3,
  "project_id": "4e424624-5175-44ea-8548-fdf8f1f26d93"
};