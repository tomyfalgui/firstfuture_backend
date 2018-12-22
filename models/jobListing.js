const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
    return sequelize.define('jobListing', {
        companyId: {
            type: Sequelize.INTEGER(11)
        },
        position: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT
        },
        deadline: {
            type: Sequelize.DATE
        },
        category: {
            type: Sequelize.INTEGER(2)
        },
        viewCount: {
            type: Sequelize.INTEGER(6)
        },
        street: {
            type: Sequelize.STRING
        },
        barangay: {
            type: Sequelize.STRING
        },
        city: {
            type: Sequelize.STRING
        },
        province: {
            type: Sequelize.STRING
        },
        strands: {
            type: Sequelize.STRING,
            allowNull: false,
            get() {
                var results = this.getDataValue('strands').split(';');
                for (let i in results) {
                    results[i] = parseInt(results[i]);
                }
                return (results);
            },
            set(val) {
                this.setDataValue('strands', val.join(';'));
            },
        }
    });
}