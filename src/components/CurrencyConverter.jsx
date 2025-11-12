import { useState, useEffect } from "react";
import CurrencySelect from "./CurrencySelect";

function CurrencyConverter() {
  const [amount, setAmount] = useState('');                                    
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('BRL');
  const [result, setResult] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [loadingSymbols, setLoadingSymbols] = useState(false);
  const [loadingConvert, setLoadingConvert] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setLoadingSymbols(true);
      setError('');

      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD', { signal: controller.signal }); 
        if (!res.ok) throw new Error(`Erro ao buscar moedas (HTTP ${res.status})`);                       

        const data = await res.json();
        if (data?.result !== 'success' || !data?.rates || typeof data.rates !== 'object') {               
          throw new Error('Resposta inesperada ao buscar moedas.');                                        
        }

        const symbols = Object.keys(data.rates).sort();                                                    
        setCurrencies(symbols);
      } catch (err) {
        setError(err.message || 'Falha ao buscar moedas.');
        setCurrencies(['USD', 'BRL', 'EUR', 'GBP', 'JPY']);                                               
      } finally {
        setLoadingSymbols(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const convertCurrency = async () => {
    setError('');

    const value = Number(amount);
    if (!Number.isFinite(value)) {
      setError('Informe um valor numérico válido.');
      return;
    }

    setLoadingConvert(true);
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${encodeURIComponent(fromCurrency)}`);   
      if (!res.ok) throw new Error(`Erro ao converter (HTTP ${res.status})`);                             

      const data = await res.json();
      if (data?.result !== 'success' || !data?.rates || typeof data.rates !== 'object') {                 
        throw new Error('Resposta inesperada da API de conversão.');                                       
      }

      const rate = data.rates[toCurrency];                                                                 
      if (typeof rate !== 'number') {                                                                      
        throw new Error(`Taxa ${fromCurrency}→${toCurrency} indisponível.`);                               
      }

      setResult(rate * value);                                                                             
    } catch (err) {
      setError(err.message || 'Falha ao converter.');
      setResult(null);
    } finally {
      setLoadingConvert(false);
    }
  };

  return (
    <div className="container">
      {loadingSymbols && <p>Carregando lista de moedas…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input
        type="number"
        placeholder="Valor"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <CurrencySelect
        label="De"
        value={fromCurrency}
        onChange={(e) => setFromCurrency(e.target.value)}
        options={currencies}
        isLoading={loadingSymbols}                                                                           
        loadError={!!error}                                                                                  
      />

      <CurrencySelect
        label="Para"
        value={toCurrency}
        onChange={(e) => setToCurrency(e.target.value)}
        options={currencies}
        isLoading={loadingSymbols}                                                                           
        loadError={!!error}                                                                                  
      />

      <button onClick={convertCurrency} disabled={loadingConvert || loadingSymbols}>
        {loadingConvert ? 'Convertendo…' : 'Converter'}
      </button>

      {result !== null && (
        <h2>Resultado: {Number(result).toFixed(2)} {toCurrency}</h2>
      )}
    </div>
  );
}

export default CurrencyConverter;