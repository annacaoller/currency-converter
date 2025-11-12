function CurrencySelect({value, onChange, label, options}) {
    return (
        <div style={{ margin: '10px' }}>
            <label>
                {label}:
                <select value={value} onChange={onChange}>
                    {options.map((currency) => (
                        <option key={currency} value={currency}>{currency}</option>
                    ))}
                </select>
            </label>
        </div>
    );
}

export default CurrencySelect;