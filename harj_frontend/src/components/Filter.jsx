const Filter = ({
  carBrand,
  carModel,
  carYear,
  onBrandChange,
  onModelChange,
  onYearChange
}) => {
  return (
    <div>
      <label>
        Merkki:
        <input value={carBrand} onChange={onBrandChange} />
      </label>
      <label>
        Malli:
        <input value={carModel} onChange={onModelChange} />
      </label>
      <label>
        Vuosi:
        <input value={carYear} onChange={onYearChange} />
      </label>
    </div>
  )
}

export default Filter