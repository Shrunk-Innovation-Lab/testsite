import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, ArrowRight, Home, Target, Users, ClipboardCheck, TrendingUp, DollarSign, Rocket, BarChart3, MessageSquare, RefreshCw, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const SustainabilityWorkshop = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({});
  const [showDiagram, setShowDiagram] = useState(false);

  const steps = [
    {
      id: 'scope',
      title: 'Initiative Scope',
      icon: Target,
      phase: 'Foundation',
      description: 'Define the primary focus area for your sustainability initiative',
      strategicQuestion: 'What environmental impact area presents the greatest opportunity for meaningful change at RWH?',
      options: [
        { 
          value: 'energy', 
          label: 'Energy & Carbon Reduction',
          detail: 'Focus on reducing energy consumption, transitioning to renewables, and lowering carbon emissions',
          timeline: '18-36 months',
          resources: 'High capital, dedicated energy manager',
          risks: 'Grid dependency, upfront costs',
          kpis: ['kWh reduction %', 'Scope 1 & 2 emissions', 'Renewable energy %']
        },
        { 
          value: 'waste', 
          label: 'Waste Management & Circular Economy',
          detail: 'Implement comprehensive waste reduction, recycling programs, and circular procurement practices',
          timeline: '12-24 months',
          resources: 'Medium capital, waste coordinator',
          risks: 'Clinical waste regulations, staff behavior change',
          kpis: ['Landfill diversion %', 'Waste per patient', 'Recycling rate']
        },
        { 
          value: 'water', 
          label: 'Water Conservation',
          detail: 'Reduce water usage, implement water-efficient systems, and rainwater harvesting',
          timeline: '12-18 months',
          resources: 'Medium capital, facilities team',
          risks: 'Hygiene standards, infrastructure constraints',
          kpis: ['Water use per bed day', 'Harvested water volume', 'Peak demand reduction']
        },
        { 
          value: 'procurement', 
          label: 'Sustainable Procurement',
          detail: 'Establish green purchasing policies and supplier sustainability requirements',
          timeline: '24-36 months',
          resources: 'Low capital, procurement policy reform',
          risks: 'Supplier availability, cost premiums',
          kpis: ['Sustainable product %', 'Supplier compliance', 'Scope 3 emissions']
        },
        { 
          value: 'comprehensive', 
          label: 'Comprehensive Program',
          detail: 'Multi-faceted approach addressing multiple sustainability areas simultaneously',
          timeline: '36-60 months',
          resources: 'High capital, dedicated team',
          risks: 'Complexity, resource dilution',
          kpis: ['Multi-domain scorecard', 'Carbon footprint', 'Environmental cost savings']
        }
      ]
    },
    {
      id: 'stakeholders',
      title: 'Stakeholder Engagement',
      icon: Users,
      phase: 'Foundation',
      description: 'Identify the primary stakeholder groups to involve in the initiative',
      strategicQuestion: 'Who needs to be at the table to ensure buy-in, resources, and sustained momentum?',
      options: [
        { 
          value: 'clinical', 
          label: 'Clinical Teams First',
          detail: 'Engage nurses, doctors, and allied health professionals as primary champions',
          timeline: '6-12 months to build network',
          resources: 'Protected time, clinical champions',
          risks: 'Competing priorities, clinical resistance',
          kpis: ['Champion participation', 'Clinical engagement score', 'Frontline adoption rate']
        },
        { 
          value: 'operations', 
          label: 'Operations & Facilities',
          detail: 'Lead through facilities management, engineering, and operational teams',
          timeline: '3-6 months to establish',
          resources: 'Operational budget, technical expertise',
          risks: 'Limited clinical input, siloed approach',
          kpis: ['Project completion rate', 'Operational efficiency', 'Technical adoption']
        },
        { 
          value: 'executive', 
          label: 'Executive-Led',
          detail: 'Board and executive team drive the initiative with top-down support',
          timeline: '2-3 months for mandate',
          resources: 'Executive sponsorship, strategic budget',
          risks: 'Staff disengagement, perceived mandate',
          kpis: ['Executive visibility', 'Strategic alignment', 'Resource allocation']
        },
        { 
          value: 'grassroots', 
          label: 'Grassroots Network',
          detail: 'Build a volunteer network of sustainability champions across all departments',
          timeline: '12-18 months to scale',
          resources: 'Coordination support, recognition program',
          risks: 'Volunteer burnout, inconsistent effort',
          kpis: ['Active champions', 'Cross-department reach', 'Initiative origination']
        },
        { 
          value: 'collaborative', 
          label: 'Collaborative Governance',
          detail: 'Establish a cross-functional steering committee with representatives from all areas',
          timeline: '3-6 months to establish',
          resources: 'Governance structure, meeting time',
          risks: 'Decision delays, consensus challenges',
          kpis: ['Committee effectiveness', 'Cross-functional projects', 'Decision velocity']
        }
      ]
    },
    {
      id: 'assessment',
      title: 'Baseline Assessment',
      icon: ClipboardCheck,
      phase: 'Planning',
      description: 'Choose the method for assessing current sustainability performance',
      strategicQuestion: 'How will we establish where we are today to measure progress tomorrow?',
      options: [
        { 
          value: 'audit', 
          label: 'Comprehensive Sustainability Audit',
          detail: 'Detailed assessment of all operations, baseline measurements, and gap analysis',
          timeline: '4-6 months',
          resources: 'External consultants, data systems',
          risks: 'Cost, time intensive, analysis paralysis',
          kpis: ['Baseline established', 'Gap analysis complete', 'Audit recommendations']
        },
        { 
          value: 'quick', 
          label: 'Rapid Assessment',
          detail: 'Quick wins identification and high-impact opportunity mapping',
          timeline: '4-8 weeks',
          resources: 'Internal team, existing data',
          risks: 'Incomplete picture, missed opportunities',
          kpis: ['Quick wins identified', 'Priority ranking', 'Initial baselines']
        },
        { 
          value: 'certification', 
          label: 'External Certification Framework',
          detail: 'Use Green Star Healthcare or similar framework for structured assessment',
          timeline: '6-12 months',
          resources: 'Certification fees, dedicated coordinator',
          risks: 'Framework constraints, ongoing compliance',
          kpis: ['Rating achieved', 'Criteria met', 'Certification status']
        },
        { 
          value: 'benchmark', 
          label: 'Peer Benchmarking',
          detail: 'Compare performance against other healthcare facilities and industry standards',
          timeline: '2-3 months',
          resources: 'Benchmarking data access, analysis capacity',
          risks: 'Data availability, comparability issues',
          kpis: ['Peer comparison', 'Performance quartile', 'Best practice gaps']
        },
        { 
          value: 'phased', 
          label: 'Phased Assessment',
          detail: 'Start with priority areas, expand assessment over time',
          timeline: '3-6 months initial, ongoing',
          resources: 'Flexible budget, iterative approach',
          risks: 'Incomplete initial view, scope creep',
          kpis: ['Phases completed', 'Coverage expansion', 'Assessment depth']
        }
      ]
    },
    {
      id: 'goals',
      title: 'Target Setting',
      icon: TrendingUp,
      phase: 'Planning',
      description: 'Define the approach to setting sustainability targets',
      strategicQuestion: 'What level of ambition will drive meaningful change while remaining achievable?',
      options: [
        { 
          value: 'science', 
          label: 'Science-Based Targets',
          detail: 'Align with climate science and net-zero pathways (e.g., 1.5°C warming limit)',
          timeline: '12-18 months for validation',
          resources: 'External validation, technical expertise',
          risks: 'Aggressive targets, long-term uncertainty',
          kpis: ['SBTi validation', 'Pathway alignment', 'Annual progress vs. target']
        },
        { 
          value: 'regulatory', 
          label: 'Regulatory Compliance Plus',
          detail: 'Meet all requirements and exceed by specific percentages',
          timeline: '6-12 months',
          resources: 'Compliance monitoring, buffer capacity',
          risks: 'Limited ambition, reactive approach',
          kpis: ['Compliance status', 'Exceed % achieved', 'Regulatory readiness']
        },
        { 
          value: 'incremental', 
          label: 'Incremental Improvement',
          detail: 'Set year-on-year improvement targets (e.g., 5% annual reduction)',
          timeline: 'Annual cycles',
          resources: 'Continuous improvement capacity',
          risks: 'Diminishing returns, lacks urgency',
          kpis: ['Annual improvement %', 'Cumulative reduction', 'Target achievement rate']
        },
        { 
          value: 'aspirational', 
          label: 'Aspirational Vision',
          detail: 'Set ambitious long-term goals (e.g., carbon neutral by 2035)',
          timeline: 'Long-term (10-15 years)',
          resources: 'Transformational investment, innovation',
          risks: 'Feasibility uncertainty, technology dependence',
          kpis: ['Vision milestones', 'Trajectory tracking', 'Innovation adoption']
        },
        { 
          value: 'balanced', 
          label: 'Balanced Scorecard',
          detail: 'Multiple metrics across environmental, social, and economic dimensions',
          timeline: 'Quarterly reviews',
          resources: 'Comprehensive data systems',
          risks: 'Complexity, conflicting priorities',
          kpis: ['Scorecard balance', 'Multi-dimensional performance', 'Integrated outcomes']
        }
      ]
    },
    {
      id: 'resources',
      title: 'Resource Mobilization',
      icon: DollarSign,
      phase: 'Planning',
      description: 'Determine how to fund and resource the initiative',
      strategicQuestion: 'How will we secure and sustain the financial and human resources needed?',
      options: [
        { 
          value: 'capital', 
          label: 'Capital Investment Program',
          detail: 'Dedicated multi-year budget for infrastructure and system upgrades',
          timeline: 'Multi-year allocation',
          resources: '$2-10M+, project management',
          risks: 'Capital availability, competing priorities',
          kpis: ['Capital deployed', 'ROI', 'Project completion']
        },
        { 
          value: 'revolving', 
          label: 'Revolving Green Fund',
          detail: 'Self-funding model where savings are reinvested into new projects',
          timeline: '12-18 months to establish',
          resources: 'Seed funding, financial tracking',
          risks: 'Initial funding, savings validation',
          kpis: ['Fund balance', 'Reinvestment rate', 'Cumulative savings']
        },
        { 
          value: 'grants', 
          label: 'External Funding Focus',
          detail: 'Prioritize government grants, partnerships, and external funding sources',
          timeline: 'Ongoing applications',
          resources: 'Grant writing capacity, partnership development',
          risks: 'Funding uncertainty, application burden',
          kpis: ['Grants secured', 'External funding %', 'Partnership value']
        },
        { 
          value: 'integrated', 
          label: 'Integrated BAU Budget',
          detail: 'Embed sustainability considerations into all operational and capital budgets',
          timeline: 'Annual budget cycles',
          resources: 'Policy integration, budget process reform',
          risks: 'Diffused accountability, competing needs',
          kpis: ['Sustainability budget %', 'Policy compliance', 'Integrated decisions']
        },
        { 
          value: 'phased', 
          label: 'Phased Funding Approach',
          detail: 'Start small with quick wins, scale up as benefits are demonstrated',
          timeline: 'Phase-dependent',
          resources: 'Initial pilot budget, performance data',
          risks: 'Momentum loss, scale-up delays',
          kpis: ['Phase progression', 'Demonstrated ROI', 'Scale achieved']
        }
      ]
    },
    {
      id: 'implementation',
      title: 'Execution Strategy',
      icon: Rocket,
      phase: 'Delivery',
      description: 'Select the rollout approach for sustainability initiatives',
      strategicQuestion: 'What implementation pathway will maximize learning while managing risk?',
      options: [
        { 
          value: 'pilot', 
          label: 'Pilot Programs',
          detail: 'Test initiatives in specific departments before hospital-wide rollout',
          timeline: '6-12 months pilot + rollout',
          resources: 'Pilot sites, evaluation capacity',
          risks: 'Pilot failure, scale-up challenges',
          kpis: ['Pilot success metrics', 'Lessons documented', 'Scale-up readiness']
        },
        { 
          value: 'concurrent', 
          label: 'Concurrent Rollout',
          detail: 'Launch multiple initiatives simultaneously across the organization',
          timeline: '3-6 months intensive',
          resources: 'High coordination, change capacity',
          risks: 'Change fatigue, quality issues',
          kpis: ['Initiatives launched', 'Parallel adoption', 'Integration effectiveness']
        },
        { 
          value: 'sequential', 
          label: 'Sequential Implementation',
          detail: 'Complete one initiative before starting the next, building momentum',
          timeline: '18-36 months staged',
          resources: 'Focused resources per initiative',
          risks: 'Slow progress, lost opportunities',
          kpis: ['Completion rate', 'Sequential success', 'Momentum indicators']
        },
        { 
          value: 'agile', 
          label: 'Agile Iterations',
          detail: 'Short cycles of planning, testing, learning, and adapting',
          timeline: '2-4 week sprints',
          resources: 'Agile team, rapid decision-making',
          risks: 'Direction changes, sprint discipline',
          kpis: ['Sprint velocity', 'Iteration learnings', 'Adaptation rate']
        },
        { 
          value: 'integrated', 
          label: 'Integration with Major Projects',
          detail: 'Embed sustainability into existing capital works and refurbishments',
          timeline: 'Project-dependent',
          resources: 'Project integration capacity',
          risks: 'Project delays, dependency issues',
          kpis: ['Integration rate', 'Project sustainability', 'Embedded benefits']
        }
      ]
    },
    {
      id: 'monitoring',
      title: 'Performance Management',
      icon: BarChart3,
      phase: 'Delivery',
      description: 'Choose how to track progress and measure success',
      strategicQuestion: 'How will we maintain visibility and accountability for results?',
      options: [
        { 
          value: 'digital', 
          label: 'Digital Dashboard',
          detail: 'Real-time monitoring platform with automated data collection and visualization',
          timeline: '6-9 months development',
          resources: 'IT development, system integration',
          risks: 'Data quality, system complexity',
          kpis: ['System uptime', 'Data completeness', 'User engagement']
        },
        { 
          value: 'quarterly', 
          label: 'Quarterly Reporting Cycle',
          detail: 'Regular reports to executive and board with KPI tracking',
          timeline: 'Quarterly cadence',
          resources: 'Reporting team, data compilation',
          risks: 'Lagging indicators, reporting burden',
          kpis: ['Report timeliness', 'KPI achievement', 'Action item closure']
        },
        { 
          value: 'integrated', 
          label: 'Integrated Performance System',
          detail: 'Embed sustainability metrics into existing performance management systems',
          timeline: '3-6 months integration',
          resources: 'System modification, training',
          risks: 'Metric overload, diluted focus',
          kpis: ['Integration completeness', 'Dual accountability', 'Performance correlation']
        },
        { 
          value: 'external', 
          label: 'External Verification',
          detail: 'Third-party audits and public disclosure (e.g., sustainability reports)',
          timeline: 'Annual verification',
          resources: 'Audit fees, report production',
          risks: 'Public scrutiny, verification costs',
          kpis: ['Verification status', 'Report quality', 'Stakeholder feedback']
        },
        { 
          value: 'live', 
          label: 'Live Display & Engagement',
          detail: 'Public displays showing real-time performance to engage staff and visitors',
          timeline: '3-6 months deployment',
          resources: 'Display infrastructure, content management',
          risks: 'Negative visibility, engagement drop',
          kpis: ['Awareness levels', 'Behavioral change', 'Display impact']
        }
      ]
    },
    {
      id: 'communication',
      title: 'Engagement & Communication',
      icon: MessageSquare,
      phase: 'Delivery',
      description: 'Define how to communicate the initiative and engage the organization',
      strategicQuestion: 'How will we inspire action and maintain momentum across the organization?',
      options: [
        { 
          value: 'campaign', 
          label: 'Awareness Campaign',
          detail: 'Branded campaign with regular updates, stories, and staff engagement activities',
          timeline: '12-18 months intensive',
          resources: 'Campaign budget, creative resources',
          risks: 'Message fatigue, campaign end',
          kpis: ['Awareness %', 'Engagement rate', 'Brand recognition']
        },
        { 
          value: 'integration', 
          label: 'BAU Communication',
          detail: 'Integrate sustainability messaging into existing communication channels',
          timeline: 'Ongoing integration',
          resources: 'Content development, channel access',
          risks: 'Message dilution, low visibility',
          kpis: ['Message reach', 'Channel utilization', 'Recall rate']
        },
        { 
          value: 'education', 
          label: 'Education Program',
          detail: 'Training, workshops, and resources to build sustainability literacy',
          timeline: '12-24 months rollout',
          resources: 'Training development, delivery capacity',
          risks: 'Attendance challenges, knowledge retention',
          kpis: ['Training completion', 'Knowledge gain', 'Behavior application']
        },
        { 
          value: 'celebration', 
          label: 'Wins & Celebration Focus',
          detail: 'Highlight successes, recognize champions, and celebrate milestones',
          timeline: 'Ongoing recognition',
          resources: 'Recognition program, event budget',
          risks: 'Recognition equity, authenticity',
          kpis: ['Champions recognized', 'Celebration events', 'Morale indicators']
        },
        { 
          value: 'transparent', 
          label: 'Transparent Reporting',
          detail: 'Open sharing of progress, challenges, and learnings with all stakeholders',
          timeline: 'Regular updates',
          resources: 'Reporting infrastructure, openness',
          risks: 'Negative perceptions, information overload',
          kpis: ['Report accessibility', 'Transparency rating', 'Trust levels']
        }
      ]
    },
    {
      id: 'review',
      title: 'Continuous Improvement',
      icon: RefreshCw,
      phase: 'Evolution',
      description: 'Establish how to evaluate and evolve the initiative over time',
      strategicQuestion: 'How will we ensure the program remains relevant and continues to deliver value?',
      options: [
        { 
          value: 'annual', 
          label: 'Annual Strategic Review',
          detail: 'Comprehensive yearly assessment with strategy refresh and target updates',
          timeline: 'Annual cycle',
          resources: 'Review team, strategy facilitation',
          risks: 'Review fatigue, slow adaptation',
          kpis: ['Review completion', 'Strategy updates', 'Target adjustments']
        },
        { 
          value: 'continuous', 
          label: 'Continuous Improvement Cycles',
          detail: 'Regular feedback loops with ongoing refinement and adaptation',
          timeline: 'Monthly/quarterly cycles',
          resources: 'Improvement culture, rapid response',
          risks: 'Direction instability, change overload',
          kpis: ['Improvement initiatives', 'Cycle time', 'Adoption rate']
        },
        { 
          value: 'milestone', 
          label: 'Milestone-Based Review',
          detail: 'Formal evaluation at key project milestones and achievement points',
          timeline: 'Event-driven',
          resources: 'Evaluation framework, milestone tracking',
          risks: 'Review gaps, milestone delays',
          kpis: ['Milestone achievement', 'Lessons captured', 'Course corrections']
        },
        { 
          value: 'external', 
          label: 'External Review Panel',
          detail: 'Independent experts provide periodic assessments and recommendations',
          timeline: 'Bi-annual reviews',
          resources: 'Panel fees, expert access',
          risks: 'External disconnect, recommendation acceptance',
          kpis: ['Panel recommendations', 'Implementation rate', 'Expert satisfaction']
        },
        { 
          value: 'adaptive', 
          label: 'Adaptive Management',
          detail: 'Flexible approach that responds to emerging opportunities and challenges',
          timeline: 'Continuous monitoring',
          resources: 'Flexible resources, decision agility',
          risks: 'Lack of structure, accountability drift',
          kpis: ['Adaptation events', 'Response time', 'Outcome improvement']
        }
      ]
    }
  ];

  const handleOptionSelect = (optionValue) => {
    setSelections({
      ...selections,
      [steps[currentStep].id]: optionValue
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowDiagram(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (index) => {
    setCurrentStep(index);
    setShowDiagram(false);
  };

  const resetWorkshop = () => {
    setCurrentStep(0);
    setSelections({});
    setShowDiagram(false);
  };

  const getSelectedOption = (stepId) => {
    const step = steps.find(s => s.id === stepId);
    const selectedValue = selections[stepId];
    return step?.options.find(opt => opt.value === selectedValue);
  };

  const isStepComplete = (stepId) => {
    return selections[stepId] !== undefined;
  };

  const allStepsComplete = () => {
    return steps.every(step => isStepComplete(step.id));
  };

  const phases = [
    { name: 'Foundation', color: '#2563eb', steps: ['scope', 'stakeholders'] },
    { name: 'Planning', color: '#7c3aed', steps: ['assessment', 'goals', 'resources'] },
    { name: 'Delivery', color: '#059669', steps: ['implementation', 'monitoring', 'communication'] },
    { name: 'Evolution', color: '#dc2626', steps: ['review'] }
  ];

  if (showDiagram) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Merriweather:wght@700;900&display=swap');
          
          * {
            font-family: 'Inter', sans-serif;
          }
          
          .playbook-header {
            font-family: 'Merriweather', serif;
          }
          
          .phase-card {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .phase-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          }
          
          .process-node {
            transition: all 0.3s ease;
          }
          
          .process-node:hover {
            transform: scale(1.02);
          }
          
          .connection-line {
            animation: flowPulse 2s ease-in-out infinite;
          }
          
          @keyframes flowPulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }
          
          .fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
            opacity: 0;
          }
          
          @keyframes fadeInUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .metric-badge {
            backdrop-filter: blur(10px);
          }
        `}</style>
        
        <div className="max-w-7xl mx-auto">
          {/* Playbook Header */}
          <div className="bg-white border-b-4 border-slate-900 shadow-lg mb-6">
            <div className="p-8">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">
                    Operational Playbook
                  </div>
                  <h1 className="text-4xl font-black text-slate-900 mb-1 playbook-header">
                    Sustainability Initiative Process
                  </h1>
                  <p className="text-lg text-slate-600 font-medium">
                    Royal Women's Hospital Melbourne | Process Framework v1.0
                  </p>
                </div>
                <button
                  onClick={resetWorkshop}
                  className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all"
                >
                  <Home size={18} />
                  Reset
                </button>
              </div>
            </div>
            
            {/* Phase Overview Bar */}
            <div className="grid grid-cols-4 border-t border-slate-200">
              {phases.map((phase, idx) => {
                const phaseSteps = steps.filter(s => phase.steps.includes(s.id));
                const completedInPhase = phaseSteps.filter(s => isStepComplete(s.id)).length;
                
                return (
                  <div key={phase.name} className="border-r border-slate-200 last:border-r-0 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: phase.color }}
                      />
                      <div className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                        Phase {idx + 1}
                      </div>
                    </div>
                    <div className="font-bold text-slate-900 mb-1">{phase.name}</div>
                    <div className="text-sm text-slate-600">
                      {completedInPhase}/{phaseSteps.length} Steps
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Executive Summary */}
          <div className="bg-white border-l-4 border-slate-900 shadow-sm mb-6 p-6">
            <div className="flex items-start gap-4">
              <div className="bg-slate-100 rounded-lg p-3">
                <CheckCircle2 className="text-slate-700" size={24} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg mb-2">Process Complete</h2>
                <p className="text-slate-600 leading-relaxed">
                  Your team has successfully defined a comprehensive sustainability initiative process across 
                  four strategic phases. This playbook outlines the selected approach for each critical decision point, 
                  including implementation timelines, resource requirements, risk factors, and key performance indicators.
                </p>
              </div>
            </div>
          </div>

          {/* Process Flow by Phase */}
          {phases.map((phase, phaseIdx) => {
            const phaseSteps = steps.filter(s => phase.steps.includes(s.id));
            
            return (
              <div 
                key={phase.name} 
                className="mb-8 fade-in-up" 
                style={{ 
                  animationDelay: `${phaseIdx * 0.1}s`,
                  transform: 'translateY(20px)'
                }}
              >
                {/* Phase Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg"
                    style={{ backgroundColor: phase.color }}
                  >
                    {phaseIdx + 1}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Phase {phaseIdx + 1}
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 playbook-header">
                      {phase.name}
                    </h2>
                  </div>
                </div>

                {/* Phase Steps */}
                <div className="space-y-4">
                  {phaseSteps.map((step, stepIdx) => {
                    const selected = getSelectedOption(step.id);
                    const StepIcon = step.icon;
                    
                    return (
                      <div key={step.id} className="relative">
                        {/* Connection Line to Next Step */}
                        {stepIdx < phaseSteps.length - 1 && (
                          <div className="absolute left-6 top-full h-4 w-0.5 bg-slate-300 connection-line" />
                        )}
                        
                        <div className="process-node bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md overflow-hidden">
                          {/* Step Header */}
                          <div 
                            className="p-5 border-b border-slate-200"
                            style={{ backgroundColor: `${phase.color}08` }}
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div 
                                className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                                style={{ backgroundColor: phase.color }}
                              >
                                <StepIcon size={20} />
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-slate-900 text-lg">
                                  {step.title}
                                </div>
                                <div className="text-sm text-slate-600">
                                  {step.description}
                                </div>
                              </div>
                            </div>
                            
                            {/* Strategic Question */}
                            <div className="bg-white/70 rounded-lg p-3 border border-slate-200">
                              <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                                Strategic Question
                              </div>
                              <div className="text-sm text-slate-700 italic">
                                {step.strategicQuestion}
                              </div>
                            </div>
                          </div>

                          {/* Selected Option */}
                          <div className="p-5">
                            <div className="flex items-start gap-4">
                              <div 
                                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                                style={{ backgroundColor: `${phase.color}20` }}
                              >
                                <Check style={{ color: phase.color }} size={18} />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold text-slate-900 text-lg mb-2">
                                  {selected?.label}
                                </h3>
                                <p className="text-slate-600 mb-4 leading-relaxed">
                                  {selected?.detail}
                                </p>
                                
                                {/* Metrics Grid */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Clock size={14} className="text-slate-500" />
                                      <div className="text-xs font-bold text-slate-500 uppercase">Timeline</div>
                                    </div>
                                    <div className="text-sm font-semibold text-slate-900">
                                      {selected?.timeline}
                                    </div>
                                  </div>
                                  
                                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                    <div className="flex items-center gap-2 mb-1">
                                      <DollarSign size={14} className="text-slate-500" />
                                      <div className="text-xs font-bold text-slate-500 uppercase">Resources</div>
                                    </div>
                                    <div className="text-sm font-semibold text-slate-900">
                                      {selected?.resources}
                                    </div>
                                  </div>
                                  
                                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                    <div className="flex items-center gap-2 mb-1">
                                      <AlertCircle size={14} className="text-slate-500" />
                                      <div className="text-xs font-bold text-slate-500 uppercase">Key Risks</div>
                                    </div>
                                    <div className="text-sm font-semibold text-slate-900">
                                      {selected?.risks}
                                    </div>
                                  </div>
                                  
                                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                    <div className="flex items-center gap-2 mb-1">
                                      <BarChart3 size={14} className="text-slate-500" />
                                      <div className="text-xs font-bold text-slate-500 uppercase">KPIs</div>
                                    </div>
                                    <div className="text-xs text-slate-700 space-y-0.5">
                                      {selected?.kpis.slice(0, 2).map((kpi, i) => (
                                        <div key={i}>• {kpi}</div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Phase Connection */}
                {phaseIdx < phases.length - 1 && (
                  <div className="flex items-center justify-center my-6">
                    <div className="flex items-center gap-3">
                      <div className="h-0.5 w-24 bg-gradient-to-r from-slate-300 to-slate-400" />
                      <div className="bg-slate-100 rounded-full px-4 py-2 text-xs font-bold text-slate-600 uppercase tracking-wide">
                        Transition to {phases[phaseIdx + 1].name}
                      </div>
                      <div className="h-0.5 w-24 bg-gradient-to-r from-slate-400 to-slate-300" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Implementation Roadmap */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mt-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-slate-900 rounded-lg p-3">
                <ArrowRight className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 playbook-header">
                  Next Steps: Implementation Roadmap
                </h2>
                <p className="text-slate-600">
                  Critical actions to operationalize your sustainability initiative
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                <div className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center text-sm font-bold">1</div>
                  Immediate Actions (Week 1-2)
                </div>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    Document this playbook and circulate to all stakeholders
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    Assign executive sponsor and project leadership
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    Schedule steering committee formation meeting
                  </li>
                </ul>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                <div className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center text-sm font-bold">2</div>
                  Short-term Setup (Month 1-3)
                </div>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    Develop detailed project plans for each phase
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    Secure funding commitments and resource allocation
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    Establish baseline measurement systems
                  </li>
                </ul>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                <div className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center text-sm font-bold">3</div>
                  Medium-term Execution (Quarter 1-2)
                </div>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
                    Launch pilot programs and initial initiatives
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
                    Implement monitoring and reporting systems
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
                    Begin stakeholder engagement and communication campaigns
                  </li>
                </ul>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                <div className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center text-sm font-bold">4</div>
                  Long-term Sustainability (Year 1+)
                </div>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                    Scale successful pilots across the organization
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                    Conduct regular performance reviews and course corrections
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                    Embed sustainability into organizational culture and operations
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Success Factors */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl shadow-lg p-8 mt-6 text-white">
            <h2 className="text-2xl font-black mb-6 playbook-header">Critical Success Factors</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="font-bold mb-2 flex items-center gap-2">
                  <Target size={20} />
                  Leadership Commitment
                </div>
                <p className="text-white/80 text-sm">
                  Sustained executive support and visible championship from board and senior management
                </p>
              </div>
              <div>
                <div className="font-bold mb-2 flex items-center gap-2">
                  <Users size={20} />
                  Cultural Integration
                </div>
                <p className="text-white/80 text-sm">
                  Embedding sustainability into daily operations and decision-making across all levels
                </p>
              </div>
              <div>
                <div className="font-bold mb-2 flex items-center gap-2">
                  <TrendingUp size={20} />
                  Data-Driven Decisions
                </div>
                <p className="text-white/80 text-sm">
                  Rigorous measurement, transparent reporting, and evidence-based continuous improvement
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Merriweather:wght@700;900&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        .playbook-header {
          font-family: 'Merriweather', serif;
        }
        
        .slide-in {
          animation: slideIn 0.5s ease-out;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .option-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
        }
        
        .option-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        
        .option-card.selected {
          border-color: #1e293b;
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: white;
        }
        
        .option-card.selected::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(to bottom, #3b82f6, #06b6d4);
        }
        
        .step-indicator {
          transition: all 0.3s ease;
        }
        
        .step-indicator.complete {
          background: linear-gradient(135deg, #059669, #10b981);
        }
        
        .step-indicator.active {
          background: linear-gradient(135deg, #1e293b, #334155);
          transform: scale(1.1);
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b-4 border-slate-900 shadow-lg mb-6">
          <div className="p-8">
            <div className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">
              Operational Playbook Workshop
            </div>
            <h1 className="text-5xl font-black text-slate-900 mb-2 playbook-header">
              Sustainability Initiative Process Design
            </h1>
            <p className="text-xl text-slate-600 font-medium">
              Royal Women's Hospital Melbourne | Strategic Planning Session
            </p>
          </div>
          
          {/* Progress Indicators */}
          <div className="border-t border-slate-200 p-6">
            <div className="flex items-center gap-2 flex-wrap mb-4">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <React.Fragment key={step.id}>
                    <div
                      onClick={() => handleStepClick(index)}
                      className={`step-indicator cursor-pointer flex items-center justify-center w-12 h-12 rounded-lg font-bold text-white shadow-md hover:shadow-lg
                        ${isStepComplete(step.id) ? 'complete' : 'bg-slate-300'}
                        ${currentStep === index ? 'active ring-4 ring-slate-300' : ''}`}
                      title={step.title}
                    >
                      {isStepComplete(step.id) ? (
                        <Check size={20} />
                      ) : (
                        <StepIcon size={20} />
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="flex-1 h-1 bg-slate-200 rounded-full min-w-[20px] max-w-[40px]">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                          style={{width: isStepComplete(steps[index + 1].id) ? '100%' : '0%'}}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="text-slate-600">
                <span className="font-bold text-slate-900">{steps[currentStep].phase}</span> Phase • 
                Step {currentStep + 1} of {steps.length}
              </div>
              <div className="text-slate-600">
                {Object.keys(selections).length} / {steps.length} completed
              </div>
            </div>
          </div>
        </div>

        {/* Current Step */}
        <div className="slide-in">
          <div className="bg-white border border-slate-200 shadow-lg mb-6">
            {/* Step Header */}
            <div className="border-b border-slate-200 p-8 bg-slate-50">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-slate-900 w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg">
                  {React.createElement(steps[currentStep].icon, { size: 28 })}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {steps[currentStep].phase} Phase • Step {currentStep + 1}
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 mb-2 playbook-header">
                    {steps[currentStep].title}
                  </h2>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    {steps[currentStep].description}
                  </p>
                </div>
              </div>

              {/* Strategic Question */}
              <div className="bg-white border-l-4 border-slate-900 p-5 rounded-r-lg">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                  Strategic Question
                </div>
                <p className="text-slate-900 font-medium italic text-lg">
                  {steps[currentStep].strategicQuestion}
                </p>
              </div>
            </div>

            {/* Options */}
            <div className="p-8">
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">
                Select Your Approach
              </div>
              <div className="space-y-4">
                {steps[currentStep].options.map((option) => {
                  const isSelected = selections[steps[currentStep].id] === option.value;
                  
                  return (
                    <div
                      key={option.value}
                      onClick={() => handleOptionSelect(option.value)}
                      className={`option-card border-2 rounded-xl p-6 ${
                        isSelected
                          ? 'selected border-slate-900'
                          : 'border-slate-200 bg-white hover:border-slate-400'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center mt-1 ${
                          isSelected
                            ? 'bg-white border-white'
                            : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && (
                            <Check size={16} className="text-slate-900" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className={`text-xl font-bold mb-3 ${
                            isSelected ? 'text-white' : 'text-slate-900'
                          }`}>
                            {option.label}
                          </h3>
                          <p className={`leading-relaxed mb-4 ${
                            isSelected ? 'text-white/90' : 'text-slate-600'
                          }`}>
                            {option.detail}
                          </p>
                          
                          {/* Operational Details */}
                          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/20">
                            <div className={isSelected ? 'text-white/80' : 'text-slate-600'}>
                              <div className="text-xs font-bold uppercase tracking-wide mb-1 flex items-center gap-1">
                                <Clock size={12} />
                                Timeline
                              </div>
                              <div className="text-sm font-semibold">{option.timeline}</div>
                            </div>
                            <div className={isSelected ? 'text-white/80' : 'text-slate-600'}>
                              <div className="text-xs font-bold uppercase tracking-wide mb-1 flex items-center gap-1">
                                <DollarSign size={12} />
                                Resources
                              </div>
                              <div className="text-sm font-semibold">{option.resources}</div>
                            </div>
                            <div className={`col-span-2 ${isSelected ? 'text-white/80' : 'text-slate-600'}`}>
                              <div className="text-xs font-bold uppercase tracking-wide mb-1 flex items-center gap-1">
                                <AlertCircle size={12} />
                                Key Risks
                              </div>
                              <div className="text-sm">{option.risks}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-4 bg-white border-2 border-slate-300 text-slate-700 rounded-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:border-slate-900 hover:text-slate-900 transition-all shadow-sm hover:shadow-md"
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          <div className="text-center">
            {!selections[steps[currentStep].id] && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
                <p className="text-sm text-amber-900 font-medium">
                  Select an option to proceed
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleNext}
            disabled={!selections[steps[currentStep].id]}
            className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition-all shadow-md hover:shadow-lg"
          >
            {currentStep === steps.length - 1 ? 'Generate Playbook' : 'Next Step'}
            <ChevronRight size={20} />
          </button>
        </div>

        {allStepsComplete() && currentStep === steps.length - 1 && (
          <div className="mt-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-full p-3">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">Process Design Complete</h3>
                <p className="text-white/90">
                  All steps have been defined. Click "Generate Playbook" to view your comprehensive operational framework.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SustainabilityWorkshop;
