const dotenv = require('dotenv').config();
const mysql2 = require('mysql2');
const Sequelize = require('sequelize');
const userModel = require('./models/user');
const companyModel = require('./models/company');
const extraCurricularModel = require('./models/extraCurricular');
const languageModel = require('./models/language');
const workExperienceModel = require('./models/workExperience');
const skillModel = require('./models/skill');
const bookmarkModel = require('./models/bookmark');
const jobListingModel = require('./models/jobListing');
const profilePictureModel = require('./models/profilePicture');
const applicationModel = require('./models/application');
const companyPictureModel = require('./models/companyPicture');

const cityModel = require('./models/city');
const provinceModel = require('./models/province');
const regionModel = require('./models/region');

const cities = require('./docs/locations/refcitymun.json');
const provinces = require('./docs/locations/refprovince.json');
const regions = require('./docs/locations/refregion.json');

const sequelize = new Sequelize(process.env.DB_URL, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    operatorsAliases: false,
    pool: {
        max: process.env.CONNECTION_LIMIT,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false
});

const User = userModel(sequelize, Sequelize);
const Company = companyModel(sequelize, Sequelize);
const ExtraCurricular = extraCurricularModel(sequelize, Sequelize);
const Skill = skillModel(sequelize, Sequelize);
const Language = languageModel(sequelize, Sequelize);
const WorkExperience = workExperienceModel(sequelize, Sequelize);
const Bookmark = bookmarkModel(sequelize, Sequelize);
const JobListing = jobListingModel(sequelize, Sequelize);
const Application = applicationModel(sequelize, Sequelize);
const ProfilePicture = profilePictureModel(sequelize, Sequelize);
const CompanyPicture = companyPictureModel(sequelize, Sequelize);
const City = cityModel(sequelize, Sequelize);
const Province = provinceModel(sequelize, Sequelize);
const Region = regionModel(sequelize, Sequelize);

User.hasMany(Skill, { onDelete: 'CASCADE' });
User.hasMany(Language, { onDelete: 'CASCADE' });
User.hasMany(WorkExperience, { onDelete: 'CASCADE' });
User.hasMany(ExtraCurricular, { onDelete: 'CASCADE' });
User.hasMany(Bookmark, { onDelete: 'CASCADE' });
User.hasMany(Application, { onDelete: 'CASCADE' });
User.hasOne(ProfilePicture, { onDelete: 'CASCADE' });

Skill.belongsTo(User, { onDelete: 'CASCADE' });
Language.belongsTo(User, { onDelete: 'CASCADE' });
WorkExperience.belongsTo(User, { onDelete: 'CASCADE' });
ExtraCurricular.belongsTo(User, { onDelete: 'CASCADE' });
Bookmark.belongsTo(User, { onDelete: 'CASCADE' });
Application.belongsTo(User, { onDelete: 'CASCADE' });
Application.belongsTo(JobListing, { onDelete: 'SET NULL' });


Company.hasMany(JobListing, { onDelete: 'CASCADE', foreignKey:'companyId' });
Company.hasMany(CompanyPicture, { onDelete: 'CASCADE' });
JobListing.hasMany(Bookmark, { onDelete: 'CASCADE' });
JobListing.hasMany(Application, { onDelete: 'SET NULL' });
JobListing.belongsTo(Company, { onDelete: 'CASCADE', foreignKey:'companyId' });
Bookmark.belongsTo(JobListing, { onDelete: 'CASCADE' });
City.belongsTo(Province, {foreignKey: 'provCode', targetKey: 'provCode'});
City.belongsTo(Region,{foreignKey: 'regDesc', targetKey: 'regCode'});
City.hasMany(User, {foreignKey: 'city'});
User.belongsTo(City, {foreignKey: 'city'})
City.hasMany(Company, {foreignKey: 'city'});
Company.belongsTo(City, {foreignKey: 'city'});
Province.hasMany(City,{foreignKey: 'provCode', targetKey: 'provCode'});
Region.hasMany(City,{foreignKey: 'regDesc', targetKey: 'regCode'});

sequelize.sync({force: true}).then(()=>{
    const locations = [Region, Province, City,];
    const data = [regions, provinces, cities,];

    for (let i = 0; i < locations.length; i++) {
        locations[i].bulkCreate(data[i].RECORDS);
    }
});

module.exports = { User, Company, ExtraCurricular, Skill, Language, 
    WorkExperience, JobListing, Bookmark, ProfilePicture, Application, 
    CompanyPicture, Region, City, Province, sequelize };