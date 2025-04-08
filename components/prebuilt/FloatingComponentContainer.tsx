"use client";

import { useFloatingComponent } from "@/app/shared";
import { useEffect, useRef, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SplitContentView } from "./SplitContentView";

export function FloatingComponentContainer() {
  const { isVisible, component, hideFloatingComponent, forceType, toolResult } = useFloatingComponent();
  const [open, setOpen] = useState(false);

  // 当isVisible变化时更新Dialog的open状态
  useEffect(() => {
    setOpen(isVisible);
  }, [isVisible]);

  // 监听自定义hide_floating_component事件
  useEffect(() => {
    const handleHideEvent = () => {
      // 立即将对话框设置为关闭状态（视觉效果）
      setOpen(false);
      
      // 延迟调用hideFloatingComponent，给详细页面对话框关闭留出时间
      // 这样视觉上会先关闭中间层，然后详细页面的关闭按钮消失
      setTimeout(() => {
        hideFloatingComponent();
      }, 100);
    };

    // 添加事件监听器
    document.addEventListener('hide_floating_component', handleHideEvent);

    // 清理函数
    return () => {
      document.removeEventListener('hide_floating_component', handleHideEvent);
    };
  }, [hideFloatingComponent]);

  // 当Dialog关闭时通知Context
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      hideFloatingComponent();
    }
  };

  if (!component) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className={cn(
          "max-w-5xl h-[85vh] max-h-[85vh]", 
          "flex flex-col",
          "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50",
          "border border-indigo-100 shadow-lg rounded-3xl !rounded-3xl"
        )}
        aria-describedby="dialog-description"
      >
        <DialogHeader className="border-b border-indigo-100 pb-3 flex-shrink-0">
          <DialogTitle className="text-xl font-bold text-indigo-700">AI健身助手</DialogTitle>
          <DialogDescription id="dialog-description" className="sr-only">
            AI健身助手详细内容展示窗口，显示生成的健身相关内容
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          {/* 使用新的分栏视图组件，并传递forceType和toolResult参数 */}
          <SplitContentView 
            mainContent={component} 
            onClose={() => handleOpenChange(false)} 
            forceType={forceType}
            toolResult={toolResult}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}