"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Target, Clock } from "lucide-react";

interface SimplePlanProps {
  title: string;
  goal: string;
  duration: string;
  progress?: number;
}

export function SimplePlan({ title, goal, duration, progress = 75 }: SimplePlanProps) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <Card className="w-[280px] h-[280px] bg-[#EFFAF6] border-none rounded-xl shadow-none overflow-hidden relative">
      <CardHeader className="pb-0 pt-3 px-4">
        <CardTitle className="text-xl font-bold text-[#0F766E]">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 px-4 pb-0 flex flex-col">
        <div className="flex items-center text-[#0F766E] mt-0">
          <Target className="mr-2 h-4 w-4" />
          <div className="text-md font-medium">训练目标</div>
        </div>
        <div className="text-lg font-medium text-[#0D9488] ml-6 mb-0">{goal}</div>
        
        <div className="flex-1 flex items-center justify-center py-0 mt-1">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg viewBox="0 0 100 100" width="128" height="128">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#0EA5E9" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="40" stroke="#D1FAE5" strokeWidth="8" fill="none" />
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                stroke="url(#gradient)" 
                strokeWidth="8" 
                fill="none" 
                strokeDasharray={circumference} 
                strokeDashoffset={offset}
                strokeLinecap="round" 
                transform="rotate(-90 50 50)"
              />
              <text x="50" y="45" textAnchor="middle" fill="#0F766E" fontSize="16" fontWeight="bold">{progress}%</text>
              <text x="50" y="65" textAnchor="middle" fill="#0F766E" fontSize="10">已完成</text>
            </svg>
          </div>
        </div>
      </CardContent>
      
      <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center text-xs text-[#0F766E]">
        <Clock className="mr-1 h-3 w-3 inline" />
        <span>持续时间: {duration}</span>
      </div>
    </Card>
  );
}

export default SimplePlan; 