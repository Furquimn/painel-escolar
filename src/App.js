import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Tela1 from "./pages/Tela1";
import Tela2 from "./pages/Tela2";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navbar */}
        <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="text-white font-bold text-lg tracking-wide">
                Painel Escolar
              </div>

              {/* Links */}
              <div className="flex space-x-6">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive
                        ? "bg-white text-blue-600 shadow"
                        : "text-white hover:bg-blue-500/50"
                    }`
                  }
                >
                  Página 1
                </NavLink>

                <NavLink
                  to="/tela2"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive
                        ? "bg-white text-blue-600 shadow"
                        : "text-white hover:bg-blue-500/50"
                    }`
                  }
                >
                  Página 2
                </NavLink>
              </div>

              {/* Botão extra */}
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="bg-white text-blue-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100 transition shadow"
              >
                Resetar Dados
              </button>
            </div>
          </div>
        </nav>

        {/* Conteúdo */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Tela1 />} />
            <Route path="/tela2" element={<Tela2 />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
