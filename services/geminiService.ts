import { GoogleGenAI } from "@google/genai";
import { VideoOperation } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // Remove the data URL prefix e.g. "data:image/png;base64,"
            resolve(result.split(',')[1]);
        };
        reader.onerror = (error) => reject(error);
    });
};

export const generateVideoFromImage = async (imageFile: File): Promise<string> => {
    try {
        const base64Image = await fileToBase64(imageFile);

        let operation: VideoOperation = await ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: 'make this image move, ',
            image: {
                imageBytes: base64Image,
                mimeType: imageFile.type,
            },
            config: {
                numberOfVideos: 1
            }
        });

        while (!operation.done) {
            console.log('Polling for video generation status...');
            await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds before polling again
            // Fix: Remove 'as any' cast as VideoOperation is now compatible with the expected SDK type.
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }
        
        if (operation.error) {
            throw new Error(`Video generation failed: ${operation.error.message}`);
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

        if (!downloadLink) {
            throw new Error('Video generation finished, but no download link was found.');
        }

        console.log('Fetching generated video...');
        // The response.body contains the MP4 bytes. You must append an API key when fetching from the download link.
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        if (!response.ok) {
            throw new Error(`Failed to download video file. Status: ${response.statusText}`);
        }
        
        const videoBlob = await response.blob();
        const videoUrl = URL.createObjectURL(videoBlob);
        
        return videoUrl;

    } catch (error) {
        console.error('Error in generateVideoFromImage:', error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate video: ${error.message}`);
        }
        throw new Error('An unknown error occurred during video generation.');
    }
};
