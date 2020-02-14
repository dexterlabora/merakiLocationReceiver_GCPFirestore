// USER DEFINED VARIABLES
// Add your GCP and Meraki settings here

module.exports = {
  firestore: {
    projectId: "yourProject",
    keyFilename: "datastore-credential_example.json"
  },

  validator: "yourValidator",
  secret: "yourSecret",
  // TEST MODE - Disables secret. The `validator` can be specified in the query
  // https://youservice.com/receiver?validator="1234567891234567890"
  testMode: true
};
