const fs = require('fs');

const IMAGE_PATH = 'C:/Users/Lenovo/Pictures/Screenshots/Screenshot (319).png';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNWU2M2JmZTEwNzkyNGQxNDNjYzkwNiIsImlhdCI6MTc4NDYzMTEwOCwiZXhwIjoxNzg3MjIzMTA4fQ.RSevDRJRI4fPL8bvkk4DWjjfElRpajphAk4DVIgOsIw';

async function run() {
  const imageBuffer = fs.readFileSync(IMAGE_PATH);
  const base64Image = imageBuffer.toString('base64');

  const res = await fetch('http://localhost:5000/api/tutor/start-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`
    },
    body: JSON.stringify({
      image: base64Image,
      mimeType: 'image/png'
    })
  });

  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

run();