require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Ad = require('./models/Ad');

// Sample data
const sampleUsers = [
  {
    fullName: 'Admin User',
    phoneNumber: '+252611111111',
    email: 'admin@gadamagado.com',
    password: 'admin123',
    region: 'Banaadir',
    district: 'Mogadishu',
    role: 'admin'
  },
  {
    fullName: 'John Doe',
    phoneNumber: '+252612345678',
    email: 'john@example.com',
    password: 'test123',
    region: 'Banaadir',
    district: 'Mogadishu',
    role: 'user'
  }
];

const sampleAds = [];

const seedDatabase = async () => {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Ad.deleteMany({});

    // Create users
    console.log('👥 Creating sample users...');
    const createdUsers = await User.create(sampleUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create sample ads linked to users
    const userId = createdUsers[0]._id;
    const sampleAdsWithUser = [
      {
        title: 'Toyota Corolla 2015',
        description: 'Excellent condition, well maintained. Comes with new tires and full service history.',
        price: 12000,
        category: 'Vehicles',
        subcategory: 'Cars',
        region: 'Banaadir',
        district: 'Mogadishu',
        contact: '+252612345678',
        images: ['https://via.placeholder.com/400x300/4A90E2/ffffff?text=Toyota+Corolla'],
        userId: userId,
        isFeatured: true,
        status: 'approved'
      },
      {
        title: '3 Bedroom House for Rent',
        description: 'Beautiful 3 bedroom house in a safe neighborhood. Fully furnished with modern amenities.',
        price: 800,
        category: 'Property',
        subcategory: 'For Rent',
        region: 'Banaadir',
        district: 'Wadajir',
        contact: '+252612345679',
        images: ['https://via.placeholder.com/400x300/27AE60/ffffff?text=House+for+Rent'],
        userId: userId,
        isFeatured: true,
        status: 'approved'
      },
      {
        title: 'iPhone 13 Pro Max',
        description: 'Brand new iPhone 13 Pro Max 256GB. Still in sealed box with warranty.',
        price: 1200,
        category: 'Electronics',
        subcategory: 'Phones',
        region: 'Banaadir',
        district: 'Mogadishu',
        contact: '+252612345678',
        images: ['https://via.placeholder.com/400x300/E74C3C/ffffff?text=iPhone+13'],
        userId: userId,
        status: 'approved'
      }
    ];

    console.log('📢 Creating sample ads...');
    const createdAds = await Ad.create(sampleAdsWithUser);
    console.log(`✅ Created ${createdAds.length} ads`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - ${createdUsers.length} users created`);
    console.log(`   - ${createdAds.length} ads created`);
    console.log('\n🔐 Test Credentials:');
    console.log('   Phone: +252611111111');
    console.log('   Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
