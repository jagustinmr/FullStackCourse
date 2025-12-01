const Header = (props) => <h2>{props.course}</h2>

const Content = (props) => {

  return <div>
    {props.parts.map(part => 
      <Part key={part.id} part={part.name} exercises={part.exercises} />
    )}
  </div>
}

const Part = (props) => {
  return (
    <p>{props.part} {props.exercises}</p>
  )
}

const Total = (props) => <b>total of {props.total} exercises</b>

const Course = (props) => {
  const totalExercises = props.course.parts.reduce((acc, part) => acc + part.exercises, 0)

  return (
    <div>
      <Header course={props.course.name} />
      <Content parts={props.course.parts} />
      <Total total={totalExercises} />
    </div>
  )
}

export default Course