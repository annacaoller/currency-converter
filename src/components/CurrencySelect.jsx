function CurrencySelect({ id, value, onChange, label, options = [], disabled = false }) {
  const selectId = id || `currency-select-${(label || 'generic').toLowerCase().replace(/\s+/g, '-')}`;
  const isLoading = options.length === 0;

  return (
    <div style={{ margin: '10px' }}>
      <label htmlFor={selectId}>{label}:</label>
      <select
        id={selectId}
        onChange={onChange}
        disabled={disabled || isLoading}
        value={isLoading ? "" : value}
      >
        {isLoading ? (
          <option value="">Carregando…</option>
        ) : (
          options.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))
        )}
      </select>
    </div>
  );
}

export default CurrencySelect;