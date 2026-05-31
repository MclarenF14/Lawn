import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setEstimate(null);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError('Please select a lawn photo');
      return;
    }

    setLoading(true);
    setError(null);
    setEstimate(null);

    try {
      const formData = new FormData();
      formData.append('image', image);

      const response = await fetch('/api/estimate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get estimate');
      }

      const data = await response.json();
      setEstimate(data);
    } catch (err) {
      setError(err.message || 'An error occurred while processing your image');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Lawn Mowing Estimator</title>
        <meta name="description" content="AI-powered lawn mowing cost estimation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>🌱 Lawn Mowing Estimator</h1>
        <p className={styles.subtitle}>Upload a lawn photo to get an instant estimate</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.uploadArea}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
              id="imageInput"
            />
            <label htmlFor="imageInput" className={styles.uploadLabel}>
              {preview ? '✓ Photo selected' : '📸 Click to upload lawn photo'}
            </label>
          </div>

          {preview && (
            <div className={styles.preview}>
              <img src={preview} alt="Preview" />
            </div>
          )}

          <button type="submit" disabled={loading || !image} className={styles.submitBtn}>
            {loading ? '⏳ Analyzing...' : '💰 Get Estimate'}
          </button>
        </form>

        {error && <div className={styles.error}>❌ {error}</div>}

        {estimate && (
          <div className={styles.result}>
            <h2>Estimate Result</h2>
            <div className={styles.estimateBox}>
              <p><strong>Lawn Size:</strong> {estimate.lawnSize}</p>
              <p><strong>Condition:</strong> {estimate.condition}</p>
              <p><strong>Complexity:</strong> {estimate.complexity}</p>
              <div className={styles.priceBox}>
                <p className={styles.price}>${estimate.estimatedPrice}</p>
              </div>
              <p className={styles.reasoning}><strong>Analysis:</strong> {estimate.reasoning}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
