import { useRef } from "react";
import PageLayout from "../../components/layouts/PageLayout";

const links = [
  { path: "/directeur/dashboard", icon: "🏠", label: "Tableau de bord" },
  { path: "/directeur/kpi", icon: "📊", label: "KPI Performance" },
  { path: "/directeur/predictive", icon: "🤖", label: "Analyse Prédictive" },
];

const KPI = () => {
  const printRef = useRef(null);
  const months = ["Juil", "Août", "Sep", "Oct", "Nov", "Déc", "Jan"];
  const satisfactionData = [88, 91, 89, 93, 92, 94, 94.2];
  const clientsData = [980, 1050, 1020, 1100, 1180, 1210, 1248];
  const maxSat = Math.max(...satisfactionData);
  const maxClients = Math.max(...clientsData);

  const kpis = [
    { label: "Temps moyen de traitement", value: "8.5 min", target: "< 10 min", trend: "↓ -12%" },
    { label: "Taux de satisfaction globale", value: "94.2%", target: "> 90%", trend: "↑ +1.4%" },
    { label: "Taux d'absentéisme agents", value: "3.2%", target: "< 5%", trend: "↓ -0.8%" },
    { label: "Temps d'attente moyen", value: "14 min", target: "< 20 min", trend: "↓ -15%" },
    { label: "Taux résolution 1er contact", value: "82%", target: "> 80%", trend: "↑ +3%" },
    { label: "Clients servis / agent / jour", value: "21.4", target: "> 15", trend: "↑ +5%" },
  ];

  const handleExportPDF = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Rapport KPI — BankFlow — Janvier 2025</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #1a1a2e; padding: 40px; }
            .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; padding-bottom: 16px; border-bottom: 3px solid #EAB308; }
            .logo { display: flex; align-items: center; gap: 12px; }
            .logo-box { width: 44px; height: 44px; background: #EAB308; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; color: #000; }
            .logo-name { font-size: 22px; font-weight: 800; color: #1a1a2e; }
            .report-info { text-align: right; }
            .report-info h1 { font-size: 18px; font-weight: 800; color: #1a1a2e; }
            .report-info p { font-size: 12px; color: #888; margin-top: 2px; }
            .section-title { font-size: 15px; font-weight: 800; color: #1a1a2e; margin: 28px 0 14px; text-transform: uppercase; letter-spacing: 1px; border-left: 4px solid #EAB308; padding-left: 10px; }
            .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 28px; }
            .kpi-card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; background: #f9fafb; }
            .kpi-label { font-size: 11px; color: #6b7280; margin-bottom: 6px; }
            .kpi-value { font-size: 22px; font-weight: 800; color: #1a1a2e; margin-bottom: 4px; }
            .kpi-row { display: flex; justify-content: space-between; align-items: center; }
            .kpi-target { font-size: 11px; color: #9ca3af; }
            .kpi-trend { font-size: 12px; font-weight: 700; color: #10b981; }
            .badge { background: #d1fae5; color: #059669; border-radius: 20px; padding: 2px 8px; font-size: 10px; font-weight: 700; }
            .charts { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 28px; }
            .chart-box { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; }
            .chart-title { font-size: 13px; font-weight: 700; color: #1a1a2e; margin-bottom: 14px; }
            .bars { display: flex; align-items: flex-end; gap: 8px; height: 100px; }
            .bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; height: 100%; justify-content: flex-end; }
            .bar { width: 100%; border-radius: 4px 4px 0 0; }
            .bar-teal { background: #0d9488; }
            .bar-yellow { background: #EAB308; }
            .bar-label { font-size: 9px; color: #9ca3af; }
            .bar-val { font-size: 9px; color: #6b7280; }
            .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; }
            .footer p { font-size: 11px; color: #9ca3af; }
            .footer .stamp { background: #d1fae5; color: #059669; border-radius: 6px; padding: 4px 10px; font-size: 11px; font-weight: 700; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">
              <div class="logo-box">BF</div>
              <span class="logo-name">BankFlow</span>
            </div>
            <div class="report-info">
              <h1>Rapport KPI Performance</h1>
              <p>Janvier 2025 — Généré le ${new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}</p>
            </div>
          </div>

          <div class="section-title">Indicateurs Clés de Performance</div>
          <div class="kpi-grid">
            ${kpis.map(k => `
              <div class="kpi-card">
                <div class="kpi-label">${k.label}</div>
                <div class="kpi-value">${k.value}</div>
                <div class="kpi-row">
                  <span class="kpi-target">Cible : ${k.target}</span>
                  <span class="kpi-trend">${k.trend}</span>
                </div>
              </div>
            `).join("")}
          </div>

          <div class="section-title">Évolution sur 7 mois</div>
          <div class="charts">
            <div class="chart-box">
              <div class="chart-title">Taux de Satisfaction (%)</div>
              <div class="bars">
                ${satisfactionData.map((v, i) => `
                  <div class="bar-wrap">
                    <div class="bar-val">${v}%</div>
                    <div class="bar bar-teal" style="height:${((v - 85) / (maxSat - 85)) * 80}px;min-height:6px"></div>
                    <div class="bar-label">${months[i]}</div>
                  </div>
                `).join("")}
              </div>
            </div>
            <div class="chart-box">
              <div class="chart-title">Volume Clients / mois</div>
              <div class="bars">
                ${clientsData.map((v, i) => `
                  <div class="bar-wrap">
                    <div class="bar-val">${v}</div>
                    <div class="bar bar-yellow" style="height:${(v / maxClients) * 80}px;min-height:6px"></div>
                    <div class="bar-label">${months[i]}</div>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>

          <div class="footer">
            <p>© 2025 BankFlow — Document confidentiel — Usage interne uniquement</p>
            <span class="stamp">✓ Rapport validé</span>
          </div>
        </body>
      </html>
    `;

    const win = window.open("", "_blank");
    win.document.write(printContent);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
      win.close();
    }, 500);
  };

  return (
    <PageLayout links={links} title="KPI Performance" subtitle="Indicateurs clés — Janvier 2025">

      {/* BOUTON EXPORT PDF */}
      <div className="flex justify-end mb-6">
        <button onClick={handleExportPDF}
          className="flex items-center gap-2 bg-yellow-500 text-black font-display font-bold px-5 py-2.5 rounded-xl hover:bg-yellow-400 transition-all hover:shadow-lg hover:shadow-yellow-500/20">
          <span>📄</span>
          Exporter en PDF
        </button>
      </div>

      <div ref={printRef}>
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {kpis.map((k, i) => (
            <div key={i} className="stat-card">
              <div className="flex items-start justify-between mb-3">
                <span className="text-white/40 text-xs leading-tight max-w-40">{k.label}</span>
                <span className="badge-green text-xs">OK</span>
              </div>
              <div className="font-display font-bold text-2xl text-white mb-1">{k.value}</div>
              <div className="flex items-center justify-between">
                <span className="text-white/25 text-xs">Cible : {k.target}</span>
                <span className="text-teal-400 text-xs font-bold">{k.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* GRAPHIQUES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-display font-bold text-white mb-5">Taux de Satisfaction — 7 mois</h3>
            <div className="flex items-end gap-3 h-40 mb-4">
              {satisfactionData.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-white/30 text-xs">{v}%</div>
                  <div className="w-full bg-teal-500/20 rounded-t-lg hover:bg-teal-500/40 transition-all"
                    style={{ height: `${((v - 85) / (maxSat - 85)) * 100}%`, minHeight: "8px" }} />
                  <span className="text-white/30 text-xs">{months[i]}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-teal-500/40 rounded" />
              <span className="text-white/30 text-xs">Satisfaction mensuelle</span>
            </div>
          </div>

          <div className="card">
            <h3 className="font-display font-bold text-white mb-5">Volume Clients — 7 mois</h3>
            <div className="flex items-end gap-3 h-40 mb-4">
              {clientsData.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-white/30 text-xs">{v}</div>
                  <div className="w-full bg-yellow-500/20 rounded-t-lg hover:bg-yellow-500/40 transition-all"
                    style={{ height: `${(v / maxClients) * 100}%`, minHeight: "8px" }} />
                  <span className="text-white/30 text-xs">{months[i]}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500/40 rounded" />
              <span className="text-white/30 text-xs">Clients servis / mois</span>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default KPI;