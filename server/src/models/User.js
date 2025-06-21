const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 30],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 100],
      },
    },
    profileInfo: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    timestamps: true,
    paranoid: true, // Soft deletes
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ['password'] },
      },
    },
  });

  // Hash password before saving
  User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  });

  User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  // Method to compare password
  User.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  // Define associations
  User.associate = (models) => {
    // A user can be a member of many bands
    User.belongsToMany(models.Band, {
      through: models.BandMember,
      as: 'bands',
      foreignKey: 'userId',
    });

    // A user can create many songs
    User.hasMany(models.Song, {
      as: 'songs',
      foreignKey: 'createdBy',
    });

    // A user can create many setlists
    User.hasMany(models.Setlist, {
      as: 'setlists',
      foreignKey: 'createdBy',
    });

    // A user can have many comments
    User.hasMany(models.Comment, {
      as: 'comments',
      foreignKey: 'userId',
    });

    // A user can have many notifications
    User.hasMany(models.Notification, {
      as: 'notifications',
      foreignKey: 'userId',
    });

    // A user can be mentioned in many comments
    User.belongsToMany(models.Comment, {
      through: 'CommentMentions',
      as: 'mentions',
      foreignKey: 'userId',
    });

    // A user can upload many attachments
    User.hasMany(models.SongAttachment, {
      as: 'uploads',
      foreignKey: 'uploadedBy',
    });

    // A user can create many setlist versions
    User.hasMany(models.SetlistVersion, {
      as: 'setlistVersions',
      foreignKey: 'createdBy',
    });
  };

  return User;
};
