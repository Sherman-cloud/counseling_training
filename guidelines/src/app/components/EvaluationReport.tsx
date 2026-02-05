import { Download, ArrowLeft, Star, AlertCircle, Award, CheckCircle2, TrendingUp, TrendingDown, Sparkles, Wrench } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import type { OverallEvaluation, ChartData } from '@/app/services/api';

interface EvaluationReportProps {
  scenarioName: string;
  overallEvaluation?: OverallEvaluation | null;
  competencyScores?: Record<string, number>;
  conversationTurns?: number;
  sessionTurnRecords?: SessionTurnRecord[];
  allChartData?: ChartData | null;
  onStartNew: () => void;
  onBackToScenarios: () => void;
}

interface SessionTurnRecord {
  turn: number;
  counselorMessage: string;
  visitorMessage: string;
  evaluation: any;
  score: number;
  feedback: string;
}

interface CompetencyScores {
  Professionalism?: number;
  Relational?: number;
  Science?: number;
  Application?: number;
  Education?: number;
  Systems?: number;
}

// 统一配色 - 青蓝色系
const colors = {
  primary: '#7BC0CD',
  dark: '#4198AC',
  light: '#E8F4F6',
  bg: '#F8FAFC',
  success: '#10B981',
  warning: '#F59E0B'
};

const competencyDimensions = [
  { key: 'Professionalism', label: '专业素养' },
  { key: 'Relational', label: '关系建立' },
  { key: 'Science', label: '科学知识' },
  { key: 'Application', label: '应用能力' },
  { key: 'Education', label: '教育指导' },
  { key: 'Systems', label: '系统思维' }
];

const prepareRadarData = (scores: CompetencyScores) => {
  return competencyDimensions.map(dim => ({
    dimension: dim.label,
    fullMark: 10,
    value: scores[dim.key as keyof CompetencyScores] || 0
  }));
};

