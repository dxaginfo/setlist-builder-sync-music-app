module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    relatedId: {
      type: DataTypes.UUID,
      allowNull: true,
      // This can reference various tables depending on notification type
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  }, {
    timestamps: true,
  });

  // Define associations
  Notification.associate = (models) => {
    // A notification belongs to a user
    Notification.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
    });
  };

  return Notification;
};
