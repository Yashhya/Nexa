import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import {
  X, Mic, MicOff, Send, Sparkles, Volume2, VolumeX, Minimize2, Maximize2,
  Play, Pause, Square, FastForward, RotateCcw
} from 'lucide-react';
import * as THREE from 'three';
import { setAssistantOpen } from '../../store/slices/uiSlice';
import { addToCart } from '../../store/slices/cartSlice';
import api from '../../utils/api';
import { generateSessionId } from '../../utils/helpers';
import toast from 'react-hot-toast';

// 3D AI Avatar Orb
const AIOrb = ({ isSpeaking, isThinking, isHappy }) => {
  const meshRef = useRef();
  const ringRef = useRef();
  const ring2Ref = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      const breatheScale = 1 + Math.sin(t * 1.5) * 0.04;
      meshRef.current.scale.setScalar(breatheScale);
      if (isSpeaking) {
        meshRef.current.material.distort = 0.4 + Math.sin(t * 8) * 0.2;
        meshRef.current.material.speed = 3;
      } else if (isThinking) {
        meshRef.current.material.distort = 0.6;
        meshRef.current.material.speed = 5;
      } else if (isHappy) {
        meshRef.current.material.distort = 0.3 + Math.sin(t * 4) * 0.15;
        meshRef.current.material.speed = 4;
      } else {
        meshRef.current.material.distort = 0.2 + Math.sin(t * 0.8) * 0.05;
        meshRef.current.material.speed = 1.5;
      }
      meshRef.current.material.color.setHSL(0.75 + Math.sin(t * 0.3) * 0.05, 0.8, 0.5);
      meshRef.current.material.emissive.setHSL(0.55 + Math.sin(t * 0.2) * 0.1, 0.9, 0.3);
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.5;
      ringRef.current.rotation.y = t * 0.3;
      ringRef.current.material.opacity = 0.3 + Math.sin(t * 2) * 0.15;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -t * 0.4;
      ring2Ref.current.rotation.z = t * 0.6;
      ring2Ref.current.material.opacity = 0.2 + Math.sin(t * 1.5 + 1) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <group>
        <mesh ref={meshRef}>
          <sphereGeometry args={[1, 64, 64]} />
          <MeshDistortMaterial
            color="#7c3aed"
            emissive="#4c1d95"
            emissiveIntensity={0.5}
            roughness={0.1}
            metalness={0.9}
            distort={0.3}
            speed={2}
            transparent
            opacity={0.95}
          />
        </mesh>
        <mesh scale={0.6}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1} transparent opacity={0.3} />
        </mesh>
        <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
          <ringGeometry args={[1.4, 1.6, 64]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
        <mesh ref={ring2Ref} rotation={[Math.PI / 5, Math.PI / 4, 0]}>
          <ringGeometry args={[1.7, 1.85, 64]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </Float>
  );
};

