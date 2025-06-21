module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    parentCommentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Comments',
        key: 'id',
      },
    },
  }, {
    timestamps: true,
  });

  // Define associations
  Comment.associate = (models) => {
    // A comment belongs to a setlist
    Comment.belongsTo(models.Setlist, {
      as: 'setlist',
      foreignKey: 'setlistId',
    });

    // A comment was created by a user
    Comment.belongsTo(models.User, {
      as: 'author',
      foreignKey: 'userId',
    });

    // A comment may have a parent comment (for replies)
    Comment.belongsTo(models.Comment, {
      as: 'parentComment',
      foreignKey: 'parentCommentId',
    });

    // A comment may have many replies
    Comment.hasMany(models.Comment, {
      as: 'replies',
      foreignKey: 'parentCommentId',
    });

    // A comment can mention many users
    Comment.belongsToMany(models.User, {
      through: 'CommentMentions',
      as: 'mentionedUsers',
      foreignKey: 'commentId',
    });
  };

  return Comment;
};
