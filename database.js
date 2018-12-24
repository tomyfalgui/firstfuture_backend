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

Skill.belongsTo(User);
Language.belongsTo(User);
WorkExperience.belongsTo(User);
ExtraCurricular.belongsTo(User);
Bookmark.belongsTo(User);
ProfilePicture.belongsTo(User);
JobListing.belongsTo(Company);
Bookmark.belongsTo(JobListing);
Bookmark.belongsTo(User);
jobListingSkill.belongsTo(JobListing);
Application.belongsTo(User);


sequelize.sync({ alter: true });

module.exports = { User, Company, ExtraCurricular, Skill, Language, WorkExperience, JobListing, jobListingSkill, Bookmark, ProfilePicture, Application };