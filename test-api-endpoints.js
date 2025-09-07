// Test script for the new API endpoints
// Run this with: node test-api-endpoints.js

const BASE_URL = 'http://localhost:3000';

async function testAPIEndpoints() {
  console.log('🧪 Testing API Endpoints...\n');

  // Test 1: GET /api/habits
  console.log('1. Testing GET /api/habits...');
  try {
    const response = await fetch(`${BASE_URL}/api/habits?userId=demo-user`);
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  console.log('\n2. Testing POST /api/habits...');
  try {
    const response = await fetch(`${BASE_URL}/api/habits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'demo-user',
        habitName: 'Test Habit',
        category: 'physical',
        frequency: 'daily',
        targetCount: 1,
        description: 'A test habit for API testing',
        priority: 'medium'
      })
    });
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  console.log('\n3. Testing GET /api/dashboard/summary...');
  try {
    const response = await fetch(`${BASE_URL}/api/dashboard/summary?userId=demo-user`);
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  console.log('\n4. Testing GET /api/ai/recommendations...');
  try {
    const response = await fetch(`${BASE_URL}/api/ai/recommendations?userId=demo-user&type=general`);
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  console.log('\n5. Testing POST /api/user/reflection...');
  try {
    const response = await fetch(`${BASE_URL}/api/user/reflection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'demo-user',
        date: new Date().toISOString().split('T')[0],
        mood: 8,
        energy: 7,
        gratitude: 'Grateful for a productive day',
        challenges: 'Need to focus more on time management',
        wins: 'Completed all planned tasks',
        tomorrowFocus: 'Start with the most important task first'
      })
    });
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  console.log('\n✅ API endpoint testing completed!');
}

// Run the tests
testAPIEndpoints().catch(console.error);
