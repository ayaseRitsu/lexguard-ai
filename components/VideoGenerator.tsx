
import React, { useState } from 'react';
import { Upload, Video, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { generateVeoVideo } from '../services/veoService';

const VideoGenerator: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setVideoUrl(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateVideo = async () => {
    if (!selectedImage) return;

    setIsGenerating(true);
    setError(null);
    setStatusMessage('Connecting to Veo models...');

    try {
      const video = await generateVeoVideo(selectedImage, (status) => setStatusMessage(status));
      setVideoUrl(video);
      setStatusMessage('Video generated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to generate video. Please ensure billing is enabled.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-8">
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 shadow-sm">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Video className="text-blue-600" />
            Veo Contract Visualization
          </h2>
          <p className="text-slate-500 mt-2">
            Upload a photo of your office, a signature page, or a concept image to generate a realistic cinematic video brief using Veo 3.1.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upload Area */}
          <div className="flex flex-col gap-4">
            <div className="relative h-64 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center bg-white hover:border-blue-400 transition-colors group">
              {selectedImage ? (
                <img src={selectedImage} alt="Preview" className="h-full w-full object-cover rounded-lg" />
              ) : (
                <div className="text-center p-6">
                  <Upload className="mx-auto text-slate-400 mb-2 group-hover:text-blue-500 transition-colors" size={32} />
                  <p className="text-sm font-medium text-slate-600">Click or drag to upload</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB</p>
                </div>
              )}
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            
            <button
              onClick={handleGenerateVideo}
              disabled={!selectedImage || isGenerating}
              className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-bold transition-all
                ${!selectedImage || isGenerating 
                  ? 'bg-slate-200 text-slate-400' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'}`}
            >
              <Sparkles size={18} />
              {isGenerating ? 'Generating...' : 'Generate Veo Brief'}
            </button>

            {error && (
              <div className="bg-red-50 border border-red-100 p-3 rounded-lg flex items-start gap-2 text-sm text-red-600">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Results Area */}
          <div className="bg-slate-200/50 rounded-xl flex items-center justify-center relative overflow-hidden min-h-[256px]">
            {videoUrl ? (
              <video 
                src={videoUrl} 
                controls 
                autoPlay 
                loop 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-6">
                {isGenerating ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="text-slate-600 font-medium animate-pulse">{statusMessage}</p>
                    <p className="text-xs text-slate-400 italic">This usually takes about 20-30 seconds.</p>
                  </div>
                ) : (
                  <p className="text-slate-400 font-medium">Your video will appear here</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;
