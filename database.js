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
const jobListingSkillModel = require('./models/jobListingSkill');
const profilePictureModel = require('./models/profilePicture');
const applicationModel = require('./models/application');

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
})

const User = userModel(sequelize, Sequelize);
const Company = companyModel(sequelize, Sequelize);
const ExtraCurricular = extraCurricularModel(sequelize, Sequelize);
const Skill = skillModel(sequelize, Sequelize);
const Language = languageModel(sequelize, Sequelize);
const WorkExperience = workExperienceModel(sequelize, Sequelize);
const Bookmark = bookmarkModel(sequelize, Sequelize);
const JobListing = jobListingModel(sequelize, Sequelize);
const jobListingSkill = jobListingSkillModel(sequelize, Sequelize);
const ProfilePicture = profilePictureModel(sequelize, Sequelize);
const Application = applicationModel(sequelize, Sequelize);

Skill.belongsTo(User, {onDelete: 'CASCADE'});
Language.belongsTo(User, {onDelete: 'CASCADE'});
WorkExperience.belongsTo(User, {onDelete: 'CASCADE'});
ExtraCurricular.belongsTo(User, {onDelete: 'CASCADE'});
Bookmark.belongsTo(User, {onDelete: 'CASCADE'});
ProfilePicture.belongsTo(User, {onDelete: 'CASCADE'});
JobListing.belongsTo(Company, {onDelete: 'CASCADE'});
Bookmark.belongsTo(JobListing, {onDelete: 'CASCADE'});
Bookmark.belongsTo(User, {onDelete: 'CASCADE'});
jobListingSkill.belongsTo(JobListing, {onDelete: 'CASCADE'});
Application.belongsTo(User, {onDelete: 'CASCADE'});
Application.belongsTo(JobListing, {onDelete: 'CASCADE'});

sequelize.sync({ alter: true });

module.exports = { User, Company, ExtraCurricular, Skill, Language, WorkExperience, JobListing, jobListingSkill, Bookmark, ProfilePicture, Application };