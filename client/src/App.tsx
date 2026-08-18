import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ThankYou from "./pages/ThankYou";
import ClientPortal from "./pages/ClientPortal";
import InsightPage from "./pages/InsightPage";
import InsightsIndex from "./pages/InsightsIndex";

const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const EmployeeSatisfaction = lazy(() => import("./pages/EmployeeSatisfaction"));

function Router() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#080a08] text-[#c8cfc8] font-mono flex items-center justify-center px-6"><p className="text-[11px] tracking-[0.16em] uppercase">Loading secure workspace…</p></main>}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/thank-you" component={ThankYou} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/satisfaction" component={EmployeeSatisfaction} />
        <Route path="/portal" component={ClientPortal} />
        <Route path="/insights" component={InsightsIndex} />
        <Route path="/insights/:slug" component={InsightPage} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
