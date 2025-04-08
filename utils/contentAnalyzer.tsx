"use client";

import React, { ReactNode } from 'react';
import { SimpleRecord } from '@/components/prebuilt/SimpleRecord';
import { SimplePlan } from '@/components/prebuilt/SimplePlan';
import { SimpleRecipe } from '@/components/prebuilt/SimpleRecipe';
import { SimpleAchievement } from '@/components/prebuilt/SimpleAchievement';
import { SimpleCheckin } from '@/components/prebuilt/SimpleCheckin';

// 内容类型枚举
export enum ContentType {
  RECORD = 'record',
  PLAN = 'plan',
  RECIPE = 'recipe',
  ACHIEVEMENT = 'achievement',
  CHECKIN = 'checkin',
  UNKNOWN = 'unknown'
}

// 提取的数据接口
interface ExtractedData {
  type: ContentType;
  data: any;
}

/**
 * 从主页面内容中识别类型
 * @param content 页面内容
 * @returns 内容类型
 */
export function identifyContentType(content: ReactNode): ContentType {
  // 将内容转换为字符串进行分析
  const contentStr = JSON.stringify(content);
  
  // 添加调试信息，查看内容字符串的一部分
  console.log("内容字符串前200字符:", contentStr.substring(0, 200));
  
  // ===== 固定映射关系（最高优先级）=====
  // 此映射关系不允许修改，永久保持此对应关系
  
  // 检查组件路径 - 这是确定类型的唯一方法
  if (contentStr.includes('workout.tsx')) {
    console.log('识别到workout.tsx组件，使用SimpleRecord');
    return ContentType.RECORD;
  }
  
  if (contentStr.includes('plan.tsx')) {
    console.log('识别到plan.tsx组件，使用SimplePlan');
    return ContentType.PLAN;
  }
  
  if (contentStr.includes('record.tsx')) {
    console.log('识别到record.tsx组件，使用SimpleCheckin');
    return ContentType.CHECKIN;
  }
  
  if (contentStr.includes('recipe.tsx') || contentStr.includes('/recipe')) {
    console.log('识别到recipe.tsx组件，使用SimpleRecipe');
    return ContentType.RECIPE;
  }
  
  if (contentStr.includes('achievement.tsx')) {
    console.log('识别到achievement.tsx组件，使用SimpleAchievement');
    return ContentType.ACHIEVEMENT;
  }
  
  // 备用内容识别逻辑 - 仅当无法通过文件路径识别时使用
  // 检查瑜伽打卡内容
  if ((contentStr.includes('瑜伽') || contentStr.includes('yoga')) && 
      (contentStr.includes('打卡') || contentStr.includes('坚持') || 
       contentStr.includes('目标') || contentStr.includes('修行') || 
       contentStr.includes('记录') || contentStr.includes('训练') ||
       contentStr.includes('天') || contentStr.includes('练习'))) {
    console.log('识别到瑜伽打卡记录内容，使用SimpleCheckin');
    return ContentType.CHECKIN;
  }
  
  // 检查一般打卡内容
  if (contentStr.includes('打卡') || contentStr.includes('坚持') || 
      (contentStr.includes('天') && contentStr.includes('目标'))) {
    console.log('识别到打卡记录内容，使用SimpleCheckin');
    return ContentType.CHECKIN;
  }
  
  // 检查运动记录内容
  if (contentStr.includes('运动') || contentStr.includes('跑步') || 
      contentStr.includes('公里') || contentStr.includes('锻炼')) {
    console.log('识别到运动记录内容，使用SimpleRecord');
    return ContentType.RECORD;
  }
  
  // 检查食谱内容
  if (contentStr.includes('食谱') || contentStr.includes('食材') || 
      contentStr.includes('热量') || contentStr.includes('营养')) {
    console.log('识别到食谱内容，使用SimpleRecipe');
    return ContentType.RECIPE;
  }
  
  // 检查成就内容
  if (contentStr.includes('成就') || contentStr.includes('奖牌') || 
      contentStr.includes('徽章') || contentStr.includes('完成')) {
    console.log('识别到成就内容，使用SimpleAchievement');
    return ContentType.ACHIEVEMENT;
  }
  
  // 检查计划内容
  if (contentStr.includes('计划') || contentStr.includes('训练') || 
      contentStr.includes('周期') || contentStr.includes('健身方案')) {
    console.log('识别到训练计划内容，使用SimplePlan');
    return ContentType.PLAN;
  }
  
  // 默认返回未知类型
  console.log("无法识别内容类型，返回UNKNOWN", contentStr.substring(0, 200));
  return ContentType.UNKNOWN;
}

/**
 * 从运动记录中提取数据
 */
function extractRecordData(content: ReactNode): any {
  // 使用固定数据
  return {
    title: "运动记录",
    activity: "户外跑步",
    time: "00:15:30", 
    distance: "1.51"
  };
}

