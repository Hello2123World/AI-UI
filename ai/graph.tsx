import { BaseMessage } from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";
import { StateGraph, START, END } from "@langchain/langgraph";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { workoutTool, trainingPlanTool, recipeTool, achievementTool, trainingRecordTool } from "./tools";
import { ChatOpenAI } from "@langchain/openai";

interface AgentExecutorState {
  input: string;
  chat_history: BaseMessage[];
  /**
   * The plain text result of the LLM if
   * no tool was used.
   */
  result?: string;
  /**
   * The parsed tool result that was called.
   */
  toolCall?: {
    name: string;
    parameters: Record<string, any>;
  };
  /**
   * The result of a tool.
   */
  toolResult?: Record<string, any>;
}

const invokeModel = async (
  state: AgentExecutorState,
  config?: RunnableConfig,
): Promise<Partial<AgentExecutorState>> => {
  const initialPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a helpful assistant. You're provided a list of tools, and an input from the user.\n
Your job is to determine whether or not you have a tool which can handle the users input, or respond with plain text.`,
    ],
    new MessagesPlaceholder({
      variableName: "chat_history",
      optional: true,
    }),
    ["human", "{input}"],
  ]);

  const tools = [workoutTool, trainingPlanTool, recipeTool, achievementTool, trainingRecordTool];

  const llm = new ChatOpenAI({
    temperature: 0,
    modelName: "moonshot-v1-8k", // deepseek-chat
    streaming: true,
    openAIApiKey: "sk-rT5vrStWV7u26OtR6EAjZHmb4O9bTINENpYtMU89H6yLFebx", // 替换为sk-2c6a28ccd2314527b8e1a74c29dc4e57
    configuration: {
      baseURL: "https://api.moonshot.cn/v1", // DeepSeek 的API端点https://api.deepseek.com/v1
    },
  }).bindTools(tools);
  const chain = initialPrompt.pipe(llm);
  const result = await chain.invoke(
    {
      input: state.input,
      chat_history: state.chat_history,
    },
    config,
  );

  if (result.tool_calls && result.tool_calls.length > 0) {
    return {
      toolCall: {
        name: result.tool_calls[0].name,
        parameters: result.tool_calls[0].args,
      },
    };
  }
  return {
    result: result.content as string,
  };
};

const invokeToolsOrReturn = (state: AgentExecutorState) => {
  if (state.toolCall) {
    return "invokeTools";
  }
  if (state.result) {
    return END;
  }
  throw new Error("No tool call or result found.");
};

const invokeTools = async (
  state: AgentExecutorState,
  config?: RunnableConfig,
): Promise<Partial<AgentExecutorState>> => {
  console.log("===== 开始调用工具 =====");
  
  if (!state.toolCall) {
    console.error("没有找到工具调用信息");
    throw new Error("No tool call found.");
  }
  
  console.log("工具名称:", state.toolCall.name);
  console.log("工具参数:", JSON.stringify(state.toolCall.parameters));
  
  const toolMap = {
    [workoutTool.name]: workoutTool,
    [trainingPlanTool.name]: trainingPlanTool,
    [recipeTool.name]: recipeTool,
    [achievementTool.name]: achievementTool,
    [trainingRecordTool.name]: trainingRecordTool,
  };

  const selectedTool = toolMap[state.toolCall.name];
  if (!selectedTool) {
    console.error("在工具映射中找不到相应工具");
    throw new Error("No tool found in tool map.");
  }
  
  try {
    console.log("开始调用工具...");
    const toolResult = await selectedTool.invoke(
      state.toolCall.parameters as any,
      config,
    );
    console.log("工具调用完成");
    console.log("工具返回的原始结果类型:", typeof toolResult);
    console.log("工具返回的原始结果长度:", toolResult.length);
    
    try {
      // 尝试JSON解析
      console.log("尝试解析JSON结果...");
      let parsedResult;
      
      // 检查是否已经包含"Tool result:"前缀
      if (typeof toolResult === 'string' && toolResult.startsWith('Tool result:')) {
        console.error("警告: 工具结果已经包含'Tool result:'前缀");
        // 尝试提取JSON部分
        const jsonPart = toolResult.substring("Tool result:".length).trim();
        parsedResult = JSON.parse(jsonPart);
      } else {
        parsedResult = JSON.parse(toolResult);
      }
      
      console.log("JSON解析成功");
      return {
        toolResult: parsedResult,
      };
    } catch (parseError) {
      console.error("解析工具结果为JSON时出错:", parseError);
      console.log("问题结果的前100个字符:", toolResult.substring(0, 100));
      
      // 返回文本结果而不是抛出错误
      return {
        toolResult: {
          type: "text",
          content: toolResult,
          error: "JSON解析失败"
        },
      };
    }
  } catch (invokeError) {
    console.error("调用工具时出错:", invokeError);
    
    // 返回错误信息
    return {
      toolResult: {
        error: true,
        message: invokeError instanceof Error ? invokeError.message : String(invokeError)
      },
    };
  } finally {
    console.log("===== 工具调用完成 =====");
  }
};

export function agentExecutor() {
  const workflow = new StateGraph<AgentExecutorState>({
    channels: {
      input: null,
      chat_history: null,
      result: null,
      toolCall: null,
      toolResult: null,
    },
  })
    .addNode("invokeModel", invokeModel)
    .addNode("invokeTools", invokeTools)
    .addConditionalEdges("invokeModel", invokeToolsOrReturn)
    .addEdge(START, "invokeModel")
    .addEdge("invokeTools", END);

  const graph = workflow.compile();
  return graph;
}
