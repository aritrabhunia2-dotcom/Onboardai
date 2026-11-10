import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Bug,
  CheckSquare,
  CircleCheck,
  Clock3,
  Lightbulb,
  LayoutDashboard,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Mail,
  MessageSquare,
  ShieldCheck,
  UserRound,
  Users,
} from 'lucide-react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const goalSections = [
  { id: 'targets', label: 'Targets', description: 'Set and track measurable outcomes for your team.' },
  { id: 'roadmap', label: 'Milestone Roadmap', description: 'Break goals into milestones and track progress over time.' },
  { id: 'alignment', label: 'Alignment', description: 'Connect team and individual goals to company priorities.' },
  { id: 'dependencies', label: 'Dependencies', description: 'Review the goals, teams, and milestones that depend on one another.' },
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
  { id: 'overview', label: 'Overall View', summaryKey: 'overview' },
  { id: 'architecture', label: 'Architecture', summaryKey: 'architecture' },
  { id: 'tech-stack', label: 'Tech Stack', summaryKey: 'techStack' },
  { id: 'key-features', label: 'Key Features', summaryKey: 'keyFeatures' },
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
  const activeGoalSection = goalSections.find((section) => section.id === activeGoalTab);
  const activeIdeaSection = ideaSections.find((section) => section.id === activeIdeaTab);

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
    if (!supabase) return;

    setAuthError('');
    setAuthMessage('');
    setAuthSubmitting(true);

    try {
      const deadlineIso = new Date(timesheetDeadline).toISOString();
      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              full_name: fullName.trim(),
              employer_name: employerName.trim(),
              job_title: jobTitle.trim(),
              timesheet_deadline: deadlineIso,
            },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setAuthMessage('Supabase accepted the signup. If the confirmation email does not arrive, configure custom SMTP in your Supabase project.');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });
        if (error) throw error;
        const { data: updatedUser, error: updateError } = await supabase.auth.updateUser({
          data: { timesheet_deadline: deadlineIso },
        });
        if (updateError) throw updateError;
        setTimesheetDeadline(toLocalDateTimeInput(updatedUser.user.user_metadata.timesheet_deadline));
        setAuthUser(updatedUser.user || data.user);
      }
      setAuthPassword('');
    } catch (error) {
      setAuthError(getAuthErrorMessage(error));
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!supabase || !authEmail) return;

    setAuthError('');
    setAuthMessage('');
    setResendingConfirmation(true);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: authEmail,
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
    if (!supabase) return;
    setSignOutError('');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) setSignOutError(getAuthErrorMessage(error));
    } catch (error) {
      setSignOutError(getAuthErrorMessage(error));
    }
  };

  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    setAuthError('');
    setAuthMessage('');
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    const query = chatQuery.trim();
    if (!query || chatSubmitting) return;

    setChatSubmitting(true);
    try {
      // Send real query to the Node/Express backend running on port 5000
      const res = await fetch(`${apiBaseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
        signal: AbortSignal.timeout(60000),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Chatpot request failed (${res.status}).`);
      if (typeof data.answer !== 'string' || !data.answer.trim()) {
        throw new Error('Chatpot returned an invalid response. Please try again.');
      }

      setChatHistory(prev => [
        ...prev,
        {
          user: query,
          ai: data.answer,
          evidence: data.evidence
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
          evidence: null
        }
      ]);
    } finally {
      setChatSubmitting(false);
      setChatQuery('');
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
                  </>
                )}

                <label className="block text-sm font-medium text-slate-700">
                  Timesheet submission deadline (your local time)
                  <span className="relative mt-1.5 block">
                    <input
                      type="datetime-local"
                      name="timesheet-deadline"
                      required
                      value={timesheetDeadline}
                      onChange={(event) => setTimesheetDeadline(event.target.value)}
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </span>
                </label>

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
                  </dl>
                </div>
              </section>
            ) : (
              <section className="grid max-w-5xl overflow-hidden border border-slate-200 bg-white shadow-sm lg:grid-cols-[0.9fr_1.1fr]" aria-labelledby="auth-title">
                <div className="relative flex min-h-64 flex-col justify-between overflow-hidden bg-slate-900 p-7 text-white sm:p-9">
                  <div className="absolute -right-12 -top-14 size-56 rounded-full border border-white/10" aria-hidden="true" />
                  <div className="absolute -right-2 -top-4 size-36 rounded-full border border-white/10" aria-hidden="true" />
                  <div className="relative">
                    <span className="inline-flex size-11 items-center justify-center rounded-md bg-indigo-500 text-white">
                      <LayoutDashboard size={21} aria-hidden="true" />
                    </span>
                    <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">Your work, in focus</p>
                    <h3 className="mt-3 max-w-xs text-2xl font-semibold leading-tight">A clearer start to every workday.</h3>
                  </div>
                  <p className="relative mt-8 text-sm text-slate-300">Create an account to make this workspace yours.</p>
                </div>

                <div className="p-6 sm:p-9">
                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">MyWorkspace access</p>
                    <h3 id="auth-title" className="mt-2 text-2xl font-semibold text-slate-900">
                      {authMode === 'signup' ? 'Create your account' : 'Welcome back'}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {authMode === 'signup' ? 'Set up your account to continue.' : 'Sign in to return to your workspace.'}
                    </p>
                  </div>

                  {!supabase && (
                    <div className="mb-5 border-l-4 border-amber-500 bg-amber-50 p-3 text-sm leading-5 text-amber-950" role="status">
                      <p className="font-semibold">Connect Supabase to enable account access.</p>
                      <p className="mt-1">Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to <code>client/.env.local</code>, then restart the client. Use a publishable anon key, never a service-role key.</p>
                    </div>
                  )}

                  <div className="mb-6 grid grid-cols-2 border-b border-slate-200" role="tablist" aria-label="Account access">
                    {[
                      { id: 'signup', label: 'Create account' },
                      { id: 'signin', label: 'Sign in' },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        role="tab"
                        aria-selected={authMode === mode.id}
                        onClick={() => switchAuthMode(mode.id)}
                        className={`border-b-2 px-2 py-3 text-sm font-medium transition ${authMode === mode.id ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    {authMode === 'signup' && (
                      <>
                        <label className="block text-sm font-medium text-slate-700">
                          Full name
                          <span className="relative mt-1.5 block">
                            <UserRound size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                            <input
                              type="text"
                              name="name"
                              autoComplete="name"
                              required
                              value={fullName}
                              onChange={(event) => setFullName(event.target.value)}
                              placeholder="Your name"
                              className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                          </span>
                        </label>
                        <label className="block text-sm font-medium text-slate-700">
                          Employer / organization
                          <span className="relative mt-1.5 block">
                            <Building2 size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                            <input
                              type="text"
                              name="employer"
                              autoComplete="organization"
                              required
                              value={employerName}
                              onChange={(event) => setEmployerName(event.target.value)}
                              placeholder="Company or organization"
                              className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                          </span>
                        </label>
                        <label className="block text-sm font-medium text-slate-700">
                          Job title
                          <span className="relative mt-1.5 block">
                            <BriefcaseBusiness size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                            <input
                              type="text"
                              name="job-title"
                              autoComplete="organization-title"
                              required
                              value={jobTitle}
                              onChange={(event) => setJobTitle(event.target.value)}
                              placeholder="Your role"
                              className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                          </span>
                        </label>
                      </>
                    )}
                    <label className="block text-sm font-medium text-slate-700">
                      Email address
                      <span className="relative mt-1.5 block">
                        <Mail size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                        <input
                          type="email"
                          name="email"
                          autoComplete="email"
                          required
                          value={authEmail}
                          onChange={(event) => setAuthEmail(event.target.value)}
                          placeholder="you@example.com"
                          className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                      </span>
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      Password
                      <span className="relative mt-1.5 block">
                        <LockKeyhole size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                        <input
                          type="password"
                          name="password"
                          autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'}
                          minLength={6}
                          required
                          value={authPassword}
                          onChange={(event) => setAuthPassword(event.target.value)}
                          placeholder="At least 6 characters"
                          className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                      </span>
                    </label>

                    {authError && <p className="text-sm text-red-700" role="alert">{authError}</p>}
                    {authMessage && (
                      <p className="text-sm text-emerald-700" role="status">{authMessage}</p>
                    )}

                    <button
                      type="submit"
                      disabled={authSubmitting || !supabase}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {authSubmitting ? <LoaderCircle size={17} className="animate-spin" aria-hidden="true" /> : null}
                      {authSubmitting ? 'Please wait...' : authMode === 'signup' ? 'Create account' : 'Sign in'}
                      {!authSubmitting && <ArrowRight size={17} aria-hidden="true" />}
                    </button>
                    {authMode === 'signup' && (
                      <button
                        type="button"
                        onClick={handleResendConfirmation}
                        disabled={resendingConfirmation || !authEmail}
                        className="w-full py-1 text-sm font-semibold text-indigo-700 underline decoration-indigo-300 underline-offset-4 hover:text-indigo-900 disabled:cursor-not-allowed disabled:text-slate-400"
                      >
                        {resendingConfirmation ? 'Sending confirmation...' : 'Already signed up? Resend confirmation email'}
                      </button>
                    )}
                  </form>
                  <p className="mt-5 text-center text-xs leading-5 text-slate-500">Your credentials are handled securely by Supabase Authentication.</p>
                </div>
              </section>
            )}
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
          <div>
            <header className="dashboard-heading">
              <p className="dashboard-eyebrow">Dashboard / Goals</p>
              <h2 className="text-2xl font-bold mb-4 text-slate-800">Goals</h2>
            </header>
            <div className="goal-tabs" role="tablist" aria-label="Goal sections">
              {goalSections.map((tab) => (
                <button
                  key={tab.id}
                  id={`goal-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={activeGoalTab === tab.id}
                  aria-controls="goal-tab-panel"
                  className={`goal-tab${activeGoalTab === tab.id ? ' active' : ''}`}
                  onClick={() => setActiveGoalTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <section
              id="goal-tab-panel"
              className="goal-tab-panel"
              role="tabpanel"
              aria-labelledby={`goal-tab-${activeGoalTab}`}
              tabIndex={0}
            >
              <h3>{activeGoalSection.label}</h3>
              <p>{activeGoalSection.description}</p>
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

        {activeTab === 'ideas' && (
          <div>
            <header className="dashboard-heading">
              <p className="dashboard-eyebrow">Dashboard / Ideas</p>
              <h2 className="text-2xl font-bold mb-4 text-slate-800">Project Ideas</h2>
            </header>

            <form className="idea-repository-form" onSubmit={handleIdeaSubmit}>
              <label htmlFor="idea-repository-url">Public GitHub repository</label>
              <div className="idea-repository-input-row">
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
                  aria-describedby="idea-repository-help"
                />
                <button type="submit" disabled={ideaLoading || !ideaRepositoryUrl.trim()}>
                  {ideaLoading ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : null}
                  {ideaLoading ? 'Analyzing...' : 'Analyze repository'}
                </button>
              </div>
              <p id="idea-repository-help">Enter a public GitHub repository URL. The summary is generated from its README and selected source files.</p>
            </form>

            {ideaError && <p className="idea-error" role="alert">{ideaError}</p>}
            {ideaSummary && (
              <div className="idea-repository-summary">
                <h3>{ideaSummary.repository}</h3>
                <p>{ideaSummary.description || 'No repository description provided.'}</p>
                {ideaSummary.primaryLanguage && <span className="idea-language-tag">{ideaSummary.primaryLanguage}</span>}
                <p className="idea-files-analyzed">
                  Summary based on {ideaSummary.filesAnalyzed?.length || 0} repository files.
                </p>
              </div>
            )}

            <div className="goal-tabs" role="tablist" aria-label="Project idea sections">
              {ideaSections.map((tab) => (
                <button
                  key={tab.id}
                  id={`idea-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={activeIdeaTab === tab.id}
                  aria-controls="idea-tab-panel"
                  className={`goal-tab${activeIdeaTab === tab.id ? ' active' : ''}`}
                  onClick={() => setActiveIdeaTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <section
              id="idea-tab-panel"
              className="goal-tab-panel idea-tab-panel"
              role="tabpanel"
              aria-labelledby={`idea-tab-${activeIdeaTab}`}
              tabIndex={0}
              aria-live="polite"
            >
              {ideaLoading ? (
                <p className="idea-loading"><LoaderCircle size={18} className="animate-spin" aria-hidden="true" />Reading repository files and preparing the summary...</p>
              ) : ideaSummary ? (
                <>
                  <h3>{activeIdeaSection.label}</h3>
                  <ul className="idea-summary-list">
                    {(ideaSummary.summary[activeIdeaSection.summaryKey] || []).map((point, index) => (
                      <li key={`${activeIdeaSection.id}-${index}`}>{point}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <h3>{activeIdeaSection.label}</h3>
                  <p>Enter a public GitHub repository above to generate a point-form project summary.</p>
                </>
              )}
            </section>
          </div>
        )}

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
          <div className="max-w-3xl flex flex-col h-[80vh]">
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Chatpot AI (Evidence-Linked)</h2>
            <div className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-slate-200 overflow-y-auto space-y-4 mb-4">
              {chatHistory.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="p-3 bg-indigo-50 text-indigo-950 rounded-lg self-end text-sm">
                    <strong>You:</strong> {item.user}
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                    <strong>Chatpot AI:</strong> {item.ai}
                    {item.evidence && (
                      <div className="mt-2 text-xs bg-indigo-100/60 p-2 rounded text-indigo-800 border border-indigo-200">
                        📄 <strong>Evidence Citation:</strong> <code>{item.evidence.file}</code> (Lines {item.evidence.lines})
                      </div>
                  )}
                </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleChatSubmit} className="flex gap-2">
              <input
                type="text"
                value={chatQuery}
                onChange={(e) => setChatQuery(e.target.value)}
                placeholder="Ask Chatpot AI about project architecture or code..."
                className="flex-1 p-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button type="submit" disabled={chatSubmitting || !chatQuery.trim()} className="bg-indigo-600 text-white px-5 py-3 rounded-lg font-medium text-sm hover:bg-indigo-700 transition disabled:cursor-not-allowed disabled:opacity-60">
                {chatSubmitting ? 'Thinking...' : 'Ask AI'}
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