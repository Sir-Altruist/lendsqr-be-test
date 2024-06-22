/** @type {import('sequelize-cli').Migration} */
module.exports = {
    /**
   *
   * @param {QueryInterface} queryInterface
   * @param {DataTypes} Sequelize
   */
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("user", {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4
            },
            username: {
                type: Sequelize.STRING,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("user");
    }
};
