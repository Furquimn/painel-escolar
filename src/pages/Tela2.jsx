// src/pages/Tela2.jsx
import React, { useState, useEffect } from "react";
import Table from "../components/Tabela";
import BarraPesquisa from "../components/BarraPesquisa";
import Filtro from "../components/Filtro";
import teachersData from "../data/teachers.json";
import mattersData from "../data/matters.json";
import relationships from "../data/relationships.json";
import degreesData from "../data/degrees.json";
import classesData from "../data/classes.json";
import studentsData from "../data/students.json";

export default function Tela2() {
  const [query, setQuery] = useState("");
  const [selectedDegree, setSelectedDegree] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedMatter, setSelectedMatter] = useState("");

  const [listaProfessores, setListaProfessores] = useState(() => {
    const saved = localStorage.getItem("teachers");
    return saved ? JSON.parse(saved) : teachersData;
  });

  const [listaRelacionamentos, setListaRelacionamentos] = useState(() => {
    const saved = localStorage.getItem("relationships");
    return saved ? JSON.parse(saved) : relationships;
  });

  useEffect(() => {
    localStorage.setItem("teachers", JSON.stringify(listaProfessores));
  }, [listaProfessores]);

  useEffect(() => {
    localStorage.setItem("relationships", JSON.stringify(listaRelacionamentos));
  }, [listaRelacionamentos]);

  const [professorExpandido, setProfessorExpandido] = useState(null);
  const [degreeFilterSelected, setDegreeFilterSelected] = useState("");

  // montar linhas
  let todasLinhas = [];
  listaRelacionamentos.forEach((relacionamento) => {
    let nomesSeries = [];
    let nomesTurmas = [];

    if (relacionamento.degrees) {
      relacionamento.degrees.forEach((d) => {
        let serie = degreesData.find((x) => x.id === d.degreeId);
        if (serie) nomesSeries.push(serie.name);
        if (d.classes) {
          d.classes.forEach((c) => {
            let turma = classesData.find((y) => y.id === c.classId || y.id === c.classPosition);
            if (turma) nomesTurmas.push(turma.name);
          });
        }
      });
    }

    let professor = listaProfessores.find((t) => t.id === relacionamento.teacherId);
    let disciplina = mattersData.find((m) => m.id === relacionamento.matterId);

    todasLinhas.push({
      nomeProfessor: professor ? professor.name : "—",
      nomeDisciplina: disciplina ? disciplina.name : "—",
      nomesSeries: nomesSeries.join(", "),
      nomesTurmas: nomesTurmas.join(", "),
      _idsSeries: relacionamento.degrees ? relacionamento.degrees.map((d) => d.degreeId) : [],
      _idsTurmas: relacionamento.degrees
        ? relacionamento.degrees.flatMap((d) => (d.classes || []).map((c) => c.classId))
        : [],
      _idProfessor: relacionamento.teacherId,
      _idDisciplina: relacionamento.matterId,
    });
  });

  // agrupar por professor
  let linhasAgrupadas = [];
  listaProfessores.forEach((prof) => {
    let relsProfessor = todasLinhas.filter((r) => r._idProfessor === prof.id);
    if (relsProfessor.length > 0) {
      linhasAgrupadas.push({
        nomeProfessor: prof.name,
        nomeDisciplina: [...new Set(relsProfessor.map((x) => x.nomeDisciplina))].join(", "),
        nomesSeries: [...new Set(relsProfessor.map((x) => x.nomesSeries).join(", ").split(", "))].join(", "),
        nomesTurmas: [...new Set(relsProfessor.map((x) => x.nomesTurmas).join(", ").split(", "))].join(", "),
        _idsSeries: [...new Set(relsProfessor.flatMap((x) => x._idsSeries))],
        _idsTurmas: [...new Set(relsProfessor.flatMap((x) => x._idsTurmas))],
        _idProfessor: prof.id
      });
    }
  });

  // filtros
  let linhasFiltradas = linhasAgrupadas
    .filter((r) => (r.nomeProfessor || "").toLowerCase().includes(query.toLowerCase()))
    .filter((r) => selectedDegree === "" || r._idsSeries.includes(Number(selectedDegree)))
    .filter((r) => selectedClass === "" || r._idsTurmas.includes(Number(selectedClass)))
    .filter((r) => selectedMatter === "" || (r.nomeDisciplina || "").toLowerCase().includes(selectedMatter.toLowerCase()));

  const alternarExpandir = (linha) => {
    setDegreeFilterSelected("");
    if (professorExpandido && professorExpandido.id === linha._idProfessor) {
      setProfessorExpandido(null);
    } else {
      setProfessorExpandido({ id: linha._idProfessor, idsSeries: linha._idsSeries, idsTurmas: linha._idsTurmas });
    }
  };

  const colunas = [
    { key: "nomeProfessor", label: "Professor" },
    { key: "nomeDisciplina", label: "Disciplinas" },
    { key: "nomesSeries", label: "Séries" },
    { key: "nomesTurmas", label: "Turmas" },
    {
      key: "acoes",
      label: "Ações",
      render: (linha) => (
        <button
          onClick={() => alternarExpandir(linha)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          {professorExpandido && professorExpandido.id === linha._idProfessor ? "Fechar" : "Ver alunos"}
        </button>
      )
    }
  ];

  // opções de filtros
  const opcoesSerie = [{ value: "", label: "Todas as séries" }, ...degreesData.map((d) => ({ value: String(d.id), label: d.name }))];
  const opcoesTurma = [{ value: "", label: "Todas as turmas" }, ...classesData.map((c) => ({ value: String(c.id), label: c.name }))];
  const opcoesDisciplina = [{ value: "", label: "Todas as disciplinas" }, ...mattersData.map((m) => ({ value: String(m.id), label: m.name }))];
  const opcoesFormularioDisciplina = [{ value: "", label: "Selecione uma disciplina" }, ...mattersData.map((m) => ({ value: String(m.id), label: m.name }))];

  // formulário
  const [formTeacherName, setFormTeacherName] = useState("");
  const [formMatterId, setFormMatterId] = useState("");
  const [formDegreeIds, setFormDegreeIds] = useState([]);
  const [formClassIds, setFormClassIds] = useState([]);

  const handleSubmitRelationship = (e) => {
    e.preventDefault();

    if (!formTeacherName.trim()) {
      alert("Digite o nome do professor.");
      return;
    }
    if (!formMatterId) {
      alert("Selecione uma disciplina.");
      return;
    }
    if (formDegreeIds.length === 0) {
      alert("Selecione ao menos uma série.");
      return;
    }

    let teacherId;
    let existingTeacher = listaProfessores.find((t) => t.name.toLowerCase() === formTeacherName.trim().toLowerCase());
    if (existingTeacher) {
      teacherId = existingTeacher.id;
    } else {
      teacherId = listaProfessores.length ? Math.max(...listaProfessores.map((t) => t.id)) + 1 : 1;
      setListaProfessores([...listaProfessores, { id: teacherId, name: formTeacherName.trim() }]);
    }

    let degreesPayload = formDegreeIds.map((d) => ({
      degreeId: Number(d),
      classes: formClassIds.map((c) => ({ classId: Number(c) }))
    }));

    setListaRelacionamentos([...listaRelacionamentos, { teacherId, matterId: Number(formMatterId), degrees: degreesPayload }]);

    setFormTeacherName("");
    setFormMatterId("");
    setFormDegreeIds([]);
    setFormClassIds([]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Professores</h1>

      {/* filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <BarraPesquisa value={query} onChange={setQuery} placeholder="Filtrar por professor" />
        <Filtro label="Série:" value={selectedDegree} onChange={setSelectedDegree} options={opcoesSerie} />
        <Filtro label="Turma:" value={selectedClass} onChange={setSelectedClass} options={opcoesTurma} />
        <Filtro label="Disciplina:" value={selectedMatter} onChange={setSelectedMatter} options={opcoesDisciplina} />
      </div>

      {/* formulário */}
      <div className="border border-gray-300 rounded p-4 mb-6 bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">Novo relacionamento</h3>
        <form onSubmit={handleSubmitRelationship} className="space-y-4">
          <input
            type="text"
            value={formTeacherName}
            onChange={(e) => setFormTeacherName(e.target.value)}
            placeholder="Digite o nome do professor"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <Filtro value={formMatterId} onChange={setFormMatterId} options={opcoesFormularioDisciplina} />

          <div>
            <span className="font-semibold">Séries:</span>
            <div className="flex flex-wrap gap-4 mt-2">
              {degreesData.map((d) => (
                <label key={d.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formDegreeIds.includes(String(d.id))}
                    onChange={() => {
                      if (formDegreeIds.includes(String(d.id))) {
                        setFormDegreeIds(formDegreeIds.filter((x) => x !== String(d.id)));
                      } else {
                        setFormDegreeIds([...formDegreeIds, String(d.id)]);
                      }
                    }}
                  />
                  {d.name}
                </label>
              ))}
            </div>
          </div>

          <div>
            <span className="font-semibold">Turmas:</span>
            <div className="flex flex-wrap gap-4 mt-2">
              {classesData.map((c) => (
                <label key={c.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formClassIds.includes(String(c.id))}
                    onChange={() => {
                      if (formClassIds.includes(String(c.id))) {
                        setFormClassIds(formClassIds.filter((x) => x !== String(c.id)));
                      } else {
                        setFormClassIds([...formClassIds, String(c.id)]);
                      }
                    }}
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Adicionar
          </button>
        </form>
      </div>

      <Table columns={colunas} data={linhasFiltradas} paginated pageSize={15} />

      {/* alunos */}
      {professorExpandido && (
        <div className="mt-6 p-4 border border-gray-300 rounded bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Alunos</h3>
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              onClick={() => setDegreeFilterSelected("")}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
            >
              Todas as séries
            </button>
            {professorExpandido.idsSeries.map((id) => (
              <button
                key={id}
                onClick={() => setDegreeFilterSelected(degreeFilterSelected === String(id) ? "" : String(id))}
                className={`px-3 py-1 border rounded ${
                  degreeFilterSelected === String(id)
                    ? "bg-blue-500 text-white border-blue-500"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                {degreesData.find((d) => d.id === id)?.name || id}
              </button>
            ))}
          </div>

          {(() => {
            let idsAtivos = degreeFilterSelected ? [Number(degreeFilterSelected)] : professorExpandido.idsSeries;
            let alunos = studentsData.filter((s) => idsAtivos.includes(s.degreeId));
            if (selectedClass) {
              alunos = alunos.filter((s) => s.classId === Number(selectedClass));
            }
            if (alunos.length === 0) return <div className="text-gray-500">Nenhum aluno encontrado.</div>;
            return (
              <ul className="list-disc pl-5 space-y-1">
                {alunos.slice(0, 50).map((s, i) => (
                  <li key={i}>{s.name}</li>
                ))}
              </ul>
            );
          })()}
        </div>
      )}
    </div>
  );
}
