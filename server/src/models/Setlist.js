module.exports = (sequelize, DataTypes) => {
  const Setlist = sequelize.define('Setlist', {
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    bandId: {
      type: DataTypes.UUID,
      allowNull: true, // Can be null for personal setlists
      references: {
        model: 'Bands',
        key: 'id',
      },
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    eventDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    venue: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    totalDuration: {
      type: DataTypes.INTEGER, // Duration in seconds
      allowNull: true,
    },
  }, {
    timestamps: true,
    paranoid: true, // Soft deletes
  });

  // Define associations
  Setlist.associate = (models) => {
    // A setlist was created by a user
    Setlist.belongsTo(models.User, {
      as: 'creator',
      foreignKey: 'createdBy',
    });

    // A setlist may belong to a band
    Setlist.belongsTo(models.Band, {
      as: 'band',
      foreignKey: 'bandId',
    });

    // A setlist contains many songs
    Setlist.belongsToMany(models.Song, {
      through: models.SetlistItem,
      as: 'songs',
      foreignKey: 'setlistId',
    });

    // A setlist has many items (ordering songs)
    Setlist.hasMany(models.SetlistItem, {
      as: 'items',
      foreignKey: 'setlistId',
    });

    // A setlist has many versions
    Setlist.hasMany(models.SetlistVersion, {
      as: 'versions',
      foreignKey: 'setlistId',
    });

    // A setlist has many comments
    Setlist.hasMany(models.Comment, {
      as: 'comments',
      foreignKey: 'setlistId',
    });
  };

  return Setlist;
};
