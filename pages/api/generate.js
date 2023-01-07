
const API_URL=`https://api-inference.huggingface.co/models/phmagic/avatar1`

const bufferToBase64 = (buffer) => {
    let arr = new Uint8Array(buffer);
    const base64 = btoa(
      arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    return `data:image/png;base64,${base64}`;
  };


  const generateAction = async (req, res) => {
    const input = JSON.parse(req.body).input;
    const response = await fetch(
        API_URL,
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_AUTH_KEY}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          inputs: input,
          use_cache: true
        }),
      }
    );

  
    if (response.ok) {
      const buffer = await response.arrayBuffer();
      const base64 = bufferToBase64(buffer);
      res.status(200).json({ image: base64 });
    } else if (response.status === 503) {
      const json = await response.json();
      res.status(503).json(json);
    } else {
      const json = await response.json();
      res.status(response.status).json({ error: response.statusText });
    }
  };
  
  export default generateAction;