import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Tracker from "./pages/Tracker";
import Learn from "./pages/Learn";
import Careers from "./pages/Careers";
import HowWeWork from "./pages/HowWeWork";
import Submit from "./pages/Submit";
import Ask from "./pages/Ask";
import Meetings from "./pages/Meetings";
import Corrections from "./pages/Corrections";
import AdminReview from "./pages/AdminReview";
import Vault from "./pages/Vault";
import Admin from "./pages/Admin";
import Search from "./pages/Search";
import { ProvenanceProvider } from "./lib/provenance";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/search"} component={Search} />
      <Route path={"/tracker"} component={Tracker} />
      <Route path={"/learn"} component={Learn} />
      <Route path={"/careers"} component={Careers} />
      <Route path={"/ask"} component={Ask} />
      <Route path="/meetings" component={Meetings} />
      <Route path="/corrections" component={Corrections} />
      <Route path={"/vault"} component={Vault} />
      <Route path={"/admin/review"} component={AdminReview} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/how-we-work"} component={HowWeWork} />
      <Route path={"/submit"} component={Submit} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <ProvenanceProvider>
            <Router />
          </ProvenanceProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
