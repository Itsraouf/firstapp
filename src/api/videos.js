// src/pages/api/videos.js
import nextConnect from 'next-connect';
import multer from 'multer';
import mongoose from 'mongoose';
import Video from '../../models/Video';
import { connectToDatabase } from '../utils/mongodb';

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
  }),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single('video'));

apiRoute.post(async (req, res) => {
  await connectToDatabase();

  const video = new Video({
    title: req.body.title,
    description: req.body.description,
    url: `/uploads/${req.file.filename}`,
  });

  try {
    const newVideo = await video.save();
    res.status(201).json(newVideo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

apiRoute.get(async (req, res) => {
  await connectToDatabase();

  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, since we're using multer
  },
};

export default apiRoute;
