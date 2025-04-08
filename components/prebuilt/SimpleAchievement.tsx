"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface SimpleAchievementProps {
  title: string;
  medalInfo: string;
  earnedDate: string;
}

export function SimpleAchievement({ title, medalInfo, earnedDate }: SimpleAchievementProps) {
  return (
    <Card className="w-[280px] h-[280px] bg-[#F5F3FF] border-none rounded-xl shadow-none">
      <CardContent className="flex flex-col items-center pt-6 pb-6 px-4 space-y-4 h-full">
        <h2 className="text-xl font-bold text-indigo-700">{title}</h2>
        
        <div className="relative my-4">
          <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
            <Trophy className="h-8 w-8 text-indigo-500" />
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-md font-medium text-indigo-800">{medalInfo}</p>
          <p className="text-sm text-indigo-500 mt-1">获得日期: {earnedDate}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default SimpleAchievement; 