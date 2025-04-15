import Chat from "@/components/prebuilt/chat";

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <h1 className="main-title">AI-Call-Of-UI</h1>
      <p className="subtitle">您的个性化页面生成助手，随时随地为您提供数字界面</p>
      
      <div className="chat-container">
        <Chat />
      </div>
    </main>
  );
}
