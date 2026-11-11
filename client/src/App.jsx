import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  BriefcaseBusiness,
  Building2,
  Bug,
  Check,
  CheckCircle2,
  CheckSquare,
  CircleCheck,
  Clock3,
  Code2,
  Compass,
  Copy,
  Cpu,
  Database,
  ExternalLink,
  FileCode,
  FileText,
  Filter,
  GitMerge,
  Layers,
  Lightbulb,
  LayoutDashboard,
  Link as LinkIcon,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Mail,
  MessageSquare,
  Milestone,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  Users,
} from 'lucide-react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const goalSections = [
  { id: 'targets', label: 'Targets', icon: Target, description: 'Set and track measurable outcomes for your onboarding sprint.' },
  { id: 'roadmap', label: 'Milestone Roadmap', icon: Milestone, description: 'Break goals into chronological milestones and track deliverable progress.' },
  { id: 'alignment', label: 'Alignment', icon: Compass, description: 'Connect team and individual milestones to company-wide strategic OKRs.' },
  { id: 'dependencies', label: 'Dependencies', icon: GitMerge, description: 'Identify and resolve cross-team blockers, API access limits, and external requirements.' },
];

const projectSections = [
  { id: 'overview', label: 'Overview' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'documents', label: 'Documents' },
  { id: 'plan', label: 'Plan' },
];

const issueSections = [
  { id: 'bugs', label: 'Bugs' },
  { id: 'blockers', label: 'Blockers' },
  { id: 'resolution-history', label: 'Resolution History' },
];

const ideaSections = [
  { id: 'overview', label: 'Overall View', icon: Sparkles, summaryKey: 'overview' },
  { id: 'architecture', label: 'Architecture', icon: Layers, summaryKey: 'architecture' },
  { id: 'tech-stack', label: 'Tech Stack', icon: Cpu, summaryKey: 'techStack' },
  { id: 'key-features', label: 'Key Features', icon: Boxes, summaryKey: 'keyFeatures' },
];

const timesheetSections = [
  { id: 'deadline', label: 'Submission Deadline' },
  { id: 'time-given', label: 'Time Already Given' },
];

const bugs = [];
const blockers = [];
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

const formatCountdown = (milliseconds) => {
  const totalSeconds = Math.floor(Math.abs(milliseconds) / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
};

const toLocalDateTimeInput = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
};

const getAuthErrorMessage = (error) => {
  const message = typeof error?.message === 'string'
    ? error.message
    : 'Authentication failed. Please try again.';
  if (message.toLowerCase().includes('rate limit')) {
    return 'Supabase has temporarily rate-limited signup emails. Stop retrying for now. For this hackathon, sign in to Supabase and turn off Confirm email under Authentication → Sign In / Providers → Email.';
  }

  return message;
};

const initialGoals = [
  {
    id: 'g-1',
    title: 'Complete Core Security & Compliance Modules',
    description: 'Finish all mandatory internal data privacy, SOC2 compliance, and API security training modules.',
    category: 'Compliance',
    progress: 100,
    status: 'Completed',
    dueDate: 'Day 3',
    metric: '5 of 5 modules completed',
    owner: 'SecOps Team',
    priority: 'High',
  },
  {
    id: 'g-2',
    title: 'Setup Local Dev Environment & Smoke Test',
    description: 'Verify Node.js backend, Vite React frontend, Supabase credentials, and environment variables.',
    category: 'Engineering',
    progress: 100,
    status: 'Completed',
    dueDate: 'Day 5',
    metric: '100% services operational',
    owner: 'Platform Dev',
    priority: 'High',
  },
  {
    id: 'g-3',
    title: 'Evidence-Linked Chatpot Citation System',
    description: 'Implement multi-source RAG context ingestion for public GitHub repositories and Google Drive files.',
    category: 'Core Feature',
    progress: 85,
    status: 'In Progress',
    dueDate: 'Week 2',
    metric: '3 of 4 sources verified',
    owner: 'Sarah Chen (Mentor)',
    priority: 'High',
  },
  {
    id: 'g-4',
    title: 'Optimize Gemini LLM Model Fallback Cascade',
    description: 'Ensure graceful degradation across gemini-2.0, gemini-3.5, and gemini-3.8 with zero downtime.',
    category: 'AI Engine',
    progress: 90,
    status: 'In Progress',
    dueDate: 'Week 2',
    metric: '< 450ms fallback latency',
    owner: 'Alex Rivera',
    priority: 'Medium',
  },
  {
    id: 'g-5',
    title: 'Achieve 90%+ Test Coverage for Auth & Chat APIs',
    description: 'Construct end-to-end unit and integration test suites validating Supabase JWT and Chatpot endpoints.',
    category: 'Quality',
    progress: 60,
    status: 'At Risk',
    dueDate: 'Week 3',
    metric: '68% / 90% coverage',
    owner: 'Alex Rivera',
    priority: 'High',
  },
];

const initialMilestones = [
  {
    id: 'm-1',
    phase: 'Phase 1',
    title: 'Orientation & Architecture Deep-Dive',
    timeframe: 'Days 1 – 3',
    status: 'Completed',
    summary: 'Initial repo checkout, environment verification, and security onboarding.',
    deliverables: [
      { id: 'd-1', text: 'Clone repository and install client + server dependencies', completed: true },
      { id: 'd-2', text: 'Configure Supabase Auth credentials & local .env files', completed: true },
      { id: 'd-3', text: 'Review high-level system architecture and database schemas', completed: true },
      { id: 'd-4', text: 'Verify Gemini API keys and initial smoke test passes', completed: true },
    ],
  },
  {
    id: 'm-2',
    phase: 'Phase 2',
    title: 'Evidence-Linked Ingestion & Chatpot Pipeline',
    timeframe: 'Days 4 – 12',
    status: 'In Progress',
    summary: 'Connecting GitHub REST API and Google Drive text extractors to the Gemini prompt context.',
    deliverables: [
      { id: 'd-5', text: 'Implement multi-source ingestion in Express backend', completed: true },
      { id: 'd-6', text: 'Design citations verification cards in React frontend', completed: true },
      { id: 'd-7', text: 'Add interactive source validation & status badges', completed: true },
      { id: 'd-8', text: 'Support direct Google Drive public documents export format', completed: false },
    ],
  },
  {
    id: 'm-3',
    phase: 'Phase 3',
    title: 'Performance Optimization & Resilient Fallbacks',
    timeframe: 'Days 13 – 20',
    status: 'Upcoming',
    summary: 'Hardening error recovery, response latency optimization, and rate limiting.',
    deliverables: [
      { id: 'd-9', text: 'Model fallback cascade across Gemini 2.0, 3.5, and 3.8 flash', completed: true },
      { id: 'd-10', text: 'Implement client-side caching for analyzed repo metadata', completed: false },
      { id: 'd-11', text: 'Add telemetry logging and response latency trackers', completed: false },
      { id: 'd-12', text: 'Cross-browser accessibility testing (a11y audit)', completed: false },
    ],
  },
  {
    id: 'm-4',
    phase: 'Phase 4',
    title: 'Production Staging & Final Capstone Demo',
    timeframe: 'Days 21 – 30',
    status: 'Upcoming',
    summary: 'Final intern capstone presentation, deployment to staging, and documentation handoff.',
    deliverables: [
      { id: 'd-13', text: 'Finalize developer onboarding manual and API references', completed: false },
      { id: 'd-14', text: 'Staging deployment and end-to-end smoke verification', completed: false },
      { id: 'd-15', text: 'Deliver capstone demo to engineering mentors and team leads', completed: false },
      { id: 'd-16', text: 'Gather feedback and create transition backlog tickets', completed: false },
    ],
  },
];

const strategicAlignments = [
  {
    id: 'align-1',
    pillar: 'AI-Augmented Developer Tooling',
    companyGoal: 'Reduce new engineer onboarding ramp-up duration by 60% through AI automation.',
    teamObjective: 'Deliver an interactive, evidence-backed knowledge assistant for company codebases.',
    internContribution: 'Built the Chatpot multi-source RAG engine connecting GitHub repos and Drive docs with verified citations.',
    metric: 'Ramp-up reduced from 21 days → 4 days',
    alignmentScore: '98% Direct Alignment',
    badgeColor: 'emerald',
  },
  {
    id: 'align-2',
    pillar: 'Platform Reliability & Performance',
    companyGoal: 'Maintain 99.95% API uptime across all internal developer portals.',
    teamObjective: 'Implement zero-downtime resilient model fallback cascades for LLM operations.',
    internContribution: 'Engineered automatic failover across Gemini 2.0, 3.5, and 3.8 models with in-memory retry handling.',
    metric: 'Zero API 500 downtime recorded',
    alignmentScore: '95% Direct Alignment',
    badgeColor: 'indigo',
  },
  {
    id: 'align-3',
    pillar: 'Security & Zero-Trust Governance',
    companyGoal: 'Enforce enterprise authentication and granular role-based access control.',
    teamObjective: 'Standardize client-side authentication with Supabase JWT and safe session recovery.',
    internContribution: 'Refactored signup/login flow with resilient error recovery and demo sandbox profiles.',
    metric: '100% compliance with access audit',
    alignmentScore: '92% Direct Alignment',
    badgeColor: 'amber',
  },
];

const initialDependencies = [
  {
    id: 'dep-1',
    title: 'Google Drive API Service Account Quota Approval',
    category: 'Cloud Infrastructure',
    severity: 'Moderate',
    status: 'Resolved',
    blockedBy: 'DevOps / Cloud Architecture Team',
    impact: 'Allows higher volume Drive metadata fetches for large team documents.',
    eta: 'Resolved yesterday',
  },
  {
    id: 'dep-2',
    title: 'Supabase Production Row Level Security Policies',
    category: 'Security & Auth',
    severity: 'Critical',
    status: 'In Review',
    blockedBy: 'SecOps Audit Team',
    impact: 'Enforces database-level isolation between different intern cohorts.',
    eta: 'ETA: Nov 14, 2026',
  },
  {
    id: 'dep-3',
    title: 'GitHub App Organization OAuth Client ID',
    category: 'API Access',
    severity: 'High',
    status: 'Blocked',
    blockedBy: 'IT Platform Administration',
    impact: 'Lifts unauthenticated GitHub rate limits from 60 req/hr to 5,000 req/hr.',
    eta: 'Awaiting Admin Approval',
  },
  {
    id: 'dep-4',
    title: 'Design System Figma Component Tokens Sync',
    category: 'Design System',
    severity: 'Low',
    status: 'Resolved',
    blockedBy: 'Core UI/UX Squad',
    impact: 'Standardizes color tokens and typography with main company design system.',
    eta: 'Completed',
  },
];

