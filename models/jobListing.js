const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
    return sequelize.define('jobListing', {
        position: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        deadline: {
            type: Sequelize.DATE
        },
        category: {
            type: Sequelize.INTEGER(2),
            allowNull: false
        },
        viewCount: {
            type: Sequelize.INTEGER(6),
            allowNull: false
        },
        street: {
            type: Sequelize.STRING,
            allowNull: false
        },
        barangay: {
            type: Sequelize.STRING,
            allowNull: false
        },
        city: {
            type: Sequelize.STRING,
            allowNull: false
        },
        province: {
            type: Sequelize.STRING,
            allowNull: false
        },
        strands: {
            type: Sequelize.STRING,
            allowNull: false,
            get() {
                try{
                    var results = this.getDataValue('strands').split(';');
                    for (let i in results) {
                        results[i] = parseInt(results[i]);
                    }
                    return(results);
                }
                catch(err){
                    return(null);
                }
            },
            set(val) {
                this.setDataValue('strands', val.join(';'));
            },
        }
    });
}