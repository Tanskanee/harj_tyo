import React, { useEffect, useState } from 'react'
import './App.css'
import Filter from './components/Filter.jsx'
import Cars from './components/Cars.jsx'

const App = () => {
  const [carList, setCarList] = useState([])
  const [newBrand, setNewBrand] = useState("")
  const [newModel, setNewModel] = useState("")
  const [newYear, setNewYear] = useState("")
  const [filterBrand, setFilterBrand] = useState("")
  const [filterModel, setFilterModel] = useState("")
  const [filterYear, setFilterYear] = useState("")

  useEffect(() => {
    fetch('http://localhost:3001/api/cars')
      .then(response => {
        if (!response.ok) {
          throw new Error('Autojen haku epäonnistui')
        }

        return response.json()
      })
      .then(data => {
        setCarList(data)
      })
      .catch(error => {
        console.error('Virhe autojen haussa:', error)
      })
  }, [])

  const addCar = async (event) => {
    event.preventDefault()

    if (!newBrand.trim() || !newModel.trim() || !newYear.trim()) {
      window.alert("Merkki, malli ja vuosi ovat pakollisia.")
      return
    }

    const year = Number(newYear)
    if (!Number.isInteger(year) || year < 1886) {
      window.alert("Vuosi täytyy olla kelvollinen luku.")
      return
    }

    const existingCar = carList.find(car =>
      car.brand.toLowerCase() === newBrand.trim().toLowerCase() &&
      car.model.toLowerCase() === newModel.trim().toLowerCase()
    )

    if (existingCar) {
      if (window.confirm(`${newBrand} ${newModel} already exists, replace its year?`)) {
        const response = await fetch(`http://localhost:3001/api/cars/${existingCar.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...existingCar, year })
        })

        if (!response.ok) {
          window.alert("Auton päivitys epäonnistui.")
          return
        }

        const updatedCar = await response.json()
        setCarList(carList.map(car =>
          car.id === updatedCar.id ? updatedCar : car
        ))
        setNewBrand("")
        setNewModel("")
        setNewYear("")
      }
      return
    }

    const response = await fetch('http://localhost:3001/api/cars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brand: newBrand.trim(),
        model: newModel.trim(),
        year
      })
    })

    if (!response.ok) {
      window.alert("Auton lisääminen epäonnistui.")
      return
    }

    const newCar = await response.json()
    setCarList(carList.concat(newCar))
    setNewBrand("")
    setNewModel("")
    setNewYear("")

    window.alert("Auto lisätty.")
  }

  const deleteCar = async (id, name) => {
    if (window.confirm(`Poistetaanko ${name}?`)) {
      const response = await fetch(`http://localhost:3001/api/cars/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        window.alert("Auton poistaminen epäonnistui.")
        return
      }

      setCarList(carList.filter(car => car.id !== id))
    }
  }

  const carsToShow = carList.filter(car => 
    car.brand.toLowerCase().includes(filterBrand.toLowerCase()) &&
    car.model.toLowerCase().includes(filterModel.toLowerCase()) &&
    car.year.toString().includes(filterYear)
  )
  return (
    <div className="app">
      <h1>Autot</h1>
      <h2>Lisää uusi auto</h2>
      <form onSubmit={addCar}>
        <div className="form-fields">
          <label>
            Merkki:
            <input value={newBrand} onChange={event => setNewBrand(event.target.value)} />
          </label>
          <label>
            Malli:
            <input value={newModel} onChange={event => setNewModel(event.target.value)} />
          </label>
          <label>
            Vuosi:
            <input value={newYear} onChange={event => setNewYear(event.target.value)} />
          </label>
        </div>

        <div><button type="submit">lisää</button></div>
      </form>
      <div className="content-layout">
        <section className="filter-section">
          <h2>Suodata autoja</h2>
          <Filter
            carBrand={filterBrand}
            carModel={filterModel}
            carYear={filterYear}
            onBrandChange={event => setFilterBrand(event.target.value)}
            onModelChange={event => setFilterModel(event.target.value)}
            onYearChange={event => setFilterYear(event.target.value)}
          />
        </section>
        <section className="cars-section">
          <h2>Lista nykyisistä autoista</h2>
          <Cars cars={carsToShow} onDelete={deleteCar} />
        </section>
      </div>
    </div>
    )
}

export default App