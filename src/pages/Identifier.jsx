import React, { useState, useEffect } from 'react';
import { usePrediction } from '../contexts/PredictionProvider';
import '../css/Identifier.css';
import { plantCareTips } from '../data/Links';

const Identifier = () => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState('');
  const [mode, setMode] = useState('species');
  const { classifySpecies, classifyHealth, prediction, setPrediction } = usePrediction();

  // const MAX_FILE_SIZE = 75 * 1024;

  useEffect(() => {
    setPreview(null);
    setPrediction(null);
    setWarning('');
  }, [mode]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setWarning('');
    setPrediction(null);

    // if (file.size > MAX_FILE_SIZE) {
    //   setWarning('⚠️ Image size exceeds 75KB. Please upload a smaller image.');
    //   return;
    // }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const raw = reader.result;

      // ✅ Remove base64 prefix if present
      const base64 = raw.includes(',') ? raw.split(',')[1] : raw;

      setPreview(raw); // still show full preview in <img>
      setLoading(true);

      if (mode === 'species') {
        await classifySpecies(base64);
      } else {
        await classifyHealth(base64);
      }

      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const tips = prediction?.predicted_class
  ? plantCareTips[mode]?.[prediction.predicted_class.toLowerCase().replace(/\s/g, "_")] || []
  : [];

  // Dynamic heading based on mode
  const identifierTitle = mode === 'species' ? '🌱 Species Identifier' : '🦠 Health Identifier';

  return (
    <div className="identifier-wrapper">
      <div className="identifier-container">
        <div className="identifier-tabs">
          <div
            onClick={() => setMode('species')}
            className={`identifier-tab ${mode === 'species' ? 'active' : ''}`}
          >
            Species Identifier
          </div>
          <div
            onClick={() => setMode('health')}
            className={`identifier-tab ${mode === 'health' ? 'active' : ''}`}
          >
            Health Identifier
          </div>
        </div>

        <h2 className="identifier-title">{identifierTitle}</h2>

        <p className="identifier-warning">
          ⚠️ This model may not always produce accurate results. Please use predictions with discretion.
        </p>

        <div className="identifier-upload">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="upload-input"
          />
        </div>

        {warning && <p className="identifier-error">{warning}</p>}

        {preview && !warning && (
          <div className="identifier-preview">
            <img src={preview} alt="Uploaded Leaf" />
          </div>
        )}

        {loading && <p className="identifier-loading">🔄 Predicting...</p>}

        {!loading && prediction && !warning && (
          <div className="identifier-result">
            {prediction.error ? (
              <p className="identifier-error">❌ Error: {prediction.error}</p>
            ) : (
              <>
                <p><strong>🧬 Predicted Class:</strong> {prediction.predicted_class}</p>
                <p><strong>📈 Confidence:</strong> {(prediction.confidence * 100).toFixed(2)}%</p>

                {tips.length > 0 && (
                  <div className="identifier-tips">
                    <h3 className="tips-heading">💡 Care Tips:</h3>
                    <div className="tips-bubbles">
                      {tips.map((tip, index) => (
                        <span key={index} className="tip-bubble">{tip}</span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Identifier;