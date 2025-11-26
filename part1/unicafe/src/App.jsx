import { useState } from 'react'

const Title = ({ text }) => {
  return (
    <>
      <h1>{text}</h1>
    </>
  )
}

const StatisticLine = ({ text, value }) => {
  return (
    <>
      <td>
        {text}
      </td>
      <td>
        {value}
      </td>
    </>
  )
}

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad

  if (total === 0) {
    return (
      <>
        <p>No feedback given</p>
      </>
    )
  }

  const average = (good - bad) / total
  const positive = (good / total) * 100

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <StatisticLine text="good" value={good} />
          </tr>
          <tr>
            <StatisticLine text="neutral" value={neutral} />
          </tr>
          <tr>
            <StatisticLine text="bad" value={bad} />
          </tr>
          <tr>
            <StatisticLine text="all" value={total} />
          </tr>
          <tr>
            <StatisticLine text="average" value={average} />
          </tr>
          <tr>
            <StatisticLine text="positive" value={`${positive} %`} />
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const Button = ({ onClick, text }) => {
  return (
    <>
      <button onClick={onClick}>{text}</button>
    </>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

const onGoodClick = () => {
  setGood(good + 1)
}

const onNeutralClick = () => {
  setNeutral(neutral + 1)
}

const onBadClick = () => {
  setBad(bad + 1)
}

  return (
    <div>
      <Title text="give feedback" />
      <Button onClick={onGoodClick} text="good" />
      <Button onClick={onNeutralClick} text="neutral" />
      <Button onClick={onBadClick} text="bad" />
      <Title text="statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App