// 咨询质量趋势图组件
function SessionFlowChart({ sessionTurnRecords }: { sessionTurnRecords: SessionTurnRecord[] }) {
  // 准备趋势图数据
  const trendData = sessionTurnRecords.map(record => ({
    轮次: `第${record.turn}轮`,
    得分: record.score,
    turn: record.turn
  }));

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
      <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4" style={{ color: colors.dark }} />
        咨询质量趋势
      </h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="轮次"
            tick={{ fill: '#64748b', fontSize: 11 }}
            stroke="#94a3b8"
          />
          <YAxis
            domain={[0, 10]}
            tick={{ fill: '#64748b', fontSize: 11 }}
            stroke="#94a3b8"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          <Line
            type="monotone"
            dataKey="得分"
            stroke={colors.dark}
            strokeWidth={2}
            dot={{ fill: colors.primary, r: 4 }}
            activeDot={{ r: 6, fill: colors.dark }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// 关键帧诊断组件
function KeyMomentsAnalysis({ sessionTurnRecords }: { sessionTurnRecords: SessionTurnRecord[] }) {
  if (sessionTurnRecords.length === 0) {
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
        <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4" style={{ color: colors.dark }} />
          关键帧诊断
        </h2>
        <p className="text-sm text-slate-500 text-center py-8">暂无对话记录</p>
      </div>
    );
  }

  // 找出最高分和最低分的轮次
  const sortedByScore = [...sessionTurnRecords].sort((a, b) => b.score - a.score);
  const bestMoment = sortedByScore[0];
  const worstMoment = sortedByScore[sortedByScore.length - 1];

  // 提取表扬部分（简单逻辑：取前半部分作为表扬）
  const extractPraise = (feedback: string) => {
    if (!feedback) return '表现良好';
    // 尝试找到"建议"等关键词，之前的内容作为表扬
    const suggestIndex = feedback.indexOf('建议');
    if (suggestIndex > 0) {
      return feedback.substring(0, suggestIndex).trim();
    }
    return feedback.substring(0, Math.min(100, feedback.length));
  };

  // 提取建议部分
  const extractSuggestion = (feedback: string) => {
    if (!feedback) return '继续努力';
    const suggestIndex = feedback.indexOf('建议');
    if (suggestIndex > 0) {
      return feedback.substring(suggestIndex).trim();
    }
    return feedback.substring(Math.min(100, feedback.length));
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
      <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Sparkles className="w-4 h-4" style={{ color: colors.dark }} />
        关键帧诊断
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 高光时刻 */}
        <div className="rounded-lg p-4 border-2" style={{ backgroundColor: '#F0FDF4', borderColor: colors.success }}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4" style={{ color: colors.success }} />
            <h3 className="text-sm font-semibold" style={{ color: colors.success }}>高光时刻</h3>
            <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.success, color: 'white' }}>
              {bestMoment.score.toFixed(1)}分
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-500 mb-1">你的话术</p>
              <p className="text-sm text-slate-700 bg-white/70 rounded p-2 leading-relaxed">
                {bestMoment.counselorMessage}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500 mb-1">督导反馈</p>
              <p className="text-sm text-slate-700 leading-relaxed">
                {extractPraise(bestMoment.feedback)}
              </p>
            </div>
          </div>
        </div>

        {/* 提升空间 */}
        <div className="rounded-lg p-4 border-2" style={{ backgroundColor: '#FEF3C7', borderColor: colors.warning }}>
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="w-4 h-4" style={{ color: colors.warning }} />
            <h3 className="text-sm font-semibold" style={{ color: colors.warning }}>提升空间</h3>
            <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.warning, color: 'white' }}>
              {worstMoment.score.toFixed(1)}分
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-500 mb-1">你的话术</p>
              <p className="text-sm text-slate-700 bg-white/70 rounded p-2 leading-relaxed line-through decoration-red-400 decoration-1">
                {worstMoment.counselorMessage}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500 mb-1">督导建议</p>
              <p className="text-sm text-slate-700 leading-relaxed">
                {extractSuggestion(worstMoment.feedback)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 来访者状态图表组件
function VisitorStatusCharts({ allChartData }: { allChartData: ChartData | null }) {
  if (!allChartData) return null;

  // 阶段名称映射
  const stageNames: Record<number, string> = {
    1: '初始阶段',
    2: '深入阶段',
    3: '工作阶段',
    4: '结束阶段'
  };

  // 对话阶段曲线数据
  const stageData = allChartData.conversation_stage_curve?.map(d => ({
    轮次: d.dialogue_count,
    阶段: stageNames[d.stage] || `阶段${d.stage}`
  })) || [];

  // 情绪时间线数据
  const emotionData = allChartData.session_emotion_timeline?.map(d => ({
    轮次: d.turn,
    情绪: d.label
  })) || [];

  // 压力曲线数据
  const stressData = allChartData.stress_curve?.map(d => ({
    轮次: d.turn,
    压力: d.value
  })) || [];

  // 情绪曲线数据
  const emotionCurveData = allChartData.emotion_curve?.map(d => ({
    轮次: d.turn,
    情绪值: d.value
  })) || [];

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
      <h2 className="text-sm font-semibold text-slate-900 mb-4">来访者状态监控</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 对话阶段曲线 */}
        {stageData.length > 0 && (
          <div>
            <p className="text-xs text-slate-500 mb-2">对话阶段</p>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={stageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="轮次" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '11px' }}
                />
                <Line type="stepAfter" dataKey="阶段" stroke={colors.primary} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* 压力曲线 */}
        {stressData.length > 0 && (
          <div>
            <p className="text-xs text-slate-500 mb-2">压力水平</p>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={stressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="轮次" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="压力" stroke={colors.dark} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* 情绪时间线 */}
        {emotionData.length > 0 && (
          <div>
            <p className="text-xs text-slate-500 mb-2">情绪状态</p>
            <div className="h-[150px] overflow-y-auto">
              <div className="space-y-1">
                {emotionData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="w-12 text-slate-400">第{d.轮次}轮</span>
                    <span className="px-2 py-0.5 rounded text-white text-xs" style={{ backgroundColor: colors.primary }}>
                      {d.情绪}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 情绪曲线 */}
        {emotionCurveData.length > 0 && (
          <div>
            <p className="text-xs text-slate-500 mb-2">情绪变化</p>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={emotionCurveData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="轮次" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="情绪值" stroke="#51999F" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export function EvaluationReport({
  scenarioName,
  overallEvaluation,
  competencyScores = {},
  conversationTurns = 0,
  sessionTurnRecords = [],
  allChartData = null,
  onStartNew,
  onBackToScenarios
}: EvaluationReportProps) {
  const radarData = prepareRadarData(competencyScores as CompetencyScores);

  const strengths = overallEvaluation?.structured_output?.稳定优势
    ? typeof overallEvaluation.structured_output.稳定优势 === 'string'
      ? overallEvaluation.structured_output.稳定优势.split(/\d+\.\s+/).filter(s => s.trim())
      : overallEvaluation.structured_output.稳定优势
    : [];

  const weaknesses = overallEvaluation?.structured_output?.结构性短板
    ? typeof overallEvaluation.structured_output.结构性短板 === 'string'
      ? overallEvaluation.structured_output.结构性短板.split(/\d+\.\s+/).filter(s => s.trim())
      : overallEvaluation.structured_output.结构性短板
    : [];

  const overallScore = overallEvaluation?.structured_output?.综合得分 || 0;

  const getRank = (score: number) => {
    if (score < 4) return '新手上路';
    if (score <= 7) return '合格咨询师';
    return '资深专家';
  };

  const handleExport = () => {
    const exportData = {
      scenario: scenarioName,
      overallScore: overallScore,
      conversationTurns: conversationTurns,
      competencyScores: competencyScores,
      sessionTurnRecords: sessionTurnRecords,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `咨询报告_${scenarioName}_${new Date().toLocaleDateString('zh-CN')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bg }}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToScenarios}
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              返回
            </Button>
            <div className="h-5 w-px bg-slate-200" />
            <h1 className="text-lg font-semibold text-slate-900">咨询评价报告</h1>
          </div>
          <div className="text-sm text-slate-500">{scenarioName}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        {/* 总体评分卡 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-6">
                {/* 分数 */}
                <div className="text-center">
                  <p className="text-sm text-slate-500 mb-1">综合得分</p>
                  <p className="text-4xl font-bold" style={{ color: colors.dark }}>
                    {overallScore.toFixed(1)}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">/ 10</p>
                </div>

                {/* 段位和轮次 */}
                <div className="flex-1 space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium" style={{ backgroundColor: colors.light }}>
                    <Award className="w-4 h-4" style={{ color: colors.dark }} />
                    <span style={{ color: colors.dark }}>{getRank(overallScore)}</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    完成 <span className="font-semibold">{conversationTurns}</span> 轮对话
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleExport}
              size="sm"
              className="bg-slate-700 hover:bg-slate-800 text-white"
            >
              <Download className="w-4 h-4 mr-1" />
              导出
            </Button>
          </div>
        </div>

        {/* 总体评价 */}
        {overallEvaluation?.natural_language_feedback && (
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Star className="w-4 h-4" style={{ color: colors.dark }} />
              总体评价
            </h3>
            <p className="text-slate-700 leading-relaxed text-sm">
              {overallEvaluation.natural_language_feedback}
            </p>
          </div>
        )}

        {/* 咨询质量趋势图 */}
        {sessionTurnRecords.length > 0 && <SessionFlowChart sessionTurnRecords={sessionTurnRecords} />}

        {/* 关键帧诊断 */}
        {sessionTurnRecords.length > 0 && <KeyMomentsAnalysis sessionTurnRecords={sessionTurnRecords} />}

        {/* 来访者状态监控 */}
        {allChartData && <VisitorStatusCharts allChartData={allChartData} />}

        {/* 优劣势 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 稳定优势 */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-semibold text-slate-900">稳定优势</h3>
            </div>
            <ul className="space-y-2">
              {strengths.slice(0, 3).map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-semibold mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed">{strength}</p>
                </li>
              ))}
              {strengths.length === 0 && (
                <li className="text-sm text-slate-400 italic">暂无数据</li>
              )}
            </ul>
          </div>

          {/* 结构性短板 */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-slate-900">待提升</h3>
            </div>
            <ul className="space-y-2">
              {weaknesses.slice(0, 3).map((weakness, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-semibold mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed">{weakness}</p>
                </li>
              ))}
              {weaknesses.length === 0 && (
                <li className="text-sm text-slate-400 italic">暂无数据</li>
              )}
            </ul>
          </div>
        </div>

        {/* 胜任力评估 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">胜任力评估</h2>
          <div className="flex flex-col lg:flex-row gap-5">
            {/* 雷达图 */}
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 10]}
                    tick={{ fill: '#94a3b8', fontSize: 9 }}
                    tickCount={6}
                  />
                  <Radar
                    name="胜任力"
                    dataKey="value"
                    stroke={colors.dark}
                    fill={colors.primary}
                    fillOpacity={0.4}
                    strokeWidth={1.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* 维度得分 */}
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-2">
                {competencyDimensions.map((dim) => {
                  const score = (competencyScores as CompetencyScores)[dim.key as keyof CompetencyScores] || 0;
                  return (
                    <div key={dim.key} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                      <span className="text-xs font-medium text-slate-700">{dim.label}</span>
                      <span className="text-sm font-semibold" style={{ color: colors.dark }}>
                        {score.toFixed(1)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-center gap-3 pt-2">
          <Button
            onClick={onStartNew}
            style={{ backgroundColor: colors.primary }}
            className="text-white hover:opacity-90 px-6"
          >
            开始新的练习
          </Button>
          <Button
            onClick={onBackToScenarios}
            variant="outline"
            className="px-6 border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            选择其他场景
          </Button>
        </div>
      </div>
    </div>
  );
}
