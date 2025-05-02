import { useState, useEffect } from 'react';

// Emotion color mappings
const emotionColors = {
  happy: 'bg-yellow-400',
  sad: 'bg-blue-500',
  angry: 'bg-red-500',
  relaxed: 'bg-green-400',
  excited: 'bg-purple-400',
};

const App = () => {
  const [emotion, setEmotion] = useState('happy');
  const [bars, setBars] = useState(Array(80).fill(0));
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setBars(Array.from({ length: 80 }, () => Math.random()));
    }, 80); // Faster for cinematic effect

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchEmotion = async () => {
      try {
        const response = await fetch('/api/emotion/current', {
          method: 'GET',
          headers: {
            // 'Authorization': `Bearer ${your_token}`, // If you need token later
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCurrentEmotion(data.emotion);
        } else {
          const data = await response.json();
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred while fetching the current emotion.');
      }
    };

    fetchEmotion();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setUploading(true);
      const response = await fetch('/api/sound/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Sound uploaded successfully! 🎶 Predicted Emotion: ${data.predicted_emotion}`);
        setSelectedFile(null);
        setCurrentEmotion(data.predicted_emotion); // Update the emotion based on the upload
      } else {
        const data = await response.json();
        alert(`Upload failed: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while uploading.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black overflow-hidden">
      {/* Navbar */}
      <nav className="w-full py-5 px-8 flex justify-between items-center backdrop-blur-md bg-opacity-30">
        <h1 className={`text-4xl font-extrabold tracking-widest ${emotionColors[emotion]} text-black rounded px-4 py-2`}>
          STILLMOTION
        </h1>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <h2 className="text-white text-2xl mb-6">
          Current Emotion: <span className={`px-4 py-1 rounded ${emotionColors[currentEmotion]} text-black font-semibold`}>{currentEmotion || emotion}</span>
        </h2>

        {/* Sound bars */}
        <div className="flex items-end justify-center w-full max-w-6xl h-72 gap-[2px] mb-10">
          {bars.map((height, idx) => (
            <div
              key={idx}
              className={`${emotionColors[emotion]} transition-all duration-500 ease-out`}
              style={{
                width: '1%',
                height: `${height * 100}%`,
                borderRadius: '8px',
              }}
            ></div>
          ))}
        </div>

        {/* Upload section */}
        <div className="flex flex-col items-center space-y-6 mt-8 w-full max-w-md bg-gray-800 rounded-2xl p-8 shadow-2xl">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="file-input w-full max-w-xs"
          />

          <div className="flex gap-4 flex-wrap justify-center">
            {Object.keys(emotionColors).map((em) => (
              <button
                key={em}
                onClick={() => setEmotion(em)}
                className={`px-4 py-2 rounded-full text-black font-bold ${emotionColors[em]} hover:scale-105 transition-all duration-300`}
              >
                {em.charAt(0).toUpperCase() + em.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full text-black font-bold hover:scale-110 transition-transform duration-300"
          >
            {uploading ? 'Uploading...' : 'Upload Sound'}
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-gray-400 bg-gray-800">
        © 2025 StillMotion. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
