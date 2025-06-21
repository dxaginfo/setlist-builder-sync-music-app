module.exports = (sequelize, DataTypes) => {
  const BandMember = sequelize.define('BandMember', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bandId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Bands',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    role: {
      type: DataTypes.ENUM('admin', 'member', 'viewer'),
      defaultValue: 'member',
      allowNull: false,
    },
    joinedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    timestamps: true,
    uniqueKeys: {
      band_member_unique: {
        fields: ['bandId', 'userId'],
      },
    },
  });

  // Define associations
  BandMember.associate = (models) => {
    // BandMember belongs to a band
    BandMember.belongsTo(models.Band, {
      foreignKey: 'bandId',
    });

    // BandMember belongs to a user
    BandMember.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  };

  return BandMember;
};
