const express = require("express");
const mongoose = require("mongoose");
const Tarefa = require("./model");
const cors = require("cors");
require("./database");
const app = express();
const PORT = 3001;

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API do Gerenciador de Tarefas funcionando");
});

app.post("/tarefas", async (req, res) => {
  try {
    const novaTarefa = new Tarefa(req.body);
    await novaTarefa.save();
    res
      .status(201)
      .json({ mensagem: "Tarefa criada com sucesso!", tarefa: novaTarefa });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao salvar a tarefa.", detalhes: error });
  }
});

app.get("/tarefas", async (req, res) => {
  try {
    const tarefas = await Tarefa.find();
    res.json(tarefas);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar tarefas." });
  }
});

app.put("/mudarStatus/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const tarefa = await Tarefa.findById(id);
    if (!tarefa) {
      return res.status(404).json({ erro: "Tarefa não encontrada." });
    }
    tarefa.status = tarefa.status === "ativo" ? "desativado" : "ativo";
    await tarefa.save();
    res.json({ mensagem: "Status atualizado com sucesso.", tarefa });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar o status." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
