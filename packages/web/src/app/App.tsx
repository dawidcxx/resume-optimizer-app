import { Route, Switch } from "wouter";
import { HistoryProvider } from "./history";
import { AppLayout } from "./layout/AppLayout";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ResumeEditPage } from "./pages/ResumeEditPage";
import { ResumeProjectsPage } from "./pages/ResumeProjectsPage";
import { AnnotationToolbarProvider } from "./resume/annotations";
import { ResumeProjectRedirect } from "./resume/ResumeProjectRedirect";

export function App() {
  return (
    <HistoryProvider>
      <AnnotationToolbarProvider>
        <AppLayout>
          <Switch>
            <Route path="/resume/:id/edit" component={ResumeEditPage} />
            <Route path="/resume/:id" component={ResumeProjectRedirect} />
            <Route path="/" component={ResumeProjectsPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </AppLayout>
      </AnnotationToolbarProvider>
    </HistoryProvider>
  );
}