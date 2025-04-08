"use client";

/**
 * 拖拽状态接口，用于跟踪拖拽操作的状态
 */
export interface DragState {
  isDragging: boolean;
  component: React.ReactNode | null;
  sourceType: string | null;
  detailIndex: number;
}

/**
 * 创建初始拖拽状态
 */
export const initialDragState: DragState = {
  isDragging: false,
  component: null,
  sourceType: null,
  detailIndex: -1
};

/**
 * 区域接口，定义了可拖放区域的属性
 */
export interface DropZone {
  id: string;
  name: string;
  components: React.ReactNode[];
  position?: { x: number; y: number };
  detailIndex?: number;
}

/**
 * 处理开始拖动事件
 * @param content 被拖动的内容
 * @param sourceId 源区域ID
 * @param setState 设置拖拽状态的函数
 */
export function handleDragStart(
  content: React.ReactNode,
  sourceId: string,
  setState: React.Dispatch<React.SetStateAction<DragState>>
) {
  setState({
    isDragging: true,
    component: content,
    sourceType: sourceId,
    detailIndex: -1
  });
}

/**
 * 处理拖放事件
 * @param targetId 目标区域ID 
 * @param dragState 当前拖拽状态
 * @param setDragState 设置拖拽状态的函数
 * @param setDropZones 设置拖放区域的函数
 */
export function handleDrop(
  targetId: string,
  dragState: DragState,
  setDragState: React.Dispatch<React.SetStateAction<DragState>>,
  setDropZones: React.Dispatch<React.SetStateAction<DropZone[]>>
) {
  if (!dragState.isDragging || !dragState.component) return;

  setDropZones((zones) =>
    zones.map((zone) =>
      zone.id === targetId
        ? { ...zone, components: [dragState.component] }
        : zone
    )
  );

  // 重置拖拽状态
  setDragState(initialDragState);
}

/**
 * 处理拖动经过事件，用于实现视觉反馈
 * @param e 拖动事件
 */
export function handleDragOver(e: React.DragEvent) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

/**
 * 处理拖动进入区域事件
 * @param e 拖动事件
 */
export function handleDragEnter(e: React.DragEvent) {
  e.preventDefault();
  const target = e.currentTarget as HTMLElement;
  target.classList.add("drag-over");
}

/**
 * 处理拖动离开区域事件
 * @param e 拖动事件
 */
export function handleDragLeave(e: React.DragEvent) {
  e.preventDefault();
  const target = e.currentTarget as HTMLElement;
  target.classList.remove("drag-over");
}

/**
 * 处理拖动结束事件
 * @param setDragState 设置拖拽状态的函数
 */
export function handleDragEnd(
  setDragState: React.Dispatch<React.SetStateAction<DragState>>
) {
  setDragState(initialDragState);
}

/**
 * 创建一个记忆化的拖放处理器，避免不必要的重新渲染
 * @param targetId 目标区域ID
 * @param dragState 当前拖拽状态
 * @param setDragState 设置拖拽状态的函数
 * @param setDropZones 设置拖放区域的函数
 */
export const createDropHandler = (zoneId: string, dragState: DragState, setDragState: React.Dispatch<React.SetStateAction<DragState>>, setDropZones: React.Dispatch<React.SetStateAction<DropZone[]>>) => {
  return (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    
    if (dragState.isDragging && dragState.component) {
      setDropZones(prevZones => 
        prevZones.map(zone => 
          zone.id === zoneId 
            ? { 
                ...zone, 
                components: [dragState.component as React.ReactNode],
                detailIndex: dragState.detailIndex // 传递详细页面索引
              } 
            : zone
        )
      );
      
      setDragState(initialDragState);
    }
  };
}; 