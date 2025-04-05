import { Link, useLocation } from "wouter";
import { Home, History } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav>
      <div className="container">
        <div className="nav-content">
          <h1 className="app-title">DeepFake Detector</h1>
          <div className="nav-buttons">
            <Link href="/">
              <button className={`button ${location === "/" ? "button-default" : "button-ghost"}`}>
                <Home className="icon" />
                Home
              </button>
            </Link>
            <Link href="/history">
              <button className={`button ${location === "/history" ? "button-default" : "button-ghost"}`}>
                <History className="icon" />
                History
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