const sessionId = generateSessionId();

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello there! I'm ARIA, your AI shopping assistant from NEXA. I'm thrilled to help you find amazing products and make your shopping experience futuristic and fun! How can I assist you today? ✨",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isHappy, setIsHappy] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showVoiceControls, setShowVoiceControls] = useState(false);

  // Voice States
  const [isMuted, setIsMuted] = useState(() => localStorage.getItem('aria_muted') === 'true');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(() => parseFloat(localStorage.getItem('aria_volume') || '1'));
  const [speed, setSpeed] = useState(() => parseFloat(localStorage.getItem('aria_speed') || '1'));

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const speechRef = useRef(null);
  const recognitionRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAssistantOpen } = useSelector(s => s.ui);
  const { isAuthenticated } = useSelector(s => s.auth);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    if (isAssistantOpen) {
      setIsHappy(true);
      setTimeout(() => setIsHappy(false), 2000);
      if (textareaRef.current) textareaRef.current.focus();
    }
  }, [isAssistantOpen]);

  useEffect(() => {
    localStorage.setItem('aria_muted', isMuted);
    localStorage.setItem('aria_volume', volume);
    localStorage.setItem('aria_speed', speed);
  }, [isMuted, volume, speed]);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  const formatTextForSpeech = (text) => {
    return text.replace(/₹/g, 'rupees ').replace(/\bNEXA\b/gi, 'Nexa').replace(/[#*_~`\[\]]/g, '');
  };

  const speak = (text) => {
    if (isMuted || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsPaused(false);
    const cleanText = formatTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = speed;
    utterance.pitch = 1.1;
    utterance.volume = volume;
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google') && v.lang === 'en-IN') || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => { setIsSpeaking(false); setIsPaused(false); };
    utterance.onerror = () => { setIsSpeaking(false); setIsPaused(false); };
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const togglePauseResume = () => {
    if (isPaused) window.speechSynthesis.resume();
    else if (isSpeaking) window.speechSynthesis.pause();
  };

  const replayLast = () => {
    const botMessages = messages.filter(m => m.role === 'assistant');
    if (botMessages.length > 0) speak(botMessages[botMessages.length - 1].content);
  };

  const handleAction = async (action) => {
    if (!action) return;
    const { type, payload } = action;
    switch (type) {
      case 'navigate': navigate(payload.path); break;
      case 'filter_products':
      case 'show_products':
        const params = new URLSearchParams();
        if (payload.category) params.append('category', payload.category);
        if (payload.keyword) params.append('keyword', payload.keyword);
        if (payload.maxPrice) params.append('maxPrice', payload.maxPrice);
        navigate(`/shop?${params.toString()}`);
        break;
      case 'open_category': navigate(`/shop?category=${payload.category}`); break;
      case 'add_to_cart':
        if (!isAuthenticated) { toast.error('Please login to add to cart'); navigate('/login'); return; }
        try {
          await dispatch(addToCart({ productId: payload.productId })).unwrap();
          toast.success('Added to cart by ARIA!');
          setIsHappy(true); setTimeout(() => setIsHappy(false), 2000);
        } catch (e) { toast.error('Could not add to cart'); }
        break;
      default: break;
    }
  };

  const sendMessage = async (msg = input) => {
    if (!msg.trim() || isLoading) return;
    if (isSpeaking) stopSpeaking();

    const userMsg = { role: 'user', content: msg, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setIsThinking(true);
    if (textareaRef.current) textareaRef.current.style.height = 'auto'; // Reset height

    const context = { currentPath: window.location.pathname, isLoggedIn: isAuthenticated };
    
    // Retry logic
    let attempts = 0;
    const maxAttempts = 2;
    let success = false;

    while (attempts < maxAttempts && !success) {
      try {
        const res = await api.post('/ai/chat', { message: msg, sessionId, context });
        const { response, action } = res.data;
        setIsThinking(false);
        setMessages(prev => [...prev, { role: 'assistant', content: response, action, timestamp: new Date() }]);
        speak(response);
        if (action) setTimeout(() => handleAction(action), 800);
        success = true;
      } catch (err) {
        attempts++;
        if (attempts >= maxAttempts) {
          setIsThinking(false);
          console.error("ARIA Connection Error:", err);
          setMessages(prev => [...prev, { role: 'assistant', content: "I'm having a brief connection issue right now. Please try again! 🔄", timestamp: new Date() }]);
          speak("I'm having a brief connection issue right now. Please try again!");
        } else {
          // Wait 1 second before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast.error('Voice input not supported in this browser');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => {
      setIsListening(true);
      if (isSpeaking) stopSpeaking();
    };
    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setInput(text);
      setIsListening(false);
      setTimeout(() => sendMessage(text), 300);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const suggestions = [
    "Recommend a phone under ₹30000",
    "Best headphones for gaming",
    "Compare iPhone vs Samsung",
    "Trending sneakers right now",
  ];

  return (
    <>
      <AnimatePresence>
        {!isAssistantOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch(setAssistantOpen(true))}
            className="fixed bottom-6 right-6 z-[60] w-24 h-32 sm:w-32 sm:h-40 flex items-end justify-center drop-shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all"
          >
            <div className="absolute inset-0 z-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
               <Canvas camera={{ position: [0, 0, 4] }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <AIOrb />
              </Canvas>
            </div>
            <img src="/avatar.png" alt="AI Assistant" className="w-full h-full object-contain drop-shadow-2xl relative z-10" />
            <span className="absolute bottom-4 right-4 w-5 h-5 bg-green-400 rounded-full border-[3px] border-[var(--bg-primary)] animate-pulse shadow-[0_0_15px_rgba(74,222,128,0.8)] z-20" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAssistantOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-[60] flex flex-col drop-shadow-2xl"
            style={{ width: isMinimized ? '320px' : '450px', height: isMinimized ? 'auto' : '75vh', maxHeight: '800px' }}
          >
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl overflow-hidden flex flex-col h-full shadow-[0_30px_100px_rgba(0,0,0,0.4)] relative">
              
              {/* Premium Header */}
              <div className="relative p-5 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center justify-between z-10 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 shrink-0 relative bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full border border-white/10 flex items-center justify-center p-1">
                    <img src="/avatar.png" alt="ARIA" className="w-full h-full object-cover rounded-full" />
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[var(--bg-secondary)] shadow-sm" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-lg tracking-tight text-[var(--text-primary)] font-['Space_Grotesk']">ARIA</h3>
                      {isThinking && <span className="bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">Thinking</span>}
                      {isSpeaking && !isPaused && <span className="bg-purple-500/10 text-purple-500 border border-purple-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse"><Volume2 size={12} /> Speaking</span>}
                    </div>
                    <p className="text-sm font-medium text-[var(--text-muted)]">NEXA AI Assistant</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => { const newMute = !isMuted; setIsMuted(newMute); if (newMute) stopSpeaking(); }} className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-[var(--text-secondary)]">
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                  <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-[var(--text-secondary)]">
                    {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
                  </button>
                  <button onClick={() => dispatch(setAssistantOpen(false))} className="p-2 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-colors text-[var(--text-secondary)]">
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Chat Area */}
              {!isMinimized && (
                <>
                  <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide bg-[var(--bg-primary)]">
                    {messages.length <= 1 && (
                      <div className="mb-6 flex flex-wrap gap-2 justify-center pt-4">
                        {suggestions.map((s, i) => (
                          <button
                            key={i}
                            onClick={() => sendMessage(s)}
                            className="bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-purple-500 hover:border-purple-500/50 text-xs sm:text-sm font-medium px-4 py-2 rounded-full transition-all shadow-sm"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}

                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-full`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="flex items-center gap-2 mb-1.5 ml-1">
                            <Sparkles size={14} className="text-purple-500" />
                            <span className="text-xs font-bold text-[var(--text-muted)]">ARIA</span>
                          </div>
                        )}
                        <div className={`px-5 py-3.5 rounded-3xl text-[15px] leading-relaxed shadow-sm ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-br-sm'
                            : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-bl-sm shadow-md shadow-purple-500/5'
                        } max-w-[85%] whitespace-pre-wrap`}>
                          {msg.content}
                          {msg.action && (
                            <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-lg w-fit border border-cyan-500/20">
                              <Sparkles size={12} /> Action: {msg.action.type.replace('_', ' ')}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}

                    {isThinking && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-start max-w-full">
                        <div className="flex items-center gap-2 mb-1.5 ml-1">
                          <Sparkles size={14} className="text-purple-500" />
                          <span className="text-xs font-bold text-[var(--text-muted)]">ARIA is typing...</span>
                        </div>
                        <div className="px-5 py-4 rounded-3xl rounded-bl-sm border border-[var(--border-color)] bg-[var(--bg-card)] shadow-sm">
                          <div className="flex gap-1.5">
                            {[0, 0.2, 0.4].map((delay, i) => (
                              <motion.div key={i} className="w-2 h-2 rounded-full bg-purple-500/50" animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.8, repeat: Infinity, delay }} />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-card)] shrink-0 z-20">
                    <div className="flex items-end gap-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-3xl p-2 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all shadow-inner">
                      <button
                        onClick={isListening ? stopListening : startListening}
                        className={`p-3 shrink-0 rounded-full transition-all flex items-center justify-center ${isListening ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/40' : 'bg-transparent text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-purple-500'}`}
                      >
                        {isListening ? <MicOff size={22} /> : <Mic size={22} />}
                      </button>
                      <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask ARIA anything... (Shift+Enter for new line)"
                        className="flex-1 bg-transparent border-none outline-none text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none py-3 max-h-[120px] scrollbar-hide"
                        rows={1}
                      />
                      <button
                        onClick={() => sendMessage()}
                        disabled={!input.trim() || isLoading}
                        className="p-3 shrink-0 rounded-full transition-all flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white disabled:opacity-40 hover:shadow-lg hover:shadow-purple-500/30 disabled:hover:shadow-none"
                      >
                        <Send size={20} className="ml-1" />
                      </button>
                    </div>
                    <p className="text-center mt-3 text-[10px] font-medium text-[var(--text-muted)]">
                      ARIA can make mistakes. Consider verifying important information.
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
