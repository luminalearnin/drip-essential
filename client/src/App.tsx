import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { StoreProvider } from "./store";
import Home, { CatalogPage, InfoPage, ProductPage } from "./pages/Home";
import NotFound from "./pages/NotFound";

function Router() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL === "/" ? "" : import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/watches" component={CatalogPage} />
        <Route path="/watches/:brand" component={CatalogPage} />
        <Route path="/product/:id" component={ProductPage} />
        <Route path="/about" component={InfoPage} />
        <Route path="/shipping" component={InfoPage} />
        <Route path="/returns" component={InfoPage} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <StoreProvider>
            <Toaster />
            <Router />
          </StoreProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
