module.exports = {
  testEnvironment: 'node', // Tells Jest this is a Node.js app (not a browser)
  forceExit: true,         // Reinforces the --forceExit command
  detectOpenHandles: true, // Tries to warn you if something is preventing Jest from closing
  testTimeout: 10000,      // Gives each test 10 seconds to run before failing (good for API calls)
};