// Custom asset registry for web compatibility
const AssetRegistry = {
  registerAsset: (asset) => {
    return asset;
  },
  getAssetByID: (id) => {
    return null;
  },
  getAssetByName: (name) => {
    return null;
  }
};

module.exports = AssetRegistry;