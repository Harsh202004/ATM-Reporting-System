const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('./models');

const createAdminUser = async () => {
  const adminEmail = 'admin@example.com';
  const adminPassword = 'Admin123!';

  try {
    await mongoose.connect('mongodb://localhost:27017/atm_reporting');

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log('Existing Admin:', existingAdmin);
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminUser = new User({
      username: 'admin',
      email: adminEmail,
      password: hashedPassword,
      isAdmin: true,
    });

    await adminUser.save();
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.connection.close();
  }
};

createAdminUser();
