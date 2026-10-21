import { Route, Switch } from "wouter";
import { AppLayout } from "./layout/AppLayout";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ResumeEditPage } from "./pages/ResumeEditPage";
import { ResumeProjectsPage } from "./pages/ResumeProjectsPage";
import { ResumeProjectRedirect } from "./resume/ResumeProjectRedirect";

export function App() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/resume/:id/edit" component={ResumeEditPage} />
        <Route path="/resume/:id" component={ResumeProjectRedirect} />
        <Route path="/" component={ResumeProjectsPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </AppLayout>
  );
}
