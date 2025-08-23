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
    }
  },
  "version": 1,
  "project_id": "4e424624-5175-44ea-8548-fdf8f1f26d93"
};