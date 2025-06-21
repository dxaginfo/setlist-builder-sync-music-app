module.exports = (sequelize, DataTypes) => {
  const Song = sequelize.define('Song', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100],
      },
    },
    artist: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tempo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 300,
      },
    },
    duration: {
      type: DataTypes.INTEGER, // Duration in seconds
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lyrics: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    chordChart: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    bandId: {
      type: DataTypes.UUID,
      allowNull: true, // Can be null for personal songs
      references: {
        model: 'Bands',
        key: 'id',
      },
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  }, {
    timestamps: true,
    paranoid: true, // Soft deletes
  });

  // Define associations
  Song.associate = (models) => {
    // A song was created by a user
    Song.belongsTo(models.User, {
      as: 'creator',
      foreignKey: 'createdBy',
    });

    // A song may belong to a band
    Song.belongsTo(models.Band, {
      as: 'band',
      foreignKey: 'bandId',
    });

    // A song can be in many setlists
    Song.belongsToMany(models.Setlist, {
      through: models.SetlistItem,
      as: 'setlists',
      foreignKey: 'songId',
    });

    // A song can have many attachments
    Song.hasMany(models.SongAttachment, {
      as: 'attachments',
      foreignKey: 'songId',
    });
  };

  return Song;
};
