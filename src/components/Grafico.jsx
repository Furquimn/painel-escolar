import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

// Required registration for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

export default function Grafico({ rows = [] }) {
  // Contar alunos por série
  const contagemSeries = rows.reduce((acumulador, linha) => {
    const chaveSerie = linha.degreeName || "—";
    acumulador[chaveSerie] = (acumulador[chaveSerie] ?? 0) + 1;
    return acumulador;
  }, {});

  const rotulos = Object.keys(contagemSeries);
  const dadosGrafico = {
    labels: rotulos,
    datasets: [
      {
        label: "Alunos por série",
        data: rotulos.map((rotulo) => contagemSeries[rotulo] ?? 0),
        backgroundColor: "#4A90E2",
      },
    ],
  };

  const opcoesGrafico = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Alunos por série" },
    },
  };

  return <Bar data={dadosGrafico} options={opcoesGrafico} />;
}
