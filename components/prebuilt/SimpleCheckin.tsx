"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SimpleCheckinProps {
  title: string;
  currentDays: number;
  targetDays: number;
}

export function SimpleCheckin({ title, currentDays, targetDays }: SimpleCheckinProps) {
  const progress = (currentDays / targetDays) * 100;
  const completionRate = Math.floor(progress);
  
  return (
    <Card className="w-[280px] h-[280px] bg-[#FFF9E5] border-none rounded-xl shadow-none">
      <CardContent className="flex flex-col items-center pt-6 pb-6 px-4 space-y-4 h-full">
        <h2 className="text-xl font-bold text-orange-700">{title}</h2>
        
        <div className="relative w-20 h-20 rounded-full bg-orange-50">
          <div className="absolute inset-0 flex flex-col items-center justify-center translate-y-2">
            <p className="text-xl font-bold text-orange-600 mb-0 leading-none">{currentDays}/{targetDays}</p>
            <p className="text-xs text-orange-500 mt-0.5">天</p>
          </div>
        </div>
        
        <p className="text-sm font-medium text-orange-600">目标进度: {completionRate}%</p>
        
        <div className="w-full max-w-[200px]">
          <div className="h-2 w-full rounded-full bg-orange-100 overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 absolute left-0 top-0 rounded-r-full" 
              style={{ 
                width: `${progress}%`,
                transition: 'width 0.3s ease-in-out'
              }}
            >
              <div 
                className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full shadow-sm"
                style={{
                  transform: 'translate(50%, -50%)',
                  boxShadow: '0 0 4px rgba(239, 68, 68, 0.3)'
                }}
              />
            </div>
          </div>
        </div>
        
        <p className="text-sm text-orange-600 text-center mt-1">
          {currentDays < targetDays 
            ? `再坚持${targetDays - currentDays}天就能达成目标！` 
            : "恭喜您已完成目标！"}
        </p>
      </CardContent>
    </Card>
  );
}

export default SimpleCheckin; 