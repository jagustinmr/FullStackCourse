import { useState, useEffect } from 'react'
import PeopleList from './components/PeopleList'
import FilterPerson from './components/Filter'
import PersonForm from './components/PersonForm'
import phonesApi from './service/phones'
import Notification from './components/Notification'
import { notificationStyleSuccess, notificationStyleError } from './stylesConstatns'
const App = () => {
    const [persons, setPersons] = useState([])
    const personHook = () => { 
      phonesApi.getAll().then(response => {
        setPersons(response)
      })
    }
    useEffect(personHook, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationStyle, setNotificationStyle] = useState({})

  const handleNameChange = (event) => {
      setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
      setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
      setFilter(event.target.value)
  }

  const notificationMessageChange = (message) => {
    setNotificationMessage(message)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  const onDeleteClick = (person) => {
    const nameToDelete = person.name
    const personToDelete = persons.find(person => person.name === nameToDelete)
    if (personToDelete && window.confirm(`Delete ${nameToDelete} ?`)) {
      phonesApi.deletePerson(personToDelete.id).then(() => {
        setPersons(persons.filter(person => person.id !== personToDelete.id))
      }).catch(() => {
        setNotificationStyle(notificationStyleError)
        notificationMessageChange(`Information of ${nameToDelete} has already been removed from server`)
        setPersons(persons.filter(person => person.id !== personToDelete.id))
      })
    }
  }

  const handlePersonAdd = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber
    }

    const existingPerson = persons.find(person => person.name === newName)
    if (existingPerson) {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        phonesApi.update(existingPerson.id, { ...existingPerson, number: newNumber })
          .then(response => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : response.data))
            setNewName('')
            setNewNumber('')
          })
      }
    } else {
      phonesApi.create(newPerson).then(response => {
        setPersons(persons.concat(response))
        setNewName('')
        setNewNumber('')
      })
      setNotificationStyle(notificationStyleSuccess)
      notificationMessageChange(`Added ${newName}`, notificationStyleSuccess)
    }

  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} notificationStyle={notificationStyle} />
      <div>filter shown with <input onChange={handleFilterChange} /></div>
      <FilterPerson persons={persons} filter={filter} />
      <h2>Add a new</h2>
      <PersonForm 
        addPerson={handlePersonAdd} 
        newName={newName} 
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <PeopleList persons={persons} onClick={onDeleteClick} />
    </div>
  )
}

export default App