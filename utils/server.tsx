import "server-only";

import { ReactNode, isValidElement } from "react";
import { AIProvider } from "./client";
import { createStreamableUI, createStreamableValue } from "ai/rsc";
import { Runnable } from "@langchain/core/runnables";
import { CompiledStateGraph } from "@langchain/langgraph";
import { StreamEvent } from "@langchain/core/tracers/log_stream";
import { AIMessage } from "@/ai/message";

export const dynamic = "force-dynamic";

export const CUSTOM_UI_YIELD_NAME = "__yield_ui__";

/**
 * Executes `streamEvents` method on a runnable
 * and converts the generator to a RSC friendly stream
 *
 * @param runnable
 * @returns React node which can be sent to the client
 */
export function streamRunnableUI<RunInput, RunOutput>(
  runnable:
    | Runnable<RunInput, RunOutput>
    | CompiledStateGraph<RunInput, Partial<RunInput>>,
  inputs: RunInput,
) {
  console.log("===== 开始流式处理UI =====");
  console.log("输入:", JSON.stringify(inputs));
  
  const ui = createStreamableUI();
  const [lastEvent, resolve] = withResolvers<any>();

  (async () => {
    try {
      let lastEventValue: StreamEvent | null = null;

      const callbacks: Record<
        string,
        ReturnType<typeof createStreamableUI | typeof createStreamableValue>
      > = {};

      for await (const streamEvent of (
        runnable as Runnable<RunInput, RunOutput>
      ).streamEvents(inputs, {
        version: "v2",
      })) {
        try {
          console.log("流事件:", streamEvent.event);
          
          if (
            streamEvent.name === CUSTOM_UI_YIELD_NAME &&
            isValidElement(streamEvent.data.output.value)
          ) {
            console.log("处理UI组件事件:", streamEvent.data.output.type);
            if (streamEvent.data.output.type === "append") {
              // 直接添加组件，不包装在AIMessage中
              ui.append(streamEvent.data.output.value);
            } else if (streamEvent.data.output.type === "update") {
              ui.update(streamEvent.data.output.value);
            }
          }

          if (streamEvent.event === "on_chat_model_stream") {
            console.log("处理聊天模型流事件");
            const chunk = streamEvent.data.chunk;
            if ("text" in chunk && typeof chunk.text === "string") {
              console.log("文本块长度:", chunk.text.length);
              if (!callbacks[streamEvent.run_id]) {
                // 对于文本流，创建一个新的流
                const textStream = createStreamableValue();
                // 使用AIMessage包装文本内容
                ui.append(<AIMessage value={textStream.value} />);
                callbacks[streamEvent.run_id] = textStream;
              }

              callbacks[streamEvent.run_id].append(chunk.text);
            }
          }

          lastEventValue = streamEvent;
        } catch (eventError) {
          console.error("处理流事件时出错:", eventError);
          // 继续处理下一个事件
        }
      }

      console.log("流事件处理完成");
      if (lastEventValue?.data?.output) {
        console.log("最终事件类型:", typeof lastEventValue.data.output);
        try {
          if (typeof lastEventValue.data.output === 'object') {
            console.log("最终事件键:", Object.keys(lastEventValue.data.output));
          }
        } catch (e) {
          console.error("分析最终事件时出错:", e);
        }
      } else {
        console.log("最终事件为空或缺少data.output");
      }
      
      // 解析promise，允许客户端继续
      resolve(lastEventValue?.data.output);

      // 关闭所有文本流的UI流
      Object.values(callbacks).forEach((cb) => cb.done());

      // 关闭组件流的主UI流
      ui.done();
      console.log("===== 流式处理UI完成 =====");
    } catch (error) {
      console.error("流式处理UI时出错:", error);
      try {
        // 发送错误消息到客户端
        ui.append(<div className="error-message">处理响应时出错: {error instanceof Error ? error.message : String(error)}</div>);
        ui.done();
        
        // 返回一个错误标记，方便客户端识别错误情况
        resolve("error_response");
      } catch (e) {
        console.error("处理UI错误时又出错:", e);
      }
    }
  })();

  return { ui: ui.value, lastEvent };
}

/**
 * Expose these endpoints outside for the client
 * We wrap the functions in order to properly resolve importing
 * client components.
 *
 * TODO: replace with createAI instead, even though that
 * implicitly handles state management
 *
 * See https://github.com/vercel/next.js/pull/59615
 * @param actions
 */
export function exposeEndpoints<T extends Record<string, unknown>>(
  actions: T,
): {
  (props: { children: ReactNode }): Promise<JSX.Element>;
  $$types?: T;
} {
  return async function AI(props: { children: ReactNode }) {
    return <AIProvider actions={actions}>{props.children}</AIProvider>;
  };
}

/**
 * Polyfill to emulate the upcoming Promise.withResolvers
 */
export function withResolvers<T>() {
  let resolve: (value: T) => void;
  let reject: (reason?: any) => void;

  const innerPromise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  // @ts-expect-error
  return [innerPromise, resolve, reject] as const;
}
