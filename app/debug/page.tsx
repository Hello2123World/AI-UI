"use client";

import { useState, useEffect } from "react";
import { VoiceRecorder } from "@/components/prebuilt/VoiceRecorder";

export default function DebugPage() {
  const [recognizedText, setRecognizedText] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

  // 重写console.log等方法来捕获日志
  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
      originalLog(...args);
      setLogs(prev => [...prev, `[LOG] ${args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ')}`]);
    };

    console.error = (...args) => {
      originalError(...args);
      setLogs(prev => [...prev, `[ERROR] ${args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ')}`]);
    };

    console.warn = (...args) => {
      originalWarn(...args);
      setLogs(prev => [...prev, `[WARN] ${args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ')}`]);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">语音API调试页面</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">语音录制测试</h2>
          
          <div className="flex items-center space-x-4 mb-6">
            <VoiceRecorder onTextChange={setRecognizedText} />
            <span className="text-sm text-gray-500">点击按钮开始/停止录音</span>
          </div>
          
          <div className="mt-4">
            <h3 className="font-medium mb-2">识别结果:</h3>
            <div className="bg-gray-50 p-4 rounded border min-h-[100px]">
              {recognizedText || <span className="text-gray-400">语音识别结果将显示在这里...</span>}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">调试日志</h2>
            <button 
              onClick={clearLogs}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              清除日志
            </button>
          </div>
          
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm h-[500px] overflow-y-auto">
            {logs.length === 0 ? (
              <span className="text-gray-500">等待日志...</span>
            ) : (
              logs.map((log, i) => (
                <div key={i} className={`mb-1 ${log.includes('[ERROR]') ? 'text-red-400' : log.includes('[WARN]') ? 'text-yellow-400' : ''}`}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 