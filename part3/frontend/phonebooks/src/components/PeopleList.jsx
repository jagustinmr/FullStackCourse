
const PeopleList = ({ persons, onClick }) => {
  return (
    <ul>
      {persons.map((person) => 
        <li key={person.id}>{`${person.name} ${person.number}`} <button onClick={() => onClick(person)}>delete</button></li>  
      )}
    </ul>
  )
}
export default PeopleList