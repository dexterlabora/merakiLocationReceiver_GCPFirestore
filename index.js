const Firestore = require("@google-cloud/firestore");
const configs = require("./configs.js");
const firestore = new Firestore({
  projectId: configs.firestore.projectId,
  keyFilename: configs.firestore.keyFilename
});
const testMode = configs.testMode;
var validator = configs.validator;
var secret = configs.secret;

// ******************************

function storeData(body) {
  let date = new Date();
  let now = date.toISOString();

  try {
    let networkId = body.data.networkId;
    // Create or update a Firebase DB Collection
    let docRef = firestore
      // name of the collection
      .collection(`location_${body.version}_${body.type}_${networkId}`)
      // name of the document
      .doc(now, { merge: true });
    // add timestamp to payload
    body.data.postReceived = now;
    // Write to database
    docRef.set(body.data);
  } catch (e) {
    console.error("ERROR:", e);
    res.status(500).send(e);
    return;
  }
}

// REST API to connect to the Meraki Location Service
exports.merakiLocationReceiver = (req, res) => {
  switch (req.method) {
    case "GET":
      if (testMode) {
        validator = req.query.validator || validator;
      }
      res.send(validator);
      break;
    case "POST":
      if (testMode) {
        storeData(req.body);
        res.status(201).send();
      } else if (req.body.secret === secret) {
        console.log("Secret verified");
        storeData(req.body);
        res.status(201).send();
      } else {
        console.log("Secret was invalid");
        res.status(501).send();
      }
      break;
    default:
      res.status(400).send("invalid method " + req.method);
  }
};
