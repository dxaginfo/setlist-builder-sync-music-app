module.exports = (sequelize, DataTypes) => {
  const SetlistItem = sequelize.define('SetlistItem', {
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
    songId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Songs',
        key: 'id',
      },
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    customKey: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    customTempo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 300,
      },
    },
    customDuration: {
      type: DataTypes.INTEGER, // Duration in seconds
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    setNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
  }, {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['setlistId', 'position', 'setNumber'],
      },
    ],
  });

  // Define associations
  SetlistItem.associate = (models) => {
    // A setlist item belongs to a setlist
    SetlistItem.belongsTo(models.Setlist, {
      as: 'setlist',
      foreignKey: 'setlistId',
    });

    // A setlist item references a song
    SetlistItem.belongsTo(models.Song, {
      as: 'song',
      foreignKey: 'songId',
    });
  };

  return SetlistItem;
};
