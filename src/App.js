import React, { useEffect } from 'react'

import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { socket } from './socket'

function App() {
  const [mode, setMode] = React.useState('')
  const [playerName, setPlayerName] = React.useState('')

  const handleChangeName = (event) => {
    setPlayerName(event.target.value)
  }
  const handleChangeMode = (event) => {
    setMode(event.target.value)
  }

  const connect = () => {
    socket.emit('new-player-request', {
      playerName
    })
  }

  useEffect(() => {
    socket.connect()
    socket.on('new-user', (players) => {
      console.log(players)
    })
    socket.on('user-disconnected', (player) => {
      console.log('Se desconecto', player)
    })

    return () => {
      socket.off('new-user')
      socket.off('user-disconnected')
    }
  }, [])

  return (
    <>
      <Box sx={{ minWidth: 120, marginTop: 10, component: 'form' }}>
        <FormControl fullWidth sx={{ marginBottom: 5 }}>
          <TextField
            label='Ingresa tu nombre jugador'
            variant='outlined'
            onChange={handleChangeName}
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Selecciona el modo de juego</InputLabel>
          <Select value={mode} label='Selecciona el modo de juego' onChange={handleChangeMode}>
            <MenuItem value={'NORMAL'}>NORMAL</MenuItem>
            <MenuItem value={'FULL'}>FULL</MenuItem>
          </Select>
        </FormControl>
        <Button variant='outlined' sx={{ marginTop: 5 }} onClick={connect}>
          Conectarse
        </Button>
      </Box>
    </>
  )
}

export default App
