import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
//import LudoBoard from './LudoBoard';
import TodoList from './TodoList';
import Ticket from './Ticket';
import Lottery from './Lottery';

function App() {
  
  return (
    <>
    <Lottery n={3} winningSum={15}/>
    {/*<Ticket ticket={[0,1,2]}/>
    <Ticket ticket={[0,7,0]}/>
    <Ticket ticket={[0,1,2]}/>*/}
    
    </>
  )
}

export default App
