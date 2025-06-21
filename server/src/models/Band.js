module.exports = (sequelize, DataTypes) => {
  const Band = sequelize.define('Band', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
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
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    timestamps: true,
    paranoid: true, // Soft deletes
  });

  // Define associations
  Band.associate = (models) => {
    // A band has many members
    Band.belongsToMany(models.User, {
      through: models.BandMember,
      as: 'members',
      foreignKey: 'bandId',
    });

    // A band was created by a user
    Band.belongsTo(models.User, {
      as: 'creator',
      foreignKey: 'createdBy',
    });

    // A band can have many songs
    Band.hasMany(models.Song, {
      as: 'songs',
      foreignKey: 'bandId',
    });

    // A band can have many setlists
    Band.hasMany(models.Setlist, {
      as: 'setlists',
      foreignKey: 'bandId',
    });
  };

  return Band;
};
