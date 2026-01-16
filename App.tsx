
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnalysisResult, DemoState } from './types';
import Navbar from './components/Navbar';
import ContractWorkspace from './components/ContractWorkspace';
import VideoGenerator from './components/VideoGenerator';
import { analyzeContract } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'video'>('analysis');
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  
  // Demo States
  const [demoState, setDemoState] = useState<DemoState>(DemoState.IDLE);
  const [cursorPos, setCursorPos] = useState({ x: 100, y: 100 });
  const [showCursor, setShowCursor] = useState(false);

  // References for Demo targets
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const startDemo = useCallback(() => {
    setResult(null);
    setInputText('');
    setDemoState(DemoState.MOVING_TO_TEXTAREA);
    setShowCursor(true);
  }, []);

  const handleManualAnalysis = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    try {
      const data = await analyzeContract(inputText);
      setResult(data);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const contractParagraph = "This Service Agreement ('Agreement') is entered into as of October 1, 2023. Termination: Either party may terminate with 30 days written notice for any reason. Liability: Total aggregate liability for any claims arising out of this Agreement is limited to $10,000 or the fees paid in the previous 12 months. Confidentiality: Both parties shall maintain strict confidentiality for 5 years post-termination. Payment: All invoices are due Net 30 days.";

    if (demoState === DemoState.MOVING_TO_TEXTAREA) {
      if (textareaRef.current) {
        const rect = textareaRef.current.getBoundingClientRect();
        setCursorPos({ x: rect.left + 50, y: rect.top + 50 });
        timeout = setTimeout(() => setDemoState(DemoState.TYPING), 1000);
      }
    } else if (demoState === DemoState.TYPING) {
      let currentText = "";
      let charIndex = 0;
      
      const typeNextChar = () => {
        if (charIndex < contractParagraph.length) {
          currentText += contractParagraph[charIndex];
          setInputText(currentText);
          charIndex++;
          // Variable typing speed simulator
          const delay = 30 + Math.random() * 70;
          timeout = setTimeout(typeNextChar, delay);
        } else {
          timeout = setTimeout(() => setDemoState(DemoState.MOVING_TO_BUTTON), 1000);
        }
      };
      typeNextChar();
    } else if (demoState === DemoState.MOVING_TO_BUTTON) {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setCursorPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
        timeout = setTimeout(() => setDemoState(DemoState.ANALYZING), 1000);
      }
    } else if (demoState === DemoState.ANALYZING) {
      setIsAnalyzing(true);
      // Brief subtle pause as requested
      timeout = setTimeout(() => {
        setIsAnalyzing(false);
        setDemoState(DemoState.DISPLAYING);
        // Realistic analysis result payload
        setResult({
          summary: "This is a standard Service Agreement governing professional relations, liability limits, and confidentiality obligations. It establishes a fixed liability cap and standard termination notice periods.",
          risks: [
            "Low liability cap of $10,000 may not adequately cover potential damages for high-value projects.",
            "Termination 'for any reason' allows either party to exit without cause, potentially disrupting long-term planning.",
            "Confidentiality period of 5 years might be excessive depending on the nature of the industry."
          ],
          negotiations: [
            "Negotiate a higher liability cap or link it to insurance coverage limits.",
            "Request 'termination for cause only' during the first 6 months to ensure project stability.",
            "Shorten the confidentiality term to 2 or 3 years to align with typical market standards."
          ]
        });
        setShowCursor(false);
      }, 1500);
    }

    return () => clearTimeout(timeout);
  }, [demoState]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar onDemoClick={startDemo} onTabChange={setActiveTab} activeTab={activeTab} />
      
      <main className="flex-1 flex flex-col">
        {activeTab === 'analysis' ? (
          <ContractWorkspace 
            inputText={inputText}
            setInputText={setInputText}
            isAnalyzing={isAnalyzing}
            result={result}
            onRunAnalysis={handleManualAnalysis}
            textareaRef={textareaRef}
            buttonRef={buttonRef}
          />
        ) : (
          <VideoGenerator />
        )}
      </main>

      {/* Simulated Cursor */}
      {showCursor && (
        <div 
          className="cursor-simulate" 
          style={{ 
            left: cursorPos.x, 
            top: cursorPos.y,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5 3.21V20.8L10.1 16.2L13.1 23.2L15.9 22L12.9 15L18.5 15L5.5 3.21Z" fill="black" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </div>
  );
};

export default App;
