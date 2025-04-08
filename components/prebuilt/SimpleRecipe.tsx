"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SimpleRecipeProps {
  title: string;
  difficulty: "简单" | "中等" | "困难";
  timeNeeded: string;
  protein?: string;
  carbs?: string;
  fat?: string;
}

export function SimpleRecipe({ 
  title, 
  difficulty, 
  timeNeeded,
  protein = "15g",
  carbs = "22g",
  fat = "28g"
}: SimpleRecipeProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case "简单": return "bg-green-100 text-green-700 hover:bg-green-100";
      case "中等": return "bg-amber-100 text-amber-700 hover:bg-amber-100";
      case "困难": return "bg-red-100 text-red-700 hover:bg-red-100";
      default: return "bg-slate-100 text-slate-700 hover:bg-slate-100";
    }
  };

  return (
    <Card className="w-[280px] h-[280px] bg-[#FEF2F7] border-none rounded-xl shadow-none overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-xl font-bold text-[#BE185D]">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-3 px-4 pb-4 flex flex-col h-[calc(100%-60px)]">
        <div className="flex justify-between items-center mb-3">
          <Badge className={`${getDifficultyColor(difficulty)} px-2 py-0.5 h-5 text-xs hover:bg-transparent`}>
            难度: {difficulty}
          </Badge>
          <div className="flex items-center text-xs text-[#BE185D]">
            <Clock className="mr-1 h-3 w-3" />
            {timeNeeded}
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-[#FBCFE8] flex items-center justify-center">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 12C6 9.5 8 6 12 6C16 6 18 9.5 18 12" stroke="#DB2777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 12H19V15C19 18 17 20 12 20C7 20 5 18 5 15V12Z" stroke="#DB2777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.0002 10C10.0002 10 10.5 9 12.0002 9C13.5005 9 14.0002 10 14.0002 10" stroke="#DB2777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.0002 5C10.0002 5 10.5 4 12.0002 4C13.5005 4 14.0002 5 14.0002 5" stroke="#DB2777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-2">
          {[
            { name: "蛋白质", value: protein },
            { name: "碳水", value: carbs },
            { name: "脂肪", value: fat }
          ].map((nutrient, index) => (
            <div key={index} className="p-1 text-center">
              <div className="text-[10px] text-[#DB2777]">{nutrient.name}</div>
              <div className="text-xs font-semibold text-[#BE185D]">
                {nutrient.value}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default SimpleRecipe; 