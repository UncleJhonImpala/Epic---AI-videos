import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import GenerateButton from './components/GenerateButton';
import Loader from './components/Loader';
import VideoPlayer from './components/VideoPlayer';
import ErrorMessage from './components/ErrorMessage';
import { generateVideoFromImage } from './services/geminiService';

const LOADING_MESSAGES = [
  "Fixing your flaws...",
  "Telling your character to dance...",
  "Composing peak...",
  "This will be a while, hold on a bit, let's chat...",
  "Solving world peace...",
  "exporting GTA 6...",
  "Pirating indie games...",
  "WAIT PLEASE HELP, I'M STUCK IN THIS..."
];

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>(LOADING_MESSAGES[0]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fix: Use a browser-compatible type for the interval ID. `NodeJS.Timeout` is not available in the browser.
    let interval: ReturnType<typeof setInterval>;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMessage(prev => {
          const currentIndex = LOADING_MESSAGES.indexOf(prev);
          const nextIndex = (currentIndex + 1) % LOADING_MESSAGES.length;
          return LOADING_MESSAGES[nextIndex];
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleGenerate = async () => {
    if (!imageFile) {
      setError("which image would you like animated?");
      return;
    }

    setIsLoading(true);
    setError(null);
    setVideoUrl(null);
    setLoadingMessage(LOADING_MESSAGES[0]);

    try {
      const url = await generateVideoFromImage(imageFile);
      setVideoUrl(url);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unknown error occurred while generating the video.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = useCallback(() => {
    setImageFile(null);
    setVideoUrl(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const isButtonDisabled = !imageFile || isLoading;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <Header />
        <main className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 border border-gray-700">
          {!videoUrl && !isLoading && (
            <>
              <ImageUploader imageFile={imageFile} onImageSelect={setImageFile} />
              <GenerateButton onClick={handleGenerate} disabled={isButtonDisabled} />
            </>
          )}

          {isLoading && <Loader message={loadingMessage} />}

          {error && <ErrorMessage message={error} />}
          
          {videoUrl && (
            <VideoPlayer videoUrl={videoUrl} onReset={handleReset} />
          )}
        </main>
        <footer className="text-center text-gray-500 text-sm mt-8">
            <p>Vivaan Bhatia - Y11 Personal Project</p>
        </footer>
      </div>
    </div>
  );
};

export default App;