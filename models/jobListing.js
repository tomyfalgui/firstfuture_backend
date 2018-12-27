const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
    return sequelize.define('jobListing', {
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