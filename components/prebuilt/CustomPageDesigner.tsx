"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DragState,
  DropZone,
  initialDragState,
  handleDragStart,
  handleDrop,
  handleDragOver,
  handleDragEnter,
  handleDragLeave,
  handleDragEnd,
  createDropHandler
} from "@/utils/dragUtils";
import { useFloatingComponent } from "@/app/shared";
import { SimpleRecord } from "./SimpleRecord";
import { SimplePlan } from "./SimplePlan";
import { SimpleRecipe } from "./SimpleRecipe";
import { SimpleAchievement } from "./SimpleAchievement";
import { SimpleCheckin } from "./SimpleCheckin";
import { generateSimplifiedComponent } from "@/utils/contentAnalyzer";
import ReactDOM from "react-dom/client";
import { createPortal } from "react-dom";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

// 组件属性定义
interface CustomPageDesignerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  generatedContent: React.ReactNode[];
  toolResults?: Record<string, any>[];
  forceTypes?: string[]; // 新增参数，与SplitContentView中的forceType对应
}

// 自定义Modal组件用于显示简化版页面
interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

// 成品页面组件
interface FinishedPageProps {
  isOpen: boolean;
  onClose: () => void;
  layouts: DropZone[];
  showFloatingComponent: (content: React.ReactNode) => void;
  generatedContent: React.ReactNode[];
}

