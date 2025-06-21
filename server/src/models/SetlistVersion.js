module.exports = (sequelize, DataTypes) => {
  const SetlistVersion = sequelize.define('SetlistVersion', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    setlistId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Setlists',
        key: 'id',
      },
    },
    versionNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    snapshot: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['setlistId', 'versionNumber'],
      },
    ],
  });

  // Define associations
  SetlistVersion.associate = (models) => {
    // A setlist version belongs to a setlist
    SetlistVersion.belongsTo(models.Setlist, {
      as: 'setlist',
      foreignKey: 'setlistId',
    });

    // A setlist version was created by a user
    SetlistVersion.belongsTo(models.User, {
      as: 'creator',
      foreignKey: 'createdBy',
    });
  };

  return SetlistVersion;
};
