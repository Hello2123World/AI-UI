"use client";

import { useState, useEffect, useRef, isValidElement } from "react";
import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { EndpointsContext } from "@/app/agent";
import { useActions } from "@/utils/client";
import { LocalContext } from "@/app/shared";
import { HumanMessageText } from "./message";
import { VoiceRecorder } from "./VoiceRecorder";
import { useFloatingComponent } from "@/app/shared";
import { CustomPageDesigner } from "./CustomPageDesigner";
import { SplitContentView } from "./SplitContentView";
import { LoadingComponent } from "./LoadingComponent";

export interface ChatProps {}

function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}

function FileUploadMessage({ file }: { file: File }) {
  return <div className="message file-message">
    已上传图片: {file.name}
  </div>;
}

export default function Chat() {
  const actions = useActions<typeof EndpointsContext>();
  const [elements, setElements] = useState<JSX.Element[]>([]);
  const [history, setHistory] = useState<[role: string, content: string][]>([]);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File>();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  // 添加浮动组件的钩子
  const { showFloatingComponent } = useFloatingComponent();
  
  // 添加自定义页面设计相关状态
  const [hasAiResponse, setHasAiResponse] = useState(false);
  const [customDesignerOpen, setCustomDesignerOpen] = useState(false);
  const [aiResponses, setAiResponses] = useState<React.ReactNode[]>([]);
  // 添加工具结果状态
  const [toolResults, setToolResults] = useState<Record<string, any>[]>([]);

  // 滚动到底部的函数
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // 当消息列表变化时滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [elements]);

  // 添加初始欢迎消息
  useState(() => {
    // 立即显示欢迎消息，无需延迟
      const welcomeMessage = (
        <div className="flex flex-col gap-1 w-full max-w-fit mr-auto" key="welcome">
          <div className="message">
            欢迎使用AI健身助手！请告诉我您的健身需求，我将为您提供个性化的建议和计划。
          </div>
        </div>
      );
      setElements([welcomeMessage]);
  });

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // 1. 输出用户输入
    console.log("===== 处理用户请求 =====");
    console.log("1. 用户输入:", input);
    
    try {
    // 保存用户请求到localStorage
    localStorage.setItem('lastUserRequest', input.trim());
      
      // 预处理用户输入，识别特定模式
      let processedInput = input;
      let displayInput = input; // 新增：用于显示在UI上的输入内容

      if (input.includes('打卡记录') || input.includes('训练记录')) {
        // 确保使用create_training_record工具
        processedInput = `请使用create_training_record工具来处理以下请求：${input}`;
        // displayInput保持不变，仍然是原始输入
      }
    
    // 添加用户消息
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
        content: processedInput, // 发送给后端的内容
      timestamp: new Date().toISOString()
    };
    
    // 立即清空输入框，提高用户体验
    setInput("");
    setSelectedFile(undefined);
    
    const newElements = [...elements];
    let base64File: string | undefined = undefined;
    let fileExtension = selectedFile?.type.split("/")[1];
    if (selectedFile) {
      base64File = await convertFileToBase64(selectedFile);
    }

    // 添加用户消息到UI
    newElements.push(
      <div className="flex flex-col w-full gap-1 mt-auto" key={history.length}>
        {selectedFile && <FileUploadMessage file={selectedFile} />}
          <div className="message user-message">{displayInput}</div>
      </div>
    );
    
    // 立即更新UI显示用户消息
    setElements(newElements);
    
      // 调用AI响应 - 控制台输出原始处理后的输入
      console.log("发送给AI的实际内容:", processedInput);

    const element = await actions.agent({
        input: processedInput,
      chat_history: history,
      file:
        base64File && fileExtension
          ? {
              base64: base64File,
              extension: fileExtension,
            }
          : undefined,
    });

    // 保存AI响应组件，以便后续点击时可以再次显示
    const aiResponseComponent = (
      <div className="ai-floating-component">
        {element.ui}
      </div>
    );
    
    // 保存最新的AI响应组件到历史记录中
    setAiResponses(prev => [...prev, aiResponseComponent]);
    setHasAiResponse(true);

      // 2. 获取和输出lastEvent
    let lastEvent = await element.lastEvent;
      console.log("2. lastEvent:", lastEvent);
      
      // 处理错误响应情况
      if (lastEvent === "error_response") {
        console.error("检测到AI处理错误");
        setElements(prev => [
          ...prev,
          <div className="flex flex-col gap-1 w-full max-w-fit mr-auto" key={`error-${Date.now()}`}>
            <div className="message system-message error-message">
              处理响应时出错: 我理解您想创建一个训练打卡记录。请尝试更明确地描述，例如"帮我创建一个30天健身打卡记录"或"开始一个新的训练打卡计划"。
            </div>
          </div>
        ]);
        
        // 更新聊天历史
        setHistory((prev) => [
          ...prev,
          ["user", displayInput],
          ["assistant", "抱歉，我没能正确理解您的请求。请尝试更明确地描述您想创建的打卡记录类型。"],
        ]);
        
        setInput("");
        setSelectedFile(undefined);
        setTimeout(scrollToBottom, 100);
        return;
      }
      
      const isToolResponse = typeof lastEvent === "object" && lastEvent["invokeTools"];
      
      if (isToolResponse) {
        // 基本信息
        let contentType = undefined;
        
        // 3. 确定详细页面组件
        // 直接从lastEvent中读取工具名称并映射到对应的组件类型
        const toolComponentMap: Record<string, string> = {
          'recipe_display': 'SimpleRecipe.tsx',         // 食谱组件
          'achievement_badges': 'SimpleAchievement.tsx', // 成就组件
          'create_training_plan': 'SimplePlan.tsx',     // 训练计划组件
          'create_training_record': 'SimpleCheckin.tsx',  // 打卡记录组件
          'workout_record': 'SimpleRecord.tsx',         // 运动记录组件
          'training_record': 'SimpleCheckin.tsx',       // 训练打卡记录组件
          'checkin_record': 'SimpleCheckin.tsx',        // 打卡记录组件
          'fitness_record': 'SimpleCheckin.tsx'         // 健身记录组件
        };
        
        let toolName;
        // 从工具名称映射
        if (lastEvent.invokeModel?.toolCall?.name) {
          toolName = lastEvent.invokeModel.toolCall.name;
          contentType = toolComponentMap[toolName];
          console.log("3. 确定的详细页面组件:");
          console.log("   - 工具名称:", toolName);
          console.log("   - 映射到组件类型:", contentType);
        } 
        // 备用方案
        else if (lastEvent.invokeTools?.toolResult?.type) {
          contentType = lastEvent.invokeTools.toolResult.type;
          console.log("3. 确定的详细页面组件:");
          console.log("   - 从toolResult获取类型:", contentType);
        }
        
        // 4. 调用的卡片组件
        console.log("4. 调用的卡片组件:", contentType);
        
        // 5. 相关监测信息
        console.log("5. 相关监测信息:");
        console.log("   - 响应内容长度:", JSON.stringify(aiResponseComponent).length);
        console.log("   - 是否为工具响应:", isToolResponse);
      
      // 使用浮动组件展示分栏视图，并传递内容类型
        showFloatingComponent(aiResponseComponent, contentType, lastEvent.invokeTools?.toolResult);
      
      // 同时在聊天界面中也添加一个可点击的简化版本的响应
      setElements(prev => [
        ...prev,
        <div className="flex flex-col gap-1 w-full max-w-fit mr-auto" key={`ai-${history.length}`}>
          <div 
            className="message ai-message clickable-message"
            onClick={() => {
              // 显示加载组件
              showFloatingComponent(<LoadingComponent />);
              
              // 延迟300ms以确保内容完全生成
              setTimeout(() => {
                  showFloatingComponent(aiResponseComponent, contentType, lastEvent.invokeTools?.toolResult);
              }, 300);
            }}
          >
            AI已生成响应，点击查看详细内容
          </div>
        </div>
      ]);

        // 保存工具结果数据
        if (lastEvent.invokeTools?.toolResult) {
          // 添加组件类型到工具结果
          const toolResultWithType = {
            ...lastEvent.invokeTools.toolResult,
            componentType: contentType || 'SimpleRecord.tsx' // 保存组件类型
          };
          
          // 将当前的工具结果添加到数组中
          setToolResults(prev => [...prev, toolResultWithType]);
          console.log("已保存工具结果数据:", toolResultWithType);
          
          // 更新lastEvent中的工具结果，确保后续处理使用带有类型的结果
          lastEvent.invokeTools.toolResult = toolResultWithType;
        }
    } else {
      // 如果是普通文本响应，直接添加到聊天容器中
        console.log("处理普通文本响应...");
        console.log("element.ui类型:", typeof element.ui);
        try {
          console.log("element.ui内容示例:", 
            React.isValidElement(element.ui) 
              ? "有效的React元素" 
              : typeof element.ui === 'string' 
                ? element.ui.substring(0, 100) 
                : "非字符串非React元素");
        } catch (e) {
          console.error("检查element.ui时出错:", e);
        }
        
      setElements(prev => [
        ...prev,
        <div className="flex flex-col gap-1 w-full max-w-fit mr-auto" key={`ai-${history.length}`}>
          <div className="ai-floating-component">
            {element.ui}
          </div>
        </div>
      ]);
    }
    
    // 确保在添加AI响应后滚动到底部
    setTimeout(scrollToBottom, 100);

    // 更新聊天历史
    (async () => {
        try {
          console.log("开始更新聊天历史...");
          console.log("lastEvent类型:", typeof lastEvent);
          
      if (typeof lastEvent === "object") {
            console.log("lastEvent键:", Object.keys(lastEvent));
            
        if (lastEvent["invokeModel"] && lastEvent["invokeModel"]["result"]) {
              console.log("更新为模型结果");
          setHistory((prev) => [
            ...prev,
                ["user", displayInput],
            ["assistant", lastEvent["invokeModel"]["result"]],
          ]);
        } else if (lastEvent["invokeTools"]) {
              console.log("更新为工具结果");
              console.log("工具结果:", lastEvent["invokeTools"]["toolResult"]);
              
              // 根据工具结果类型生成更友好的消息
              const toolResult = lastEvent["invokeTools"]["toolResult"];
              let friendlyMessage = "AI已为您生成相关内容";
              
              // 根据工具类型或标题生成更友好的消息
              if (toolResult) {
                if (toolResult.title) {
                  // 如果有标题，使用标题
                  friendlyMessage = `AI已为您生成「${toolResult.title}」`;
                } else if (toolResult.componentType) {
                  // 根据组件类型显示不同消息
                  const typeMap: Record<string, string> = {
                    'SimpleRecipe.tsx': '健康食谱',
                    'SimplePlan.tsx': '训练计划',
                    'SimpleCheckin.tsx': '打卡记录',
                    'SimpleRecord.tsx': '运动记录',
                    'SimpleAchievement.tsx': '运动成就'
                  };
                  friendlyMessage = `AI已为您生成${typeMap[toolResult.componentType] || '相关内容'}`;
                }
              }
              
              setHistory((prev) => [
                ...prev,
                ["user", displayInput],
                ["assistant", friendlyMessage],
              ]);
        } else {
              console.log("ELSE! 未知的lastEvent结构:", lastEvent);
            }
          }
        } catch (e) {
          console.error("更新聊天历史时出错:", e);
      }
    })();

    setInput("");
    setSelectedFile(undefined);
      console.log("===== 消息处理完成 =====");
    } catch (error) {
      console.error("处理消息时出错:", error);
      // 显示友好的错误消息
      setElements(prev => [
        ...prev,
        <div className="flex flex-col gap-1 w-full max-w-fit mr-auto" key={`error-${Date.now()}`}>
          <div className="message system-message error-message">
            处理您的请求时出现错误。请稍后再试。
            <details>
              <summary>错误详情</summary>
              <pre>{error instanceof Error ? error.message : String(error)}</pre>
            </details>
          </div>
        </div>
      ]);
    }
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* 自定义页面设计组件 - 添加toolResults参数 */}
      <CustomPageDesigner 
        isOpen={customDesignerOpen}
        onOpenChange={setCustomDesignerOpen}
        generatedContent={aiResponses}
        toolResults={toolResults}
        forceTypes={toolResults.map(result => result.componentType || 'SimpleRecord.tsx')}
      />
      
      <div 
        className="chat-messages custom-scrollbar" 
        id="chatMessages" 
        ref={chatContainerRef}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05)'
        }}
      >
        {elements}
      </div>
      
      {/* 表单部分 */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await handleSendMessage();
        }}
        className="input-group mt-3"
      >
        {/* 自定义页面设计按钮 - 移动到这里 */}
        <Button
          onClick={(e) => {
            e.preventDefault(); // 防止表单提交
            if (hasAiResponse) {
              setCustomDesignerOpen(true);
            }
          }}
          className={`custom-design-btn-input ${!hasAiResponse ? 'disabled-btn' : ''}`}
          type="button" // 确保不会触发表单提交
          disabled={!hasAiResponse}
          title={hasAiResponse ? "自定义页面布局" : "请先等待AI响应后使用此功能"}
        >
          自定义页面设计
        </Button>
        
        {/* 输入区域容器 */}
        <div className="input-btn-container">
          {/* 将textarea也添加自定义滚动条样式 */}
          <textarea
            className="form-control chat-input resize-none custom-scrollbar flex-grow"
            placeholder="告诉我您的健身需求，例如：'我想开始增肌训练'"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={1}
            style={{ 
              minHeight: "50px", 
              maxHeight: "150px", 
              overflowY: "auto",
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05)',
              border: 'none',
              background: 'transparent'
            }}
            onInput={(e) => {
              // 自动调整高度
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${Math.min(target.scrollHeight, 150)}px`;
            }}
            onKeyDown={(e) => {
              // 按下Shift+Enter时换行，仅按Enter时提交
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (input.trim()) {
                  handleSendMessage();
                }
              }
            }}
          />
          
          <div className="d-flex align-items-center action-buttons">
            <Input
              className="d-none"
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
            />
            <label htmlFor="image" className="btn ms-2" style={{
              background: "rgba(255, 255, 255, 0.15)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer"
            }}>
              <i className="fas fa-image text-white"></i>
            </label>
            
            <div className="ms-2">
              <VoiceRecorder onTextChange={setInput} />
            </div>
            
            <Button type="submit" className="btn send-btn ms-2">
              <i className="fas fa-paper-plane text-white"></i>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}