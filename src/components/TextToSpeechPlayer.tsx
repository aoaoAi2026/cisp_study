import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Settings,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Capacitor } from '@capacitor/core';
import { TextToSpeech as CapacitorTTS } from '@capacitor-community/text-to-speech';

interface TextToSpeechPlayerProps {
  text: string;
  isDark?: boolean;
}

const CHUNK_SIZE = 200;

const TextToSpeechPlayer: React.FC<TextToSpeechPlayerProps> = ({ text, isDark = false }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [chunks, setChunks] = useState<string[]>([]);
  const [voices, setVoices] = useState<{ name: string; lang: string }[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isNative, setIsNative] = useState(false);

  const playTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const chunkDurationRef = useRef<number>(0);

  const accentColor = 'text-cyber-green';
  const cardBg = isDark ? 'bg-cyber-purple/10' : 'bg-gray-100';
  const textColor = isDark ? 'text-gray-200' : 'text-gray-800';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';

  const splitTextIntoChunks = useCallback((text: string, size: number = CHUNK_SIZE): string[] => {
    const cleanText = text.replace(/[#*`>\-]/g, '').replace(/\n+/g, ' ').trim();
    const chunks: string[] = [];
    let current = '';
    const sentences = cleanText.split(/(?<=[。！？.!?])/);
    for (const sentence of sentences) {
      if (current.length + sentence.length <= size) {
        current += sentence;
      } else {
        if (current.trim()) chunks.push(current.trim());
        current = sentence;
      }
    }
    if (current.trim()) chunks.push(current.trim());
    if (chunks.length === 0 && cleanText.trim()) chunks.push(cleanText.trim());
    return chunks;
  }, []);

  useEffect(() => {
    const checkSupport = async () => {
      if (Capacitor.isNativePlatform()) {
        setIsNative(true);
        setIsSupported(true);
        try {
          const result = await CapacitorTTS.getSupportedVoices();
          const voiceList = result.voices || [];
          setVoices(voiceList);
          const chineseVoice = voiceList.find(v =>
            v.lang.includes('zh') || v.lang.includes('CN')
          );
          if (chineseVoice) {
            setSelectedVoice(chineseVoice.name);
          }
        } catch (e) {
          console.log('获取语音列表失败', e);
        }
      } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        setIsNative(false);
        setIsSupported(true);
        const loadVoices = () => {
          const availableVoices = window.speechSynthesis.getVoices();
          setVoices(availableVoices.map(v => ({ name: v.name, lang: v.lang })));
          const chineseVoice = availableVoices.find(v =>
            v.lang.includes('zh') || v.lang.includes('CN')
          );
          if (chineseVoice && !selectedVoice) {
            setSelectedVoice(chineseVoice.name);
          }
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
      } else {
        setIsSupported(false);
      }
    };
    checkSupport();
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
      }
    };
  }, [selectedVoice]);

  useEffect(() => {
    if (text && isSupported) {
      const newChunks = splitTextIntoChunks(text);
      setChunks(newChunks);
      setCurrentChunkIndex(0);
    }
  }, [text, isSupported, splitTextIntoChunks]);

  const stopNative = useCallback(async () => {
    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current);
      playTimeoutRef.current = null;
    }
    try {
      await CapacitorTTS.stop();
    } catch (e) {
      console.log('停止失败', e);
    }
  }, []);

  const speakNative = useCallback(async (index: number) => {
    if (!chunks[index]) return;
    try {
      await stopNative();
      const text = chunks[index];
      const estimatedDuration = Math.max(text.length * 200 / rate, 1000);
      chunkDurationRef.current = estimatedDuration;

      await CapacitorTTS.speak({
        text: text,
        lang: 'zh-CN',
        rate: rate,
        pitch: pitch,
        volume: isMuted ? 0 : volume,
        category: 'ambient'
      });

      playTimeoutRef.current = setTimeout(() => {
        if (index < chunks.length - 1) {
          setCurrentChunkIndex(index + 1);
          speakNative(index + 1);
        } else {
          setIsPlaying(false);
          setIsPaused(false);
          setCurrentChunkIndex(0);
        }
      }, estimatedDuration);
    } catch (e) {
      console.log('朗读失败', e);
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [chunks, rate, pitch, volume, isMuted, stopNative]);

  const speakWeb = useCallback((index: number) => {
    if (!chunks[index]) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(chunks[index]);
    utterance.lang = 'zh-CN';
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = isMuted ? 0 : volume;
    if (selectedVoice && voices.length > 0) {
      const voice = window.speechSynthesis.getVoices().find(v => v.name === selectedVoice);
      if (voice) utterance.voice = voice;
    }
    utterance.onend = () => {
      if (index < chunks.length - 1) {
        setCurrentChunkIndex(index + 1);
        speakWeb(index + 1);
      } else {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentChunkIndex(0);
      }
    };
    window.speechSynthesis.speak(utterance);
  }, [chunks, rate, pitch, volume, isMuted, selectedVoice, voices]);

  const togglePlay = async () => {
    if (!isSupported) return;
    if (isNative) {
      if (isPaused) {
        setIsPaused(false);
        setIsPlaying(true);
        speakNative(currentChunkIndex);
      } else if (isPlaying) {
        if (playTimeoutRef.current) {
          clearTimeout(playTimeoutRef.current);
          playTimeoutRef.current = null;
        }
        try {
          await CapacitorTTS.stop();
        } catch (e) {
          console.log('暂停失败', e);
        }
        setIsPaused(true);
      } else {
        setIsPlaying(true);
        setIsPaused(false);
        speakNative(currentChunkIndex);
      }
    } else {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
        setIsPlaying(true);
      } else if (isPlaying) {
        window.speechSynthesis.pause();
        setIsPaused(true);
      } else {
        setIsPlaying(true);
        setIsPaused(false);
        speakWeb(currentChunkIndex);
      }
    }
  };

  const skipBackward = async () => {
    if (!isSupported || currentChunkIndex === 0) return;
    const newIndex = currentChunkIndex - 1;
    setCurrentChunkIndex(newIndex);
    if (isPlaying && !isPaused) {
      if (isNative) {
        speakNative(newIndex);
      } else {
        speakWeb(newIndex);
      }
    }
  };

  const skipForward = async () => {
    if (!isSupported || currentChunkIndex >= chunks.length - 1) return;
    const newIndex = currentChunkIndex + 1;
    setCurrentChunkIndex(newIndex);
    if (isPlaying && !isPaused) {
      if (isNative) {
        speakNative(newIndex);
      } else {
        speakWeb(newIndex);
      }
    }
  };

  const toggleMute = async () => {
    setIsMuted(!isMuted);
    if (isPlaying && !isPaused) {
      if (isNative) {
        speakNative(currentChunkIndex);
      } else {
        speakWeb(currentChunkIndex);
      }
    }
  };

  const stop = async () => {
    if (!isSupported) return;
    if (isNative) {
      await stopNative();
    } else {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentChunkIndex(0);
  };

  useEffect(() => {
    if (isPlaying && !isPaused && isSupported) {
      if (isNative) {
        speakNative(currentChunkIndex);
      } else {
        speakWeb(currentChunkIndex);
      }
    }
  }, [rate, pitch, selectedVoice]);

  const progress = chunks.length > 0 ? ((currentChunkIndex + 1) / chunks.length) * 100 : 0;
  const displayVoices = voices.length > 0 ? voices : [];

  if (!isSupported) {
    return (
      <div className={`mb-4 p-3 rounded-xl border ${isDark ? 'border-cyber-green/20 bg-cyber-purple/5' : 'border-gray-200 bg-gray-50'}`}>
        <div className={`text-sm text-center ${textSecondary}`}>
          当前设备或浏览器不支持语音朗读功能
        </div>
      </div>
    );
  }

  return (
    <div className={`mb-4 rounded-xl border overflow-hidden ${isDark ? 'border-cyber-green/20 bg-[#0a0f1a]/80' : 'border-gray-200 bg-white'}`}>
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Volume2 size={16} className={accentColor} />
            <span className={`text-sm font-medium ${textColor}`}>语音朗读</span>
            <span className={`text-xs ${textSecondary}`}>
              {chunks.length > 0 ? `第 ${currentChunkIndex + 1}/${chunks.length} 段` : ''}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={stop}
              className={`p-1.5 rounded-lg transition-colors ${textSecondary} hover:${cardBg}`}
            >
              <X size={16} />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-1.5 rounded-lg transition-colors ${showSettings ? accentColor + ' ' + cardBg : textSecondary + ' hover:' + cardBg}`}
            >
              <Settings size={16} />
            </button>
          </div>
        </div>

        <div className="w-full h-1 rounded-full bg-gray-700/30 mb-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyber-purple to-cyber-blue"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            onClick={skipBackward}
            disabled={currentChunkIndex === 0}
            className={`p-2 rounded-lg transition-all ${
              currentChunkIndex === 0
                ? 'opacity-40 cursor-not-allowed'
                : `hover:${cardBg} active:scale-95`
            } ${textColor}`}
          >
            <SkipBack size={18} />
          </button>

          <button
            onClick={togglePlay}
            className="p-3 rounded-full bg-gradient-to-br from-cyber-purple to-cyber-blue text-white shadow-lg shadow-cyber-purple/30 hover:shadow-cyber-purple/50 transition-all active:scale-95"
          >
            {isPlaying && !isPaused ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
          </button>

          <button
            onClick={skipForward}
            disabled={currentChunkIndex >= chunks.length - 1}
            className={`p-2 rounded-lg transition-all ${
              currentChunkIndex >= chunks.length - 1
                ? 'opacity-40 cursor-not-allowed'
                : `hover:${cardBg} active:scale-95`
            } ${textColor}`}
          >
            <SkipForward size={18} />
          </button>

          <button
            onClick={toggleMute}
            className={`p-2 rounded-lg transition-all hover:${cardBg} active:scale-95 ${
              isMuted ? 'text-gray-500' : textColor
            } ml-1`}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`space-y-3 pt-3 mt-3 border-t ${isDark ? 'border-cyber-green/10' : 'border-gray-200'} overflow-hidden`}
            >
              <div>
                <label className={`text-xs ${textSecondary} mb-1.5 block`}>
                  选择语音 ({displayVoices.length}种)
                </label>
                <select
                  value={selectedVoice}
                  onChange={(e) => {
                    setSelectedVoice(e.target.value);
                  }}
                  className={`w-full px-3 py-2 rounded-lg text-sm border ${
                    isDark
                      ? 'bg-cyber-purple/10 border-cyber-green/20 text-gray-200'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-cyber-purple/50`}
                >
                  {displayVoices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className={`text-xs ${textSecondary}`}>语速</label>
                  <span className={`text-xs ${accentColor}`}>{rate.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={rate}
                  onChange={(e) => {
                    const newRate = parseFloat(e.target.value);
                    setRate(newRate);
                  }}
                  className="w-full accent-cyber-purple"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className={`text-xs ${textSecondary}`}>音调</label>
                  <span className={`text-xs ${accentColor}`}>{pitch.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => {
                    const newPitch = parseFloat(e.target.value);
                    setPitch(newPitch);
                  }}
                  className="w-full accent-cyber-purple"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className={`text-xs ${textSecondary}`}>音量</label>
                  <span className={`text-xs ${accentColor}`}>{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => {
                    const newVolume = parseFloat(e.target.value);
                    setVolume(newVolume);
                    setIsMuted(newVolume === 0);
                  }}
                  className="w-full accent-cyber-purple"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TextToSpeechPlayer;
