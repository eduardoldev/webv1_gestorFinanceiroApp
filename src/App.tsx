import { useEffect, useState } from "react";

type Despesa = {
  descricao: string;
  valor: number;
};

type Receita = {
  descricao: string;
  valor: number;
};

export default function App() {
  const [despesas, setDespesas] = useState<Despesa[]>(() => {
    const saved = localStorage.getItem("despesas");
    return saved ? JSON.parse(saved) : [];
  });

  const [receitas, setReceitas] = useState<Receita[]>(() => {
    const saved = localStorage.getItem("receitas");
    return saved ? JSON.parse(saved) : [];
  });

  const [saldo, setSaldo] = useState(() => {
    const saved = localStorage.getItem("saldo");
    return saved ? Number(saved) : 0;
  });

  const [desc, setDesc] = useState("");
  const [valor, setValor] = useState(0);
  const [tipo, setTipo] = useState<"receita" | "despesa">("receita");

  const adicionar = () => {
    if (!desc.trim()) {
      window.alert("Por favor, preencha a descrição.");
      return;
    }

    if (valor <= 0 || isNaN(valor)) {
      window.alert("Por favor, informe um valor válido maior que zero.");
      return;
    }

    if (tipo === "despesa") {
      const novaDespesa: Despesa = { descricao: desc, valor };
      const novasDespesas = [...despesas, novaDespesa];
      setDespesas(novasDespesas);
      setSaldo((prev) => prev - valor);
    } else {
      const novaReceita: Receita = { descricao: desc, valor };
      const novasReceitas = [...receitas, novaReceita];
      setReceitas(novasReceitas);
      setSaldo((prev) => prev + valor);
    }

    setDesc("");
    setValor(0);
  };

  const removerDespesa = (index: number) => {
    const despesa = despesas[index];
    const novasDespesas = despesas.filter((_, i) => i !== index);
    setDespesas(novasDespesas);
    setSaldo((prev) => prev + despesa.valor);
  };

  const removerReceita = (index: number) => {
    const receita = receitas[index];
    const novasReceitas = receitas.filter((_, i) => i !== index);
    setReceitas(novasReceitas);
    setSaldo((prev) => prev - receita.valor);
  };

  const limparTudo = () => {
    const confirmar = window.confirm("Tem certeza que deseja limpar tudo?");
    if (confirmar) {
      setDespesas([]);
      setReceitas([]);
      setSaldo(0);
      localStorage.clear();
    }
  };

  useEffect(() => {
    localStorage.setItem("despesas", JSON.stringify(despesas));
    localStorage.setItem("receitas", JSON.stringify(receitas));
    localStorage.setItem("saldo", saldo.toString());
  }, [despesas, receitas, saldo]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-slate-800">
          Controle Financeiro
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Descrição"
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <input
            type="number"
            placeholder="Valor"
            className="w-32 border border-slate-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={valor === 0 ? "" : valor}
            onChange={(e) => {
              const v = Number(e.target.value);
              setValor(isNaN(v) ? 0 : v);
            }}
          />
          <select
            className="border border-slate-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as "receita" | "despesa")}
          >
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
          </select>
          <button
            onClick={adicionar}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Adicionar
          </button>
        </div>

        <div className="flex justify-between items-center bg-slate-50 rounded-lg p-4 mb-6 border border-slate-200">
          <h2 className="text-2xl font-semibold">
            Saldo:{" "}
            <span className={saldo >= 0 ? "text-green-600" : "text-red-600"}>
              R$ {saldo.toFixed(2)}
            </span>
          </h2>
          <button
            onClick={limparTudo}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
          >
            Limpar Tudo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-red-600">
              Despesas
            </h3>
            <ul className="space-y-2">
              {despesas.map((despesa, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-red-50 border border-red-200 px-4 py-2 rounded-lg"
                >
                  <div>
                    {despesa.descricao} - R$ {despesa.valor.toFixed(2)}
                  </div>
                  <button
                    onClick={() => removerDespesa(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </li>
              ))}
              {despesas.length === 0 && (
                <p className="text-sm text-slate-500">Nenhuma despesa</p>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-green-600">
              Receitas
            </h3>
            <ul className="space-y-2">
              {receitas.map((receita, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-green-50 border border-green-200 px-4 py-2 rounded-lg"
                >
                  <div>
                    {receita.descricao} - R$ {receita.valor.toFixed(2)}
                  </div>
                  <button
                    onClick={() => removerReceita(index)}
                    className="text-green-600 hover:text-green-800"
                  >
                    ✕
                  </button>
                </li>
              ))}
              {receitas.length === 0 && (
                <p className="text-sm text-slate-500">Nenhuma receita</p>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="fixed bottom-2 right-4 text-slate-500 text-xs">
        GestorFinanceiroApp
      </div>
    </div>
  );
}
