// Manual test for user persistence
// This can be run in the browser console to test user authentication and persistence

console.log('=== TIOSKAP User Persistence Test ===');

// Test 1: Check if auth context is available
const testAuthContext = () => {
  console.log('\n1. Testing Auth Context availability...');
  
  // Check if we can access the auth context through the DOM
  const user = localStorage.getItem('tioskap_user');
  const session = localStorage.getItem('tioskap_session');
  
  console.log('Stored user data:', user ? JSON.parse(user) : 'None');
  console.log('Session token:', session ? 'Present' : 'None');
  
  return { user: user ? JSON.parse(user) : null, session };
};

// Test 2: Test database connection
const testDatabaseConnection = async () => {
  console.log('\n2. Testing Database Connection...');
  
  try {
    // This should be available if the app is loaded
    if (window.db) {
      const result = await window.db.testConnection();
      console.log('Database connection test:', result);
      return result.success;
    } else {
      console.log('Database module not available in window');
      return false;
    }
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
};

// Test 3: Test user creation
const testUserCreation = async () => {
  console.log('\n3. Testing User Creation...');
  
  const testUserData = {
    username: `test_user_${Date.now()}`,
    display_name: `Test User ${Date.now()}`,
    avatar_color: '#FF6B6B',
    email: null,
    is_anonymous: true
  };
  
  try {
    if (window.db) {
      const newUser = await window.db.createUser(testUserData);
      console.log('Created test user:', newUser);
      return newUser;
    } else {
      console.log('Database not available for user creation test');
      return null;
    }
  } catch (error) {
    console.error('User creation error:', error);
    return null;
  }
};

// Test 4: Test story creation
const testStoryCreation = async (userId) => {
  console.log('\n4. Testing Story Creation...');
  
  if (!userId) {
    console.log('No user ID provided, skipping story test');
    return null;
  }
  
  const testStoryData = {
    user_id: userId,
    content: 'Esta es una historia de prueba para verificar que el sistema de persistencia funciona correctamente.',
    mood: 4,
    category: 'Prueba',
    tags: ['test', 'persistence'],
    is_anonymous: true
  };
  
  try {
    if (window.db) {
      const newStory = await window.db.createStory(testStoryData);
      console.log('Created test story:', newStory);
      return newStory;
    } else {
      console.log('Database not available for story creation test');
      return null;
    }
  } catch (error) {
    console.error('Story creation error:', error);
    return null;
  }
};

// Test 5: Test data retrieval
const testDataRetrieval = async (userId) => {
  console.log('\n5. Testing Data Retrieval...');
  
  try {
    if (window.db && userId) {
      const user = await window.db.getUserById(userId);
      console.log('Retrieved user:', user);
      
      const stories = await window.db.getStories({ user_id: userId });
      console.log('Retrieved user stories:', stories);
      
      return { user, stories };
    } else {
      console.log('Database or user ID not available for retrieval test');
      return null;
    }
  } catch (error) {
    console.error('Data retrieval error:', error);
    return null;
  }
};

// Main test runner
const runPersistenceTests = async () => {
  console.log('Starting persistence tests...\n');
  
  // Make db available globally for testing
  if (!window.db) {
    try {
      const { db } = await import('./lib/database.js');
      window.db = db;
    } catch (error) {
      console.error('Could not import database module:', error);
    }
  }
  
  const authState = testAuthContext();
  
  const dbConnected = await testDatabaseConnection();
  if (!dbConnected) {
    console.log('❌ Database connection failed - check your environment variables');
    return false;
  }
  
  const testUser = await testUserCreation();
  if (!testUser) {
    console.log('❌ User creation failed');
    return false;
  }
  
  const testStory = await testStoryCreation(testUser.id);
  if (!testStory) {
    console.log('❌ Story creation failed');
    return false;
  }
  
  const retrievedData = await testDataRetrieval(testUser.id);
  if (!retrievedData) {
    console.log('❌ Data retrieval failed');
    return false;
  }
  
  console.log('\n=== Test Results ===');
  console.log('✅ Database connection: OK');
  console.log('✅ User creation: OK');
  console.log('✅ Story creation: OK');
  console.log('✅ Data retrieval: OK');
  console.log('\n🎉 All persistence tests passed!');
  
  return true;
};

// Instructions for manual testing
console.log(`
📋 Manual Testing Instructions:
1. Open the browser console (F12)
2. Run: runPersistenceTests()
3. Check that all tests pass
4. Try creating a user account through the UI
5. Log out and log back in
6. Verify your data persists
7. Create a story in /desahogos
8. Refresh the page and verify the story is still there

To run the automated tests, execute:
runPersistenceTests()
`);

// Export for use
window.runPersistenceTests = runPersistenceTests;
window.testAuthContext = testAuthContext;
