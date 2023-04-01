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
import CircularProgress from '@mui/material/CircularProgress'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'
import { Table } from './table'

function App() {
  const [playerName, setPlayerName] = React.useState('')
  const [modeInput, setModeInput] = React.useState(false)
  const [mode, setMode] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [gameStarted, setGameStarted] = React.useState(false)
  const [table, setTable] = React.useState(undefined)

  const handleChangeName = (event) => {
    setPlayerName(event.target.value)
  }
  const handleChangeMode = (event) => {
    setMode(event.target.value)
    socket.emit('set-mode', {
      mode: event.target.value
    })
  }

  const connect = () => {
    socket.emit('request-game', {
      playerName
    })
  }

  useEffect(() => {
    socket.connect()
    socket.on('joined-game', (e) => {
      setIsLoading(true)
      console.log(e)
    })
    socket.on('player-connected', (e) => {
      console.log('Se conecto', e)
    })
    socket.on('player-disconnected', (e) => {
      console.log('Se desconecto', e)
    })
    socket.on('table-assigned', (e) => {
      console.log('Se asigno el carton', e)
      const transposedValues = e.table[0].map((_, colIndex) => e.table.map((row) => row[colIndex]))

      setTable(transposedValues)
    })
    socket.on('lobby-closed', () => {
      console.log('Se cerro el lobby')
      setIsLoading(false)
    })
    socket.on('current-status', (e) => {
      console.log(e)
      if (e.currentGameMode) {
        setModeInput(true)
      }
      if (e.gameStarted) {
        setGameStarted(true)
      }
    })
  }, [])

  return (
    <>
      <Typography variant='h3' component='h3' sx={{ marginBottom: 10 }}>
        Bingo
      </Typography>

      {gameStarted ? (
        <>
          <Typography variant='h5' component='h5'>
            La partida se cerró intentalo más tarde <SentimentVeryDissatisfiedIcon />
          </Typography>
        </>
      ) : isLoading ? (
        <>
          <CircularProgress sx={{ marginBottom: 5 }} />
          <Typography variant='h4' component='h4'>
            Esperando a otros jugadores
          </Typography>
        </>
      ) : (
        <Box sx={{ minWidth: 120, component: 'form' }}>
          <FormControl fullWidth>
            <TextField
              value={playerName}
              label='Ingresa tu nombre jugador'
              variant='outlined'
              onChange={handleChangeName}
            />
          </FormControl>
          <FormControl fullWidth sx={{ marginTop: 5 }}>
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
      )}
      {table && <Table table={table} />}
    </>
  )
}

export default App
