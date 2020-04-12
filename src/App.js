import React, {useState} from 'react';
import './App.css';
import {useQuery, useMutation} from 'react-query'
import {ActionCableProvider, useActionCable} from 'use-action-cable'

const Count = ({id, value}) => {
  const [increment] = useMutation(() => fetch(`http://localhost:3000/counts/${id}`, {method: 'PUT'}))
  const [decrement] = useMutation(() => fetch(`http://localhost:3000/counts/${id}?decrement=1`, {method: 'PUT'}))
  const [newValue, setNewValue] = useState()
  useActionCable(
    {channel: 'CountChannel', countId: id},
    {received: data => setNewValue(data.value)}
  )

  return <li>
    id: {id}, value: {newValue || value}
    <button type="button" style={{marginLeft: 10}} onClick={decrement}>-</button>
    <button type="button" style={{marginLeft: 10}} onClick={increment}>+</button>
  </li>
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
      <ul>
        {counts.map(({id, value}) => <Count id={id} value={value} key={id} />)}
      </ul>
    </ActionCableProvider>
  );
}

export default App;
