const Cars = ({ cars, onDelete }) => {
  return (
    <ul>
      {cars.map(car => (
        <li key={car.id}>
          <span>{car.brand} {car.model} ({car.year})</span>
          <button
            className="delete-button"
            onClick={() => onDelete(car.id, `${car.brand} ${car.model}`)}
          >
            Poista
          </button>
        </li>
      ))}
    </ul>
  )
}

export default Cars
