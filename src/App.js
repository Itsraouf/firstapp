import styles from './App.module.css';
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const fileInputRef = useRef(null);
  const [videos, setVideos] = useState([]);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', 'Sample Video'); // You can add more fields as needed

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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/videos/${id}`);
      setVideos(videos.filter(video => video._id !== id));
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className={styles.app}>
      <div className={styles.sidebar}>
        <h2>Ricolavo Com</h2>
        <nav>
          <ul>
            <li>Home</li>
            <li>Upload</li>
            <li>Videos</li>
            <li>Contact</li>
          </ul>
        </nav>
      </div>

      <div className={styles.container}>
        <div>
          <title>Ricolavo Com</title>
          <meta name="description" content="Video hosting made easy" />
        </div>

        <header className={styles.header}>
          <h1>Ricolavo Com</h1>
        </header>

        <main className={styles.main}>
          <section className={styles.hero}>
            <h2>Video hosting made easy</h2>
            <p>Join thousands of businesses and creators who trust Ricolavo to upload and share their videos.</p>
          </section>

          <section className={styles.uploadContainer}>
            <p>Select videos to upload or drag and drop video files</p>
            <button className={styles.uploadButton} onClick={handleUploadClick}>Choose File</button>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
          </section>

          <section className={styles.videoList}>
            {videos.map(video => (
              <div key={video._id} className={styles.videoBox}>
                <video className={styles.video} controls>
                  <source src={video.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className={styles.videoActions}>
                  <button className={styles.actionButton} onClick={() => handleDelete(video._id)}>Delete</button>
                </div>
              </div>
            ))}
          </section>
        </main>

        <footer className={styles.footer}>
          <div className={styles.supportInfo}>
            <p>Support info goes here</p>
            <p>Contact us: <a href="mailto:ricolavo.com@outlook.com">ricolavo.com@outlook.com</a></p>
          </div>
          <p>&copy; {new Date().getFullYear()} Ricolavo Com. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
