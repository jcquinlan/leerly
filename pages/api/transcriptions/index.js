import nextConnect from 'next-connect';
import multer from 'multer';
import FormData from 'form-data';

// Returns a Multer instance that provides several methods for generating 
// middleware that process files uploaded in multipart/form-data format.
const upload = multer({
  storage: multer.memoryStorage()
});

const apiRoute = nextConnect({
  // Handle any other HTTP method
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

const uploadMiddleware = upload.single('audioFile');
apiRoute.use(uploadMiddleware);

// POST
apiRoute.post(async (req, res) => {
    var formData = new FormData();
    formData.append('file_url', req.body.audioFileURL);
    formData.append('language', 'es');

    console.log(req.body.audioFileURL);

    const url = `https://api.sonix.ai/v1/media`;
    const request = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.SONIX_API_KEY}`,
            // 'Content-Type': 'multipart/form-data'
        },
        body: formData
    };


    const response = await fetch(url, request);
    const json = await response.json();

    res.status(200).json(json);
});

export default apiRoute;

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};