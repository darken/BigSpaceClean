/**
 * BigSpace Clean — cleaning request backend
 */

const TZ = 'Asia/Tokyo';
const ID_PREFIX = 'BSC';

// To check the deployment.
function doGet() {
  return json({ ok: true, message: 'BigSpace Clean endpoint is running.' });
}

// Called by the form receives a JSON as text/plain.
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    console.log('Received request', data);
    return json({ ok: true, requestId: nextRequestId() });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: 'Invalid request' });
  }
}

function nextRequestId() {
  const ymd = Utilities.formatDate(new Date(), TZ, 'yyyyMMdd');
  const n = Math.floor(Math.random() * 10000);
  return ID_PREFIX + '-' + ymd + '-' + String(n).padStart(4, '0');
}

// Returns an object as a JSON response.
function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
