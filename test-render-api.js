const https = require('https');

const data = JSON.stringify({
  data: ["A->B", "A->C", "B->D"]
});

const options = {
  hostname: 'chitkara-bfhl-api-gpkr.onrender.com',
  port: 443,
  path: '/bfhl',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.write(data);
req.end();
