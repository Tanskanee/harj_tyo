const fs = require('fs')
const path = require('path')
const express = require('express')
const cors = require('cors')


const app = express()
const port = 3001

const carsFilePath = path.join(__dirname, 'cars.json')

let cars

try {
    cars = JSON.parse(fs.readFileSync(carsFilePath, 'utf-8'))
} catch (error) {
    console.error('Virhe luettaessa cars.json-tiedostoa:', error)
    process.exit(1)
}

const saveCars = () => {
    try {
        fs.writeFileSync(carsFilePath, JSON.stringify(cars, null, 2))
    } catch (error) {
        console.error('Virhe tallennettaessa cars.json-tiedostoa:', error)
    }
}

app.use(cors())
app.use(express.json())

app.get('/api/cars', (request, response) => {
  response.json(cars)
})

app.get('/api/cars/:id', (request, response) => {
  const car = cars.find(car => car.id === Number(request.params.id))

  if (!car) {
    return response.status(404).json({ error: 'Car not found' })
  }

  response.json(car)
})

app.post('/api/cars', (request, response) => {
  const { brand, model, year } = request.body

  if (!brand?.trim() || !model?.trim() || !Number.isInteger(year)) {
    return response.status(400).json({
      error: 'Brand, model, and a numeric year are required'
    })
  }

  const existingCar = cars.find(car =>
    car.brand.toLowerCase() === brand.trim().toLowerCase() &&
    car.model.toLowerCase() === model.trim().toLowerCase()
  )

  if (existingCar) {
    return response.status(409).json({ error: 'Car already exists' })
  }
  const nextId = cars.length > 0 ? Math.max(...cars.map(car => car.id)) + 1 : 1

  const newCar = {
    id: nextId,
    brand: brand.trim(),
    model: model.trim(),
    year
  }


  cars = cars.concat(newCar)
  saveCars()
  response.status(201).json(newCar)
})

app.put('/api/cars/:id', (request, response) => {
  const id = Number(request.params.id)
  const { brand, model, year } = request.body
  const car = cars.find(car => car.id === id)

  if (!car) {
    return response.status(404).json({ error: 'Car not found' })
  }

  if (!brand?.trim() || !model?.trim() || !Number.isInteger(year)) {
    return response.status(400).json({
      error: 'Brand, model, and a numeric year are required'
    })
  }

  const updatedCar = {
    id,
    brand: brand.trim(),
    model: model.trim(),
    year
  }

  cars = cars.map(car => car.id === id ? updatedCar : car)
  saveCars()
  response.json(updatedCar)
})

app.delete('/api/cars/:id', (request, response) => {
  const id = Number(request.params.id)
  const carExists = cars.some(car => car.id === id)

  if (!carExists) {
    return response.status(404).json({ error: 'Car not found' })
  }

  cars = cars.filter(car => car.id !== id)
  saveCars()
  response.status(204).end()
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})