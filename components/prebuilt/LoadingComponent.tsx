"use client";

import React from 'react';

export function LoadingComponent() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-6 text-lg font-medium text-indigo-700">内容加载中...</p>
        <p className="mt-2 text-sm text-indigo-500">正在生成简化卡片视图</p>
      </div>
    </div>
  );
} 