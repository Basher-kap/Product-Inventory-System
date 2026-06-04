// Example usage of UserService
// Run with: node examples/user-service-example.js

require('dotenv').config();
const UserService = require('../app/services/UserService');

async function main() {
  try {
    // 1. Find existing user
    console.log('📌 Finding user "Basher"...');
    const user = await UserService.findByUsername('Basher');
    console.log('Found:', user);

    // 2. Verify password
    console.log('\n🔒 Verifying password for "Basher"...');
    const isValid = await UserService.verifyPassword('Basher', 'Bash_123');
    console.log('Password valid:', isValid);

    // 3. Create a new user
    console.log('\n➕ Creating new user "testuser"...');
    const newUser = await UserService.create({
      username: 'testuser',
      password: 'test123',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com'
    });
    console.log('Created:', newUser);

    // 4. Update user profile
    console.log('\n✏️ Updating "testuser" profile...');
    const updated = await UserService.updateProfile('testuser', {
      address: '123 Main St',
      email: 'newemail@example.com'
    });
    console.log('Updated:', updated);

    // 5. List all users
    console.log('\n📋 All users:');
    const allUsers = await UserService.findAll();
    console.log(allUsers);

  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
