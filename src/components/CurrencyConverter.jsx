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
        const fetchCurrencies = async () => {
            setLoadingSymbols(true);
            setError('');
            try {
                const res = await fetch('https://api.exchangerate.host/symbols');
                if (!res.ok) throw new Error('Erro ao buscar moedas');
                const data = await res.json();
                const symbols = data?.symbols ? Object.keys(data.symbols) : [];
                setCurrencies(symbols);
            }   catch (err) {
                setError(err.message);
            }   finally {
                setLoadingSymbols(false)
            }
        };
        fetchCurrencies();
    }, []);

    const convertCurrency = async () => {
        setError('');
        const value = Number(amount);
        if (!Number.isFinite(value)) {
            setError('Informe um valor numérico válido');
            return;
        }
        setLoadingConvert(true);
        try {
            const res = await fetch(
                `https://api.exchangerate.host/convert?from=${fromCurrency}&to=${toCurrency}&amount=${value}`
            );
            if (!res.ok) throw new Error('Erro ao converter moeda');
            const data = await res.json();
            if (data && typeof data.result !== 'undefined') {
                setResult(data.result);
            }   else {
                throw new Error('Resposta inesperada da API.');
            }    
        }   catch(err) {
            setError(err.message);
            setResult(null);
        }   finally {
            setLoadingConvert(false);
        }
    };

return (
    <div className="container">
        {loadingSymbols && <p>Carregando lista de moedas...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <input
        type="number"
        placeholder="Valor"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        />

        <CurrencySelect
        value={fromCurrency}
        onChange={(e) => setFromCurrency(e.target.value)}
        label="De"
        options={currencies}
        />

        <CurrencySelect
        value={toCurrency}
        onChange={(e) => setToCurrency(e.target.value)}
        label="Para"
        options={currencies}
        />

        <button onClick={convertCurrency} disabled={loadingConvert}>
            {loadingConvert ? 'Convertendo...' : 'Converter'}
        </button>
        
        {result !== null && (
            <h2>Resultado: {Number(result).toFixed(2)} {toCurrency}</h2>
        )}
    </div>
);
}

export default CurrencyConverter;