const defaultProjectAnalysis = {
  repository: 'OnboardAI / Core Workspace Engine',
  description: 'AI-assisted onboarding platform providing evidence-linked codebase comprehension, intern milestone tracking, and automated timesheet estimation.',
  primaryLanguage: 'JavaScript / React 19',
  stars: 142,
  forks: 29,
  topics: ['developer-onboarding', 'rag-citations', 'gemini-api', 'react-19', 'supabase-auth'],
  filesAnalyzed: [
    'README.md',
    'server/server.js',
    'client/src/App.jsx',
    'client/src/index.css',
    'package.json',
  ],
  summary: {
    overview: [
      'Interactive intern onboarding portal streamlining knowledge discovery across repositories and documentation.',
      'Evidence-linked Chatpot AI engine capable of citing verified line numbers and source URLs from ingested code and Drive docs.',
      'Real-time goals tracking, milestone roadmap checklists, and cross-team dependency management.',
      'Integrated timesheet activity estimator analyzing GitHub commit velocity and engineering effort.',
    ],
    architecture: [
      'Frontend Client: React 19 single-page application built on Vite with Tailwind CSS v4 styling and Lucide icons.',
      'API Gateway: Express.js server providing CORS-enabled REST endpoints for chat, repository analysis, and source validation.',
      'AI Retrieval Engine: Google GenAI SDK integrating Gemini 2.0/3.5/3.8 Flash with multi-model automatic failover.',
      'Authentication & Cloud Storage: Supabase GoTrue authentication with JWT session persistence and PostgreSQL data layer.',
      'External Data Connectors: GitHub REST API v3 for tree/blob extraction and Google Drive v3 for document exports.',
    ],
    techStack: [
      'React 19 & Vite: Fast HMR development and modern concurrent UI rendering pipeline.',
      'Tailwind CSS v4: Utility-first design system with responsive layouts and accessible contrast ratios.',
      'Google Gemini API (@google/genai): State-of-the-art multimodal reasoning with sub-second token generation.',
      'Supabase & PostgreSQL: Managed authentication, Row Level Security (RLS), and real-time database listeners.',
      'Node.js & Express: Lightweight asynchronous server runtime for proxying API requests and sanitizing untrusted inputs.',
    ],
    keyFeatures: [
      'Evidence-Linked AI Chatpot: Dual-pane interface with verifiable source snippets, line numbers, and direct GitHub/Drive links.',
      'Automated Project Summarizer: Instant point-form extraction of overview, architecture, stack, and features from public repos.',
      'Goal & Milestone Tracker: Interactive OKR target tracking with milestone roadmap phases and deliverable checklists.',
      'Cross-Team Dependency Matrix: Real-time blocker resolution tracker with priority badges and status toggles.',
      'Demo Sandbox & Supabase Auth: One-click intern test sign-in alongside secure email/password credential management.',
    ],
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState('projects');
  const [activeGoalTab, setActiveGoalTab] = useState('targets');
  const [activeProjectTab, setActiveProjectTab] = useState('overview');
  const [activeIssueTab, setActiveIssueTab] = useState('bugs');
  const [activeIdeaTab, setActiveIdeaTab] = useState('overview');
  const [activeTimesheetTab, setActiveTimesheetTab] = useState('deadline');
  const [timesheetDeadline, setTimesheetDeadline] = useState('');
  const [timesheetNow, setTimesheetNow] = useState(Date.now());
  const [timesheetEstimate, setTimesheetEstimate] = useState(null);
  const [timesheetLoading, setTimesheetLoading] = useState(false);
  const [timesheetError, setTimesheetError] = useState('');
  const [ideaRepositoryUrl, setIdeaRepositoryUrl] = useState('');
  const [ideaSummary, setIdeaSummary] = useState(null);
  const [ideaLoading, setIdeaLoading] = useState(false);
  const [ideaError, setIdeaError] = useState('');
  const [projectSearch, setProjectSearch] = useState('');
  const [dependencyResolved, setDependencyResolved] = useState(false);
  const [chatQuery, setChatQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatRepoUrl, setChatRepoUrl] = useState('');
  const [chatGdriveUrl, setChatGdriveUrl] = useState('');
  const [connectedSources, setConnectedSources] = useState({ github: null, gdrive: null });
  const [sourcesValidating, setSourcesValidating] = useState(false);
  const [sourcesError, setSourcesError] = useState('');
  const [showSourcesPanel, setShowSourcesPanel] = useState(true);
  const [authMode, setAuthMode] = useState('signin');
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(Boolean(supabase));
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [resendingConfirmation, setResendingConfirmation] = useState(false);
  const [authError, setAuthError] = useState('');
  const [signOutError, setSignOutError] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [fullName, setFullName] = useState('');
  const [chatSubmitting, setChatSubmitting] = useState(false);
  const [employerName, setEmployerName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  const [goalsList, setGoalsList] = useState(initialGoals);
  const [goalsFilter, setGoalsFilter] = useState('all');
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('Engineering');
  const [newGoalMetric, setNewGoalMetric] = useState('');
  const [newGoalDueDate, setNewGoalDueDate] = useState('');

  const [milestonesList, setMilestonesList] = useState(initialMilestones);
  const [dependenciesList, setDependenciesList] = useState(initialDependencies);
  const [showAddDepModal, setShowAddDepModal] = useState(false);
  const [newDepTitle, setNewDepTitle] = useState('');
  const [newDepCategory, setNewDepCategory] = useState('Cloud Infrastructure');
  const [newDepSeverity, setNewDepSeverity] = useState('Moderate');
  const [newDepBlockedBy, setNewDepBlockedBy] = useState('');

  const [copiedSummary, setCopiedSummary] = useState(false);

  const handleToggleGoal = (goalId) => {
    setGoalsList((prev) =>
      prev.map((goal) => {
        if (goal.id !== goalId) return goal;
        const isDone = goal.status === 'Completed';
        return {
          ...goal,
          status: isDone ? 'In Progress' : 'Completed',
          progress: isDone ? 50 : 100,
        };
      })
    );
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    const newGoal = {
      id: `g-${Date.now()}`,
      title: newGoalTitle.trim(),
      description: 'Custom team target created during onboarding session.',
      category: newGoalCategory,
      progress: 0,
      status: 'In Progress',
      dueDate: newGoalDueDate.trim() || 'Next Sprint',
      metric: newGoalMetric.trim() || 'Pending verification',
      owner: authUser?.email ? authUser.email.split('@')[0] : 'Current Intern',
      priority: 'Medium',
    };
    setGoalsList((prev) => [newGoal, ...prev]);
    setNewGoalTitle('');
    setNewGoalMetric('');
    setNewGoalDueDate('');
    setShowAddGoalModal(false);
  };

  const handleToggleDeliverable = (milestoneId, deliverableId) => {
    setMilestonesList((prev) =>
      prev.map((milestone) => {
        if (milestone.id !== milestoneId) return milestone;
        const updatedDeliverables = milestone.deliverables.map((item) =>
          item.id === deliverableId ? { ...item, completed: !item.completed } : item
        );
        const completedCount = updatedDeliverables.filter((d) => d.completed).length;
        const total = updatedDeliverables.length;
        const pct = Math.round((completedCount / total) * 100);
        const newStatus = pct === 100 ? 'Completed' : pct > 0 ? 'In Progress' : 'Upcoming';
        return {
          ...milestone,
          deliverables: updatedDeliverables,
          status: newStatus,
        };
      })
    );
  };

  const handleToggleDependency = (depId) => {
    setDependenciesList((prev) =>
      prev.map((dep) => {
        if (dep.id !== depId) return dep;
        const isResolved = dep.status === 'Resolved';
        return {
          ...dep,
          status: isResolved ? 'Blocked' : 'Resolved',
          eta: isResolved ? 'Re-opened just now' : 'Resolved just now',
        };
      })
    );
  };

  const handleAddDependency = (e) => {
    e.preventDefault();
    if (!newDepTitle.trim()) return;
    const newDep = {
      id: `dep-${Date.now()}`,
      title: newDepTitle.trim(),
      category: newDepCategory,
      severity: newDepSeverity,
      status: 'Blocked',
      blockedBy: newDepBlockedBy.trim() || 'Cross-functional Team',
      impact: 'Identified during active sprint planning.',
      eta: 'In Investigation',
    };
    setDependenciesList((prev) => [newDep, ...prev]);
    setNewDepTitle('');
    setNewDepBlockedBy('');
    setShowAddDepModal(false);
  };

  const handleCopySummary = (text) => {
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  useEffect(() => {
    if (!supabase) return undefined;

    let active = true;
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (active) {
        if (error) setAuthError(getAuthErrorMessage(error));
        setAuthUser(session?.user ?? null);
        setTimesheetDeadline(toLocalDateTimeInput(session?.user?.user_metadata?.timesheet_deadline));
        setAuthLoading(false);
      }
    }).catch((error) => {
      if (active) {
        setAuthError(getAuthErrorMessage(error));
        setAuthLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setAuthUser(session?.user ?? null);
      setTimesheetDeadline(toLocalDateTimeInput(session?.user?.user_metadata?.timesheet_deadline));
      setAuthLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (activeTab !== 'timesheet') return undefined;
    const timerId = window.setInterval(() => setTimesheetNow(Date.now()), 1000);
    return () => window.clearInterval(timerId);
  }, [activeTab]);

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    if (!supabase) {
      setAuthError('Supabase is not configured. Please check your environment variables.');
      return;
    }

    setAuthError('');
    setAuthMessage('');
    setAuthSubmitting(true);

    try {
      let deadlineIso = null;
      if (timesheetDeadline) {
        const parsed = new Date(timesheetDeadline);
        if (!Number.isNaN(parsed.getTime())) {
          deadlineIso = parsed.toISOString();
        }
      }

      if (authMode === 'signup') {
        const metadata = {
          full_name: fullName.trim(),
          employer_name: employerName.trim(),
          job_title: jobTitle.trim(),
        };
        if (deadlineIso) {
          metadata.timesheet_deadline = deadlineIso;
        }

        const { data, error } = await supabase.auth.signUp({
          email: authEmail.trim(),
          password: authPassword,
          options: {
            emailRedirectTo: window.location.origin,
            data: metadata,
          },
        });
        if (error) throw error;
        if (data?.session) {
          setAuthUser(data.user);
          if (deadlineIso) {
            setTimesheetDeadline(toLocalDateTimeInput(deadlineIso));
          }
        } else if (data?.user) {
          setAuthMessage('Account created! Please check your email to confirm your account, or sign in.');
          setAuthMode('signin');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail.trim(),
          password: authPassword,
        });
        if (error) throw error;

        let user = data?.user;
        if (deadlineIso && user) {
          try {
            const { data: updatedUser } = await supabase.auth.updateUser({
              data: { timesheet_deadline: deadlineIso },
            });
            if (updatedUser?.user) user = updatedUser.user;
          } catch (updateErr) {
            console.warn('Could not update deadline on sign in:', updateErr);
          }
        }

        const savedDeadline = user?.user_metadata?.timesheet_deadline;
        if (savedDeadline) {
          setTimesheetDeadline(toLocalDateTimeInput(savedDeadline));
        }
        setAuthUser(user);
      }
      setAuthPassword('');
    } catch (error) {
      setAuthError(getAuthErrorMessage(error));
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleDemoSignIn = () => {
    setAuthError('');
    setAuthMessage('');
    const demoUser = {
      id: 'demo-intern-01',
      email: 'alex.intern@onboardai.demo',
      user_metadata: {
        full_name: 'Alex Rivera (Demo Intern)',
        employer_name: 'Acme Technologies',
        job_title: 'Software Engineering Intern',
        timesheet_deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    };
    setTimesheetDeadline(toLocalDateTimeInput(demoUser.user_metadata.timesheet_deadline));
    setAuthUser(demoUser);
  };

  const handleResendConfirmation = async () => {
    if (!supabase || !authEmail) return;

    setAuthError('');
    setAuthMessage('');
    setResendingConfirmation(true);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: authEmail.trim(),
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) throw error;
      setAuthMessage('Supabase accepted the resend request, but delivery is not guaranteed by its default email service. Configure custom SMTP if the message does not arrive.');
    } catch (error) {
      setAuthError(getAuthErrorMessage(error));
    } finally {
      setResendingConfirmation(false);
    }
  };

  const handleSignOut = async () => {
    setSignOutError('');
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (error) {
      setSignOutError(getAuthErrorMessage(error));
    } finally {
      setAuthUser(null);
    }
  };

  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    setAuthError('');
    setAuthMessage('');
  };

  const handleValidateSources = async (customRepo, customGdrive) => {
    const repo = typeof customRepo === 'string' ? customRepo : chatRepoUrl;
    const gdrive = typeof customGdrive === 'string' ? customGdrive : chatGdriveUrl;
    if (!repo.trim() && !gdrive.trim()) {
      setSourcesError('Enter at least a GitHub repository URL or a Google Drive link.');
      return;
    }

    setSourcesValidating(true);
    setSourcesError('');
    try {
      const res = await fetch(`${apiBaseUrl}/api/chat/sources/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repositoryUrl: repo.trim(), gdriveUrl: gdrive.trim() }),
      });
      const data = await res.json();
      setConnectedSources({
        github: data.github,
        gdrive: data.gdrive,
      });
      if (data.errors && data.errors.length > 0) {
        setSourcesError(data.errors.join(' | '));
      }
    } catch (err) {
      setSourcesError(err.message || 'Failed to connect sources.');
    } finally {
      setSourcesValidating(false);
    }
  };

  const handleChatSubmit = async (e, customQuery) => {
    if (e) e.preventDefault();
    const query = (typeof customQuery === 'string' ? customQuery : chatQuery).trim();
    if (!query || chatSubmitting) return;

    setChatSubmitting(true);
    setChatQuery('');
    try {
      // Send real query with linked sources to the backend
      const res = await fetch(`${apiBaseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          repositoryUrl: chatRepoUrl.trim(),
          gdriveUrl: chatGdriveUrl.trim()
        }),
        signal: AbortSignal.timeout(60000),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Chatpot request failed (${res.status}).`);
      if (typeof data.answer !== 'string' || !data.answer.trim()) {
        throw new Error('Chatpot returned an invalid response. Please try again.');
      }

      // Auto update connected sources if detected
      if (data.connectedSources) {
        setConnectedSources(prev => ({
          github: data.connectedSources.github || prev.github,
          gdrive: data.connectedSources.gdrive || prev.gdrive
        }));
      }

      const evidenceArray = Array.isArray(data.evidence)
        ? data.evidence
        : data.evidence
          ? [data.evidence]
          : [];

      setChatHistory(prev => [
        ...prev,
        {
          user: query,
          ai: data.answer,
          evidence: evidenceArray,
          connectedSources: data.connectedSources,
          sourceErrors: data.sourceErrors,
        }
      ]);
    } catch (err) {
      console.error("API error:", err);
      setChatHistory(prev => [
        ...prev,
        {
          user: query,
          ai: err.name === 'TimeoutError'
            ? 'Chatpot took too long to respond. Please try again.'
            : err.message || `Unable to reach backend server at ${apiBaseUrl}.`,
          evidence: []
        }
      ]);
    } finally {
      setChatSubmitting(false);
    }
  };

  const handleIdeaSubmit = async (event) => {
    event.preventDefault();
    const repositoryUrl = ideaRepositoryUrl.trim();
    if (!repositoryUrl || ideaLoading) return;

    setIdeaError('');
    setIdeaSummary(null);
    setIdeaLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/ideas/summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repositoryUrl }),
        signal: AbortSignal.timeout(90000),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Repository summary failed (${response.status}).`);
      if (!data.repository || !data.summary) throw new Error('The server returned an incomplete repository summary.');
      setIdeaSummary(data);
    } catch (error) {
      setIdeaError(error.name === 'TimeoutError'
        ? 'Repository analysis took too long. Please try again.'
        : error.message || 'Unable to summarize this repository.');
    } finally {
      setIdeaLoading(false);
    }
  };

  const handleTimesheetEstimate = async () => {
    if (!ideaRepositoryUrl.trim() || timesheetLoading) return;
    setTimesheetError('');
    setTimesheetEstimate(null);
    setTimesheetLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/timesheet/activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repositoryUrl: ideaRepositoryUrl.trim() }),
        signal: AbortSignal.timeout(60000),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `GitHub activity request failed (${response.status}).`);
      if (typeof data.estimatedHours !== 'number' || typeof data.commitCount !== 'number') {
        throw new Error('GitHub returned an incomplete activity estimate.');
      }
      setTimesheetEstimate(data);
    } catch (error) {
      setTimesheetError(error.name === 'TimeoutError'
        ? 'GitHub activity lookup took too long. Please try again.'
        : error.message || 'Unable to estimate time from GitHub activity.');
    } finally {
      setTimesheetLoading(false);
    }
  };

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 text-sm text-slate-600" role="status">
        <LoaderCircle size={18} className="mr-3 animate-spin" aria-hidden="true" />
        Checking your session...
      </main>
    );
  }

  if (!authUser) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-5xl">
          <a href="/" className="inline-flex items-center gap-3 text-slate-900 no-underline">
            <span className="flex size-10 items-center justify-center rounded-md bg-indigo-600 text-white">
              <LayoutDashboard size={20} aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold">OnboardAI</span>
          </a>

          <section className="mt-8 grid overflow-hidden border border-slate-200 bg-white shadow-sm lg:mt-12 lg:grid-cols-[0.9fr_1.1fr]" aria-labelledby="auth-title">
            <div className="relative flex min-h-64 flex-col justify-between overflow-hidden bg-slate-900 p-7 text-white sm:p-9">
              <div className="absolute -right-12 -top-14 size-56 rounded-full border border-white/10" aria-hidden="true" />
              <div className="absolute -right-2 -top-4 size-36 rounded-full border border-white/10" aria-hidden="true" />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">Your work, in focus</p>
                <h1 className="mt-4 max-w-xs text-3xl font-semibold leading-tight">A clearer start to every workday.</h1>
              </div>
              <p className="relative mt-8 text-sm text-slate-300">Sign in to continue to your workspace, or create an account to get started.</p>
            </div>

            <div className="p-6 sm:p-9">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">MyWorkspace access</p>
                <h2 id="auth-title" className="mt-2 text-2xl font-semibold text-slate-900">
                  {authMode === 'signup' ? 'Create your account' : 'Sign in'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {authMode === 'signup' ? 'Add your work details to set up your profile.' : 'Enter your account details to continue.'}
                </p>
              </div>

              {!supabase && (
                <div className="mb-5 border-l-4 border-amber-500 bg-amber-50 p-3 text-sm leading-5 text-amber-950" role="status">
                  Supabase is not configured. Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to <code>client/.env.local</code>, then restart the client.
                </div>
              )}

              <div className="mb-6 grid grid-cols-2 border-b border-slate-200" role="tablist" aria-label="Account access">
                {[
                  { id: 'signin', label: 'Sign in' },
                  { id: 'signup', label: 'Create account' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    id={`auth-tab-${mode.id}`}
                    role="tab"
                    aria-selected={authMode === mode.id}
                    aria-controls="auth-tab-panel"
                    onClick={() => switchAuthMode(mode.id)}
                    className={`border-b-2 px-2 py-3 text-sm font-medium transition ${authMode === mode.id ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              <form
                id="auth-tab-panel"
                role="tabpanel"
                aria-labelledby={`auth-tab-${authMode}`}
                tabIndex={0}
                onSubmit={handleAuthSubmit}
                className="space-y-4"
              >
                {authMode === 'signup' && (
                  <>
                    <label className="block text-sm font-medium text-slate-700">
                      Full name
                      <span className="relative mt-1.5 block">
                        <UserRound size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                        <input type="text" name="name" autoComplete="name" required value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Your name" className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                      </span>
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      Employer / organization
                      <span className="relative mt-1.5 block">
                        <Building2 size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                        <input type="text" name="employer" autoComplete="organization" required value={employerName} onChange={(event) => setEmployerName(event.target.value)} placeholder="Company or organization" className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                      </span>
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      Job title
                      <span className="relative mt-1.5 block">
                        <BriefcaseBusiness size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                        <input type="text" name="job-title" autoComplete="organization-title" required value={jobTitle} onChange={(event) => setJobTitle(event.target.value)} placeholder="Your role" className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                      </span>
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      Timesheet submission deadline (optional)
                      <span className="relative mt-1.5 block">
                        <input
                          type="datetime-local"
                          name="timesheet-deadline"
                          value={timesheetDeadline}
                          onChange={(event) => setTimesheetDeadline(event.target.value)}
                          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                      </span>
                    </label>
                  </>
                )}

                <label className="block text-sm font-medium text-slate-700">
                  Email address
                  <span className="relative mt-1.5 block">
                    <Mail size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                    <input type="email" name="email" autoComplete="email" required value={authEmail} onChange={(event) => setAuthEmail(event.target.value)} placeholder="you@example.com" className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                  </span>
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Password
                  <span className="relative mt-1.5 block">
                    <LockKeyhole size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                    <input type="password" name="password" autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'} minLength={6} required value={authPassword} onChange={(event) => setAuthPassword(event.target.value)} placeholder="At least 6 characters" className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                  </span>
                </label>

                {authError && <p className="text-sm text-red-700" role="alert">{authError}</p>}
                {authMessage && <p className="text-sm text-emerald-700" role="status">{authMessage}</p>}

                <button type="submit" disabled={authSubmitting || !supabase} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
                  {authSubmitting ? <LoaderCircle size={17} className="animate-spin" aria-hidden="true" /> : null}
                  {authSubmitting ? 'Please wait...' : authMode === 'signup' ? 'Create account' : 'Sign in'}
                  {!authSubmitting && <ArrowRight size={17} aria-hidden="true" />}
                </button>
                {authMode === 'signup' && (
                  <button type="button" onClick={handleResendConfirmation} disabled={resendingConfirmation || !authEmail} className="w-full py-1 text-sm font-semibold text-indigo-700 underline decoration-indigo-300 underline-offset-4 hover:text-indigo-900 disabled:cursor-not-allowed disabled:text-slate-400">
                    {resendingConfirmation ? 'Sending confirmation...' : 'Already signed up? Resend confirmation email'}
                  </button>
                )}

                <div className="relative my-4 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <span className="relative bg-white px-2 text-xs uppercase tracking-wider text-slate-400">
                    Or
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleDemoSignIn}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  <UserRound size={16} aria-hidden="true" />
                  Explore with Demo Intern Account
                </button>
              </form>
              <p className="mt-5 text-center text-xs leading-5 text-slate-500">Your credentials are handled securely by Supabase Authentication.</p>
            </div>
          </section>
        </div>
      </main>
    );
  }
  
  return (
    <div className="dashboard-shell flex h-screen bg-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <aside className="workspace-sidebar w-64 bg-slate-900 text-white p-5 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-wide text-indigo-400 mb-8">OnboardAI</h1>
          <nav className="space-y-2">
            {[
              { id: 'workspace', label: 'MyWorkspace', icon: LayoutDashboard },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium transition ${
                    activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
            <div className="dashboard-nav-group">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                aria-current={activeTab === 'dashboard' ? 'page' : undefined}
                className={`flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium transition ${
                  activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <BriefcaseBusiness size={18} />
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('projects')}
                aria-current={activeTab === 'projects' ? 'page' : undefined}
                className={`dashboard-project-link flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium transition ${
                  activeTab === 'projects' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <CheckSquare size={18} />
                Projects
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('goals')}
                aria-current={activeTab === 'goals' ? 'page' : undefined}
                className={`dashboard-project-link flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium transition ${
                  activeTab === 'goals' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <CircleCheck size={18} />
                Goals
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('issues')}
                aria-current={activeTab === 'issues' ? 'page' : undefined}
                className={`dashboard-project-link flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium transition ${
                  activeTab === 'issues' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Bug size={18} />
                Issues
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ideas')}
                aria-current={activeTab === 'ideas' ? 'page' : undefined}
                className={`dashboard-project-link flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium transition ${
                  activeTab === 'ideas' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Lightbulb size={18} />
                Ideas
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('timesheet')}
                aria-current={activeTab === 'timesheet' ? 'page' : undefined}
                className={`dashboard-project-link flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium transition ${
                  activeTab === 'timesheet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Clock3 size={18} />
                Timesheet
              </button>
            </div>
            {[
              { id: 'chatpot', label: 'Chatpot AI', icon: MessageSquare },
              { id: 'teams', label: 'Team', icon: Users },
              { id: 'verification', label: 'Verification Gateway', icon: ShieldCheck },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium transition ${
                    activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="text-xs text-slate-500">v1.0.0 • OnboardAI Workspace</div>
      </aside>

      {/* Main Content View */}
      <main className="workspace-main flex-1 overflow-y-auto p-8">
        {activeTab === 'workspace' && (
          <div>
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">OnboardAI / Personal</p>
                <h2 className="text-3xl font-semibold text-slate-900">MyWorkspace</h2>
              </div>
              {authUser && (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
                >
                  <LogOut size={16} aria-hidden="true" />
                  Sign out
                </button>
              )}
            </div>
            {signOutError && <p className="mb-4 text-sm text-red-700" role="alert">{signOutError}</p>}
            {authError && <p className="mb-4 text-sm text-red-700" role="alert">{authError}</p>}

            {authLoading ? (
              <div className="flex min-h-72 items-center justify-center gap-3 text-sm text-slate-600" role="status">
                <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
                Checking your session...
              </div>
            ) : authUser ? (
              <section className="max-w-3xl border border-slate-200 bg-white shadow-sm" aria-labelledby="workspace-welcome-title">
                <div className="border-b border-slate-200 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <CircleCheck size={22} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 id="workspace-welcome-title" className="text-lg font-semibold text-slate-900">
                        Welcome{authUser.user_metadata?.full_name ? `, ${authUser.user_metadata.full_name}` : ''}
                      </h3>
                      <p className="text-sm text-slate-500">You’re signed in to your workspace.</p>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-5">
                  <dl className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        <Mail size={14} aria-hidden="true" /> Account email
                      </dt>
                      <dd className="mt-2 break-words text-sm text-slate-800">{authUser.email}</dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        <Building2 size={14} aria-hidden="true" /> Employer / organization
                      </dt>
                      <dd className="mt-2 text-sm text-slate-800">{authUser.user_metadata?.employer_name || 'Not provided'}</dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        <BriefcaseBusiness size={14} aria-hidden="true" /> Job title
                      </dt>
                      <dd className="mt-2 text-sm text-slate-800">{authUser.user_metadata?.job_title || 'Not provided'}</dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        <Clock3 size={14} aria-hidden="true" /> Timesheet submission deadline
                      </dt>
                      <dd className="mt-2 text-sm text-slate-800">
                        {authUser.user_metadata?.timesheet_deadline
                          ? new Date(authUser.user_metadata.timesheet_deadline).toLocaleString()
                          : 'Not set'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </section>
            ) : null}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div>
            <header className="dashboard-heading">
              <p className="dashboard-eyebrow">Overview / 5 workstreams</p>
              <h2 className="text-2xl font-bold mb-4 text-slate-800">Dashboard</h2>
            </header>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[
                { name: 'Projects', description: 'Active tracking module for projects.', progress: 68 },
                { name: 'Goals', description: 'Active tracking module for strategic goals.' },
                { name: 'Issues', description: 'Active tracking module for issue tracking.' },
                { name: 'Ideas', description: 'Active tracking module for community ideas.' },
                { name: 'Timesheet', description: 'Track your submission deadline and estimated time already given.' },
              ].map((item) => {
                const isNavigableItem = ['Projects', 'Goals', 'Issues', 'Ideas', 'Timesheet'].includes(item.name);
                const Module = isNavigableItem ? 'button' : 'div';
                const ModuleTopline = isNavigableItem ? 'span' : 'div';
                const ModuleTitle = isNavigableItem ? 'span' : 'h3';
                const ModuleDescription = isNavigableItem ? 'span' : 'p';

                return (
                  <Module
                    key={item.name}
                    {...(isNavigableItem ? { type: 'button', onClick: () => setActiveTab(item.name.toLowerCase()) } : {})}
                    className={`dashboard-module${isNavigableItem ? ' dashboard-module-button' : ''}`}
                  >
                    <ModuleTopline className="dashboard-module-topline">
                      <span className="dashboard-module-mark" aria-hidden="true" />
                      <span className="dashboard-module-kicker">Workstream</span>
                    </ModuleTopline>
                    <ModuleTitle className="dashboard-module-title">{item.name}</ModuleTitle>
                    <ModuleDescription className="dashboard-module-description">{item.description}</ModuleDescription>
                    {item.progress !== undefined && (
                      <div className="project-progress" aria-label={`Sample project completion ${item.progress}%`}>
                        <div className="project-progress-label">
                          <span>Sample project completion</span>
                          <strong>{item.progress}%</strong>
                        </div>
                        <div className="project-progress-track" role="progressbar" aria-valuenow={item.progress} aria-valuemin="0" aria-valuemax="100" aria-label="Sample project completion">
                          <span style={{ width: `${item.progress}%` }} />
                        </div>
                        <span className="project-progress-status">In progress · demo value</span>
                      </div>
                    )}
                  </Module>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="projects-view">
            <aside className="project-sidebar">
              <div className="project-search-box">
                <span className="project-search-icon" aria-hidden="true">⌕</span>
                <input
                  type="search"
                  aria-label="Search projects"
                  placeholder="Search projects..."
                  value={projectSearch}
                  onChange={(event) => setProjectSearch(event.target.value)}
                />
              </div>

              <div className="project-list-header">
                <span className="project-list-label">Projects</span>
                <button
                  type="button"
                  className="project-list-button"
                  aria-label="Add project (not available yet)"
                  title="Project creation is not available yet"
                  disabled
                >
                  +
                </button>
              </div>

              {'Customer Portal Redesign'.toLowerCase().includes(projectSearch.trim().toLowerCase()) ? (
                <div className="project-item active-project-item" aria-current="true">
                  <span className="project-item-name">Customer Portal Redesign</span>
                </div>
              ) : (
                <p className="project-search-empty" role="status">No projects match your search.</p>
              )}
            </aside>

            <section className="project-detail-panel" aria-label="Customer Portal Redesign overview">
              {!dependencyResolved && (
                <div className="project-alert">
                  <span className="project-alert-badge" aria-hidden="true">!</span>
                  <span>External dependency (1)</span>
                  <small>Pre-requisites outside this project&apos;s direct control.</small>
                  <button type="button" onClick={() => setDependencyResolved(true)}>Mark as resolved</button>
                </div>
              )}
              {dependencyResolved && (
                <div className="project-alert project-alert-resolved" role="status">
                  External dependency marked as resolved.
                </div>
              )}

              <div className="project-header-row">
                <div>
                  <div className="project-breadcrumb">Projects</div>
                  <h2>Customer Portal Redesign</h2>
                </div>
                <div className="project-header-meta">
                  <span>Jul 30, 2026</span>
                  <span>Created Sep 10, 2026 by P.</span>
                </div>
              </div>

              <div className="project-summary">
                <div className="project-progress-ring" role="img" aria-label="58 percent complete">
                  <div className="project-progress-ring-inner">
                    <span>58%</span>
                  </div>
                </div>

                <div className="project-summary-text">
                  <h3>Rebuild the self-service customer portal with a new design experience for Atlas Retail Group.</h3>
                  <div className="project-status-pills">
                    <span className="status-pill green"><i aria-hidden="true" />5 Done</span>
                    <span className="status-pill gray"><i aria-hidden="true" />2 In Progress</span>
                    <span className="status-pill blue"><i aria-hidden="true" />4 To Do</span>
                    <span className="status-pill red"><i aria-hidden="true" />1 Blocked</span>
                  </div>
                </div>
              </div>

              <div className="project-tabs" role="tablist" aria-label="Project sections">
                {projectSections.map((tab) => (
                  <button
                    key={tab.id}
                    id={`project-tab-${tab.id}`}
                    type="button"
                    role="tab"
                    aria-selected={activeProjectTab === tab.id}
                    aria-controls="project-tab-panel"
                    className={`project-tab${activeProjectTab === tab.id ? ' active' : ''}`}
                    onClick={() => setActiveProjectTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <section
                id="project-tab-panel"
                className="project-tab-panel"
                role="tabpanel"
                aria-labelledby={`project-tab-${activeProjectTab}`}
                tabIndex={0}
              >
                {activeProjectTab === 'overview' && (
                  <>
                    <div className="project-overview-grid">
                      <div className="overview-card">
                        <div className="overview-card-icon blue" aria-hidden="true">✓</div>
                        <div className="overview-card-content">
                          <strong>12</strong>
                          <span>Total Tasks</span>
                        </div>
                      </div>
                      <div className="overview-card">
                        <div className="overview-card-icon red" aria-hidden="true">!</div>
                        <div className="overview-card-content">
                          <strong>4</strong>
                          <span>Overdue</span>
                        </div>
                      </div>
                      <div className="overview-card">
                        <div className="overview-card-icon green" aria-hidden="true">%</div>
                        <div className="overview-card-content">
                          <strong>58%</strong>
                          <span>Completion Rate</span>
                        </div>
                      </div>
                    </div>

                    <div className="project-task-panel">
                      <div className="project-task-header">
                        <h4>Tasks</h4>
                        <button type="button" onClick={() => setActiveProjectTab('tasks')}>View all →</button>
                      </div>
                      <div className="task-list">
                        <div className="task-row"><span>To Do</span><span className="task-count">4</span><div className="task-progress" role="progressbar" aria-label="To do tasks" aria-valuenow="33" aria-valuemin="0" aria-valuemax="100"><span style={{ width: '33%' }} /></div></div>
                        <div className="task-row"><span>In Progress</span><span className="task-count">2</span><div className="task-progress" role="progressbar" aria-label="In progress tasks" aria-valuenow="17" aria-valuemin="0" aria-valuemax="100"><span style={{ width: '17%' }} /></div></div>
                        <div className="task-row"><span>Completed</span><span className="task-count">5</span><div className="task-progress" role="progressbar" aria-label="Completed tasks" aria-valuenow="42" aria-valuemin="0" aria-valuemax="100"><span style={{ width: '42%' }} /></div></div>
                        <div className="task-row"><span>Blocked</span><span className="task-count">1</span><div className="task-progress" role="progressbar" aria-label="Blocked tasks" aria-valuenow="8" aria-valuemin="0" aria-valuemax="100"><span style={{ width: '8%' }} /></div></div>
                      </div>
                    </div>
                  </>
                )}
                {activeProjectTab === 'tasks' && (
                  <div className="project-task-panel project-task-panel-standalone">
                    <div className="project-task-header"><h4>Project tasks</h4></div>
                    <div className="task-list">
                      <div className="task-row"><span>To Do</span><span className="task-count">4</span><div className="task-progress" role="progressbar" aria-label="To do tasks" aria-valuenow="33" aria-valuemin="0" aria-valuemax="100"><span style={{ width: '33%' }} /></div></div>
                      <div className="task-row"><span>In Progress</span><span className="task-count">2</span><div className="task-progress" role="progressbar" aria-label="In progress tasks" aria-valuenow="17" aria-valuemin="0" aria-valuemax="100"><span style={{ width: '17%' }} /></div></div>
                      <div className="task-row"><span>Completed</span><span className="task-count">5</span><div className="task-progress" role="progressbar" aria-label="Completed tasks" aria-valuenow="42" aria-valuemin="0" aria-valuemax="100"><span style={{ width: '42%' }} /></div></div>
                      <div className="task-row"><span>Blocked</span><span className="task-count">1</span><div className="task-progress" role="progressbar" aria-label="Blocked tasks" aria-valuenow="8" aria-valuemin="0" aria-valuemax="100"><span style={{ width: '8%' }} /></div></div>
                    </div>
                  </div>
                )}
                {activeProjectTab === 'documents' && (
                  <div className="project-empty-state">
                    <h3>Project documents</h3>
                    <p>No documents have been added to this project yet.</p>
                  </div>
                )}
                {activeProjectTab === 'plan' && (
                  <div className="project-empty-state">
                    <h3>Project plan</h3>
                    <p>No plan items have been added to this project yet.</p>
                  </div>
                )}
              </section>
            </section>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="space-y-6">
            <header className="dashboard-heading">
              <p className="dashboard-eyebrow">Dashboard / Goals & Objectives</p>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Intern Onboarding Goals & Milestones</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Track individual targets, visualize roadmap phases, align with organizational OKRs, and resolve team dependencies.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    Sprint Active • Week 2
                  </span>
                </div>
              </div>
            </header>

            {/* Quick KPI Overview Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Overall Progress</span>
                  <TrendingUp size={16} className="text-indigo-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-800">
                    {Math.round(goalsList.reduce((acc, g) => acc + g.progress, 0) / (goalsList.length || 1))}%
                  </span>
                  <span className="text-xs text-emerald-600 font-semibold">+12% this week</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.round(goalsList.reduce((acc, g) => acc + g.progress, 0) / (goalsList.length || 1))}%`,
                    }}
                  />
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Targets Status</span>
                  <Target size={16} className="text-emerald-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-800">
                    {goalsList.filter((g) => g.status === 'Completed').length}/{goalsList.length}
                  </span>
                  <span className="text-xs text-slate-500">Completed</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 truncate">
                  {goalsList.filter((g) => g.status === 'In Progress').length} in progress • {goalsList.filter((g) => g.status === 'At Risk').length} at risk
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Active Phase</span>
                  <Milestone size={16} className="text-indigo-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-slate-800">Phase 2</span>
                  <span className="text-xs text-indigo-600 font-semibold">75% done</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 truncate">RAG Pipeline & Chatpot Ingestion</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Dependencies</span>
                  <GitMerge size={16} className="text-amber-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-800">
                    {dependenciesList.filter((d) => d.status !== 'Resolved').length}
                  </span>
                  <span className="text-xs text-amber-600 font-semibold">Action needed</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 truncate">
                  {dependenciesList.filter((d) => d.status === 'Resolved').length} resolved
                </p>
              </div>
            </div>

            {/* Sub-Tab Navigation Pills */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3" role="tablist" aria-label="Goal sections">
              {goalSections.map((tab) => {
                const IconComponent = tab.icon || Target;
                const isActive = activeGoalTab === tab.id;
                let badge = null;
                if (tab.id === 'targets') badge = goalsList.length;
                if (tab.id === 'roadmap') badge = 'Phase 2';
                if (tab.id === 'alignment') badge = '3 OKRs';
                if (tab.id === 'dependencies') {
                  const unresolved = dependenciesList.filter((d) => d.status !== 'Resolved').length;
                  badge = unresolved > 0 ? `${unresolved} Blocked` : 'All Clear';
                }

                return (
                  <button
                    key={tab.id}
                    id={`goal-tab-${tab.id}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="goal-tab-panel"
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                    }`}
                    onClick={() => setActiveGoalTab(tab.id)}
                  >
                    <IconComponent size={16} className={isActive ? 'text-white' : 'text-slate-500'} />
                    <span>{tab.label}</span>
                    {badge && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          isActive
                            ? 'bg-indigo-500/50 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Sub-Tab Content Panels */}
            <section
              id="goal-tab-panel"
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs"
              role="tabpanel"
              aria-labelledby={`goal-tab-${activeGoalTab}`}
              tabIndex={0}
            >
              {/* SUB-TAB 1: TARGETS */}
              {activeGoalTab === 'targets' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-semibold uppercase text-slate-400 mr-2 flex items-center gap-1">
                        <Filter size={12} /> Filter:
                      </span>
                      {[
                        { id: 'all', label: `All (${goalsList.length})` },
                        { id: 'in-progress', label: `In Progress (${goalsList.filter((g) => g.status === 'In Progress').length})` },
                        { id: 'completed', label: `Completed (${goalsList.filter((g) => g.status === 'Completed').length})` },
                        { id: 'at-risk', label: `At Risk (${goalsList.filter((g) => g.status === 'At Risk').length})` },
                      ].map((filter) => (
                        <button
                          key={filter.id}
                          type="button"
                          onClick={() => setGoalsFilter(filter.id)}
                          className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                            goalsFilter === filter.id
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAddGoalModal(!showAddGoalModal)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs"
                    >
                      <Plus size={14} />
                      {showAddGoalModal ? 'Close Form' : 'Add Custom Target'}
                    </button>
                  </div>

                  {/* Add New Target Inline Form */}
                  {showAddGoalModal && (
                    <form onSubmit={handleAddGoal} className="bg-slate-50 border border-indigo-100 rounded-xl p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                          <Target size={16} className="text-indigo-600" />
                          Create New Onboarding Target
                        </h4>
                        <span className="text-xs text-slate-500">Will be assigned to your active sprint</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Target Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Build integration tests for timesheet service"
                            value={newGoalTitle}
                            onChange={(e) => setNewGoalTitle(e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                          <select
                            value={newGoalCategory}
                            onChange={(e) => setNewGoalCategory(e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-indigo-500"
                          >
                            <option value="Engineering">Engineering</option>
                            <option value="Core Feature">Core Feature</option>
                            <option value="AI Engine">AI Engine</option>
                            <option value="Compliance">Compliance</option>
                            <option value="Quality">Quality & Testing</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Key Measurable Metric</label>
                          <input
                            type="text"
                            placeholder="e.g. 95% pass rate on CI/CD pipeline"
                            value={newGoalMetric}
                            onChange={(e) => setNewGoalMetric(e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Target Due Date</label>
                          <input
                            type="text"
                            placeholder="e.g. End of Week 3"
                            value={newGoalDueDate}
                            onChange={(e) => setNewGoalDueDate(e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-indigo-500"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddGoalModal(false)}
                          className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-xs cursor-pointer"
                        >
                          Save Target
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Target Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {goalsList
                      .filter((goal) => {
                        if (goalsFilter === 'all') return true;
                        if (goalsFilter === 'in-progress') return goal.status === 'In Progress';
                        if (goalsFilter === 'completed') return goal.status === 'Completed';
                        if (goalsFilter === 'at-risk') return goal.status === 'At Risk';
                        return true;
                      })
                      .map((goal) => {
                        const isDone = goal.status === 'Completed';
                        const isAtRisk = goal.status === 'At Risk';

                        return (
                          <div
                            key={goal.id}
                            className={`border rounded-xl p-4 transition-all duration-200 hover:shadow-xs flex flex-col justify-between ${
                              isDone
                                ? 'bg-emerald-50/30 border-emerald-200'
                                : isAtRisk
                                ? 'bg-amber-50/20 border-amber-200'
                                : 'bg-white border-slate-200'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                                      goal.category === 'Compliance'
                                        ? 'bg-purple-100 text-purple-700'
                                        : goal.category === 'AI Engine'
                                        ? 'bg-blue-100 text-blue-700'
                                        : goal.category === 'Core Feature'
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : goal.category === 'Quality'
                                        ? 'bg-amber-100 text-amber-700'
                                        : 'bg-slate-100 text-slate-700'
                                    }`}
                                  >
                                    {goal.category}
                                  </span>
                                  <span
                                    className={`text-2xs uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${
                                      goal.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                                    }`}
                                  >
                                    {goal.priority}
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleToggleGoal(goal.id)}
                                  title={isDone ? 'Mark as In Progress' : 'Mark as Completed'}
                                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                                    isDone
                                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                      : isAtRisk
                                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                  }`}
                                >
                                  {isDone ? (
                                    <>
                                      <CheckCircle2 size={13} className="text-emerald-600" />
                                      Done
                                    </>
                                  ) : (
                                    <>
                                      <Clock3 size={13} className="text-slate-500" />
                                      {goal.status}
                                    </>
                                  )}
                                </button>
                              </div>

                              <h4
                                className={`text-sm font-bold mb-1.5 ${
                                  isDone ? 'text-slate-600 line-through' : 'text-slate-800'
                                }`}
                              >
                                {goal.title}
                              </h4>
                              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                                {goal.description}
                              </p>
                            </div>

                            <div className="pt-2 border-t border-slate-100 space-y-2">
                              <div className="flex items-center justify-between text-xs text-slate-600">
                                <span className="flex items-center gap-1 font-medium">
                                  <Target size={12} className="text-indigo-600" />
                                  {goal.metric}
                                </span>
                                <span className="font-bold">{goal.progress}%</span>
                              </div>

                              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-1.5 rounded-full transition-all duration-500 ${
                                    isDone ? 'bg-emerald-600' : isAtRisk ? 'bg-amber-500' : 'bg-indigo-600'
                                  }`}
                                  style={{ width: `${goal.progress}%` }}
                                />
                              </div>

                              <div className="flex items-center justify-between text-2xs text-slate-400 pt-1">
                                <span className="flex items-center gap-1">
                                  <Clock3 size={11} /> Due: {goal.dueDate}
                                </span>
                                <span className="flex items-center gap-1">
                                  <UserRound size={11} /> {goal.owner}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: MILESTONE ROADMAP */}
              {activeGoalTab === 'roadmap' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-bold text-slate-800">4-Week Structured Intern Milestones</h3>
                      <p className="text-xs text-slate-500">
                        Check off each deliverable as you complete your onboarding and feature contributions.
                      </p>
                    </div>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                      Total Deliverables:{' '}
                      {milestonesList.reduce((acc, m) => acc + m.deliverables.filter((d) => d.completed).length, 0)} of{' '}
                      {milestonesList.reduce((acc, m) => acc + m.deliverables.length, 0)} Completed
                    </span>
                  </div>

                  <div className="space-y-4">
                    {milestonesList.map((milestone, idx) => {
                      const completedCount = milestone.deliverables.filter((d) => d.completed).length;
                      const totalCount = milestone.deliverables.length;
                      const pct = Math.round((completedCount / totalCount) * 100);
                      const isComplete = pct === 100;
                      const isInProgress = pct > 0 && pct < 100;

                      return (
                        <div
                          key={milestone.id}
                          className={`border rounded-xl p-5 transition-all ${
                            isComplete
                              ? 'bg-emerald-50/20 border-emerald-200'
                              : isInProgress
                              ? 'bg-white border-indigo-200 shadow-xs ring-1 ring-indigo-50'
                              : 'bg-slate-50/50 border-slate-200'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                            <div className="flex items-center gap-2.5">
                              <span
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                  isComplete
                                    ? 'bg-emerald-600 text-white'
                                    : isInProgress
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-200 text-slate-600'
                                }`}
                              >
                                {idx + 1}
                              </span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-bold text-slate-800">{milestone.title}</h4>
                                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                    {milestone.timeframe}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">{milestone.summary}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span
                                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                  isComplete
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : isInProgress
                                    ? 'bg-indigo-100 text-indigo-800'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {isComplete ? 'Completed' : isInProgress ? 'In Progress' : 'Upcoming'}
                              </span>
                              <span className="text-xs font-bold text-slate-700 min-w-10 text-right">{pct}%</span>
                            </div>
                          </div>

                          {/* Progress Track */}
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mb-4">
                            <div
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                isComplete ? 'bg-emerald-600' : 'bg-indigo-600'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>

                          {/* Deliverables Checklist */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                            {milestone.deliverables.map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => handleToggleDeliverable(milestone.id, item.id)}
                                className={`flex items-start gap-2.5 text-left p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                                  item.completed
                                    ? 'bg-emerald-50/60 text-slate-600 hover:bg-emerald-100/60'
                                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-100'
                                }`}
                              >
                                <span className="mt-0.5 shrink-0">
                                  {item.completed ? (
                                    <CheckCircle2 size={15} className="text-emerald-600" />
                                  ) : (
                                    <span className="w-3.5 h-3.5 rounded border border-slate-400 block" />
                                  )}
                                </span>
                                <span className={item.completed ? 'line-through text-slate-500' : 'font-medium'}>
                                  {item.text}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SUB-TAB 3: ALIGNMENT */}
              {activeGoalTab === 'alignment' && (
                <div className="space-y-6">
                  <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-start gap-3">
                    <Compass size={20} className="text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-indigo-950">Strategic OKR & Milestone Mapping</h4>
                      <p className="text-xs text-indigo-700 mt-1 leading-relaxed">
                        Connecting your individual onboarding sprint deliverables directly to high-level organizational OKRs. Each task you complete drives tangible engineering velocity and platform stability.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {strategicAlignments.map((alignment) => (
                      <div
                        key={alignment.id}
                        className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-300 transition-colors shadow-xs"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                                alignment.badgeColor === 'emerald'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : alignment.badgeColor === 'indigo'
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              Strategic Pillar
                            </span>
                            <h4 className="text-sm font-bold text-slate-800">{alignment.pillar}</h4>
                          </div>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            <CheckCircle2 size={13} />
                            {alignment.alignmentScore}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-slate-50 rounded-lg p-3">
                            <span className="text-2xs uppercase tracking-wider font-bold text-slate-400 block mb-1">
                              🏢 Company Objective (OKR)
                            </span>
                            <p className="text-xs text-slate-700 font-medium leading-relaxed">
                              {alignment.companyGoal}
                            </p>
                          </div>

                          <div className="bg-indigo-50/40 rounded-lg p-3 border border-indigo-100">
                            <span className="text-2xs uppercase tracking-wider font-bold text-indigo-500 block mb-1">
                              👥 Team Objective
                            </span>
                            <p className="text-xs text-indigo-950 font-medium leading-relaxed">
                              {alignment.teamObjective}
                            </p>
                          </div>

                          <div className="bg-emerald-50/40 rounded-lg p-3 border border-emerald-100">
                            <span className="text-2xs uppercase tracking-wider font-bold text-emerald-600 block mb-1">
                              ⭐ Your Contribution & Impact
                            </span>
                            <p className="text-xs text-slate-800 font-medium leading-relaxed">
                              {alignment.internContribution}
                            </p>
                            <div className="mt-2 text-2xs font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded inline-block">
                              Impact: {alignment.metric}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-TAB 4: DEPENDENCIES */}
              {activeGoalTab === 'dependencies' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-bold text-slate-800">Cross-Team Blockers & External Requirements</h3>
                      <p className="text-xs text-slate-500">
                        Track permissions, third-party API rate limits, and cross-functional team handoffs.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddDepModal(!showAddDepModal)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs"
                    >
                      <Plus size={14} />
                      {showAddDepModal ? 'Close Form' : 'Log Dependency'}
                    </button>
                  </div>

                  {/* Add Dependency Inline Form */}
                  {showAddDepModal && (
                    <form onSubmit={handleAddDependency} className="bg-slate-50 border border-indigo-100 rounded-xl p-4 space-y-3">
                      <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        <GitMerge size={16} className="text-indigo-600" />
                        Log New Blocker or External Dependency
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. AWS S3 bucket write permissions"
                            value={newDepTitle}
                            onChange={(e) => setNewDepTitle(e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Severity</label>
                          <select
                            value={newDepSeverity}
                            onChange={(e) => setNewDepSeverity(e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-indigo-500"
                          >
                            <option value="Critical">Critical</option>
                            <option value="High">High</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Low">Low</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                          <select
                            value={newDepCategory}
                            onChange={(e) => setNewDepCategory(e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-indigo-500"
                          >
                            <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                            <option value="Security & Auth">Security & Auth</option>
                            <option value="API Access">API Access</option>
                            <option value="Design System">Design System</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Blocked By (Team or Person)</label>
                          <input
                            type="text"
                            placeholder="e.g. SecOps / Cloud Architecture"
                            value={newDepBlockedBy}
                            onChange={(e) => setNewDepBlockedBy(e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-indigo-500"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowAddDepModal(false)}
                          className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-xs cursor-pointer"
                        >
                          Save Blocker
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Dependency List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dependenciesList.map((dep) => {
                      const isResolved = dep.status === 'Resolved';
                      return (
                        <div
                          key={dep.id}
                          className={`border rounded-xl p-4 transition-all ${
                            isResolved
                              ? 'bg-slate-50/70 border-slate-200 opacity-80'
                              : dep.severity === 'Critical'
                              ? 'bg-rose-50/30 border-rose-200'
                              : 'bg-white border-slate-200 shadow-xs'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                  dep.severity === 'Critical'
                                    ? 'bg-rose-100 text-rose-700'
                                    : dep.severity === 'High'
                                    ? 'bg-amber-100 text-amber-700'
                                    : dep.severity === 'Moderate'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {dep.severity}
                              </span>
                              <span className="text-xs text-slate-500 font-medium">{dep.category}</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleToggleDependency(dep.id)}
                              className={`text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                                isResolved
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : dep.status === 'In Review'
                                  ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                  : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                              }`}
                            >
                              {isResolved ? '✓ Resolved' : dep.status}
                            </button>
                          </div>

                          <h4 className={`text-sm font-bold mb-1.5 ${isResolved ? 'text-slate-600 line-through' : 'text-slate-800'}`}>
                            {dep.title}
                          </h4>
                          <p className="text-xs text-slate-500 mb-3">{dep.impact}</p>

                          <div className="flex items-center justify-between text-2xs text-slate-500 pt-2 border-t border-slate-100">
                            <span className="font-semibold text-slate-600">
                              Blocked by: <span className="font-normal">{dep.blockedBy}</span>
                            </span>
                            <span>{dep.eta}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'issues' && (
          <div>
            <header className="dashboard-heading">
              <p className="dashboard-eyebrow">Dashboard / Issues</p>
              <h2 className="text-2xl font-bold mb-4 text-slate-800">Issues</h2>
            </header>
            <div className="goal-tabs" role="tablist" aria-label="Issue sections">
              {issueSections.map((tab) => (
                <button
                  key={tab.id}
                  id={`issue-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={activeIssueTab === tab.id}
                  aria-controls="issue-tab-panel"
                  className={`goal-tab${activeIssueTab === tab.id ? ' active' : ''}`}
                  onClick={() => setActiveIssueTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <section
              id="issue-tab-panel"
              className="goal-tab-panel issue-tab-panel"
              role="tabpanel"
              aria-labelledby={`issue-tab-${activeIssueTab}`}
              tabIndex={0}
            >
              {activeIssueTab === 'bugs' && (
                <>
                  <h3>All bugs</h3>
                  {bugs.length > 0 ? (
                    <ul className="issue-list">
                      {bugs.map((bug) => (
                        <li key={bug.id}>
                          <strong>{bug.title}</strong>
                          <span>{bug.status}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="issue-empty-state" role="status">No bugs reported.</p>
                  )}
                </>
              )}
              {activeIssueTab === 'blockers' && (
                <>
                  <h3>Blockers</h3>
                  {blockers.length > 0 ? (
                    <ul className="issue-list">
                      {blockers.map((blocker) => (
                        <li key={blocker.id}>
                          <strong>{blocker.title}</strong>
                          <span>{blocker.status}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="issue-empty-state" role="status">No blockers reported.</p>
                  )}
                </>
              )}
              {activeIssueTab === 'resolution-history' && (
                <>
                  <h3>Resolution History</h3>
                  <div className="issue-metrics">
                    <article className="overview-card">
                      <div className="overview-card-icon red" aria-hidden="true">!</div>
                      <div className="overview-card-content">
                        <strong>0</strong>
                        <span>Overdue Resolutions</span>
                      </div>
                    </article>
                    <article className="overview-card">
                      <div className="overview-card-icon blue" aria-hidden="true">h</div>
                      <div className="overview-card-content">
                        <strong>—</strong>
                        <span>Average Resolution Time (hrs)</span>
                      </div>
                    </article>
                  </div>
                  <p className="issue-empty-state" role="status">No resolved issues yet, so average resolution time is unavailable.</p>
                </>
              )}
            </section>
          </div>
        )}

        {activeTab === 'ideas' && (() => {
          const currentIdea = ideaSummary || defaultProjectAnalysis;
          const isDefaultBlueprint = !ideaSummary;

          return (
            <div className="space-y-6">
              <header className="dashboard-heading">
                <p className="dashboard-eyebrow">Dashboard / Ideas & Repository Intelligence</p>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Project Blueprint & Architecture Intelligence</h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Extract structured, point-form architecture blueprints, component data flows, and tech stacks from any public GitHub repository.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      <Sparkles size={14} className="text-indigo-600" />
                      Gemini Multimodal Intelligence
                    </span>
                  </div>
                </div>
              </header>

              {/* GitHub Repository Input Form & Preset Pills */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <FileCode size={14} className="text-indigo-600" />
                    Analyze GitHub Repository
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-2xs font-semibold text-slate-400 mr-1">Presets:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIdeaRepositoryUrl('');
                        setIdeaSummary(null);
                        setIdeaError('');
                      }}
                      className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium transition-colors cursor-pointer border border-indigo-200"
                    >
                      ⭐ OnboardAI Core
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIdeaRepositoryUrl('https://github.com/octocat/Hello-World');
                        setIdeaError('');
                      }}
                      className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium transition-colors cursor-pointer"
                    >
                      🐙 octocat/Hello-World
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIdeaRepositoryUrl('https://github.com/facebook/react');
                        setIdeaError('');
                      }}
                      className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium transition-colors cursor-pointer"
                    >
                      ⚛️ facebook/react
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIdeaRepositoryUrl('https://github.com/expressjs/express');
                        setIdeaError('');
                      }}
                      className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium transition-colors cursor-pointer"
                    >
                      ⚡ expressjs/express
                    </button>
                  </div>
                </div>

                <form onSubmit={handleIdeaSubmit} className="space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        id="idea-repository-url"
                        type="url"
                        required
                        value={ideaRepositoryUrl}
                        onChange={(event) => {
                          setIdeaRepositoryUrl(event.target.value);
                          setTimesheetEstimate(null);
                          setTimesheetError('');
                        }}
                        placeholder="https://github.com/owner/repository"
                        className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-indigo-500 focus:bg-white text-slate-800"
                      />
                      <FileCode size={16} className="absolute left-3 top-3 text-slate-400" />
                    </div>

                    <button
                      type="submit"
                      disabled={ideaLoading || !ideaRepositoryUrl.trim()}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      {ideaLoading ? (
                        <>
                          <LoaderCircle size={16} className="animate-spin" />
                          Analyzing Codebase...
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          Analyze Repository
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-2xs text-slate-400">
                    Gemini AI will read the repository README and primary source code files to construct a structured blueprint.
                  </p>
                </form>

                {ideaError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
                    <AlertTriangle size={15} className="shrink-0" />
                    <span>{ideaError}</span>
                  </div>
                )}
              </div>

              {/* Repository Metadata Header Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        {currentIdea.repository}
                        {currentIdea.repository?.includes('/') && !isDefaultBlueprint && (
                          <a
                            href={`https://github.com/${currentIdea.repository}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-indigo-600 transition-colors"
                            title="Open repository on GitHub"
                          >
                            <ExternalLink size={15} />
                          </a>
                        )}
                      </h3>

                      {isDefaultBlueprint ? (
                        <span className="text-2xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                          <CheckCircle2 size={11} className="text-indigo-600" />
                          Active Workspace Blueprint
                        </span>
                      ) : (
                        <span className="text-2xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 size={11} className="text-emerald-600" />
                          Live Analysis Complete
                        </span>
                      )}

                      {currentIdea.primaryLanguage && (
                        <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {currentIdea.primaryLanguage}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                      {currentIdea.description || 'No description provided by repository owner.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="inline-flex items-center gap-1 text-2xs font-semibold px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-200">
                      <FileCode size={13} className="text-slate-500" />
                      {currentIdea.filesAnalyzed?.length || 0} Files Analyzed
                    </span>
                  </div>
                </div>

                {/* Topics / Tags */}
                {currentIdea.topics && currentIdea.topics.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100">
                    <span className="text-2xs font-semibold text-slate-400 mr-1">Topics:</span>
                    {currentIdea.topics.map((topic, i) => (
                      <span key={i} className="text-2xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                        #{topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Sub-Tab Navigation Pills */}
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3" role="tablist" aria-label="Project idea sections">
                {ideaSections.map((tab) => {
                  const IconComponent = tab.icon || Sparkles;
                  const isActive = activeIdeaTab === tab.id;
                  const pointsCount = (currentIdea.summary[tab.summaryKey] || []).length;

                  return (
                    <button
                      key={tab.id}
                      id={`idea-tab-${tab.id}`}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls="idea-tab-panel"
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                      }`}
                      onClick={() => setActiveIdeaTab(tab.id)}
                    >
                      <IconComponent size={16} className={isActive ? 'text-white' : 'text-slate-500'} />
                      <span>{tab.label}</span>
                      {pointsCount > 0 && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            isActive ? 'bg-indigo-500/50 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {pointsCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Sub-Tab Content Section */}
              <section
                id="idea-tab-panel"
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs"
                role="tabpanel"
                aria-labelledby={`idea-tab-${activeIdeaTab}`}
                tabIndex={0}
                aria-live="polite"
              >
                {ideaLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                    <LoaderCircle size={32} className="animate-spin text-indigo-600" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Reading repository contents...</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm">
                        Fetching file tree, extracting README and key modules, and prompting Google Gemini for evidence-linked summaries.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* SUB-TAB 1: OVERALL VIEW */}
                    {activeIdeaTab === 'overview' && (
                      <div className="space-y-6">
                        {/* 4 Health & Maturity Tiles */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                              🏗️ Architecture
                            </span>
                            <span className="text-xs font-bold text-slate-800">Client-Server Modular</span>
                            <span className="text-2xs text-slate-500 block mt-0.5">Vite + Node Express</span>
                          </div>

                          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                              ⏱️ Onboarding Time
                            </span>
                            <span className="text-xs font-bold text-slate-800">3 – 5 Business Days</span>
                            <span className="text-2xs text-emerald-600 font-semibold block mt-0.5">Fast ramp-up path</span>
                          </div>

                          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                              🤖 AI Capabilities
                            </span>
                            <span className="text-xs font-bold text-slate-800">Gemini 2.0 / 3.5 / 3.8</span>
                            <span className="text-2xs text-indigo-600 font-semibold block mt-0.5">Evidence-linked RAG</span>
                          </div>

                          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                              🛡️ Auth & Storage
                            </span>
                            <span className="text-xs font-bold text-slate-800">Supabase + PostgreSQL</span>
                            <span className="text-2xs text-purple-600 font-semibold block mt-0.5">JWT & RLS Policies</span>
                          </div>
                        </div>

                        {/* Executive Bullet Points */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                              <Sparkles size={16} className="text-indigo-600" />
                              Executive Summary Points
                            </h4>
                            <span className="text-xs text-slate-500 font-medium">
                              {(currentIdea.summary.overview || []).length} Key Points
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(currentIdea.summary.overview || []).map((point, index) => (
                              <div
                                key={index}
                                className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 flex items-start gap-3 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all"
                              >
                                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                  {index + 1}
                                </div>
                                <p className="text-xs text-slate-700 leading-relaxed font-medium">{point}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Quick Action Toolbar */}
                        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab('chatpot');
                                if (ideaRepositoryUrl.trim()) setChatRepoUrl(ideaRepositoryUrl.trim());
                              }}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
                            >
                              <MessageSquare size={14} />
                              Ask Chatpot About This Repo
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const allSummary = [
                                  `# Project Blueprint: ${currentIdea.repository}`,
                                  `\n## Overview:`,
                                  ...(currentIdea.summary.overview || []).map((p) => `- ${p}`),
                                  `\n## Architecture:`,
                                  ...(currentIdea.summary.architecture || []).map((p) => `- ${p}`),
                                  `\n## Tech Stack:`,
                                  ...(currentIdea.summary.techStack || []).map((p) => `- ${p}`),
                                  `\n## Key Features:`,
                                  ...(currentIdea.summary.keyFeatures || []).map((p) => `- ${p}`),
                                ].join('\n');
                                handleCopySummary(allSummary);
                              }}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                            >
                              {copiedSummary ? (
                                <>
                                  <Check size={14} className="text-emerald-600" />
                                  <span className="text-emerald-700">Copied to Clipboard!</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={14} />
                                  Copy Markdown Blueprint
                                </>
                              )}
                            </button>
                          </div>

                          <span className="text-2xs text-slate-400">
                            Verified from repository source files • Evidence-backed
                          </span>
                        </div>
                      </div>
                    )}

                    {/* SUB-TAB 2: ARCHITECTURE */}
                    {activeIdeaTab === 'architecture' && (
                      <div className="space-y-6">
                        {/* Interactive Visual Pipeline Diagram */}
                        <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                              <Layers size={14} className="text-indigo-400" />
                              System Architecture & Data Flow
                            </span>
                            <span className="text-2xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                              REST • RAG • Citations
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
                            <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3">
                              <span className="text-2xs text-indigo-400 font-bold block mb-1">Layer 1</span>
                              <h5 className="text-xs font-bold text-white">Client SPA</h5>
                              <p className="text-2xs text-slate-400 mt-1">React 19 + Tailwind v4 + Vite HMR</p>
                            </div>

                            <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3">
                              <span className="text-2xs text-indigo-400 font-bold block mb-1">Layer 2</span>
                              <h5 className="text-xs font-bold text-white">API Gateway</h5>
                              <p className="text-2xs text-slate-400 mt-1">Node.js + Express + CORS</p>
                            </div>

                            <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3">
                              <span className="text-2xs text-indigo-400 font-bold block mb-1">Layer 3</span>
                              <h5 className="text-xs font-bold text-white">AI Engine</h5>
                              <p className="text-2xs text-slate-400 mt-1">Gemini 2.0/3.5/3.8 Flash Cascade</p>
                            </div>

                            <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3">
                              <span className="text-2xs text-indigo-400 font-bold block mb-1">Layer 4</span>
                              <h5 className="text-xs font-bold text-white">Cloud Connectors</h5>
                              <p className="text-2xs text-slate-400 mt-1">GitHub API + Google Drive + Supabase</p>
                            </div>
                          </div>
                        </div>

                        {/* 4 Architectural Highlights */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles size={16} className="text-indigo-600" />
                              <h5 className="text-xs font-bold text-slate-800">Evidence-Linked Retrieval (RAG)</h5>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              Ingests source files dynamically, builds an untrusted context sandbox, and formats verifiable citations with line numbers and repository URLs.
                            </p>
                          </div>

                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <ShieldCheck size={16} className="text-emerald-600" />
                              <h5 className="text-xs font-bold text-slate-800">Multi-Model Fallback Cascade</h5>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              Protects against upstream provider quotas by sequentially trying Gemini 2.0 Flash, 2.0 Flash Lite, 3.5 Flash, and 3.8 Flash with zero service downtime.
                            </p>
                          </div>

                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Code2 size={16} className="text-blue-600" />
                              <h5 className="text-xs font-bold text-slate-800">Stateless REST Architecture</h5>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              Clean decoupling between client frontend and backend Express server, facilitating horizontal scalability and effortless cloud containerization.
                            </p>
                          </div>

                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <LockKeyhole size={16} className="text-purple-600" />
                              <h5 className="text-xs font-bold text-slate-800">Zero-Trust Input Sanitization</h5>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              Enforces URL validation, protects sensitive files (.env, private keys, lockfiles), and applies in-memory rate limiting to defend against abuse.
                            </p>
                          </div>
                        </div>

                        {/* Extracted Architecture Breakdown Points */}
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <Layers size={16} className="text-indigo-600" />
                            Extracted Architecture Blueprint
                          </h4>
                          <div className="space-y-2.5">
                            {(currentIdea.summary.architecture || []).map((point, index) => (
                              <div
                                key={index}
                                className="bg-white border border-slate-200 rounded-lg p-3.5 flex items-start gap-3 hover:border-slate-300 transition-colors"
                              >
                                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                  {index + 1}
                                </span>
                                <p className="text-xs text-slate-700 leading-relaxed font-medium">{point}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUB-TAB 3: TECH STACK */}
                    {activeIdeaTab === 'tech-stack' && (
                      <div className="space-y-6">
                        {/* Categorized Tech Stack Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                <FileCode size={14} className="text-indigo-600" />
                                Frontend
                              </span>
                              <span className="text-2xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">Client</span>
                            </div>
                            <ul className="text-xs text-slate-600 space-y-1">
                              <li>• <strong>React 19</strong> (Concurrent rendering)</li>
                              <li>• <strong>Tailwind CSS v4</strong> (CSS styling engine)</li>
                              <li>• <strong>Vite 8</strong> (Fast bundling & HMR)</li>
                              <li>• <strong>Lucide React</strong> (Accessible icons)</li>
                            </ul>
                          </div>

                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                <Cpu size={14} className="text-blue-600" />
                                Backend Gateway
                              </span>
                              <span className="text-2xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">Server</span>
                            </div>
                            <ul className="text-xs text-slate-600 space-y-1">
                              <li>• <strong>Node.js v24</strong> (Async I/O runtime)</li>
                              <li>• <strong>Express.js</strong> (REST routing & middleware)</li>
                              <li>• <strong>CORS & dotenv</strong> (Cross-origin & secrets)</li>
                              <li>• <strong>AbortSignal</strong> (Request timeout bounds)</li>
                            </ul>
                          </div>

                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                <Sparkles size={14} className="text-purple-600" />
                                AI & Intelligence
                              </span>
                              <span className="text-2xs font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700">GenAI</span>
                            </div>
                            <ul className="text-xs text-slate-600 space-y-1">
                              <li>• <strong>@google/genai SDK</strong> (Gemini Client)</li>
                              <li>• <strong>Gemini 2.0 / 3.5 / 3.8 Flash</strong></li>
                              <li>• <strong>In-Memory Model Cascade</strong></li>
                              <li>• <strong>RAG Citations Parser</strong></li>
                            </ul>
                          </div>

                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                <Database size={14} className="text-emerald-600" />
                                Database & Auth
                              </span>
                              <span className="text-2xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Cloud</span>
                            </div>
                            <ul className="text-xs text-slate-600 space-y-1">
                              <li>• <strong>Supabase Auth</strong> (GoTrue JWT tokens)</li>
                              <li>• <strong>PostgreSQL</strong> (Managed relational store)</li>
                              <li>• <strong>Row Level Security</strong> (Tenant isolation)</li>
                              <li>• <strong>Demo Intern Fallback</strong> (Safe testing)</li>
                            </ul>
                          </div>

                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                <LinkIcon size={14} className="text-amber-600" />
                                External Connectors
                              </span>
                              <span className="text-2xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700">Integrations</span>
                            </div>
                            <ul className="text-xs text-slate-600 space-y-1">
                              <li>• <strong>GitHub REST API v3</strong> (Tree & blob fetch)</li>
                              <li>• <strong>Google Drive v3 API</strong> (Document extract)</li>
                              <li>• <strong>Google Docs /export API</strong> (Direct text)</li>
                              <li>• <strong>Google Sheets /csv API</strong> (Tabular data)</li>
                            </ul>
                          </div>

                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                <ShieldCheck size={14} className="text-slate-600" />
                                Tooling & Quality
                              </span>
                              <span className="text-2xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">DevOps</span>
                            </div>
                            <ul className="text-xs text-slate-600 space-y-1">
                              <li>• <strong>ESLint 10</strong> (Code quality enforcement)</li>
                              <li>• <strong>Git & GitHub</strong> (Version control)</li>
                              <li>• <strong>PowerShell CI Scripts</strong> (Windows tooling)</li>
                              <li>• <strong>Tailwind Vite Plugin</strong> (Build optimizer)</li>
                            </ul>
                          </div>
                        </div>

                        {/* Extracted Tech Stack Points */}
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <Cpu size={16} className="text-indigo-600" />
                            Extracted Tech Stack Items from Codebase
                          </h4>
                          <div className="space-y-2">
                            {(currentIdea.summary.techStack || []).map((point, index) => (
                              <div
                                key={index}
                                className="bg-white border border-slate-200 rounded-lg p-3.5 flex items-start gap-3 hover:border-slate-300 transition-colors"
                              >
                                <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                  ✓
                                </span>
                                <p className="text-xs text-slate-700 leading-relaxed font-medium">{point}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUB-TAB 4: KEY FEATURES */}
                    {activeIdeaTab === 'key-features' && (
                      <div className="space-y-6">
                        {/* Feature Highlights Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                  <MessageSquare size={15} className="text-indigo-600" />
                                  Evidence-Linked Chatpot
                                </span>
                                <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                  Production Ready
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                                Dual-pane chat interface citing verified line numbers and source URLs from ingested GitHub repos and Google Drive documents.
                              </p>
                            </div>
                            <div className="text-2xs text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
                              <span>Impact: High Intern Value</span>
                              <span className="text-indigo-600 font-semibold cursor-pointer" onClick={() => setActiveTab('chatpot')}>
                                Test Feature →
                              </span>
                            </div>
                          </div>

                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                  <Sparkles size={15} className="text-purple-600" />
                                  Repository Blueprint Generator
                                </span>
                                <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                  Production Ready
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                                Automatically parses file trees and README files to generate point-form architectural blueprints, tech stacks, and feature lists.
                              </p>
                            </div>
                            <div className="text-2xs text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
                              <span>Impact: Immediate Knowledge Ramp</span>
                              <span className="text-purple-600 font-semibold">Active in Ideas Tab</span>
                            </div>
                          </div>

                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                  <Target size={15} className="text-emerald-600" />
                                  Goals & Milestone Roadmap
                                </span>
                                <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                  Production Ready
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                                Interactive target tracker, deliverable checklists across 4 milestone phases, strategic OKR alignment, and dependency tracker.
                              </p>
                            </div>
                            <div className="text-2xs text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
                              <span>Impact: Sprint Accountability</span>
                              <span className="text-emerald-600 font-semibold cursor-pointer" onClick={() => setActiveTab('goals')}>
                                View Goals →
                              </span>
                            </div>
                          </div>

                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                  <Clock3 size={15} className="text-amber-600" />
                                  Timesheet Activity Estimator
                                </span>
                                <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                                  Beta Active
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                                Evaluates GitHub commit velocity, author history, and code changes to estimate required engineering hours against submission deadlines.
                              </p>
                            </div>
                            <div className="text-2xs text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
                              <span>Impact: Worklog Automation</span>
                              <span className="text-amber-600 font-semibold cursor-pointer" onClick={() => setActiveTab('timesheet')}>
                                View Timesheet →
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Extracted Key Features Points */}
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <Boxes size={16} className="text-indigo-600" />
                            Extracted Key Features from Codebase
                          </h4>
                          <div className="space-y-2">
                            {(currentIdea.summary.keyFeatures || []).map((point, index) => (
                              <div
                                key={index}
                                className="bg-white border border-slate-200 rounded-lg p-3.5 flex items-start gap-3 hover:border-slate-300 transition-colors"
                              >
                                <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                  ✓
                                </span>
                                <p className="text-xs text-slate-700 leading-relaxed font-medium">{point}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </section>
            </div>
          );
        })()}

        {activeTab === 'timesheet' && (
          <div>
            <header className="dashboard-heading">
              <p className="dashboard-eyebrow">Dashboard / Timesheet</p>
              <h2 className="text-2xl font-bold mb-4 text-slate-800">Timesheet</h2>
            </header>
            <div className="goal-tabs" role="tablist" aria-label="Timesheet sections">
              {timesheetSections.map((tab) => (
                <button
                  key={tab.id}
                  id={`timesheet-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={activeTimesheetTab === tab.id}
                  aria-controls="timesheet-tab-panel"
                  className={`goal-tab${activeTimesheetTab === tab.id ? ' active' : ''}`}
                  onClick={() => setActiveTimesheetTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <section
              id="timesheet-tab-panel"
              className="goal-tab-panel timesheet-tab-panel"
              role="tabpanel"
              aria-labelledby={`timesheet-tab-${activeTimesheetTab}`}
              tabIndex={0}
              aria-live="polite"
            >
              {activeTimesheetTab === 'deadline' && (
                <>
                  <h3>Submission Deadline</h3>
                  {timesheetDeadline ? (
                    <>
                      <p className="timesheet-deadline-date">
                        Due {new Date(timesheetDeadline).toLocaleString()}
                      </p>
                      {new Date(timesheetDeadline).getTime() > timesheetNow ? (
                        <div className="timesheet-countdown" aria-label="Time remaining">
                          {Object.entries(formatCountdown(new Date(timesheetDeadline).getTime() - timesheetNow)).map(([unit, value]) => (
                            <div className="timesheet-countdown-unit" key={unit}>
                              <strong>{String(value).padStart(2, '0')}</strong>
                              <span>{unit}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="timesheet-overdue" role="status">This submission deadline has passed.</p>
                      )}
                    </>
                  ) : (
                    <p className="issue-empty-state">Set your submission deadline on the login screen to see the countdown.</p>
                  )}
                </>
              )}
              {activeTimesheetTab === 'time-given' && (
                <>
                  <h3>Time Already Given</h3>
                  <p className="timesheet-estimate-note">
                    This is a repository-wide estimate based on public GitHub commit timestamps, not a record of your actual work hours.
                  </p>
                  {!ideaRepositoryUrl && (
                    <div className="timesheet-repository-prompt">
                      <p>Analyze a public GitHub repository in Ideas first to estimate time from its commit activity.</p>
                      <button type="button" onClick={() => setActiveTab('ideas')}>Open Ideas</button>
                    </div>
                  )}
                  {ideaRepositoryUrl && (
                    <div className="timesheet-estimate-actions">
                      <p>Repository: <strong>{ideaSummary?.repository || ideaRepositoryUrl}</strong></p>
                      <button type="button" onClick={handleTimesheetEstimate} disabled={timesheetLoading}>
                        {timesheetLoading ? 'Calculating...' : 'Calculate estimate'}
                      </button>
                    </div>
                  )}
                  {timesheetError && <p className="idea-error" role="alert">{timesheetError}</p>}
                  {timesheetLoading && (
                    <p className="idea-loading"><LoaderCircle size={18} className="animate-spin" aria-hidden="true" />Checking repository commit activity...</p>
                  )}
                  {timesheetEstimate && (
                    <div className="timesheet-estimate-result">
                      <strong>{timesheetEstimate.estimatedHours.toFixed(1)} hrs</strong>
                      <span>Estimated repository activity time</span>
                      <p>
                        Based on {timesheetEstimate.commitCount} commits on the {timesheetEstimate.branch} branch of{' '}
                        <a href={timesheetEstimate.repositoryUrl} target="_blank" rel="noreferrer">{timesheetEstimate.repository}</a>.
                      </p>
                      <small>{timesheetEstimate.methodology}</small>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        )}

        {activeTab === 'chatpot' && (
          <div className="max-w-4xl flex flex-col h-[85vh]">
            {/* Chatpot Header with Knowledge Sources Toggle */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <MessageSquare size={24} className="text-indigo-600" aria-hidden="true" />
                  Chatpot AI (Evidence-Linked)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Multi-source intelligence powered by Gemini. Ingests GitHub repos &amp; Google Drive docs with verifiable citations.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSourcesPanel(prev => !prev)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                    showSourcesPanel
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <LinkIcon size={14} aria-hidden="true" />
                  {showSourcesPanel ? 'Hide Sources Panel' : 'Connect Repo / Drive'}
                  {(connectedSources.github || connectedSources.gdrive) && (
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleChatSubmit(null, 'Provide a comprehensive onboarding summary of the connected repository and Google Drive documentation, including architecture, key components, dependencies, and evidence citations.')}
                  disabled={chatSubmitting}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                  <Sparkles size={14} aria-hidden="true" />
                  Quick Summarize
                </button>
              </div>
            </div>

            {/* Knowledge Sources Ingestion Drawer */}
            {showSourcesPanel && (
              <div className="mb-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <FileText size={14} className="text-indigo-600" />
                    Knowledge Ingestion Sources (GitHub &amp; Google Drive)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Works with public GitHub repos and Google Docs set to &quot;Anyone with the link can view&quot;
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* GitHub Repository Input */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      GitHub Repository URL
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={chatRepoUrl}
                        onChange={(e) => setChatRepoUrl(e.target.value)}
                        placeholder="https://github.com/owner/repository"
                        className="w-full pl-3 pr-20 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setChatRepoUrl('https://github.com/octocat/Hello-World');
                          handleValidateSources('https://github.com/octocat/Hello-World', chatGdriveUrl);
                        }}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded font-medium transition"
                      >
                        Demo Repo
                      </button>
                    </div>
                  </div>

                  {/* Google Drive / Docs Input */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Google Drive / Docs Link
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={chatGdriveUrl}
                        onChange={(e) => setChatGdriveUrl(e.target.value)}
                        placeholder="https://docs.google.com/document/d/..."
                        className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Connect / Sync Button & Status Badges */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    {connectedSources.github ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                        <span className="size-2 rounded-full bg-emerald-500" />
                        <strong>Repo:</strong> {connectedSources.github.name} ({connectedSources.github.filesCount || connectedSources.github.files?.length || 1} files)
                        <button
                          type="button"
                          onClick={() => {
                            setChatRepoUrl('');
                            setConnectedSources(prev => ({ ...prev, github: null }));
                          }}
                          className="ml-1 text-emerald-600 hover:text-emerald-900 text-xs"
                          title="Remove source"
                        >
                          ✕
                        </button>
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">No external GitHub repo connected</span>
                    )}

                    {connectedSources.gdrive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium">
                        <span className="size-2 rounded-full bg-blue-500" />
                        <strong>Drive:</strong> {connectedSources.gdrive.title}
                        <button
                          type="button"
                          onClick={() => {
                            setChatGdriveUrl('');
                            setConnectedSources(prev => ({ ...prev, gdrive: null }));
                          }}
                          className="ml-1 text-blue-600 hover:text-blue-900 text-xs"
                          title="Remove source"
                        >
                          ✕
                        </button>
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">· No Google Drive doc connected</span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleValidateSources(chatRepoUrl, chatGdriveUrl)}
                    disabled={sourcesValidating || (!chatRepoUrl.trim() && !chatGdriveUrl.trim())}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sourcesValidating ? (
                      <>
                        <LoaderCircle size={13} className="animate-spin" aria-hidden="true" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw size={13} aria-hidden="true" />
                        <span>Sync Knowledge Sources</span>
                      </>
                    )}
                  </button>
                </div>

                {sourcesError && (
                  <p className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200" role="alert">
                    ⚠️ {sourcesError}
                  </p>
                )}
              </div>
            )}

            {/* Chat Messages Stream */}
            <div className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-slate-200 overflow-y-auto space-y-4 mb-4">
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col justify-center items-center text-center p-6 text-slate-500">
                  <div className="size-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3 shadow-inner">
                    <Sparkles size={24} aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-base mb-1">
                    Evidence-Linked Chatpot AI
                  </h3>
                  <p className="text-xs max-w-md text-slate-500 mb-6">
                    Connect any GitHub repository or Google Drive document above, or paste links directly into your prompt. Every statement is verified with clickable evidence citations.
                  </p>

                  <div className="w-full max-w-lg space-y-2 text-left">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Suggested Actions:
                    </p>
                    {[
                      '⚡ Summarize the connected codebase and Google Drive documentation',
                      'What is the project architecture and primary technology stack?',
                      'How do I start and run the application locally?',
                      'What are the key dependencies and authentication mechanisms used?'
                    ].map((prompt, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => handleChatSubmit(null, prompt)}
                        className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-xs text-slate-700 font-medium transition flex items-center justify-between group shadow-2xs"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-indigo-600 font-bold">›</span>
                          {prompt}
                        </span>
                        <ArrowRight size={14} className="text-slate-400 group-hover:text-indigo-600 transition" aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                chatHistory.map((item, idx) => (
                  <div key={idx} className="space-y-2.5">
                    {/* User Prompt */}
                    <div className="p-3 bg-indigo-50 text-indigo-950 rounded-lg self-end text-xs sm:text-sm font-medium border border-indigo-100 flex items-start gap-2">
                      <span className="size-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        You
                      </span>
                      <div className="flex-1 break-words leading-relaxed">{item.user}</div>
                    </div>

                    {/* AI Response */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm leading-relaxed text-slate-800 shadow-2xs">
                      <div className="flex items-center gap-2 mb-2 font-semibold text-slate-900 border-b border-slate-200/80 pb-2">
                        <span className="size-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                          AI
                        </span>
                        <span>Chatpot Response</span>
                        {item.connectedSources?.github && (
                          <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            Repo: {item.connectedSources.github.repository}
                          </span>
                        )}
                        {item.connectedSources?.gdrive && (
                          <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                            Drive: {item.connectedSources.gdrive.title}
                          </span>
                        )}
                      </div>

                      <div className="whitespace-pre-wrap leading-relaxed text-slate-700">
                        {item.ai}
                      </div>

                      {/* Verifiable Evidence Citations Section */}
                      {Array.isArray(item.evidence) && item.evidence.length > 0 && (
                        <div className="mt-3.5 pt-3 border-t border-slate-200">
                          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <FileText size={13} className="text-indigo-600" />
                            Verifiable Evidence Citations ({item.evidence.length})
                          </p>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {item.evidence.map((ev, eIdx) => (
                              <div
                                key={eIdx}
                                className="p-2.5 rounded-lg border border-indigo-200/80 bg-indigo-50/50 text-xs flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-center justify-between gap-1 mb-1">
                                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                      ev.source === 'github'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : ev.source === 'gdrive'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-indigo-100 text-indigo-800'
                                    }`}>
                                      {ev.source === 'github' ? '🐙 GitHub' : ev.source === 'gdrive' ? '📁 Google Drive' : '💻 Workspace'}
                                    </span>
                                    {ev.lines && (
                                      <span className="text-[10px] text-slate-500 font-mono">Lines {ev.lines}</span>
                                    )}
                                  </div>
                                  <p className="font-semibold text-slate-800 break-words">
                                    <code>{ev.file}</code>
                                  </p>
                                  {ev.snippet && (
                                    <p className="mt-1 text-[11px] text-slate-600 italic line-clamp-2">
                                      &quot;{ev.snippet}&quot;
                                    </p>
                                  )}
                                </div>
                                {ev.url && (
                                  <a
                                    href={ev.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 underline underline-offset-2 self-start"
                                  >
                                    <span>Verify source {ev.source === 'github' ? 'on GitHub' : 'in Google Drive'}</span>
                                    <ExternalLink size={11} aria-hidden="true" />
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}

              {chatSubmitting && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm flex items-center gap-2.5 text-slate-600 animate-pulse">
                  <LoaderCircle size={16} className="animate-spin text-indigo-600" aria-hidden="true" />
                  <span>Chatpot AI is ingesting sources and verifying evidence with Gemini...</span>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleChatSubmit} className="flex gap-2">
              <input
                type="text"
                value={chatQuery}
                onChange={(e) => setChatQuery(e.target.value)}
                placeholder="Ask about project architecture, or paste a GitHub/Google Drive URL to summarize..."
                className="flex-1 p-3 border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
              <button
                type="submit"
                disabled={chatSubmitting || !chatQuery.trim()}
                className="bg-indigo-600 text-white px-5 py-3 rounded-lg font-medium text-xs sm:text-sm hover:bg-indigo-700 transition disabled:cursor-not-allowed disabled:opacity-60 flex items-center gap-2 shadow-sm"
              >
                {chatSubmitting ? (
                  <>
                    <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
                    <span>Thinking...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} aria-hidden="true" />
                    <span>Ask AI</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'teams' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Team</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <p className="text-slate-600 text-sm">Real-time developer activity stream and task progression charts.</p>
            </div>
          </div>
        )}

        {activeTab === 'verification' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Human Verification Gateway</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <p className="text-slate-600 text-sm mb-4">Review newcomer code submissions before approving final merge.</p>
              <div className="p-4 border rounded-lg bg-slate-50 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-sm text-slate-800">PR #102: Database Connection Migration</h4>
                  <p className="text-xs text-slate-500">Submitted by Newbie Dev • Prompted via Chatpot AI</p>
                </div>
                <button 
                  onClick={() => alert('Submission Approved!')}
                  className="bg-emerald-600 text-white px-4 py-2 rounded text-xs font-medium hover:bg-emerald-700"
                >
                  Approve Sign-off
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}