import React, { useState, useEffect } from "react";

export default function Table({ columns = [], data = [], paginated = false, pageSize = 15 }) {
  const [paginaAtual, setPaginaAtual] = useState(0);

  const totalRegistros = data.length;
  let totalPaginas = Math.ceil(totalRegistros / pageSize);
  if (totalPaginas < 1) totalPaginas = 1;

  // garante que a página atual não fique fora do limite
  useEffect(() => {
    if (paginaAtual > totalPaginas - 1) {
      setPaginaAtual(0);
    }
  }, [totalRegistros, totalPaginas]);

  const inicio = paginaAtual * pageSize;
  let fim = inicio + pageSize;
  if (fim > totalRegistros) fim = totalRegistros;

  const dadosPagina = paginated ? data.slice(inicio, fim) : data;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b border-gray-300"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dadosPagina.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-3 text-center text-gray-500"
              >
                Nenhum registro encontrado
              </td>
            </tr>
          ) : (
            dadosPagina.map((item, idx) => (
              <tr
                key={item.id ?? idx}
                className="hover:bg-gray-50 transition-colors"
              >
                {columns.map((col, j) => (
                  <td
                    key={j}
                    className="px-4 py-2 text-sm border-b border-gray-200"
                  >
                    {typeof col.render === "function"
                      ? col.render(item)
                      : item[col.key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {paginated && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPaginaAtual(paginaAtual - 1)}
              disabled={paginaAtual === 0}
              className={`px-3 py-1 rounded border transition ${
                paginaAtual === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              Anterior
            </button>
            <button
              onClick={() => setPaginaAtual(paginaAtual + 1)}
              disabled={paginaAtual >= totalPaginas - 1 || totalRegistros === 0}
              className={`px-3 py-1 rounded border transition ${
                paginaAtual >= totalPaginas - 1 || totalRegistros === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              Próxima
            </button>
          </div>

          <span className="text-gray-600">
            Página {totalRegistros === 0 ? 0 : paginaAtual + 1} de {totalPaginas}
          </span>

          <span className="text-gray-500 text-xs">
            Mostrando {totalRegistros === 0 ? 0 : inicio + 1}–{fim} de {totalRegistros}
          </span>
        </div>
      )}
    </div>
  );
}
