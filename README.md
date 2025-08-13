# 📚 Painel Escolar

Aplicação web desenvolvida em **React** para gerenciamento de professores, alunos, séries e turmas.  
Inclui filtros, cadastro e edição, geração automática de registros e gráficos interativos.

---

## 🚀 Tecnologias Utilizadas

- **React** — Criado com [Create React App](https://create-react-app.dev/)
- **React Router Dom** — Navegação entre telas
- **Chart.js** + **React ChartJS 2** — Criação de gráficos
- **TailwindCSS** — Estilização
- **LocalStorage** — Persistência de dados no navegador

---

## 📦 Instalação e Configuração

### 1️⃣ Clonar o repositório
```bash
git clone https://github.com/SEU_USUARIO/painel-escolar.git
cd painel-escolar
```

### 2️⃣ Instalar dependências
```bash
npm install
```

### 3️⃣ Instalar bibliotecas adicionais
```bash
npm install react-router-dom chart.js react-chartjs-2
```

### 4️⃣ Rodar o projeto
```bash
npm start
```
O projeto estará disponível em **http://localhost:3000**

---

## 🖥 Estrutura do Projeto

```
src/
  ├── components/
  │   ├── BarraPesquisa.jsx
  │   ├── Filtro.jsx
  │   ├── Grafico.jsx
  │   └── Tabela.jsx
  ├── data/
  │   ├── classes.json
  │   ├── degrees.json
  │   ├── relationships.json
  │   ├── students.json
  │   └── teachers.json
  ├── pages/
  │   ├── Tela1.jsx  # Gerenciamento de alunos
  │   └── Tela2.jsx  # Gerenciamento de professores
  ├── App.js         # Configuração de rotas e menu
  └── index.js       # Ponto de entrada
```

---

## 📌 Funcionalidades

### ✅ Gerenciamento de Alunos
- Listagem com filtros por nome/ID, série e turma  
- Edição de informações  
- Geração automática de alunos com IDs e RAs sequenciais  
- Persistência via LocalStorage  

### ✅ Gerenciamento de Professores
- Cadastro de novos professores  
- Associação com disciplinas, séries e turmas  
- Filtros e pesquisa  
- Visualização de alunos por professor  

### ✅ Gráficos
- Exibição de gráficos interativos com Chart.js  
- Dados atualizados conforme filtros  

### ✅ Navegação
- Menu com rotas usando React Router Dom  
- Botão para resetar dados (limpar LocalStorage)  

---

## 🔄 Resetar Dados
Para apagar os dados salvos no navegador e restaurar os padrões iniciais:

No console do navegador:
```js
localStorage.clear();
```

Ou usando o botão **"Resetar Dados"** no menu do projeto.

---


---

## 📷 Demonstração

### 📄 Página 1 — Lista de Alunos
![Página 1](https://raw.githubusercontent.com/Furquimn/painel-escolar/main/src/img/tela1.png)

### 📄 Página 2 — Professores
![Página 2](https://raw.githubusercontent.com/Furquimn/painel-escolar/main/src/img/tela2.png)


## ✍️ Autor
**Christian Furquim**
