"use client";

import React, { useState, ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { SimpleRecord } from "./SimpleRecord";
import { SimplePlan } from "./SimplePlan";
import { SimpleRecipe } from "./SimpleRecipe";
import { SimpleAchievement } from "./SimpleAchievement";
import { SimpleCheckin } from "./SimpleCheckin";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

// 自定义Modal组件，没有任何边框
const CustomModal = ({ isOpen, onClose, children }: CustomModalProps) => {
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center" 
      onClick={onClose}
    >
      <div onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export function NavPage() {
  const [currentPage, setCurrentPage] = useState<string | null>(null);
  
  const openPage = (page: string) => {
    setCurrentPage(page);
  };
  
  const closePage = () => {
    setCurrentPage(null);
  };
  
  // 示例数据
  const recordData = {
    title: "运动记录",
    activity: "户外跑步",
    time: "00:15:30",
    distance: "1.51"
  };
  
  const planData = {
    title: "训练计划",
    goal: "10公里长跑训练",
    duration: "4周"
  };
  
  const recipeData = {
    title: "健康食谱",
    difficulty: "中等" as const,
    timeNeeded: "30分钟"
  };
  
  const achievementData = {
    title: "跑步成就",
    medalInfo: "10公里赛事金牌",
    earnedDate: "2024-05-01"
  };
  
  const checkinData = {
    title: "打卡记录",
    currentDays: 21,
    targetDays: 30
  };
  
  return (
    <>
      <Card className="w-[500px] bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl shadow-md">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-xl font-bold text-slate-800">跑步健身应用</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <Button 
              variant="outline" 
              className="flex justify-between items-center h-16 px-4 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
              onClick={() => openPage("record")}
            >
              <div className="flex flex-col items-start">
                <span className="text-lg font-medium">运动记录</span>
                <span className="text-sm text-slate-500">查看您的最新运动数据</span>
              </div>
              <ChevronRight className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              className="flex justify-between items-center h-16 px-4 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
              onClick={() => openPage("plan")}
            >
              <div className="flex flex-col items-start">
                <span className="text-lg font-medium">训练计划</span>
                <span className="text-sm text-slate-500">查看您的个性化训练计划</span>
              </div>
              <ChevronRight className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              className="flex justify-between items-center h-16 px-4 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
              onClick={() => openPage("recipe")}
            >
              <div className="flex flex-col items-start">
                <span className="text-lg font-medium">营养食谱</span>
                <span className="text-sm text-slate-500">浏览健康饮食食谱</span>
              </div>
              <ChevronRight className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              className="flex justify-between items-center h-16 px-4 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
              onClick={() => openPage("achievement")}
            >
              <div className="flex flex-col items-start">
                <span className="text-lg font-medium">跑步成就</span>
                <span className="text-sm text-slate-500">查看您获得的奖牌和徽章</span>
              </div>
              <ChevronRight className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              className="flex justify-between items-center h-16 px-4 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
              onClick={() => openPage("checkin")}
            >
              <div className="flex flex-col items-start">
                <span className="text-lg font-medium">打卡记录</span>
                <span className="text-sm text-slate-500">查看您的运动打卡情况</span>
              </div>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <CustomModal isOpen={currentPage !== null} onClose={closePage}>
        {currentPage === "record" && <SimpleRecord {...recordData} />}
        {currentPage === "plan" && <SimplePlan {...planData} />}
        {currentPage === "recipe" && <SimpleRecipe {...recipeData} />}
        {currentPage === "achievement" && <SimpleAchievement {...achievementData} />}
        {currentPage === "checkin" && <SimpleCheckin {...checkinData} />}
      </CustomModal>
    </>
  );
}

export default NavPage;