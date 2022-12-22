'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    // 댓글에 userId 외래키 설정
    await queryInterface.addColumn("Comments", "userId", {
        type: Sequelize.INTEGER,
        allowNull: false
    })
    await queryInterface.addConstraint("Comments", {
        fields: ["userId"],
        type: 'foreign key',
        name: "fk-userId-in-Comments",
        references: {
            table: "Users",
            field: "userId"
        },
        // 유저가 삭제되거나 업데이트하면 댓글도 삭제
        onDelete: "cascade",
        onUpdate: "cascade"
    })

    // 댓글에 postId 외래키 설정
    await queryInterface.addColumn("Comments", "postId", {
        type: Sequelize.INTEGER,
        allowNull: false
    })
    await queryInterface.addConstraint("Comments", {
        fields: ["postId"],
        type: 'foreign key',
        name: "fk-postId-in-Comments",
        references: {
            table: "Posts",
            field: "postId"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
    })

    // 게시글에 userId 외래키 설정
    await queryInterface.addColumn("Posts", "userId", {
        type: Sequelize.INTEGER,
        allowNull: false
    })
    await queryInterface.addConstraint("Posts", {
        fields: ["userId"],
        type: 'foreign key',
        name: "fk-userId-in-Posts",
        references: {
            table: "Users",
            field: "userId"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
    })

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
