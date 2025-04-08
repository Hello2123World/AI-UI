"use client";

import React, { ReactNode, useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { SimpleRecord } from '@/components/prebuilt/SimpleRecord';
import { SimplePlan } from '@/components/prebuilt/SimplePlan';
import { SimpleRecipe } from '@/components/prebuilt/SimpleRecipe';
import { SimpleAchievement } from '@/components/prebuilt/SimpleAchievement';
import { SimpleCheckin } from '@/components/prebuilt/SimpleCheckin';
import { generateSimplifiedComponent } from '@/utils/contentAnalyzer';

export interface SplitContentViewProps {
  mainContent: ReactNode;
  onClose?: () => void;
  forceType?: string; // 可以强制指定类型
  toolResult?: any; // 工具结果数据
}

/**
 * 分栏视图组件，同时显示主页面和简化版页面
 */
export function SplitContentView({ mainContent, onClose, forceType, toolResult }: SplitContentViewProps) {
  // 自动生成简化版内容
  const [simplifiedContent, setSimplifiedContent] = useState<ReactNode>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 是否在大屏幕上显示分栏布局
  const [isWideLayout, setIsWideLayout] = useState(true);
  
  // 在小屏幕时切换显示内容
  const [showMainContent, setShowMainContent] = useState(true);
  
  // 在组件加载后生成简化版内容
  useEffect(() => {
    setIsLoading(true);
    
    // 延迟生成简化版内容，确保主内容已完全渲染
    const timer = setTimeout(() => {
      // 使用forceType参数或自动分析生成简化版内容
      if (forceType) {
        console.log('使用强制类型生成卡片:', forceType);
        console.log('splitContentView中的工具结果数据:', toolResult);
        console.log('forceType类型:', typeof forceType);
        console.log('forceType小写后:', forceType.toLowerCase());
        
        // 基于强制类型生成对应的卡片 - 固定的对应关系
        let forcedContent;
        
        // 匹配检查，输出完整的匹配值
        const matchValue = forceType.toLowerCase();
        console.log('匹配值:', matchValue);
        
        switch (forceType) {
          // 固定映射关系
          case 'SimpleRecipe.tsx': //SimpleRecipe.tsx
            forcedContent = <SimpleRecipe 
              title={toolResult?.title !== undefined ? toolResult.title : "健康食谱"}
              difficulty={toolResult?.difficulty !== undefined ? toolResult.difficulty : "中等"} 
              timeNeeded={toolResult?.cookTime !== undefined ? `${toolResult.cookTime}分钟` : "30分钟"}
              protein={toolResult?.nutrition?.protein !== undefined ? `${toolResult.nutrition.protein}g` : "15g"}
              carbs={toolResult?.nutrition?.carbs !== undefined ? `${toolResult.nutrition.carbs}g` : "22g"}
              fat={toolResult?.nutrition?.fat !== undefined ? `${toolResult.nutrition.fat}g` : "28g"}
            />;
            break;
          case 'SimplePlan.tsx': //SimplePlan.tsx
            // console.log('渲染Simpleplan组件，使用工具结果:', toolResult);
            // console.log('渲染Simpleplan组件，使用工具结果，持续时间:', toolResult?.progress);
            
            // 计算 startDate 和 endDate 之间的持续时间
            let durationText = "30天";
            if (toolResult?.startDate && toolResult?.endDate) {
              try {
                const startDate = new Date(toolResult.startDate);
                const endDate = new Date(toolResult.endDate);
                
                // 检查日期是否有效
                if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                  // 计算天数差
                  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  
                  // 格式化持续时间
                  if (diffDays > 0) {
                    durationText = `${diffDays} 天`;
                  }
                }
              } catch (error) {
                console.error('计算日期差异时出错:', error);
              }
            }
            
            forcedContent = <SimplePlan 
              title={toolResult?.title !== undefined ? toolResult.title : "训练计划"}   
              goal={toolResult?.goal !== undefined ? toolResult.goal : "10公里长跑训练"} 
              duration={durationText} 
              progress={toolResult?.progress !== undefined ? toolResult.progress : 75}
            />;
            break;
          case 'SimpleCheckin.tsx': //SimpleCheckin.tsx
            // 检查内容，判断是否瑜伽打卡记录
            console.log('渲染SimpleCheckin.tsx组件，使用工具结果:', toolResult);
            let title = toolResult?.title !== undefined ? toolResult.title : "打卡记录";
            let currentDays = toolResult?.streak !== undefined ? toolResult.streak : (toolResult?.currentDays !== undefined ? toolResult.currentDays : 21);
            let targetDays = toolResult?.targetDays !== undefined ? toolResult.targetDays : 30;  
            console.log('使用的打卡数据:', { title, currentDays, targetDays });
            forcedContent = <SimpleCheckin 
              title={title}
              currentDays={currentDays} 
              targetDays={targetDays} 
            />;
            break;
          case 'SimpleRecord.tsx': //SimpleRecord.tsx
            // 使用工具结果数据或默认值
            console.log('渲染SimpleRecord组件，使用工具结果:', toolResult);
            // 格式化显示持续时间，优先使用原始分钟数
            let displayDuration = "00:15:30";
            if (toolResult?.duration) {
              if (typeof toolResult.duration === 'number' || !isNaN(parseInt(toolResult.duration))) {
                // 如果是数字，显示为"XX 分钟"
                const durationNum = typeof toolResult.duration === 'number' 
                  ? toolResult.duration 
                  : parseInt(toolResult.duration);
                displayDuration = `${durationNum} 分钟`;
              } else {
                // 否则直接使用字符串
                displayDuration = toolResult.duration;
              }
            }
            
            forcedContent = <SimpleRecord 
              title={toolResult?.title !== undefined ? toolResult.title : "运动记录"}
              activity={toolResult?.activity !== undefined ? toolResult.activity : "户外跑步"}
              time={displayDuration} // 显示格式化的持续时间
              formattedDate={toolResult?.date} // 使用date作为格式化日期
              distance={toolResult?.distance !== undefined ? toolResult.distance.toString() : "0"}
            />;
            break;
          case 'SimpleAchievement.tsx': //SimpleAchievement.tsx
            forcedContent = <SimpleAchievement 
              title={toolResult?.title !== undefined ? toolResult.title : "跑步成就"} 
              medalInfo={toolResult?.badges && toolResult.badges[0]?.description !== undefined ? toolResult.badges[0].description : "10公里赛事金牌"} 
              earnedDate={toolResult?.badges && toolResult.badges[0]?.earnedDate !== undefined ? toolResult.badges[0].earnedDate : "2024-05-01"} 
            />;
            break;
          default:
            forcedContent = generateSimplifiedComponent(mainContent);
        }
        
        setSimplifiedContent(forcedContent);
      } else {
        // 默认行为：自动分析生成
        setSimplifiedContent(generateSimplifiedComponent(mainContent));
      }
      
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [mainContent, forceType, toolResult]);
  
  // 添加对hide_floating_component事件的监听
  useEffect(() => {
    const handleHideEvent = () => {
      // 如果提供了onClose回调，延迟调用它
      // 这样可以确保关闭顺序与其他组件一致
      if (onClose) {
        // 使用较长的延迟，确保在FloatingComponentContainer关闭后再调用
        setTimeout(() => {
          onClose();
        }, 150);
      }
    };
    
    // 添加事件监听器
    document.addEventListener('hide_floating_component', handleHideEvent);
    
    // 清理函数
    return () => {
      document.removeEventListener('hide_floating_component', handleHideEvent);
    };
  }, [onClose]);
  
  // 处理点击简化版卡片
  const handleSimplifiedClick = () => {
    // 如果是小屏幕布局，切换到主内容
    if (!isWideLayout) {
      setShowMainContent(true);
    }
  };
  
  return (
    <div className="w-full flex flex-col h-full">
      {/* 内容区域 */}
      <div className="flex flex-col md:flex-row overflow-visible" style={{ minHeight: "60vh", maxHeight: "calc(80vh - 120px)" }}>
        {/* 大屏幕分栏布局，小屏幕条件渲染 */}
        {(isWideLayout || showMainContent) && (
          <div className={cn(
            "p-4 overflow-y-auto custom-scrollbar",
            "max-h-[calc(80vh-120px)]",
            isWideLayout ? "md:w-2/3 border-r border-indigo-100" : "w-full"
          )}
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(99, 102, 241, 0.3) rgba(99, 102, 241, 0.1)'
          }}>
            <div className="flex justify-center pb-6">
              <div className="w-full max-w-full">
                {mainContent}
              </div>
            </div>
          </div>
        )}
        
        {(isWideLayout || !showMainContent) && (
          <div className={cn(
            "p-4 overflow-y-auto custom-scrollbar bg-indigo-50/30",
            "max-h-[calc(80vh-120px)]",
            isWideLayout ? "md:w-1/3" : "w-full"
          )}
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(99, 102, 241, 0.3) rgba(99, 102, 241, 0.1)'
          }}>
            <div className="flex flex-col items-center pb-6">
              {isLoading ? (
                <div className="h-[280px] w-[280px] flex items-center justify-center bg-white/50 rounded-xl">
                  <div className="flex flex-col items-center">
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                    </div>
                    <p className="mt-4 text-sm text-indigo-600">生成简化卡片中...</p>
                  </div>
                </div>
              ) : (
                <div 
                  className="cursor-pointer transform transition-transform hover:scale-105 active:scale-95"
                  onClick={handleSimplifiedClick}
                >
                  {simplifiedContent}
                </div>
              )}
              
              <p className="text-xs text-indigo-500 mt-4 text-center">
                {!isLoading && "点击卡片查看详细内容"}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* 底部控制区 */}
      <div className="p-3 border-t border-indigo-100 flex items-center justify-between">
        {/* 小屏幕时显示切换按钮 */}
        <div className="flex md:hidden space-x-2">
          <Button
            size="sm"
            variant={showMainContent ? "default" : "outline"}
            onClick={() => setShowMainContent(true)}
            className={cn(
              showMainContent 
                ? "bg-indigo-500 text-white" 
                : "bg-white text-indigo-500"
            )}
          >
            详细视图
          </Button>
          <Button
            size="sm"
            variant={!showMainContent ? "default" : "outline"}
            onClick={() => setShowMainContent(false)}
            className={cn(
              !showMainContent 
                ? "bg-indigo-500 text-white" 
                : "bg-white text-indigo-500"
            )}
          >
            简化视图
          </Button>
        </div>
        
        {/* 空间占位 */}
        <div className="hidden md:block">
          <p className="text-xs text-indigo-500 italic">提示: 按ESC键可关闭此窗口</p>
        </div>
        
        {/* 关闭按钮 */}
        <Button
          onClick={onClose}
          className={cn(
            "bg-gradient-to-r from-indigo-500 to-purple-600",
            "hover:from-indigo-600 hover:to-purple-700",
            "text-white border-none shadow-md hover:shadow-lg transition-all duration-300"
          )}
        >
          关闭
        </Button>
      </div>
    </div>
  );
} 