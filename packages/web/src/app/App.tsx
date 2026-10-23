import { Route, Switch } from "wouter";
import { HistoryProvider } from "./history";
import { AppLayout } from "./layout/AppLayout";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ResumeEditPage } from "./pages/ResumeEditPage";
import { ResumeProjectsPage } from "./pages/ResumeProjectsPage";
import { AnnotationToolbarProvider } from "./resume/annotations";
import {
  LegacyResumeListRedirect,
  LegacyResumeRedirect,
} from "./resume/LegacyResumeRedirect";
import { ResumeProjectRedirect } from "./resume/ResumeProjectRedirect";
import { TurnstileGateProvider } from "./turnstile/TurnstileGate";

export function App() {
  return (
    <HistoryProvider>
      <TurnstileGateProvider>
        <AnnotationToolbarProvider>
          <AppLayout>
            <Switch>
              <Route path="/resumes/:id/edit" component={ResumeEditPage} />
              <Route path="/resumes/:id" component={ResumeProjectRedirect} />
              <Route path="/resumes" component={ResumeProjectsPage} />
              <Route path="/resume/:id/edit" component={LegacyResumeRedirect} />
              <Route path="/resume/:id" component={LegacyResumeRedirect} />
              <Route path="/resume" component={LegacyResumeListRedirect} />
              <Route component={NotFoundPage} />
            </Switch>
          </AppLayout>
        </AnnotationToolbarProvider>
      </TurnstileGateProvider>
    </HistoryProvider>
  );
}
