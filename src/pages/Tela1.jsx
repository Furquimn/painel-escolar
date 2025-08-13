import React, { useState, useEffect } from "react";
import Tabela from "../components/Tabela";
import BarraPesquisa from "../components/BarraPesquisa";
import Filtro from "../components/Filtro";
import studentsData from "../data/students.json";
import degreesData from "../data/degrees.json";
import classesData from "../data/classes.json";
import Grafico from "../components/Grafico";

export default function Tela1() {
  const [query, setQuery] = useState("");
  const [selectedDegree, setSelectedDegree] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [listaAlunos, setListaAlunos] = useState(() => {
    try {
      const saved = localStorage.getItem("students");
      return saved ? JSON.parse(saved) : studentsData;
    } catch {
      return studentsData;
    }
  });
  const [alunoEditando, setAlunoEditando] = useState(null);

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(listaAlunos));
  }, [listaAlunos]);

  const iniciarEdicao = (linha) => {
    setAlunoEditando({
      id: linha.id,
      name: linha.name,
      degreeId: String(linha.degreeId || ""),
      classId: String(linha.classId || ""),
    });
  };

  // filtro
  let linhasFiltradas = listaAlunos
    .filter((a) => {
      let qLower = query.toLowerCase();
      return (
        (a.name || "").toLowerCase().includes(qLower) ||
        String(a.id).includes(qLower)
      );
    })
    .filter((a) => selectedDegree === "" || String(a.degreeId) === selectedDegree)
    .filter((a) => selectedClass === "" || String(a.classId) === selectedClass)
    .map((a) => {
      let serie = degreesData.find((d) => d.id === a.degreeId);
      let turma = classesData.find((c) => c.id === a.classId);
      return {
        id: a.id,
        name: a.name,
        degreeId: a.degreeId,
        classId: a.classId,
        degreeName: serie ? serie.name : "—",
        className: turma ? turma.name : "—",
      };
    });

  const colunas = [
    { key: "id", label: "ID" },
    { key: "name", label: "Aluno" },
    { key: "degreeName", label: "Série" },
    { key: "className", label: "Turma" },
    {
      key: "acoes",
      label: "Ações",
      render: (linha) => (
        <button
          onClick={() => iniciarEdicao(linha)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Editar
        </button>
      ),
    },
  ];

  const opcoesSerie = [
    { value: "", label: "Todas as séries" },
    ...degreesData.map((d) => ({ value: String(d.id), label: d.name })),
  ];
  const opcoesTurma = [
    { value: "", label: "Todas as turmas" },
    ...classesData.map((c) => ({ value: String(c.id), label: c.name })),
  ];

  const adicionarAlunos = (n = 300) => {
    let idsSeries = degreesData.map((d) => d.id);
    let idsTurmas = classesData.map((c) => c.id);

    let maxId = listaAlunos.reduce((m, a) => Math.max(m, a.id), 0);
    let maxRa = listaAlunos.reduce((m, a) => Math.max(m, a.ra || 100000), 100000);

    let novos = [];
    for (let i = 0; i < n; i++) {
      let dId = idsSeries[i % idsSeries.length];
      let cId = idsTurmas[Math.floor(i / idsSeries.length) % idsTurmas.length];
      novos.push({
        id: maxId + i + 1,
        ra: maxRa + i + 1,
        name: `Aluno Gerado ${maxId + i + 1}`, // segue a sequência do ID
        degreeId: dId,
        classId: cId,
      });
    }

    setListaAlunos([...listaAlunos, ...novos]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Lista de Alunos</h1>

      {/* filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <BarraPesquisa
          value={query}
          onChange={setQuery}
          placeholder="Filtrar por nome ou ID"
        />
        <Filtro
          label="Série:"
          value={selectedDegree}
          onChange={setSelectedDegree}
          options={opcoesSerie}
        />
        <Filtro
          label="Turma:"
          value={selectedClass}
          onChange={setSelectedClass}
          options={opcoesTurma}
        />
      </div>

      {/* edição */}
      {alunoEditando && (
        <div className="border border-gray-300 p-4 rounded mb-6 bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <label className="flex flex-col">
              <span className="font-semibold mb-1">Nome:</span>
              <input
                type="text"
                value={alunoEditando.name}
                onChange={(e) =>
                  setAlunoEditando({ ...alunoEditando, name: e.target.value })
                }
                className="border border-gray-300 rounded px-2 py-1"
              />
            </label>
            <label className="flex flex-col">
              <span className="font-semibold mb-1">Série:</span>
              <select
                value={alunoEditando.degreeId}
                onChange={(e) =>
                  setAlunoEditando({ ...alunoEditando, degreeId: e.target.value })
                }
                className="border border-gray-300 rounded px-2 py-1"
              >
                <option value="">Selecione...</option>
                {degreesData.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col">
              <span className="font-semibold mb-1">Turma:</span>
              <select
                value={alunoEditando.classId}
                onChange={(e) =>
                  setAlunoEditando({ ...alunoEditando, classId: e.target.value })
                }
                className="border border-gray-300 rounded px-2 py-1"
              >
                <option value="">Selecione...</option>
                {classesData.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setListaAlunos(
                  listaAlunos.map((a) =>
                    a.id === alunoEditando.id
                      ? {
                          ...a,
                          name: alunoEditando.name,
                          degreeId: Number(alunoEditando.degreeId) || a.degreeId,
                          classId: Number(alunoEditando.classId) || a.classId,
                        }
                      : a
                  )
                );
                setAlunoEditando(null);
              }}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Salvar
            </button>
            <button
              onClick={() => setAlunoEditando(null)}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* tabela */}
      <div className="mb-6">
        <Tabela columns={colunas} data={linhasFiltradas} paginated pageSize={15} />
      </div>

      <button
        onClick={() => adicionarAlunos(300)}
        className="px-5 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
      >
        Gerar +300 alunos
      </button>

      {/* gráfico */}
      <div className="max-w-3xl mt-8">
        <Grafico rows={linhasFiltradas} />
      </div>
    </div>
  );
}
