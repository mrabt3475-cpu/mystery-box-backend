/**
 * 🎮 Asset Model
 * نموذج الأصول في قاعدة البيانات
 */

module.exports = (sequelize, DataTypes) => {
  const Asset = sequelize.define('Asset', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    characterId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: 'معرف الشخصية المرتبط بالأصل'
    },
    modelUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'رابط النموذج ثلاثي الأبعاد'
    },
    textureUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'رابط النسيج'
    },
    previewUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'رابط صورة المعاينة'
    },
    iconUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'رابط الأيقونة'
    },
    source: {
      type: DataTypes.ENUM('local', 'external'),
      defaultValue: 'local',
      comment: 'مصدر الأصل: محلي أو خارجي'
    },
    format: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'صيغة الملف'
    },
    scale: {
      type: DataTypes.JSON,
      defaultValue: { x: 1, y: 1, z: 1 },
      comment: 'مقياس النموذج'
    },
    position: {
      type: DataTypes.JSON,
      defaultValue: { x: 0, y: 0, z: 0 },
      comment: 'موضع النموذج'
    },
    rotation: {
      type: DataTypes.JSON,
      defaultValue: { x: 0, y: 0, z: 0 },
      comment: 'دوران النموذج'
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {},
      comment: 'بيانات إضافية'
    },
    lastUpdated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: 'آخر تحديث'
    }
  }, {
    tableName: 'assets',
    timestamps: true,
    indexes: [
      {
        fields: ['characterId']
      },
      {
        fields: ['source']
      },
      {
        fields: ['lastUpdated']
      }
    ]
  });

  // Associations
  Asset.associate = (models) => {
    Asset.belongsTo(models.Character, {
      foreignKey: 'characterId',
      targetKey: 'id',
      as: 'character'
    });
  };

  // Instance methods
  Asset.prototype.toJSON = function() {
    const values = { ...this.get() };
    
    // Parse JSON fields
    if (typeof values.scale === 'string') {
      try { values.scale = JSON.parse(values.scale); } catch {}
    }
    if (typeof values.position === 'string') {
      try { values.position = JSON.parse(values.position); } catch {}
    }
    if (typeof values.rotation === 'string') {
      try { values.rotation = JSON.parse(values.rotation); } catch {}
    }
    if (typeof values.metadata === 'string') {
      try { values.metadata = JSON.parse(values.metadata); } catch {}
    }
    
    return values;
  };

  return Asset;
};
