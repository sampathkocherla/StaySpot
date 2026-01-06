 
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const Listing = require('../models/listing');
const initData = require('./data');

async function main() {
  try {
    
    await mongoose.connect(process.env.ATLASDB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to Atlas');
  } catch (err) {
    console.error('❌ Database connection error:', err);
  }
}

const initdb = async () => {
  try {
    await Listing.deleteMany({});
    console.log('🗑️ Cleared existing listings');

    const ownerId = "68a8256713981c73d5901689"; // replace with real user _id from your Users collection

    const listingsWithOwner = initData.data.map((obj) => ({
      ...obj,
      owner: ownerId
    }));

    await Listing.insertMany(listingsWithOwner);
    console.log('✅ Seeded listings into Atlas');
  } catch (err) {
    console.error('❌ Error seeding listings:', err);
  } finally {
    mongoose.connection.close();
  }
};

main().then(() => initdb());
