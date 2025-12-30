import { useState, useCallback, useRef, useEffect } from 'react';
import { GestureRecognizer, FilesetResolver, GestureRecognizerResult } from '@mediapipe/tasks-vision';
import { GestureType, HandPosition, GestureRecognitionState, GESTURE_MAP } from '../components/gesture/types';

interface UseGestureRecognitionReturn extends GestureRecognitionState {
  videoRef: React.RefObject<HTMLVideoElement>;
  startRecognition: () => Promise<void>;
  stopRecognition: () => void;
  isLoading: boolean;
}

export function useGestureRecognition(): UseGestureRecognitionReturn {
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognizerRef = useRef<GestureRecognizer | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isStartingRef = useRef(false); // Prevent concurrent starts

  const [state, setState] = useState<GestureRecognitionState>({
    gesture: null,
    handPosition: null,
    confidence: 0,
    isReady: false,
    error: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Initialize MediaPipe GestureRecognizer
  const initializeRecognizer = useCallback(async () => {
    try {
      console.log('[Gesture] Loading MediaPipe vision tasks...');
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );
      console.log('[Gesture] Vision tasks loaded successfully');

      // Try GPU first, fall back to CPU if it fails
      const createRecognizer = async (delegate: 'GPU' | 'CPU') => {
        console.log(`[Gesture] Attempting to create recognizer with ${delegate} delegate...`);
        return await GestureRecognizer.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task',
            delegate,
          },
          runningMode: 'VIDEO',
          numHands: 1,
        });
      };

      try {
        recognizerRef.current = await createRecognizer('GPU');
        console.log('[Gesture] Recognizer created with GPU delegate');
      } catch (gpuError) {
        console.warn('[Gesture] GPU delegate failed, falling back to CPU:', gpuError);
        recognizerRef.current = await createRecognizer('CPU');
        console.log('[Gesture] Recognizer created with CPU delegate');
      }

      return true;
    } catch (err) {
      console.error('[Gesture] Failed to initialize gesture recognizer:', err);
      setState(prev => ({
        ...prev,
        error: `Failed to load gesture model: ${err instanceof Error ? err.message : 'Unknown error'}`,
      }));
      return false;
    }
  }, []);

  // Process video frame
  const processFrame = useCallback(() => {
    if (!recognizerRef.current || !videoRef.current || videoRef.current.readyState < 2) {
      animationFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }

    try {
      const results: GestureRecognizerResult = recognizerRef.current.recognizeForVideo(
        videoRef.current,
        performance.now()
      );

      if (results.gestures && results.gestures.length > 0 && results.landmarks && results.landmarks.length > 0) {
        const topGesture = results.gestures[0][0];
        const gestureName = topGesture.categoryName;
        const mappedGesture = GESTURE_MAP[gestureName] || null;

        // Get hand position from wrist landmark (index 0) or palm center (index 9)
        const landmarks = results.landmarks[0];
        const palmCenter = landmarks[9]; // Middle finger MCP joint (palm center)

        const handPosition: HandPosition = {
          x: (palmCenter.x - 0.5) * 2, // Map 0-1 to -1 to 1
          y: -(palmCenter.y - 0.5) * 2, // Invert Y and map
          z: palmCenter.z || 0,
        };

        setState(prev => ({
          ...prev,
          gesture: mappedGesture,
          handPosition,
          confidence: topGesture.score,
          isReady: true,
          error: null,
        }));
      } else {
        setState(prev => ({
          ...prev,
          gesture: null,
          handPosition: null,
          confidence: 0,
        }));
      }
    } catch (err) {
      console.error('Error processing frame:', err);
    }

    animationFrameRef.current = requestAnimationFrame(processFrame);
  }, []);

  // Start camera and recognition
  const startRecognition = useCallback(async () => {
    // Prevent concurrent starts
    if (isStartingRef.current) {
      console.log('[Gesture] Already starting, ignoring duplicate call');
      return;
    }
    isStartingRef.current = true;

    console.log('[Gesture] Starting recognition...');
    setIsLoading(true);
    setState(prev => ({ ...prev, error: null }));

    try {
      // Initialize recognizer first
      console.log('[Gesture] Initializing recognizer...');
      const initialized = await initializeRecognizer();
      if (!initialized) {
        console.error('[Gesture] Recognizer initialization failed');
        setIsLoading(false);
        isStartingRef.current = false;
        return;
      }

      // Request camera access
      console.log('[Gesture] Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });
      console.log('[Gesture] Camera access granted');

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // Wait for video to be ready before playing
        await new Promise<void>((resolve, reject) => {
          const video = videoRef.current!;

          const onLoadedMetadata = () => {
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('error', onError);
            resolve();
          };

          const onError = () => {
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('error', onError);
            reject(new Error('Video failed to load'));
          };

          // If already loaded, resolve immediately
          if (video.readyState >= 1) {
            resolve();
          } else {
            video.addEventListener('loadedmetadata', onLoadedMetadata);
            video.addEventListener('error', onError);
          }
        });

        await videoRef.current.play();
        console.log('[Gesture] Video element playing');
      }

      // Start processing frames
      animationFrameRef.current = requestAnimationFrame(processFrame);
      console.log('[Gesture] Frame processing started');

      setState(prev => ({ ...prev, isReady: true, error: null }));
    } catch (err) {
      console.error('[Gesture] Failed to start camera:', err);
      const errorMessage =
        err instanceof Error && err.name === 'NotAllowedError'
          ? 'Camera access denied. Please allow camera access to use gesture mode.'
          : `Failed to access camera: ${err instanceof Error ? err.message : 'Unknown error'}`;

      setState(prev => ({
        ...prev,
        error: errorMessage,
        isReady: false,
      }));
    } finally {
      setIsLoading(false);
      isStartingRef.current = false;
    }
  }, [initializeRecognizer, processFrame]);

  // Stop recognition and cleanup
  const stopRecognition = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    isStartingRef.current = false;

    setState({
      gesture: null,
      handPosition: null,
      confidence: 0,
      isReady: false,
      error: null,
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecognition();
      if (recognizerRef.current) {
        recognizerRef.current.close();
      }
    };
  }, [stopRecognition]);

  return {
    ...state,
    videoRef,
    startRecognition,
    stopRecognition,
    isLoading,
  };
}
