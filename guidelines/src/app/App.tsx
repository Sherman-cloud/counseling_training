import { useState } from 'react';
import { LoginPage } from '@/app/components/LoginPage';
import { ScenarioSelection } from '@/app/components/ScenarioSelection';
import { ChatInterface } from '@/app/components/ChatInterface';
import { EvaluationReport } from '@/app/components/EvaluationReport';
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
    chartData?: ChartData | null
  ) => {
    if (evaluation) setOverallEvaluation(evaluation);
    if (scores) setCompetencyScores(scores);
    if (turns) setConversationTurns(turns);
    if (records) setSessionTurnRecords(records);
    if (chartData) setAllChartData(chartData);
    setAppState('report');
  };

  const handleStartNew = () => {
    setSelectedScenario(null);
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
