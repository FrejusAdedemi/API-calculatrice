import { useState, useEffect, useRef } from "react";
import "./App.css";

const API = "https://api-calculatrice-ja5p.vercel.app/api";
const symbols = { add: "+", sub: "−", mul: "×", div: "÷" };
const opMap   = { "+": "add", "−": "sub", "×": "mul", "÷": "div" };

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

  useEffect(() => { fetchHistorique(); }, []);

  const press = async (key) => {
    if (isError && key !== "AC") return;

    if ("0123456789".includes(key)) {
      if (newNum.current) {
        newNum.current = false;
        setDisplay(key);
      } else {
        setDisplay(prev => prev === "0" ? key : prev + key);
      }

    } else if (key === ".") {
      if (newNum.current) {
        newNum.current = false;
        setDisplay("0.");
      } else {
        setDisplay(prev => prev.includes(".") ? prev : prev + ".");
      }

    } else if (key === "AC") {
      setDisplay("0");
      setExpr("");
      setIsError(false);
      firstOp.current  = null;
      pendingOp.current = null;
      newNum.current   = true;
      setActiveOp(null);

    } else if (key === "+/-") {
      setDisplay(prev => prev.startsWith("-") ? prev.slice(1) : "-" + prev);

    } else if (key === "%") {
      setDisplay(prev => String(parseFloat(prev) / 100));

    } else if (["+", "−", "×", "÷"].includes(key)) {
      firstOp.current   = parseFloat(display);
      pendingOp.current = opMap[key];
      newNum.current    = true;
      setExpr(`${firstOp.current} ${key}`);
      setActiveOp(key);

    } else if (key === "=") {
      if (firstOp.current === null || !pendingOp.current) return;
      const a  = firstOp.current;
      const b  = parseFloat(display);
      const op = pendingOp.current;

      if (op === "div" && b === 0) {
        setDisplay("Erreur");
        setIsError(true);
        setExpr("");
        firstOp.current   = null;
        pendingOp.current = null;
        newNum.current    = true;
        setActiveOp(null);
        return;
      }

      try {
        const res  = await fetch(`${API}/${op}?a=${a}&b=${b}`);
        const data = await res.json();
        if (data.error) {
          setDisplay("Erreur");
          setIsError(true);
        } else {
          const result = String(Math.round(data.result * 1e10) / 1e10);
          setDisplay(result);
          setExpr(`${a} ${symbols[op]} ${b} =`);
          fetchHistorique();
        }
      } catch (_) {
        setDisplay("Hors ligne");
      }

      firstOp.current   = null;
      pendingOp.current = null;
      newNum.current    = true;
      setActiveOp(null);
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

  return (
    <div className="page">

      {/* ── Calculatrice ── */}
      <div className="calc-body">
        <div className="calc-brand">Docker Calc II</div>
        <div className="display">
          <div className="display-expr">{expr}</div>
          <div className={`display-main${isError ? " error" : ""}`}>
            {fmt(display)}
          </div>
        </div>
        <div className="grid">
          {[
            ["AC","fn"],  ["+/-","fn"], ["%","fn"],  ["÷","op"],
            ["7","num"],  ["8","num"],  ["9","num"],  ["×","op"],
            ["4","num"],  ["5","num"],  ["6","num"],  ["−","op"],
            ["1","num"],  ["2","num"],  ["3","num"],  ["+","op"],
            ["0","num0"], [".","num"],  ["=","eq"],
          ].map(([key, type]) => (
            <button
              key={key}
              onClick={() => press(key)}
              className={[
                "btn",
                type === "fn"   ? "btn-fn"  : "",
                type === "op"   ? `btn-op${activeOp === key ? " active" : ""}` : "",
                type === "num"  ? "btn-num" : "",
                type === "num0" ? "btn-num btn-zero" : "",
                type === "eq"   ? "btn-eq"  : "",
              ].join(" ").trim()}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* ── Historique ── */}
      <div className="hist-card">
        <div className="hist-header">
          <div className="hist-title">Historique</div>
          {historique.length > 0 &&
            <button className="btn-clear" onClick={clearAll}>Tout vider</button>}
        </div>
        {historique.length === 0
          ? <div className="hist-empty">— vide —</div>
          : historique.map(row => (
              <div className="hist-row" key={row.id}>
                <span className={`badge badge-${row.operation}`}>
                  {symbols[row.operation]}
                </span>
                <span className="hist-expr">
                  {parseFloat(row.a)} {symbols[row.operation]} {parseFloat(row.b)}
                </span>
                <span className="hist-res">{parseFloat(row.resultat)}</span>
                <button
                  className="btn-fn"
                  style={{ height:24, width:24, fontSize:12, borderRadius:6, cursor:"pointer" }}
                  onClick={() => deleteOne(row.id)}
                >
                  ✕
                </button>
              </div>
            ))
        }
      </div>

    </div>
  );
}