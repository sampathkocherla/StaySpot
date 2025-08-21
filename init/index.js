 // initdb.js
const mongoose = require('mongoose');
const Listing = require('../models/listing'); // your Listing model
const initData = require('./data'); // your seed data

// Connect to MongoDB
async function main() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderl', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Database connected');
  } catch (err) {
    console.error('❌ Database connection error:', err);
  }
}

// Seed the database
const initdb = async () => {
  try {
    // Delete existing listings
    await Listing.deleteMany({});
    console.log('🗑️ Cleared existing listings');

    // Assign a real user ID from your users collection
    const ownerId = '689637ee394201cb08604941'; // Replace with a valid user _id

    // Add owner to each listing
    const listingsWithOwner = initData.data.map((obj) => ({
      ...obj,
      owner: ownerId
    }));

    // Insert listings
    await Listing.insertMany(listingsWithOwner);
    console.log('✅ Seeded listings with real owner');
  } catch (err) {
    console.error('❌ Error seeding listings:', err);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
main().then(() => {
  initdb();
});
