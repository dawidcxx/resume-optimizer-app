import { Route, Switch } from "wouter";
import { AppLayout } from "./layout/AppLayout";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ResumeDetailPage } from "./pages/ResumeDetailPage";
import { ResumeProjectsPage } from "./pages/ResumeProjectsPage";

export function App() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/resume/:id" component={ResumeDetailPage} />
        <Route path="/" component={ResumeProjectsPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </AppLayout>
  );
}
