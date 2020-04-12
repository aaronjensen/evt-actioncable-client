import React, {useState} from 'react';
import './App.css';
import {useQuery, useMutation} from 'react-query'
import {ActionCableProvider, useActionCable} from 'use-action-cable'

let now = performance.now()

const Count = ({id, value}) => {
  const [increment] = useMutation(() => {
    now = performance.now()

    return fetch(`http://localhost:3000/counts/${id}`, {method: 'PUT'})
  })
  const [decrement] = useMutation(() => fetch(`http://localhost:3000/counts/${id}?decrement=1`, {method: 'PUT'}))
  const [newValue, setNewValue] = useState()

  useActionCable(
    {channel: 'CountChannel', countId: id},
    {
      received: data => {
        console.log(performance.now() - now)
        setNewValue(data.value)
      }
    }
  )

  return <tr>
    <td>
      {id}
    </td>
    <td style={{width: 100, textAlign: 'right'}}>
      {newValue || value}
    </td>
    <td>
      <button type="button" style={{marginLeft: 10, padding: 10}} onClick={decrement}>-</button>
      <button type="button" style={{marginLeft: 10, padding: 10}} onClick={increment}>+</button>
    </td>
  </tr>
}

function App() {
  const {status, data} = useQuery('counts', () => fetch('http://localhost:3000/counts')
    .then(response => response.json()))

  if (status !== 'success') {
    return <div>{status}</div>
  }

  const counts = data.data

  return (
    <ActionCableProvider url="http://localhost:3000/cable">
      <table style={{margin: 20}}>
        <thead>
          <tr>
            <td>id</td>
            <td>count</td>
          </tr>
        </thead>
        <tbody>
          {counts.map(({id, value}) => <Count id={id} value={value} key={id} />)}
        </tbody>
      </table>
    </ActionCableProvider>
  );
}

export default App;
