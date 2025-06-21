module.exports = (sequelize, DataTypes) => {
  const SongAttachment = sequelize.define('SongAttachment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    songId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Songs',
        key: 'id',
      },
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    uploadedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    timestamps: true,
    paranoid: true, // Soft deletes
  });

  // Define associations
  SongAttachment.associate = (models) => {
    // An attachment belongs to a song
    SongAttachment.belongsTo(models.Song, {
      as: 'song',
      foreignKey: 'songId',
    });

    // An attachment was uploaded by a user
    SongAttachment.belongsTo(models.User, {
      as: 'uploader',
      foreignKey: 'uploadedBy',
    });
  };

  return SongAttachment;
};
