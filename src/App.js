import React, { useEffect } from 'react'

import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { socket } from './socket'

function App() {
  const [mode, setMode] = React.useState('')
  const [playerName, setPlayerName] = React.useState('')
  const [modeInput, setModeInput] = React.useState(false)

  const handleChangeName = (event) => {
    setPlayerName(event.target.value)
  }
  const handleChangeMode = (event) => {
    setMode(event.target.value)

    socket.emit('set-mode', event.target.value)
  }

  const connect = () => {
    socket.emit('request-game', {
      playerName
    })
  }

  useEffect(() => {
    socket.connect()

    socket.on('joined-game', (e) => {
      console.log(e)
    })

    socket.on('player-disconnected', (e) => {
      console.log('Se desconecto', e)
    })

    socket.on('player-connected', (e) => {
      console.log('Se conecto', e)
    })

    socket.on('table-assigned', (e) => {
      console.log('Carton asignado', e)
    })
    socket.once('lobby-closed', (e) => {
      setModeInput(true)
    })

    return () => {
      socket.off('joined-game')
      socket.off('player-disconnected')
    }
  }, [])

  return (
    <>
      <Typography variant='h1' component='h1'>
        Bingo
      </Typography>
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
          <Select
            value={mode}
            label='Selecciona el modo de juego'
            onChange={handleChangeMode}
            disabled={modeInput}
          >
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
