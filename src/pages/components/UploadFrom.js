// src/components/UploadForm.js
import React, { useRef, useState } from 'react';
import axios from 'axios';
import styles from '../styles/App.module.css';

function UploadForm() {
  const fileInputRef = useRef(null);
  const [videos, setVideos] = useState([]);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', 'Sample Video'); // Add more form fields as needed

    try {
      const response = await axios.post('/api/videos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setVideos([...videos, response.data]);
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  };

  const fetchVideos = async () => {
    try {
      const response = await axios.get('/api/videos');
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  // Fetch videos on component mount
  React.useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className={styles.container}>
      <section className={styles.uploadContainer}>
        <p>Select videos to upload or drag and drop video files</p>
        <button className={styles.uploadButton} onClick={handleUploadClick}>Choose File</button>
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
      </section>

      <section className={styles.videoList}>
        {videos.map((video) => (
          <div key={video._id} className={styles.videoBox}>
            <video className={styles.video} controls>
              <source src={video.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </section>
    </div>
  );
}

export default UploadForm;
