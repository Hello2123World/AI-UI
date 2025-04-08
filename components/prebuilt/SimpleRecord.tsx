"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

interface SimpleRecordProps {
  title: string;
  activity: string;
  time: string;
  distance: string;
  formattedDate?: string;
}

export function SimpleRecord({ title, activity, time, distance, formattedDate }: SimpleRecordProps) {
  const currentDate = new Date();
  const displayDate = formattedDate || format(currentDate, 'yyyy/MM/dd', { locale: zhCN });
  
  return (
    <Card className="w-[280px] h-[280px] bg-[#EFF6FF] border-none rounded-xl shadow-none overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-xl font-bold text-blue-700">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-3 px-4 pb-4 flex flex-col h-[calc(100%-60px)]">
        <div className="text-lg font-medium text-blue-600 mb-2">{activity}</div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            <svg width="120" height="120" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#DBEAFE"
                strokeWidth="8"
                strokeDasharray="251.3"
                strokeDashoffset="0"
                className="opacity-80"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="251.3"
                strokeDashoffset="180"
                transform="rotate(90 50 50)"
              />
              <text x="50" y="45" textAnchor="middle" fill="#1D4ED8" fontSize="18" fontWeight="bold">{distance}</text>
              <text x="50" y="65" textAnchor="middle" fill="#1D4ED8" fontSize="10">公里</text>
            </svg>
            <div className="absolute bottom-5 right-10 flex">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <div className="w-3 h-3 bg-indigo-400 rounded-full ml-1"></div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-xs text-blue-600 mt-1">
          <div className="flex items-center">
            <CalendarIcon className="mr-1 h-3 w-3" />
            {displayDate}
          </div>
          <div>{time}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SimpleRecord; 