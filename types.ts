// This type definition is simplified to represent the structure needed for polling.
// The actual SDK may have a more complex type.
export interface VideoOperation {
  // Fix: The 'name' property is optional in the SDK's GenerateVideosOperation type.
  name?: string;
  done: boolean;
  response?: {
    generatedVideos?: {
      video?: {
        uri: string;
      };
    }[];
  };
  error?: {
    code: number;
    message: string;
  };
}