/**
 * 从训练计划中提取数据
 */
function extractPlanData(content: ReactNode): any {
  // 使用固定数据
  return {
    title: "训练计划",
    goal: "10公里长跑训练",
    duration: "4周",
    progress: 75
  };
}

/**
 * 从食谱中提取数据
 */
function extractRecipeData(content: ReactNode): any {
  // 使用固定数据
  return {
    title: "健康食谱",
    difficulty: "中等" as const,
    timeNeeded: "30分钟"
  };
}

/**
 * 从成就中提取数据
 */
function extractAchievementData(content: ReactNode): any {
  // 使用固定数据
  return {
    title: "跑步成就",
    medalInfo: "10公里赛事金牌",
    earnedDate: "2024-05-01"
  };
}

/**
 * 从打卡记录中提取数据
 */
function extractCheckinData(content: ReactNode): any {
  // 将内容转换为字符串
  const contentStr = JSON.stringify(content);
  
  // 尝试查找标题、当前天数和目标天数
  let title = "打卡记录";
  let currentDays = 1;
  let targetDays = 21;
  
  // 查找特定的瑜伽相关内容
  if (contentStr.includes('瑜伽') || contentStr.includes('yoga')) {
    console.log('检测到瑜伽打卡记录');
    title = "瑜伽修行之旅";
    
    // 尝试提取天数信息 - 多种模式匹配
    const currentDaysPatterns = [
      /已坚持(\d+)天/,
      /已连续打卡(\d+)天/,
      /已经坚持了(\d+)天/,
      /连续(\d+)天/,
      /第(\d+)天/,
      /共(\d+)天/
    ];
    
    for (const pattern of currentDaysPatterns) {
      const match = contentStr.match(pattern);
      if (match && match[1]) {
        currentDays = parseInt(match[1]);
        console.log(`使用模式 ${pattern} 提取到当前天数: ${currentDays}`);
        break;
      }
    }
    
    const targetDaysPatterns = [
      /目标(\d+)天/,
      /计划(\d+)天/,
      /总共(\d+)天/,
      /共(\d+)天/,
      /为期(\d+)天/
    ];
    
    for (const pattern of targetDaysPatterns) {
      const match = contentStr.match(pattern);
      if (match && match[1]) {
        targetDays = parseInt(match[1]);
        console.log(`使用模式 ${pattern} 提取到目标天数: ${targetDays}`);
        break;
      }
    }
  }
  
  console.log('提取的打卡数据:', { title, currentDays, targetDays });
  
  return {
    title,
    currentDays,
    targetDays
  };
}

/**
 * 从内容中提取相关数据
 */
export function extractDataFromContent(content: ReactNode): ExtractedData {
  const contentType = identifyContentType(content);
  
  let extractedData: any = {};
  
  switch (contentType) {
    case ContentType.RECORD:
      extractedData = extractRecordData(content);
      break;
    case ContentType.PLAN:
      extractedData = extractPlanData(content);
      break;
    case ContentType.RECIPE:
      extractedData = extractRecipeData(content);
      break;
    case ContentType.ACHIEVEMENT:
      extractedData = extractAchievementData(content);
      break;
    case ContentType.CHECKIN:
      extractedData = extractCheckinData(content);
      break;
    default:
      extractedData = { unknown: true };
  }
  
  return {
    type: contentType,
    data: extractedData
  };
}

/**
 * 根据内容类型和提取的数据生成简化版页面
 */
export function generateSimplifiedComponent(content: ReactNode): ReactNode {
  const { type, data } = extractDataFromContent(content);
  
  switch (type) {
    case ContentType.RECORD:
      return <SimpleRecord 
        title={data.title} 
        activity={data.activity} 
        time={data.time} 
        distance={data.distance} 
      />;
      
    case ContentType.PLAN:
      return <SimplePlan 
        title={data.title} 
        goal={data.goal} 
        duration={data.duration} 
        progress={data.progress || 75}
      />;
      
    case ContentType.RECIPE:
      return <SimpleRecipe 
        title={data.title} 
        difficulty={data.difficulty} 
        timeNeeded={data.timeNeeded} 
      />;
      
    case ContentType.ACHIEVEMENT:
      return <SimpleAchievement 
        title={data.title} 
        medalInfo={data.medalInfo} 
        earnedDate={data.earnedDate} 
      />;
      
    case ContentType.CHECKIN:
      return <SimpleCheckin 
        title={data.title} 
        currentDays={data.currentDays} 
        targetDays={data.targetDays} 
      />;
      
    default:
      // 如果无法识别类型，返回简化版的运动记录
      return <SimpleRecord 
        title="运动记录" 
        activity="户外跑步" 
        time="00:15:30" 
        distance="1.51" 
      />;
  }
} 