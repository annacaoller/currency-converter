import { useState, useEffect } from "react";
import CurrencySelect from "./CurrencySelect";

function CurrencyConverter() {
    const [amount, setAmound] = useState('');
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('BRL');
    const [result, setResult] = useState(null);
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCurrencies = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await fetch('https://api.exchangerate.host/symbols');
                if (!res.ok) throw new Error('Erro ao buscar moedas');
                const data = await res.json();
                setCurrencies(Object.keys(data.symbols));
            }   catch (err) {
                setError(err.message);
            }   finally {
                setLoading(false)
            }
        };
        fetchCurrencies();
    }, []);

    const convertCurrency = async () => {
        if (!amount) return;
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`https://api.exchangerate.host/convert?from=${fromCurrency}&to=${toCurrency}$amount=${amount}`);
            if (!res.ok) throw new Error('Erro ao converter moeda');
            const data = await res.json();
            setResult(data.result);
        }   catch(err) {
            setError(err.message);
        }   finally {
            setLoading(false);
        }
    };

return (
    <div className="container">
        {loading && <p>Carregando...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <input
        type="number"
        placeholder="Valor"
        value={amount}
        onChange={(e) => setAmound(e.target.value)}
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

        <button onClick={convertCurrency}>Converter</button>
        {result && <h2>Ressultado: {result.toFixed(2)} {toCurrency}</h2>}
    </div>
);
}

export default CurrencyConverter;