"use client";
import { createContext, useState, useContext, ReactNode } from "react";

// 定义浮动组件的状态接口
interface FloatingComponentState {
  isVisible: boolean;
  component: ReactNode | null;
  forceType?: string; // 强制指定卡片类型
  toolResult?: any; // 工具结果数据
  showFloatingComponent: (component: ReactNode, forceType?: string, toolResult?: any) => void;
  hideFloatingComponent: () => void;
}

// 创建上下文
const FloatingComponentContext = createContext<FloatingComponentState | undefined>(undefined);

// 创建提供者组件
export function FloatingComponentProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const [component, setComponent] = useState<ReactNode | null>(null);
  const [forceType, setForceType] = useState<string | undefined>(undefined);
  const [toolResult, setToolResult] = useState<any>(undefined);

  const showFloatingComponent = (component: ReactNode, forceType?: string, toolResult?: any) => {
    console.log("===== 显示浮动组件 =====");
    console.log("组件类型:", typeof component);
    console.log("强制类型:", forceType);
    if (toolResult) {
      console.log("工具结果数据:", toolResult);
    }
    
    try {
      // 调试组件内容
      if (component) {
        const componentStr = JSON.stringify(component);
        console.log("组件内容前100字符:", componentStr.substring(0, 100));
        
        // 检查是否包含Tool result字样
        if (componentStr.includes('Tool result:')) {
          console.error("警告: 组件内容包含'Tool result:'字样，可能是未处理的JSON数据");
        }
      }
    } catch (e) {
      console.error("分析浮动组件时出错:", e);
    }
    
    setComponent(component);
    setForceType(forceType); // 设置强制类型
    setToolResult(toolResult); // 设置工具结果
    setIsVisible(true);
  };

  const hideFloatingComponent = () => {
    console.log("隐藏浮动组件");
    setIsVisible(false);
  };

  return (
    <FloatingComponentContext.Provider
      value={{
        isVisible,
        component,
        forceType,
        toolResult,
        showFloatingComponent,
        hideFloatingComponent
      }}
    >
      {children}
    </FloatingComponentContext.Provider>
  );
}

// 创建自定义Hook
export function useFloatingComponent() {
  const context = useContext(FloatingComponentContext);
  if (context === undefined) {
    throw new Error('useFloatingComponent must be used within a FloatingComponentProvider');
  }
  return context;
}

// 现有的LocalContext保持不变
export const LocalContext = createContext<any>(null);
