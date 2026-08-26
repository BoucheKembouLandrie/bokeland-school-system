const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:Bouche%401990@localhost:5433/bokeland_licence_db');

sequelize.query(`
  INSERT INTO affiliates (email, balance, status, "createdAt", "updatedAt") 
  VALUES ('test@bokeland.com', 50000, 'GHOST', NOW(), NOW()) 
  ON CONFLICT DO NOTHING;
`)
.then(() => {
  console.log('Test affiliate test@bokeland.com created with 50000 XAF!');
  process.exit(0);
})
.catch(console.error);
