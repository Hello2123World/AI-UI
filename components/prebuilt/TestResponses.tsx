"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFloatingComponent } from "@/app/shared";
import { SplitContentView } from './SplitContentView';

/**
 * 用于测试AI响应内容分析和简化版页面生成的组件
 */
export function TestResponses() {
  const { showFloatingComponent } = useFloatingComponent();
  
  // 测试运动记录
  const testRecord = (
    <div className="ai-floating-component">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4">清晨5公里</h2>
          <p className="text-gray-600 mb-6">记录您早晨的跑步锻炼</p>
          
          <div className="bg-indigo-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center text-indigo-700 font-medium">
              <span>完成度</span>
              <span>100%</span>
            </div>
            <div className="w-full bg-indigo-200 rounded-full h-2.5 mt-2">
              <div className="bg-indigo-500 h-2.5 rounded-full" style={{width: '100%'}}></div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-sm text-blue-500 mb-1">距离</div>
              <div className="text-xl font-bold text-blue-700">5 公里</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-sm text-green-500 mb-1">时长</div>
              <div className="text-xl font-bold text-green-700">35 分钟</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-sm text-purple-500 mb-1">配速</div>
              <div className="text-xl font-bold text-purple-700">7'00"/公里</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between bg-amber-50 p-4 rounded-lg">
            <div className="flex items-center">
              <span className="text-amber-700">消耗</span>
              <span className="text-2xl font-bold text-amber-700 ml-2">320</span>
              <span className="text-amber-700 ml-1">卡路里</span>
            </div>
            <div className="text-sm text-amber-500">2024年03月31日</div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // 测试训练计划
  const testPlan = (
    <div className="ai-floating-component">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-emerald-700 mb-2">个性化训练计划</h2>
          <div className="flex items-center mb-4">
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded">中级</span>
            <span className="ml-4 text-sm text-gray-500">目标: 增肌</span>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-emerald-600 mb-2">训练目标</h3>
            <p className="text-gray-600">10公里长跑训练，重点提高耐力和速度</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-emerald-50 p-4 rounded-lg">
              <div className="text-sm text-emerald-600 mb-1">进度</div>
              <div className="flex items-center">
                <div className="text-xl font-bold text-emerald-700 mr-2">75%</div>
                <div className="w-full bg-emerald-200 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
              </div>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg">
              <div className="text-sm text-emerald-600 mb-1">持续时间</div>
              <div className="text-xl font-bold text-emerald-700">4周</div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold text-emerald-600 mb-3">每周训练安排</h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-700">周一: 长距离慢跑 (5公里)</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-700">周三: 间歇跑训练 (3公里)</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-700">周六: 长距离跑 (7公里)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // 测试食谱
  const testRecipe = (
    <div className="ai-floating-component">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-pink-700 mb-2">低脂高蛋白鸡胸肉沙拉</h2>
          <p className="text-gray-600 mb-4">一份简单又健康的鸡胸肉沙拉，适合健身和减脂期间食用。</p>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded">低脂</span>
            <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded">高蛋白</span>
            <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded">健康</span>
            <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded">沙拉</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <div className="text-sm text-purple-600 mb-1">烹饪时间</div>
              <div className="font-semibold text-purple-700">25分钟</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <div className="text-sm text-purple-600 mb-1">份量</div>
              <div className="font-semibold text-purple-700">2份</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <div className="text-sm text-purple-600 mb-1">难度</div>
              <div className="font-semibold text-purple-700">中等</div>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-pink-600 mb-3">营养成分</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-3 bg-pink-50 rounded-lg text-center">
              <div className="text-sm text-pink-600 mb-1">蛋白质</div>
              <div className="text-xl font-bold text-pink-700">28g</div>
            </div>
            <div className="p-3 bg-pink-50 rounded-lg text-center">
              <div className="text-sm text-pink-600 mb-1">碳水</div>
              <div className="text-xl font-bold text-pink-700">15g</div>
            </div>
            <div className="p-3 bg-pink-50 rounded-lg text-center">
              <div className="text-sm text-pink-600 mb-1">脂肪</div>
              <div className="text-xl font-bold text-pink-700">8g</div>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-pink-600 mb-3">主要食材</h3>
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span>鸡胸肉</span>
              <span>200g</span>
            </div>
            <div className="flex justify-between">
              <span>混合生菜</span>
              <span>100g</span>
            </div>
            <div className="flex justify-between">
              <span>小番茄</span>
              <span>50g</span>
            </div>
            <div className="flex justify-between">
              <span>黄瓜</span>
              <span>50g</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // 测试成就
  const testAchievement = (
    <div className="ai-floating-component">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4">运动成就</h2>
          
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center">
                <svg width="64" height="64" viewBox="0 0 24 24" className="text-indigo-600" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 15H17M7 15L8.5 12M7 15V18M17 15L15.5 12M17 15V18M8.5 12L10 9M8.5 12H15.5M10 9H14M10 9L12 6L14 9M14 9L15.5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="absolute -right-1 -bottom-1 w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" className="text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-indigo-50 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-indigo-700 mb-1">10公里赛事金牌</h3>
              <p className="text-indigo-500 text-sm mb-3">跑步达人证书</p>
              <div className="text-xs text-indigo-400">获得日期: 2024-03-15</div>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-indigo-700 mb-1">连续跑步30天</h3>
              <p className="text-indigo-500 text-sm mb-3">坚持不懈奖章</p>
              <div className="text-xs text-indigo-400">获得日期: 2024-02-28</div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg text-center mb-6">
            <p className="text-blue-700">继续坚持锻炼，解锁更多成就！</p>
          </div>
        </div>
      </div>
    </div>
  );
  
  // 测试打卡记录
  const testCheckin = (
    <div className="ai-floating-component">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">30天健身挑战</h2>
          <p className="text-gray-600 mb-6">记录您的健身打卡情况，坚持就是胜利！</p>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-lg font-semibold text-blue-700 mb-1">已打卡天数</div>
              <div className="text-3xl font-bold text-blue-800">21</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-lg font-semibold text-blue-700 mb-1">目标天数</div>
              <div className="text-3xl font-bold text-blue-800">30</div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>完成度</span>
              <span>70%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{width: '70%'}}></div>
            </div>
            <div className="text-sm text-blue-600 mt-2 text-center">
              再坚持9天就能达成目标！
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-blue-700 mb-3">最近打卡记录</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
              <div>
                <div className="font-medium text-gray-800">力量训练</div>
                <div className="text-sm text-gray-500">完成时间: 30分钟</div>
              </div>
              <div className="text-sm text-gray-500">今天</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
              <div>
                <div className="font-medium text-gray-800">有氧运动</div>
                <div className="text-sm text-gray-500">完成时间: 45分钟</div>
              </div>
              <div className="text-sm text-gray-500">昨天</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
              <div>
                <div className="font-medium text-gray-800">核心训练</div>
                <div className="text-sm text-gray-500">完成时间: 20分钟</div>
              </div>
              <div className="text-sm text-gray-500">2天前</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // 测试函数，显示指定内容
  const testContent = (content: React.ReactNode) => {
    showFloatingComponent(content);
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4 text-center">测试AI响应与简化版页面</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Button 
            variant="outline" 
            className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
            onClick={() => testContent(testRecord)}
          >
            测试运动记录
          </Button>
          
          <Button 
            variant="outline" 
            className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
            onClick={() => testContent(testPlan)}
          >
            测试训练计划
          </Button>
          
          <Button 
            variant="outline" 
            className="bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100"
            onClick={() => testContent(testRecipe)}
          >
            测试营养食谱
          </Button>
          
          <Button 
            variant="outline" 
            className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
            onClick={() => testContent(testAchievement)}
          >
            测试跑步成就
          </Button>
          
          <Button 
            variant="outline" 
            className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 col-span-2"
            onClick={() => testContent(testCheckin)}
          >
            测试打卡记录
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 