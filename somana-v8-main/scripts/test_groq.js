const fs = require('fs');
const path = require('path');
const https = require('https');

// Read .env.local to find GROQ_API_KEY
const envPath = path.join(__dirname, '..', '.env.local');
let apiKey = '';

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/GROQ_API_KEY=(.+)/);
  if (match && match[1]) {
    apiKey = match[1].trim();
  }
} catch (err) {
  console.error('Error reading .env.local:', err.message);
  process.exit(1);
}

if (!apiKey) {
  console.error('Could not find GROQ_API_KEY variable in .env.local');
  process.exit(1);
}

console.log('Testing Groq API with key:', apiKey.substring(0, 5) + '...');

const postData = JSON.stringify({
  model: "llama-3.3-70b-versatile",
  messages: [{ role: "user", content: "Say hello!" }],
});

const options = {
  hostname: 'api.groq.com',
  path: '/openai/v1/chat/completions',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'Content-Length': Buffer.byteLength(postData),
  },
};

const req = https.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.setEncoding('utf8');
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const logContent = `Response: ${data}\nStatus: ${res.statusCode}`;
    console.log(logContent);
    fs.writeFileSync(path.join(__dirname, 'test_output_log.txt'), logContent);
    if (res.statusCode === 200) {
        console.log('SUCCESS: API Key works!');
    } else {
        console.log('FAILURE: API Key failed or Quota exceeded.');
    }
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(postData);
req.end();
