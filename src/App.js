import React from 'react';
import logo from './logo.svg';
import './App.css';
import {useQuery} from 'react-query'

function App() {
  const {status, data} = useQuery('counts', () => fetch('http://localhost:3000/counts')
    .then(response => response.json()))

  if (status !== 'success') {
    return <div>{status}</div>
  }


  const counts = data.data

  return (
    <ul>
      {counts.map(({id, value}) =>
        <li>
          id: {id}, value: {value}
        </li>
      )}
    </ul>
  );
}

export default App;
