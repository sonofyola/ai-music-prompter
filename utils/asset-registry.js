// Custom asset registry for web compatibility
const AssetRegistry = {
  registerAsset: (asset) => {
    // For web, we don't need to register assets
    return asset;
  },
  getAssetByID: (id) => {
    // Return null for web - fonts will be loaded via CSS
    return null;
  },
  getAssetByName: (name) => {
    // Return null for web - fonts will be loaded via CSS
    return null;
  }
};

// Export both as default and named export to handle different import styles
module.exports = AssetRegistry;
module.exports.default = AssetRegistry;