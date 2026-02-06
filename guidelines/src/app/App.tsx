import { useState } from 'react';
import { LoginPage } from '@/app/components/LoginPage';
import { ScenarioSelection } from '@/app/components/ScenarioSelection';
import { ChatInterface } from '@/app/components/ChatInterface';
import { EvaluationReport } from '@/app/components/EvaluationReport';
import { difyApiService } from '@/app/services/api';
import type { Scenario } from '@/app/components/ScenarioSelection';
import type { OverallEvaluation } from '@/app/services/api';
import type { CompetencyScores } from '@/app/services/api';
import type { ChartData } from '@/app/services/api';

// 每轮对话记录
interface SessionTurnRecord {
  turn: number;
  counselorMessage: string;
  visitorMessage: string;
  evaluation: any;
  score: number;
  feedback: string;
}

type AppState = 'login' | 'scenario-selection' | 'chat' | 'report';

export default function App() {
  const [appState, setAppState] = useState<AppState>('login');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [overallEvaluation, setOverallEvaluation] = useState<OverallEvaluation | null>(null);
  const [competencyScores, setCompetencyScores] = useState<CompetencyScores>({});
  const [conversationTurns, setConversationTurns] = useState(0);
  const [sessionTurnRecords, setSessionTurnRecords] = useState<SessionTurnRecord[]>([]);
  const [allChartData, setAllChartData] = useState<ChartData | null>(null);
  const [chatSessionKey, setChatSessionKey] = useState(0);  // 用于强制重置ChatInterface

  const handleLogin = () => {
    setAppState('scenario-selection');
  };

  const handleLogout = () => {
    setAppState('login');
    setSelectedScenario(null);
  };

  const handleSelectScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setAppState('chat');
  };

  const handleBackToScenarios = () => {
    setSelectedScenario(null);
    setAppState('scenario-selection');
  };

  const handleFinishPractice = (
    evaluation?: OverallEvaluation,
    scores?: CompetencyScores,
    turns?: number,
    records?: SessionTurnRecord[],
    chartData?: ChartData | null,
    messages?: any[]
  ) => {
    if (evaluation) setOverallEvaluation(evaluation);
    if (scores) setCompetencyScores(scores);
    if (turns) setConversationTurns(turns);
    if (records) setSessionTurnRecords(records);
    if (chartData) setAllChartData(chartData);
    // 存储消息历史（可选，用于导出）
    if (messages) (window as any).sessionMessages = messages;
    setAppState('report');
  };

  const handleStartNew = () => {
    // 保留当前场景，重置数据，开始新对话
    setOverallEvaluation(null);
    setCompetencyScores({});
    setConversationTurns(0);
    setSessionTurnRecords([]);
    setAllChartData(null);
    // 清空消息历史
    (window as any).sessionMessages = [];
    // 重置API服务中的对话状态
    difyApiService.resetConversations();
    // 递增key以强制重新创建ChatInterface组件
    setChatSessionKey(prev => prev + 1);
    setAppState('chat');
  };

  return (
    <div className="size-full">
      {appState === 'login' && (
        <LoginPage onLogin={handleLogin} />
      )}

      {appState === 'scenario-selection' && (
        <ScenarioSelection
          onSelectScenario={handleSelectScenario}
          onLogout={handleLogout}
        />
      )}

      {appState === 'chat' && selectedScenario && (
        <ChatInterface
          key={chatSessionKey}
          scenario={selectedScenario}
          onBack={handleBackToScenarios}
          onFinish={handleFinishPractice}
        />
      )}

      {appState === 'report' && selectedScenario && (
        <EvaluationReport
          scenarioName={selectedScenario.title}
          overallEvaluation={overallEvaluation}
          competencyScores={competencyScores}
          conversationTurns={conversationTurns}
          sessionTurnRecords={sessionTurnRecords}
          allChartData={allChartData}
          onStartNew={handleStartNew}
          onBackToScenarios={handleBackToScenarios}
        />
      )}
    </div>
  );
}