// 添加详细食谱组件
function DetailedRecipe() {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm overflow-visible p-6">
      <h1 className="text-2xl font-bold text-[#BE185D] mb-4">低脂高蛋白鸡胸肉沙拉</h1>
      <p className="text-gray-600 mb-6">一份简单又健康的低脂高蛋白鸡胸肉沙拉，适合健身和减脂期间食用。</p>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Badge className="bg-amber-100 text-amber-700 px-3 py-1 text-sm">
            难度: 简单
          </Badge>
        </div>
        <div className="flex items-center text-sm text-[#BE185D]">
          <Clock className="mr-1 h-4 w-4" />
          25 分钟
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-[#BE185D] mb-4 pb-2 border-b border-pink-100">食材</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between items-center">
            <span className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-[#FBCFE8] mr-2"></span>
              <span className="text-gray-700">鸡胸肉</span>
            </span>
            <span className="text-gray-500">200 克</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-[#FBCFE8] mr-2"></span>
              <span className="text-gray-700">生菜</span>
            </span>
            <span className="text-gray-500">50 克</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-[#FBCFE8] mr-2"></span>
              <span className="text-gray-700">黄瓜</span>
            </span>
            <span className="text-gray-500">50 克</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-[#FBCFE8] mr-2"></span>
              <span className="text-gray-700">樱桃番茄</span>
            </span>
            <span className="text-gray-500">50 克</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-[#FBCFE8] mr-2"></span>
              <span className="text-gray-700">橄榄油</span>
            </span>
            <span className="text-gray-500">10 毫升</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-[#FBCFE8] mr-2"></span>
              <span className="text-gray-700">柠檬汁</span>
            </span>
            <span className="text-gray-500">5 毫升</span>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-[#BE185D] mb-4 pb-2 border-b border-pink-100">步骤</h2>
        <ol className="space-y-4">
          <li className="flex">
            <span className="bg-[#FBCFE8] text-[#BE185D] rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">1</span>
            <p className="text-gray-700">将鸡胸肉切成小块，用盐和黑胡椒腌制10分钟。</p>
          </li>
          <li className="flex">
            <span className="bg-[#FBCFE8] text-[#BE185D] rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">2</span>
            <p className="text-gray-700">中火煎熟鸡胸肉，约需8-10分钟，确保完全煮熟。</p>
          </li>
          <li className="flex">
            <span className="bg-[#FBCFE8] text-[#BE185D] rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">3</span>
            <p className="text-gray-700">将生菜洗净切碎，黄瓜切片，樱桃番茄对半切开。</p>
          </li>
          <li className="flex">
            <span className="bg-[#FBCFE8] text-[#BE185D] rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">4</span>
            <p className="text-gray-700">将所有蔬菜和鸡胸肉混合，淋上橄榄油和柠檬汁调味。</p>
          </li>
        </ol>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold text-[#BE185D] mb-4 pb-2 border-b border-pink-100">营养成分</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#FEF2F7] p-4 rounded-lg text-center">
            <h3 className="text-sm font-medium text-[#DB2777] mb-1">蛋白质</h3>
            <p className="text-lg font-bold text-[#BE185D]">35g</p>
          </div>
          <div className="bg-[#FEF2F7] p-4 rounded-lg text-center">
            <h3 className="text-sm font-medium text-[#DB2777] mb-1">碳水</h3>
            <p className="text-lg font-bold text-[#BE185D]">12g</p>
          </div>
          <div className="bg-[#FEF2F7] p-4 rounded-lg text-center">
            <h3 className="text-sm font-medium text-[#DB2777] mb-1">脂肪</h3>
            <p className="text-lg font-bold text-[#BE185D]">8g</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 修改当前页面显示组件
const CustomModal = ({ isOpen, onClose, children }: CustomModalProps) => {
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-auto hide-scrollbar" 
      onClick={onClose}
    >
      <div onClick={e => e.stopPropagation()} className="m-4">
        {children}
      </div>
    </div>
  );
};

// FinishedPage 组件展示完成的设计
function FinishedPage({ isOpen, onClose, layouts, showFloatingComponent, generatedContent }: FinishedPageProps) {
  // 显示详细内容
  const showDetailContent = (zoneId: string) => {
    const zone = layouts.find(z => z.id === zoneId);
    if (zone && zone.detailIndex !== undefined && zone.detailIndex !== -1 && 
        generatedContent && zone.detailIndex < generatedContent.length) {
      // 使用优化后的详细页面查看组件，而不是直接显示内容
      showEnhancedDetailView(generatedContent[zone.detailIndex], showFloatingComponent);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="max-w-5xl w-[90vw] h-[80vh] flex flex-col gap-4 p-6 bg-gradient-to-br from-blue-50/90 via-indigo-50/90 to-purple-50/90 backdrop-blur-md overflow-hidden">
        <DialogHeader className="pb-2 border-b border-indigo-100">
          <DialogTitle className="text-xl font-bold text-indigo-700">定制页面</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto hide-scrollbar">
          
          {/* 主要内容区域 - 修改成品页面布局 */}
          <div className="w-full mb-4 flex flex-col items-center">
            <div className="w-[70%] flex flex-col gap-[20%]">
              {/* 上部区域 - 区域一和区域二 */}
              <div className="grid grid-cols-2 gap-[10%] mt-[5%]">
                {layouts.slice(0, 2).map((zone) => (
                  zone.components.length > 0 ? (
                    <div 
                      key={zone.id}
                      onClick={() => showDetailContent(zone.id)}
                      className="cursor-pointer hover:drop-shadow-xl flex items-center justify-center relative aspect-square"
                    >
                      <div className="transform transition-transform duration-300 hover:-translate-y-1 w-full h-full scale-[0.95]">
                        {zone.components[0]}
                      </div>
                    </div>
                  ) : (
                    <div 
                      key={zone.id}
                      className="w-full h-full text-gray-400 flex flex-col items-center justify-center bg-white/10 rounded-lg aspect-square"
                    >
                      <div className="text-indigo-300 text-3xl mb-1">+</div>
                      <p className="text-indigo-500">{zone.name}</p>
                    </div>
                  )
                ))}
              </div>
              
              {/* 下部区域 - 区域三和区域四 */}
              <div className="grid grid-cols-2 gap-[10%]">
                {layouts.slice(2, 4).map((zone) => (
                  zone.components.length > 0 ? (
                    <div 
                      key={zone.id}
                      onClick={() => showDetailContent(zone.id)}
                      className="cursor-pointer hover:drop-shadow-xl flex items-center justify-center relative aspect-square"
                    >
                      <div className="transform transition-transform duration-300 hover:-translate-y-1 w-full h-full scale-[0.95]">
                        {zone.components[0]}
                      </div>
                    </div>
                  ) : (
                    <div 
                      key={zone.id}
                      className="w-full h-full text-gray-400 flex flex-col items-center justify-center bg-white/10 rounded-lg aspect-square"
                    >
                      <div className="text-indigo-300 text-3xl mb-1">+</div>
                      <p className="text-indigo-500">{zone.name}</p>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="pt-2 border-t border-indigo-100">
          <Button onClick={onClose} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            返回编辑
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// 新增：优化的详细页面查看组件 - 使用Dialog模态对话框
const showEnhancedDetailView = (content: React.ReactNode, showComponent: (content: React.ReactNode) => void) => {
  // 创建一个状态管理对象，用于控制对话框的开关
  const DetailViewDialog = () => {
    const [open, setOpen] = useState(true);
    
    const handleClose = () => {
      // 反转关闭顺序：先触发中间层关闭，然后再关闭详细页面
      
      // 首先触发浮动组件关闭事件
      document.dispatchEvent(new CustomEvent('hide_floating_component'));
      
      // 稍后再关闭当前对话框，给浮动组件关闭动画留出时间
      setTimeout(() => {
        setOpen(false);
      }, 50);
    };
    
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl w-[90vw] h-[90vh] bg-white overflow-auto hide-scrollbar p-0 border-none shadow-2xl rounded-2xl">
          <div className="relative w-full h-full p-6">
            <div className="absolute top-4 right-4 z-50">
              <button 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-gray-100 transition-colors"
                onClick={handleClose}
                aria-label="关闭"
              >
                <span className="text-xl text-gray-700">×</span>
              </button>
            </div>
            <div className="w-full h-full flex items-center justify-center pt-4">
              {content}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
  // 使用 showComponent 函数显示对话框组件
  showComponent(<DetailViewDialog />);
};

// 添加隐藏滚动条但保留滚动功能的样式
const setHideScrollbarStyle = () => {
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.innerHTML = `
      .hide-scrollbar {
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE and Edge */
      }
      
      .hide-scrollbar::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
      }
    `;
    document.head.appendChild(style);
  }
};

// 在setTailwindAnimations函数下添加这个函数调用
const setTailwindAnimations = () => {
  // 这些样式会在运行时动态生成，因此不需要修改tailwind配置
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes scaleIn {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      .animate-fadeIn {
        animation: fadeIn 0.3s ease-out forwards;
      }
      .animate-scaleIn {
        animation: scaleIn 0.3s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
  }
  
  // 同时设置隐藏滚动条样式
  setHideScrollbarStyle();
};

// 添加缩略图组件的接口定义
interface DetailPageThumbnailProps {
  content: React.ReactNode;
  index: number;
  onClick: () => void;
}

// 添加缩略图组件，修复类型错误
const DetailPageThumbnail = ({ content, index, onClick }: DetailPageThumbnailProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(160);

  useEffect(() => {
    if (!contentRef.current || !containerRef.current) return;
    
    // 获取内容和容器尺寸
    const contentHeight = contentRef.current.scrollHeight;
    const contentWidth = contentRef.current.scrollWidth;
    const containerWidth = containerRef.current.clientWidth;
    
    // 计算最佳缩放比例
    const scale = containerWidth / contentWidth;
    
    // 计算缩放后的高度，添加一些边距
    const scaledHeight = Math.min(contentHeight * scale, 240);
    setHeight(scaledHeight);
  }, [content]);

  return (
    <div className="overflow-hidden border border-gray-200 rounded-lg p-2 bg-white mb-3">
      <div 
        ref={containerRef}
        className="bg-gray-50 rounded overflow-hidden relative"
        style={{ height: `${height}px` }}
      >
        <div 
          ref={contentRef}
          className="absolute top-0 left-0 w-full origin-top-left"
          style={{ 
            transform: `scale(${containerRef.current ? (containerRef.current.clientWidth / (contentRef.current?.scrollWidth || 1)) : 0.33})` 
          }}
        >
          {content}
        </div>
        {height >= 180 && (
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
        )}
      </div>
      <button
        onClick={onClick}
        className="text-xs text-indigo-600 px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 w-full mt-2"
      >
        查看详细页面 #{index + 1}
      </button>
    </div>
  );
};

export function CustomPageDesigner({ 
  isOpen, 
  onOpenChange, 
  generatedContent,
  toolResults = [],
  forceTypes = [] // 新增参数默认值
}: CustomPageDesignerProps) {
  const { showFloatingComponent } = useFloatingComponent();
  const [currentPage, setCurrentPage] = useState<string | null>(null);
  
  // 将dropZones从两个区域改为四个区域
  const [dropZones, setDropZones] = useState<DropZone[]>([
    { id: "topLeft", name: "区域一", components: [], detailIndex: -1 },
    { id: "topRight", name: "区域二", components: [], detailIndex: -1 },
    { id: "bottomLeft", name: "区域三", components: [], detailIndex: -1 },
    { id: "bottomRight", name: "区域四", components: [], detailIndex: -1 },
  ]);
  
  // 拖拽状态
  const [dragState, setDragState] = useState<DragState>({
    ...initialDragState,
    detailIndex: -1
  });
  
  // 是否完成设计
  const [isDesignComplete, setIsDesignComplete] = useState(false);
  
  // 是否显示成品页面
  const [showFinishedPage, setShowFinishedPage] = useState(false);
  
  // 设计区域尺寸
  const [designAreaDimensions, setDesignAreaDimensions] = useState({
    width: 450,
    height: 300
  });
  
  // 分离卡片和详细内容
  const [cardComponents, setCardComponents] = useState<Array<{type: string, component: React.ReactNode, detailIndex: number}>>([]);
  const [detailComponents, setDetailComponents] = useState<React.ReactNode[]>([]);
  
  // 添加动画样式
  useEffect(() => {
    if (isOpen) {
      setTailwindAnimations();
    }
  }, [isOpen]);


  //console.log('检测CustomPageDesigner中isOpenpn:',isOpen);
  // 生成示例卡片
  useEffect(() => {
    if (isOpen) {
      setDetailComponents(generatedContent);
      
      // 基于生成内容自动创建对应的卡片
      const newCards: Array<{type: string, component: React.ReactNode, detailIndex: number}> = [];
      console.log('CustomPageDesigner中generatedContent:', generatedContent);
      generatedContent.forEach((content, index) => {
        // 创建临时的工具结果数据
        const contentStr = String(content);
        // 优先使用传入的toolResults，如果没有再尝试从内容中提取
        let tempToolResult: Record<string, any> = toolResults[index] || {};
        
        // 如果没有传入对应的toolResult，尝试从内容中提取
        if (!toolResults[index]) {
          try {
            const toolResultMatch = contentStr.match(/Tool result: ({.*?})/);
            if (toolResultMatch && toolResultMatch[1]) {
              tempToolResult = JSON.parse(toolResultMatch[1]);
              console.log('CustomPageDesigner中解析的工具结果:', tempToolResult);
            }
          } catch (e) {
            console.error('解析工具结果失败:', e);
          }
        } else {
          console.log('CustomPageDesigner中使用传入的工具结果:', toolResults[index]);
        }
        
        // 优先使用传入的forceType，如果没有则使用默认值
        let forceType = forceTypes[index] || '';
        let cardType = ''; // 添加cardType声明
        
        if (!forceType) {
          // 使用简单推断或默认为记录类型
          forceType = 'SimpleRecord.tsx';
        }
        
        // 避免重复调用toLowerCase()可能导致的性能问题
        const forceTypeLower = forceType.toLowerCase();
        
        // 合并判断和组件生成逻辑
        let cardComponent;
        
        if (forceTypeLower.includes('recipe')) {
          cardType = 'recipe';
          cardComponent = <SimpleRecipe 
            title={tempToolResult?.title !== undefined ? tempToolResult.title : "健康食谱"}
            difficulty={tempToolResult?.difficulty !== undefined ? tempToolResult.difficulty : "中等"} 
            timeNeeded={tempToolResult?.cookTime !== undefined ? `${tempToolResult.cookTime}分钟` : "30分钟"}
            protein={tempToolResult?.nutrition?.protein !== undefined ? `${tempToolResult.nutrition.protein}g` : "15g"}
            carbs={tempToolResult?.nutrition?.carbs !== undefined ? `${tempToolResult.nutrition.carbs}g` : "22g"}
            fat={tempToolResult?.nutrition?.fat !== undefined ? `${tempToolResult.nutrition.fat}g` : "28g"}
          />;
        } else if (forceTypeLower.includes('plan')) {
          cardType = 'plan';
          // 计算 startDate 和 endDate 之间的持续时间
          let durationText = "30天";
          if (tempToolResult?.startDate && tempToolResult?.endDate) {
            try {
              const startDate = new Date(tempToolResult.startDate);
              const endDate = new Date(tempToolResult.endDate);
              
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
              console.log('计算日期差异时出错:', error);
            }
          }
          
          cardComponent = <SimplePlan 
            title={tempToolResult?.title !== undefined ? tempToolResult.title : "训练计划"}
            goal={tempToolResult?.goal !== undefined ? tempToolResult.goal : "10公里长跑训练"} 
            duration={durationText} 
            progress={tempToolResult?.progress !== undefined ? tempToolResult.progress : 75}
          />;
        } else if (forceTypeLower.includes('checkin') || forceTypeLower === 'record') {
          cardType = 'checkin';
          // 打卡记录卡片
          cardComponent = <SimpleCheckin 
            title={tempToolResult?.title || "打卡记录"}
            currentDays={tempToolResult?.streak !== undefined ? tempToolResult.streak : (tempToolResult?.currentDays !== undefined ? tempToolResult.currentDays : 21)} 
            targetDays={tempToolResult?.targetDays || 30} 
          />;
        } else if (forceTypeLower.includes('simplerecord')) {
          cardType = 'record';
          // 运动记录卡片
          // 格式化显示持续时间
          let displayDuration = "00:15:30";
          if (tempToolResult?.duration) {
            if (typeof tempToolResult.duration === 'number' || !isNaN(parseInt(tempToolResult.duration))) {
              const durationNum = typeof tempToolResult.duration === 'number' 
                ? tempToolResult.duration 
                : parseInt(tempToolResult.duration);
              displayDuration = `${durationNum} 分钟`;
            } else {
              displayDuration = tempToolResult.duration;
            }
          }
          
          cardComponent = <SimpleRecord 
            title={tempToolResult?.title || "运动记录"}
            activity={tempToolResult?.activity || "户外跑步"} 
            time={displayDuration}
            formattedDate={tempToolResult?.date}
            distance={tempToolResult?.distance?.toString() || "0"}
          />;
        } else if (forceTypeLower.includes('achievement')) {
          cardType = 'achievement';
          cardComponent = <SimpleAchievement 
            title={tempToolResult?.title !== undefined ? tempToolResult.title : "跑步成就"} 
            medalInfo={tempToolResult?.badges && tempToolResult.badges[0]?.description !== undefined ? tempToolResult.badges[0].description : "10公里赛事金牌"} 
            earnedDate={tempToolResult?.badges && tempToolResult.badges[0]?.earnedDate !== undefined ? tempToolResult.badges[0].earnedDate : "2024-05-01"} 
          />;
        } else {
          // 默认使用原始的生成方法
          cardType = 'record';
          cardComponent = generateSimplifiedComponent(content);
        }
        
        console.log(`CardType确定为: ${cardType}, 基于forceType: ${forceType}`);
        
        newCards.push({
          type: cardType,
          component: cardComponent,
          detailIndex: index
        });
      });
      
      setCardComponents(newCards);
    }
  }, [isOpen, generatedContent, toolResults, forceTypes]);
  
  // 打开页面
  const openPage = (page: string) => {
    setCurrentPage(page);
  };
  
  // 关闭页面
  const closePage = () => {
    setCurrentPage(null);
  };
  
  // 设计区域参考
  const designAreaRef = useRef<HTMLDivElement>(null);
  
  // 测量设计区域尺寸
  useEffect(() => {
    if (isOpen && designAreaRef.current) {
      const updateDimensions = () => {
        const designArea = designAreaRef.current;
        if (designArea) {
          const rect = designArea.getBoundingClientRect();
          setDesignAreaDimensions({
            width: rect.width - 24, // 减去内边距
            height: rect.height - 24
          });
        }
      };
      
      // 初始测量
      updateDimensions();
      
      // 监听窗口大小变化
      window.addEventListener('resize', updateDimensions);
      
      return () => {
        window.removeEventListener('resize', updateDimensions);
      };
    }
  }, [isOpen]);
  
  // 处理ESC键
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isDesignComplete) {
        setIsDesignComplete(false);
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isDesignComplete]);
  
  // 当组件打开时重置状态
  useEffect(() => {
    if (isOpen) {
      setDropZones([
        { id: "topLeft", name: "区域一", components: [], detailIndex: -1 },
        { id: "topRight", name: "区域二", components: [], detailIndex: -1 },
        { id: "bottomLeft", name: "区域三", components: [], detailIndex: -1 },
        { id: "bottomRight", name: "区域四", components: [], detailIndex: -1 },
      ]);
      setIsDesignComplete(false);
      setDragState({ ...initialDragState, detailIndex: -1 });
      setShowFinishedPage(false);
    }
  }, [isOpen]);
  
  // 处理卡片拖动
  const handleCardDragStart = (cardComponent: React.ReactNode, type: string, detailIndex: number) => {
    if (!isDesignComplete) {
      handleDragStart(cardComponent, type, setDragState);
      setDragState(prev => ({ ...prev, detailIndex }));
    }
  };
  
  // 重置设计
  const resetDesign = () => {
    setDropZones([
      { id: "topLeft", name: "区域一", components: [], detailIndex: -1 },
      { id: "topRight", name: "区域二", components: [], detailIndex: -1 },
      { id: "bottomLeft", name: "区域三", components: [], detailIndex: -1 },
      { id: "bottomRight", name: "区域四", components: [], detailIndex: -1 },
    ]);
    setIsDesignComplete(false);
    setDragState({...initialDragState, detailIndex: -1});
  };
  
  // 完成设计
  const completeDesign = () => {
    setIsDesignComplete(true);
    setDragState({ ...initialDragState, detailIndex: -1 });
  };
  
  // 显示成品页面
  const showFinalPage = () => {
    setShowFinishedPage(true);
  };

  // 处理缩略图点击
  const handleThumbnailClick = (content: React.ReactNode) => {
    // 使用优化后的详细页面查看组件
    showEnhancedDetailView(content, showFloatingComponent);
  };

  // 删除区域内容
  const handleDeleteContent = (zoneId: string) => {
    setDropZones(prev => prev.map(zone => 
      zone.id === zoneId ? { ...zone, components: [] } : zone
    ));
  };
  
  // 调整内容到容器中 - 简化版本
  const placeContentInContainer = (content: React.ReactNode) => {
    return (
      <div className="w-[90%] h-[90%] flex items-center justify-center">
        {content}
      </div>
    );
  };

  // 显示详细内容
  const showDetailContent = (zoneId: string) => {
    const zone = dropZones.find(z => z.id === zoneId);
    if (zone && zone.detailIndex !== undefined && zone.detailIndex !== -1 && 
        detailComponents && zone.detailIndex < detailComponents.length) {
      // 使用优化后的详细页面查看组件
      showEnhancedDetailView(detailComponents[zone.detailIndex], showFloatingComponent);
    }
  };

  const handleResetClick = () => {
    resetDesign();
    setDropZones([
      { id: "topLeft", name: "区域一", components: [], detailIndex: -1 },
      { id: "topRight", name: "区域二", components: [], detailIndex: -1 },
      { id: "bottomLeft", name: "区域三", components: [], detailIndex: -1 },
      { id: "bottomRight", name: "区域四", components: [], detailIndex: -1 },
    ]);
  }

  // 在 CustomPageDesigner 组件中添加一个查看所有详细页面的函数
  const viewAllDetailPages = () => {
    // 创建一个包含所有详细页面的预览面板
    const previewPanel = (
      <div className="fixed inset-0 z-[201] bg-white animate-fadeIn overflow-auto hide-scrollbar">
        <div className="min-h-screen w-full py-12 px-6">
          <h2 className="text-2xl font-bold text-center text-indigo-700 mb-8">所有详细页面预览</h2>
          <div className="grid grid-cols-1 gap-10 mb-20 w-full max-w-4xl mx-auto">
            {detailComponents.map((detail, index) => (
              <div key={index} className="relative bg-gray-50 rounded-xl p-8 shadow-md">
                <div className="text-sm text-gray-500 mb-4 bg-indigo-50 rounded px-3 py-1 inline-block">
                  详细页面 #{index + 1}
                </div>
                {detail}
                <button 
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                  onClick={() => showEnhancedDetailView(detail, showFloatingComponent)}
                >
                  <span>👁️</span>
                </button>
              </div>
            ))}
          </div>
          <div className="fixed bottom-6 right-6">
            <button 
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full shadow-lg"
              onClick={() => {
                // 创建关闭事件
                const closeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
                document.dispatchEvent(closeEvent);
              }}
            >
              关闭预览
            </button>
          </div>
        </div>
      </div>
    );
    
    showFloatingComponent(previewPanel);
  };

  return (
    <>
      <Dialog open={isOpen && !showFinishedPage} onOpenChange={(open) => {
        if (!open) {
          onOpenChange(false);
        }
      }}>
        <DialogContent className={cn(
          "custom-page-designer-dialog max-w-6xl w-[90vw] h-[85vh] max-h-[900px] flex flex-col",
          "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50",
          "border border-indigo-100 shadow-lg rounded-3xl !rounded-3xl overflow-hidden"
        )}
        aria-describedby="custom-page-design-description">
          <DialogHeader className="border-b border-indigo-100 pb-3 flex-shrink-0">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl font-bold text-indigo-700">自定义页面设计</DialogTitle>
            </div>
            <DialogDescription id="custom-page-design-description" className="sr-only">
              自定义页面设计对话框，可以拖拽卡片到不同区域设计页面
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden p-4 flex flex-col gap-4">
            <div className="flex gap-6 h-full">
              {/* 左侧：生成内容区域 */}
              <div className="w-[320px] flex flex-col h-full overflow-hidden">
                <h3 className="text-lg font-semibold text-indigo-700 mb-3">生成内容</h3>
                <div className="border border-indigo-100 rounded-xl bg-white/60 p-4 flex-1 overflow-hidden flex flex-col">
                  <div className="flex-1 overflow-auto hide-scrollbar">
                    <div className="flex flex-col gap-4">
                      {/* 详细页面和卡片视图并排显示 */}
                      <div className="p-3 border border-dashed border-indigo-300 rounded-lg bg-white/80 mb-4">
                        <h4 className="text-sm font-medium text-indigo-600 mb-2">详细页面</h4>
                        <div className="max-h-[320px] overflow-y-auto hide-scrollbar mb-3">
                          {detailComponents.length > 0 ? (
                            <div className="flex flex-col gap-3">
                              {detailComponents.map((detailContent, idx) => (
                                <DetailPageThumbnail 
                                  key={idx} 
                                  content={detailContent} 
                                  index={idx} 
                                  onClick={() => handleThumbnailClick(detailContent)} 
                                />
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm p-2">暂无详细内容</p>
                          )}
                        </div>
                      </div>
                      
                      <h4 className="text-sm font-medium text-indigo-600 mb-1">卡片 (可拖拽)</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {cardComponents.map((card, index) => (
                          <div 
                            key={index}
                            className="p-3 border border-dashed border-indigo-300 rounded-lg bg-white/80"
                          >
                            <div 
                              className="draggable-content cursor-move"
                              draggable={!isDesignComplete}
                              onDragStart={() => {
                                if (!isDesignComplete) {
                                  handleCardDragStart(card.component, card.type, card.detailIndex);
                                }
                              }}
                              onDragEnd={() => handleDragEnd(setDragState)}
                            >
                              <div className="content-thumbnail">
                                {card.component}
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-center text-gray-500">
                              {card.type} 卡片 - 对应详细页面 #{card.detailIndex + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <p className="mt-3 text-sm text-indigo-600 italic">
                    {isDesignComplete 
                      ? "设计已完成" 
                      : "拖拽卡片到右侧区域"
                    }
                  </p>
                </div>
              </div>
              
              {/* 右侧：自定义区域 */}
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                <h3 className="text-lg font-semibold text-indigo-700 mb-3">自定义区域</h3>
                <div className="border border-indigo-100 rounded-xl bg-white/60 p-4 flex-1 overflow-auto hide-scrollbar">
                  {!isDesignComplete ? (
                    // 设计模式 - 修复网格区域超出范围和网格重叠问题
                    <div className="w-full h-full flex flex-col items-center">
                      <div className="w-[70%] flex flex-col gap-[20%]">
                        {/* 上部区域 - 区域一和区域二 */}
                        <div className="grid grid-cols-2 gap-[10%] mt-[5%]">
                          {dropZones.slice(0, 2).map((zone) => (
                            <div 
                              ref={zone.id === 'topLeft' ? designAreaRef : null}
                              key={zone.id}
                              className={cn(
                                "rounded-lg p-2 relative flex items-center justify-center aspect-square bg-white/10 hover:bg-white/20 transition-colors",
                                zone.components.length > 0 && "bg-white/30",
                                dragState.isDragging && "bg-white/40"
                              )}
                              onDrop={createDropHandler(zone.id, dragState, setDragState, setDropZones)}
                              onDragOver={handleDragOver}
                              onDragEnter={handleDragEnter}
                              onDragLeave={handleDragLeave}
                            >
                              {zone.components.length > 0 ? (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="relative w-[90%] h-[90%]">
                                    {zone.components[0]}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteContent(zone.id);
                                      }}
                                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600"
                                      title="删除内容"
                                    >
                                      ×
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="flex flex-col items-center justify-center text-indigo-400">
                                    <div className="text-indigo-300 text-3xl mb-1">+</div>
                                    <p>{zone.name}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {/* 下部区域 - 区域三和区域四 */}
                        <div className="grid grid-cols-2 gap-[10%]">
                          {dropZones.slice(2, 4).map((zone) => (
                            <div 
                              key={zone.id}
                              className={cn(
                                "rounded-lg p-2 relative flex items-center justify-center aspect-square bg-white/10 hover:bg-white/20 transition-colors",
                                zone.components.length > 0 && "bg-white/30",
                                dragState.isDragging && "bg-white/40"
                              )}
                              onDrop={createDropHandler(zone.id, dragState, setDragState, setDropZones)}
                              onDragOver={handleDragOver}
                              onDragEnter={handleDragEnter}
                              onDragLeave={handleDragLeave}
                            >
                              {zone.components.length > 0 ? (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="relative w-[90%] h-[90%]">
                                    {zone.components[0]}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteContent(zone.id);
                                      }}
                                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600"
                                      title="删除内容"
                                    >
                                      ×
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="flex flex-col items-center justify-center text-indigo-400">
                                    <div className="text-indigo-300 text-3xl mb-1">+</div>
                                    <p>{zone.name}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // 完成后的展示模式 - 同样修改
                    <div className="w-full h-full flex flex-col items-center">
                      <div className="w-[70%] flex flex-col gap-[20%]">
                        {/* 上部区域 - 区域一和区域二 */}
                        <div className="grid grid-cols-2 gap-[10%] mt-[5%]">
                          {dropZones.slice(0, 2).map((zone) => (
                            <div 
                              key={zone.id}
                              className="rounded-lg p-2 bg-white/30 flex items-center justify-center relative aspect-square"
                            >
                              {zone.components.length > 0 ? (
                                <div 
                                  className="w-full h-full flex items-center justify-center cursor-pointer"
                                  onClick={() => showDetailContent(zone.id)}
                                >
                                  <div className="w-[90%] h-[90%]">
                                    {zone.components[0]}
                                  </div>
                                </div>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <div className="flex flex-col items-center justify-center">
                                    <div className="text-indigo-300 text-3xl mb-1">+</div>
                                    <p>{zone.name}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {/* 下部区域 - 区域三和区域四 */}
                        <div className="grid grid-cols-2 gap-[10%]">
                          {dropZones.slice(2, 4).map((zone) => (
                            <div 
                              key={zone.id}
                              className="rounded-lg p-2 bg-white/30 flex items-center justify-center relative aspect-square"
                            >
                              {zone.components.length > 0 ? (
                                <div 
                                  className="w-full h-full flex items-center justify-center cursor-pointer"
                                  onClick={() => showDetailContent(zone.id)}
                                >
                                  <div className="w-[90%] h-[90%]">
                                    {zone.components[0]}
                                  </div>
                                </div>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <div className="flex flex-col items-center justify-center">
                                    <div className="text-indigo-300 text-3xl mb-1">+</div>
                                    <p>{zone.name}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="border-t border-indigo-100 pt-3 flex items-center justify-between flex-shrink-0">
            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={handleResetClick}
                className="bg-white hover:bg-gray-50"
              >
                重置
              </Button>
              
              {isDesignComplete && (
                <Button 
                  onClick={showFinalPage}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-none shadow-md hover:shadow-lg transition-all duration-300"
                >
                  查看成品页面
                </Button>
              )}
              
              <Button 
                onClick={isDesignComplete ? resetDesign : completeDesign}
                className={cn(
                  "bg-gradient-to-r",
                  isDesignComplete 
                    ? "from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700" 
                    : "from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700",
                  "text-white border-none shadow-md hover:shadow-lg transition-all duration-300"
                )}
              >
                {isDesignComplete ? "编辑模式" : "完成设计"}
              </Button>
              
              {detailComponents.length > 0 && (
                <Button
                  onClick={viewAllDetailPages}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-none shadow-md hover:shadow-lg transition-all duration-300"
                >
                  查看所有详细页面
                </Button>
              )}
            </div>
            
            <Button 
              onClick={() => onOpenChange(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white"
            >
              关闭
            </Button>
          </DialogFooter>
          
          <CustomModal isOpen={currentPage !== null} onClose={closePage}>
            {currentPage === "record" && <SimpleRecord title="运动记录" activity="户外跑步" time="00:15:30" distance="1.51" />}
            {currentPage === "plan" && <SimplePlan title="训练计划" goal="10公里长跑训练" duration="4周" />}
            {currentPage === "recipe" && <DetailedRecipe />}
            {currentPage === "achievement" && <SimpleAchievement title="跑步成就" medalInfo="10公里赛事金牌" earnedDate="2024-05-01" />}
            {currentPage === "checkin" && <SimpleCheckin title="打卡记录" currentDays={21} targetDays={30} />}
          </CustomModal>
        </DialogContent>
      </Dialog>
      
      {/* 添加成品页面组件的渲染 */}
      {isOpen && showFinishedPage && (
        <FinishedPage 
          isOpen={showFinishedPage}
          onClose={() => setShowFinishedPage(false)}
          layouts={dropZones}
          showFloatingComponent={showFloatingComponent}
          generatedContent={detailComponents}
        />
      )}
    </>
  );
} 