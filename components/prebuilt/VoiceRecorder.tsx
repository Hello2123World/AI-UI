import { useState, useRef, useEffect } from "react";
import { Mic } from "lucide-react";
import CryptoJS from 'crypto-js';

// 讯飞API配置
const APPID = "d8c966fa";
const API_SECRET = "ZTVhYTJiMmNhYTIxYzMwZjM1OGE1ZWI3";
const API_KEY = "afc492d830f27af65707720e2bb8dd13";

interface VoiceRecorderProps {
  onTextChange: (text: string) => void;
}

export function VoiceRecorder({ onTextChange }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [btnStatus, setBtnStatus] = useState("CLOSED");
  const [error, setError] = useState<string | null>(null); // 添加错误状态
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [resultText, setResultText] = useState("");
  const [resultTextTemp, setResultTextTemp] = useState("");
  const resultTextRef = useRef("");
  const resultTextTempRef = useRef("");

  useEffect(() => {
    resultTextRef.current = resultText;
  }, [resultText]);

  useEffect(() => {
    resultTextTempRef.current = resultTextTemp;
  }, [resultTextTemp]);

  // 获取WebSocket URL
  function getWebSocketUrl() {
    const url = "wss://iat-api.xfyun.cn/v2/iat";
    const host = "iat-api.xfyun.cn";
    const date = new Date().toUTCString();
    const algorithm = "hmac-sha256";
    const headers = "host date request-line";
    const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/iat HTTP/1.1`;
    const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, API_SECRET);
    const signature = CryptoJS.enc.Base64.stringify(signatureSha);
    const authorizationOrigin = `api_key="${API_KEY}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
    const authorization = btoa(authorizationOrigin);
    const wsUrl = `${url}?authorization=${authorization}&date=${date}&host=${host}`;
    console.log("WebSocket URL 生成:", wsUrl.substring(0, 100) + "..."); // 仅记录URL前100个字符
    return wsUrl;
  }

  // 将ArrayBuffer转换为Base64
  function toBase64(buffer: ArrayBuffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  function changeBtnStatus(status: string) {
    console.log("按钮状态变更:", status);
    setBtnStatus(status);
    if (status === "CONNECTING") {
      setResultText("");
      setResultTextTemp("");
      onTextChange("");
      setError(null); // 清除之前的错误
    } else if (status === "OPEN") {
      startCountdown();
    }
  }

  function startCountdown() {
    let seconds = 60;
    setRecordingTime(seconds);
    countdownIntervalRef.current = setInterval(() => {
      seconds = seconds - 1;
      if (seconds <= 0) {
        stopRecording();
      } else {
        setRecordingTime(seconds);
      }
    }, 1000);
  }

  async function startRecording() {
    try {
      console.log("开始录音处理...");
      const websocketUrl = getWebSocketUrl();
      console.log("正在连接WebSocket...");
      const ws = new WebSocket(websocketUrl);
      wsRef.current = ws;
      
      changeBtnStatus("CONNECTING");
      setIsRecording(true);

      console.log("请求麦克风权限...");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            sampleRate: 16000,
            channelCount: 1
          } 
        });
        console.log("麦克风权限获取成功");
        
        try {
          console.log("创建音频上下文...");
          const audioContext = new AudioContext({ sampleRate: 16000 });
          const source = audioContext.createMediaStreamSource(stream);
          const processor = audioContext.createScriptProcessor(2048, 1, 1);
          
          audioContextRef.current = audioContext;
          sourceRef.current = source;
          processorRef.current = processor;

          processor.onaudioprocess = (e) => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmData = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                pcmData[i] = Math.min(1, Math.max(-1, inputData[i])) * 0x7FFF;
              }
              
              wsRef.current.send(JSON.stringify({
                data: {
                  status: 1,
                  format: "audio/L16;rate=16000",
                  encoding: "raw",
                  audio: toBase64(pcmData.buffer),
                },
              }));
            }
          };

          source.connect(processor);
          processor.connect(audioContext.destination);
          console.log("音频处理管道设置完成");
        } catch (audioError) {
          console.error("音频上下文创建失败:", audioError);
          setError("音频处理初始化失败");
          throw audioError;
        }
      } catch (micError) {
        console.error("麦克风访问失败:", micError);
        setError("无法访问麦克风");
        throw micError;
      }

      ws.onopen = () => {
        console.log("WebSocket连接已打开，发送初始参数");
        const params = {
          common: { app_id: APPID },
          business: {
            language: "zh_cn",
            domain: "iat",
            accent: "mandarin",
            vad_eos: 5000,
            dwa: "wpgs",
          },
          data: {
            status: 0,
            format: "audio/L16;rate=16000",
            encoding: "raw",
          },
        };
        ws.send(JSON.stringify(params));
        changeBtnStatus("OPEN");
      };

      ws.onmessage = (e) => {
        const jsonData = JSON.parse(e.data);
        console.log("收到WebSocket消息:", JSON.stringify(jsonData).substring(0, 150) + "...");
        
        if (jsonData.data && jsonData.data.result) {
          const data = jsonData.data.result;
          let str = "";
          const ws = data.ws;
          for (let i = 0; i < ws.length; i++) {
            str = str + ws[i].cw[0].w;
          }
          
          const currentResultText = resultTextRef.current;
          const currentResultTextTemp = resultTextTempRef.current;

          if (data.pgs) {
            if (data.pgs === "apd") {
              setResultText(currentResultTextTemp);
              const newText = currentResultTextTemp + str;
              setResultTextTemp(newText);
              onTextChange(newText);
              console.log("追加识别结果:", str);
            } else if (data.pgs === "rpl") {
              const newText = currentResultText + str;
              setResultTextTemp(newText);
              onTextChange(newText);
              console.log("替换识别结果:", str);
            }
          } else {
            const finalText = currentResultText + str;
            setResultText(finalText);
            onTextChange(finalText);
            setResultTextTemp("");
            console.log("最终识别结果:", finalText);
          }
        }

        if (jsonData.code === 0 && jsonData.data.status === 2) {
          console.log("服务端结束会话");
          stopRecording();
        }
        if (jsonData.code !== 0) {
          console.error("讯飞API返回错误:", jsonData);
          setError(`API错误: ${jsonData.code}, ${jsonData.message || '未知错误'}`);
          stopRecording();
        }
      };

      ws.onerror = (e) => {
        console.error("WebSocket错误:", e);
        setError("WebSocket连接错误");
        stopRecording();
      };

      ws.onclose = (e) => {
        console.log("WebSocket连接关闭:", e.code, e.reason);
        stopRecording();
      };

    } catch (error) {
      console.error("启动录音失败:", error);
      setError("录音初始化失败");
      stopRecording();
    }
  }

  function stopRecording() {
    console.log("停止录音...");
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log("发送结束信号并关闭WebSocket");
      wsRef.current.send(JSON.stringify({
        data: {
          status: 2,
          format: "audio/L16;rate=16000",
          encoding: "raw",
          audio: "",
        },
      }));
      changeBtnStatus("CLOSING");
      wsRef.current.close();
    }
    
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    
    if (processorRef.current) {
      processorRef.current.disconnect();
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    setIsRecording(false);
    changeBtnStatus("CLOSED");
    console.log("录音已完全停止");
  }

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      stopRecording();
    };
  }, []);

  function toggleRecording() {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }

  return (
    <button
      type="button"
      onClick={toggleRecording}
      className={`voice-recorder-btn ${isRecording ? "recording" : ""}`}
      title={isRecording ? "点击停止录音" : "点击开始录音"}
    >
      {isRecording ? (
        <div className="recording-wave">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      ) : (
        <Mic className="text-white w-5 h-5" />
      )}
      {error && <span className="sr-only">{error}</span>}
    </button>
  );
}