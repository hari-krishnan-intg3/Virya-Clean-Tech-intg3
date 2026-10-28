import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { NavbarContainer } from '@/components/layout/NavbarContainer';
import { FooterContainer } from '@/components/layout/FooterContainer';
import { ScrollManager } from '@/components/layout/ScrollManager';
import { ExitIntentPrompt } from '@/components/privacy/ExitIntentPrompt';
import { PrivacyConsent } from '@/components/privacy/PrivacyConsent';
import { VercelAnalyticsGate } from '@/components/privacy/VercelAnalyticsGate';
import { getService, type ServiceSlug } from '@/data/services';
import {
  installSessionTracking,
  recordPageView,
  recordScrollDepth,
  recordServiceView,
  addActiveTime,
} from '@/lib/session';
import {
  readReturningVisitorFromSheet,
  readVisitorMemory,
  saveVisitorProgress,
  type VisitorMemory,
} from '@/lib/visitorMemory';

import HomePage from '@/pages/HomePage';

const ServicesPage = lazy(() => import('@/pages/ServicesPage'));
const ServiceDetailPage = lazy(() => import('@/pages/ServiceDetailPage'));
const EVChargingPage = lazy(() => import('@/pages/EVChargingPage'));
const RenewablesPage = lazy(() => import('@/pages/RenewablesPage'));
const IndustriesPage = lazy(() => import('@/pages/IndustriesPage'));
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage'));
const InsightsPage = lazy(() => import('@/pages/InsightsPage'));
const ProcessPage = lazy(() => import('@/pages/ProcessPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const ConsultationPage = lazy(() => import('@/pages/ConsultationPage'));
const CareersPage = lazy(() => import('@/pages/CareersPage'));
const FaqPage = lazy(() => import('@/pages/FaqPage'));
const ControllerPage = lazy(() => import('@/pages/ControllerPage'));
const JiraPracticePage = lazy(() => import('@/pages/JiraPracticePage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const ChatAssistant = lazy(() =>
  import('@/components/assistant/ChatAssistant').then((m) => ({ default: m.ChatAssistant })),
);

function RouteFallback() {
  return (
    <div className="shell flex min-h-[60vh] items-center justify-center pt-32" aria-busy="true">
      <div className="flex items-center gap-3 text-ink-faint">
        <span className="h-2 w-2 animate-dot-pulse rounded-full bg-emerald-500" />
        <span className="text-sm font-medium">Loading…</span>
      </div>
    </div>
  );
}

/**
 * Derives the service slug from the path so the assistant can bias every
 * answer toward the page the visitor is actually reading.
 */
function useRouteContext(): { activeService?: ServiceSlug; seenServices: ServiceSlug[] } {
  const location = useLocation();
  const [seen, setSeen] = useState<ServiceSlug[]>([]);

  const activeService = useMemo(() => {
    const match = location.pathname.match(/^\/services\/([a-z-]+)$/);
    if (!match) return undefined;
    return getService(match[1])?.slug;
  }, [location.pathname]);

  useEffect(() => {
    if (activeService) {
      recordServiceView(activeService);
      setSeen((prev) => (prev.includes(activeService) ? prev : [...prev, activeService]));
    }
  }, [activeService]);

  return { activeService, seenServices: seen };
}

/** Scroll depth + active-time collection for the session layer. */
function useEngagementTracking() {
  const location = useLocation();
  const started = useRef(Date.now());

  useEffect(() => {
    if (location.pathname.startsWith('/controller')) return;
    started.current = Date.now();
    recordPageView(`${location.pathname}${location.search}`);

    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      recordScrollDepth((window.scrollY / scrollable) * 100);
    };

    // Active time, not wall-clock: only counts while the tab is visible.
    const tick = window.setInterval(() => {
      if (document.visibilityState === 'visible') addActiveTime(5);
    }, 5000);

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.clearInterval(tick);
      window.removeEventListener('scroll', onScroll);
    };
  }, [location.pathname, location.search]);
}

export default function App() {
  const { activeService, seenServices } = useRouteContext();
  const location = useLocation();
  const isControllerRoute = location.pathname.startsWith('/controller');
  const isOperationsRoute = isControllerRoute || location.pathname.startsWith('/jira-practice');
  const [priorVisitorMemory] = useState<VisitorMemory | null>(() =>
    isOperationsRoute ? null : readVisitorMemory(),
  );
  const [returningVisitor, setReturningVisitor] = useState<VisitorMemory | null>(null);

  useEngagementTracking();

  useEffect(() => {
    if (isOperationsRoute) return;
    installSessionTracking();
  }, [isOperationsRoute]);

  useEffect(() => {
    if (isOperationsRoute) return;
    const saveProgress = () =>
      saveVisitorProgress(`${location.pathname}${location.hash}`, activeService ?? null);
    saveProgress();
    window.addEventListener('virya:tracking-preference', saveProgress);
    return () => window.removeEventListener('virya:tracking-preference', saveProgress);
  }, [activeService, isControllerRoute, location.hash, location.pathname]);

  useEffect(() => {
    if (isControllerRoute) return;
    const refreshMemory = () => {
      void readReturningVisitorFromSheet(priorVisitorMemory).then(setReturningVisitor);
    };
    refreshMemory();
    window.addEventListener('virya:tracking-preference', refreshMemory);
    return () => window.removeEventListener('virya:tracking-preference', refreshMemory);
  }, [isOperationsRoute, priorVisitorMemory]);

  // Capture intent the chatbot discovered so the form can pre-select it.
  const onAssistantInterest = useCallback((event: Event) => {
    const slug = (event as CustomEvent<string | null>).detail;
    if (!slug) return;
    if (!location.pathname.startsWith('/request-consultation')) {
      window.dispatchEvent(new CustomEvent('virya:service-intent', { detail: slug }));
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isOperationsRoute) return;
    window.addEventListener('virya:assistant-interest', onAssistantInterest);
    return () => window.removeEventListener('virya:assistant-interest', onAssistantInterest);
  }, [isOperationsRoute, onAssistantInterest]);

  const showAssistant = !isOperationsRoute && !location.pathname.startsWith('/request-consultation');

  return (
    <>
      {!isOperationsRoute && (
        <>
          <a
            href="#main"
            className="sr-only-focusable fixed left-4 top-4 z-[70] rounded-lg bg-emerald-500 px-4 py-2 font-heading text-sm font-semibold text-white"
          >
            Skip to content
          </a>
          <NavbarContainer />
          <ScrollManager />
        </>
      )}

      <main id="main">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/ev-charging/:segment?" element={<EVChargingPage />} />
            <Route path="/services/solar/:category?" element={<RenewablesPage />} />
            <Route path="/services/wind-energy/:category?" element={<RenewablesPage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />
            <Route path="/industries" element={<IndustriesPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/process" element={<ProcessPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/request-consultation" element={<ConsultationPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/controller" element={<ControllerPage />} />
            <Route path="/jira-practice" element={<JiraPracticePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      {!isOperationsRoute && (
        <>
          <FooterContainer />
          <PrivacyConsent />
          <VercelAnalyticsGate />
          <ExitIntentPrompt />
        </>
      )}

      {showAssistant && (
        <Suspense fallback={null}>
          <ChatAssistant
            activeService={activeService}
            seenServices={seenServices}
            returningVisitor={returningVisitor}
          />
        </Suspense>
      )}
    </>
  );
}