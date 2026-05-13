import { useState, useEffect, useRef } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
const symbols = { add: "+", sub: "−", mul: "×", div: "÷" };
const opMap   = { "+": "add", "−": "sub", "×": "mul", "÷": "div" };

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    min-height: 100vh;
    background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
    font-family: 'Syne', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
  }

  .page {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    max-width: 380px;
  }

  .glass {
    background: rgba(255,255,255,0.08);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 28px;
    padding: 1.5rem;
  }

  .brand {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2em;
    color: rgba(255,255,255,0.35);
    text-transform: uppercase;
    text-align: right;
    margin-bottom: 1rem;
  }

  .display {
    background: rgba(0,0,0,0.25);
    border-radius: 18px;
    padding: 1.25rem 1.5rem;
    margin-bottom: 1.25rem;
    min-height: 90px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    gap: 4px;
  }

  .display-expr {
    font-size: 13px;
    color: rgba(255,255,255,0.35);
    font-family: 'DM Mono', monospace;
    min-height: 18px;
  }

  .display-main {
    font-family: 'DM Mono', monospace;
    font-size: 42px;
    font-weight: 500;
    color: #fff;
    line-height: 1;
    letter-spacing: -1px;
    transition: color 0.2s;
  }

  .display-main.error { color: #ff6b8a; }

  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }

  .btn {
    height: 64px;
    border: none;
    border-radius: 16px;
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
    outline: none;
  }

  .btn:active { transform: scale(0.93); }

  .btn-fn {
    background: rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.75);
    font-size: 15px;
  }
  .btn-fn:hover { background: rgba(255,255,255,0.18); }

  .btn-op {
    background: rgba(162, 89, 255, 0.35);
    color: #d4b4ff;
    border: 1px solid rgba(162, 89, 255, 0.4);
  }
  .btn-op:hover { background: rgba(162, 89, 255, 0.5); }
  .btn-op.active {
    background: rgba(162, 89, 255, 0.8);
    color: #fff;
  }

  .btn-num {
    background: rgba(255,255,255,0.07);
    color: #fff;
  }
  .btn-num:hover { background: rgba(255,255,255,0.13); }

  .btn-zero {
    grid-column: span 2;
    text-align: left;
    padding-left: 24px;
  }

  .btn-eq {
    background: linear-gradient(135deg, #a259ff, #6b3fcb);
    color: #fff;
    box-shadow: 0 8px 24px rgba(162, 89, 255, 0.45);
  }
  .btn-eq:hover { box-shadow: 0 8px 32px rgba(162, 89, 255, 0.65); }

  .hist-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .hist-title {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2em;
    color: rgba(255,255,255,0.35);
    text-transform: uppercase;
  }

  .btn-clear {
    background: rgba(255,107,138,0.15);
    border: 1px solid rgba(255,107,138,0.3);
    color: rgba(255,107,138,0.8);
    font-size: 11px;
    font-weight: 600;
    font-family: 'Syne', sans-serif;
    padding: 4px 12px;
    border-radius: 8px;
    cursor: pointer;
    letter-spacing: 0.05em;
    transition: all 0.15s;
  }
  .btn-clear:hover { background: rgba(255,107,138,0.25); }

  .hist-empty {
    text-align: center;
    color: rgba(255,255,255,0.2);
    font-size: 13px;
    padding: 1rem 0;
    font-style: italic;
  }

  .hist-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .hist-row:last-child { border-bottom: none; }

  .badge {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .badge-add { background: rgba(74,222,128,0.15); color: #4ade80; }
  .badge-sub { background: rgba(251,191,36,0.15); color: #fbbf24; }
  .badge-mul { background: rgba(162,89,255,0.2); color: #c084fc; }
  .badge-div { background: rgba(56,189,248,0.15); color: #38bdf8; }

  .hist-expr {
    flex: 1;
    font-size: 13px;
    color: rgba(255,255,255,0.5);
    font-family: 'DM Mono', monospace;
  }

  .hist-res {
    font-family: 'DM Mono', monospace;
    font-size: 15px;
    font-weight: 500;
    color: rgba(255,255,255,0.85);
  }

  .btn-del {
    background: none;
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.3);
    width: 24px;
    height: 24px;
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
    flex-shrink: 0;
  }
  .btn-del:hover { border-color: rgba(255,107,138,0.4); color: rgba(255,107,138,0.7); }
`;

export default function App() {
  const [display, setDisplay]       = useState("0");
  const [expr, setExpr]             = useState("");
  const [historique, setHistorique] = useState([]);
  const [isError, setIsError]       = useState(false);
  const [activeOp, setActiveOp]     = useState(null);

  const firstOp   = useRef(null);
  const pendingOp = useRef(null);
  const newNum    = useRef(true);

  const fetchHistorique = async () => {
    try {
      const res = await fetch(`${API}/historique`);
      setHistorique(await res.json());
    } catch (_) {}
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    fetchHistorique();
    return () => document.head.removeChild(style);
  }, []);

  const press = async (key) => {
    if (isError && key !== "AC") return;

    if ("0123456789".includes(key)) {
      if (newNum.current) { newNum.current = false; setDisplay(key); }
      else setDisplay(prev => prev === "0" ? key : prev + key);
    } else if (key === ".") {
      if (newNum.current) { newNum.current = false; setDisplay("0."); }
      else setDisplay(prev => prev.includes(".") ? prev : prev + ".");
    } else if (key === "AC") {
      setDisplay("0"); setExpr(""); setIsError(false);
      firstOp.current = null; pendingOp.current = null;
      newNum.current = true; setActiveOp(null);
    } else if (key === "+/-") {
      setDisplay(prev => prev.startsWith("-") ? prev.slice(1) : "-" + prev);
    } else if (key === "%") {
      setDisplay(prev => String(parseFloat(prev) / 100));
    } else if (["+", "−", "×", "÷"].includes(key)) {
      firstOp.current = parseFloat(display);
      pendingOp.current = opMap[key];
      newNum.current = true;
      setExpr(`${firstOp.current} ${key}`);
      setActiveOp(key);
    } else if (key === "=") {
      if (firstOp.current === null || !pendingOp.current) return;
      const a = firstOp.current, b = parseFloat(display), op = pendingOp.current;
      if (op === "div" && b === 0) {
        setDisplay("Erreur"); setIsError(true); setExpr("");
        firstOp.current = null; pendingOp.current = null;
        newNum.current = true; setActiveOp(null); return;
      }
      try {
        const res = await fetch(`${API}/${op}?a=${a}&b=${b}`);
        const data = await res.json();
        if (data.error) { setDisplay("Erreur"); setIsError(true); }
        else {
          const result = String(Math.round(data.result * 1e10) / 1e10);
          setDisplay(result);
          setExpr(`${a} ${symbols[op]} ${b} =`);
          fetchHistorique();
        }
      } catch (_) { setDisplay("Hors ligne"); }
      firstOp.current = null; pendingOp.current = null;
      newNum.current = true; setActiveOp(null);
    }
  };

  const clearAll = async () => {
    if (!confirm("Vider tout l'historique ?")) return;
    await fetch(`${API}/historique`, { method: "DELETE" });
    fetchHistorique();
  };

  const deleteOne = async (id) => {
    await fetch(`${API}/historique/${id}`, { method: "DELETE" });
    fetchHistorique();
  };

  const fmt = (v) => v.length > 9 ? parseFloat(v).toExponential(3) : v;

  const keys = [
    ["AC","fn"], ["+/-","fn"], ["%","fn"], ["÷","op"],
    ["7","num"],  ["8","num"],  ["9","num"],  ["×","op"],
    ["4","num"],  ["5","num"],  ["6","num"],  ["−","op"],
    ["1","num"],  ["2","num"],  ["3","num"],  ["+","op"],
    ["0","num0"], [".","num"],  ["=","eq"],
  ];

  return (
    <div className="page">
      <div className="glass">
        <div className="brand">Docker Calc II</div>
        <div className="display">
          <div className="display-expr">{expr}</div>
          <div className={`display-main${isError ? " error" : ""}`}>{fmt(display)}</div>
        </div>
        <div className="grid">
          {keys.map(([key, type]) => (
            <button
              key={key}
              onClick={() => press(key)}
              className={[
                "btn",
                type === "fn"   ? "btn-fn" : "",
                type === "op"   ? `btn-op${activeOp === key ? " active" : ""}` : "",
                type === "num"  ? "btn-num" : "",
                type === "num0" ? "btn-num btn-zero" : "",
                type === "eq"   ? "btn-eq" : "",
              ].join(" ").trim()}
            >{key}</button>
          ))}
        </div>
      </div>

      <div className="glass">
        <div className="hist-header">
          <div className="hist-title">Historique</div>
          {historique.length > 0 && (
            <button className="btn-clear" onClick={clearAll}>Tout vider</button>
          )}
        </div>
        {historique.length === 0
          ? <div className="hist-empty">— vide —</div>
          : historique.map(row => (
              <div className="hist-row" key={row.id}>
                <span className={`badge badge-${row.operation}`}>{symbols[row.operation]}</span>
                <span className="hist-expr">{parseFloat(row.a)} {symbols[row.operation]} {parseFloat(row.b)}</span>
                <span className="hist-res">{parseFloat(row.resultat)}</span>
                <button className="btn-del" onClick={() => deleteOne(row.id)}>✕</button>
              </div>
            ))
        }
      </div>
    </div>
  );
}