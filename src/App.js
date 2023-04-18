/* eslint-disable react-hooks/exhaustive-deps */
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
import Modal from '@mui/material/Modal'
import Stack from '@mui/material/Stack'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
function App() {
  const [playerName, setPlayerName] = React.useState('')
  const [modeInput, setModeInput] = React.useState(false)
  const [mode, setMode] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [gameStarted, setGameStarted] = React.useState(false)
  const [table, setTable] = React.useState(undefined)
  const [open, setOpen] = React.useState(false)
  const [waitingBoard, setWaitingBoard] = React.useState(false)
  const [numbers, setNumbers] = React.useState([])
  const [players, setPlayers] = React.useState([])
  const [win, setWin] = React.useState(false)
  const [winner, setWinner] = React.useState(undefined)

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
    setWaitingBoard(true)
  }

  const startGame = () => {
    socket.emit('Start', 'juego iniciado')
    setWaitingBoard(true)
  }

  const handleModalButtonClick = (answer) => {
    socket.emit('answer-table', {
      accept: answer
    })
    
  }

  useEffect(() => {
    socket.connect()
    socket.on('joined-game', (e) => {
      setIsLoading(true)
    })
    socket.on('player-connected', (e) => {
      console.log(e)
      setPlayers(e.activeUsers)
    })
    socket.on('player-disconnected', (e) => {})
    socket.on('table-assigned', (e) => {
      const transposedValues = e.table[0].map((_, colIndex) => e.table.map((row) => row[colIndex]))

      setTable(transposedValues)
      setOpen(true)
    })
    socket.on('game-has-started', () => {
      setIsLoading(false)
      setWaitingBoard(false)
    })
    socket.on('current-status', (e) => {
      if (e.currentGameMode) {
        setModeInput(true)
      }
      if (e.gameStarted) {
        setGameStarted(true)
      }
    })

    socket.on('num-announced', (e) => {
      setNumbers([...numbers, e.number].sort((a, b) => a - b))
    })

    socket.on('win-announced', (e) => {
      setWin(true)
      console.log('ganador')
      console.log(e)
      setWinner(e.winner)
    })
  })

  const isMarked = (value) => {
    if (value === -1) {
      return true
    }
    let marked = false
    for (let index = 0; index < numbers.length; index++) {
      if (value === numbers[index]) {
        marked = true
      }
    }

    return marked
  }

  function checkTable(table, numbers) {
    console.log('revisando con', table, numbers)
    // Verificar filas
    for (let row of table) {
      if (numbers.every((num) => row.includes(num))) {
        return true
      }
    }

    // Verificar columnas
    for (let j = 0; j < 5; j++) {
      let column = []
      for (let i = 0; i < 5; i++) {
        column.push(table[i][j])
      }
      if (numbers.every((num) => column.includes(num))) {
        return true
      }
    }

    // Verificar diagonal principal
    let diagonalP = []
    for (let i = 0; i < 5; i++) {
      diagonalP.push(table[i][i])
    }
    if (numbers.every((num) => diagonalP.includes(num))) {
      return true
    }

    // Verificar diagonal secundaria
    let diagonalS = []
    for (let i = 0; i < 5; i++) {
      diagonalS.push(table[i][4 - i])
    }
    if (numbers.every((num) => diagonalS.includes(num))) {
      return true
    }

    // Si no se encontró ningún ganador, retorna false
    return false
  }

  useEffect(() => {
    if (table) {
      const result = checkTable(table, numbers)

      console.log(result)
      socket.emit('claim-win', {
        table
      })

      // socket.on('win-announced', (e) => {
      //   console.log('ganador')
      //   console.log(e)
      // })

      // let win = true
      // for (let i = 0; i < 5; i++) {
      //   win = true
      //   for (let j = 0; j < 5; j++) {
      //     if (!isMarked(table[i][j])) {
      //       win = false
      //       break
      //     }
      //   }
      //   if (win) {
      //     socket.emit('claim-win', {
      //       table
      //     })
      //     return
      //   }
      // }
      // for (let i = 0; i < 5; i++) {
      //   win = true
      //   for (let j = 0; j < 5; j++) {
      //     if (!isMarked(table[j][i])) {
      //       win = false
      //       break
      //     }
      //   }
      //   if (win) {
      //     socket.emit('claim-win', {
      //       table
      //     })
      //     return
      //   }
      // }
      // if (
      //   (isMarked(table[0][0]) &&
      //     isMarked(table[1][1]) &&
      //     isMarked(table[2][2]) &&
      //     isMarked(table[3][3]) &&
      //     isMarked(table[4][4])) ||
      //   (isMarked(table[0][4]) &&
      //     isMarked(table[1][3]) &&
      //     isMarked(table[2][2]) &&
      //     isMarked(table[3][1]) &&
      //     isMarked(table[4][0]))
      // ) {
      //   socket.emit('claim-win', {
      //     table
      //   })
      //   return
      // }
    }
  }, [table, numbers])

  return (
    <>
      <Typography variant='h3' component='h3' sx={{ marginBottom: 10 }}>
        Bingo
      </Typography>
      {win && (
        <>
          <Typography variant='p' component='p'>
            Ganador
          </Typography>
          <Box sx={{ display: 'flex', marginBottom: 10, flexWrap: 'wrap' }}>
              <Typography variant='p' component='p' sx={{ display: 'inline' }}>
              {winner.name} <br/>
              </Typography>
              <Table table={winner.table} />
          </Box>
        </>
      )}
      {players.length > 0 && (
        <>
          <Typography variant='p' component='p'>
            Jugadores
          </Typography>
          <Box sx={{ display: 'flex', marginBottom: 10, flexWrap: 'wrap' }}>
            <ul>
              {players.map((player) => (
                <li key={player.id}>
                  <Typography variant='p' component='p' sx={{ display: 'inline' }}>
                  {player.name} <br/>
                  </Typography>
                </li>
              ))}
            </ul>
          </Box>
        </>
      )}
      {numbers.length > 0 && (
        <>
          <Typography variant='p' component='p'>
            Números anunciados
          </Typography>
          <Box sx={{ display: 'flex', marginBottom: 10, flexWrap: 'wrap' }}>
            {numbers.map((number) => (
              <Typography key={number} variant='p' component='p' sx={{ display: 'inline' }}>
                {number},
              </Typography>
            ))}
          </Box>
        </>
      )}
      {gameStarted && !table && !waitingBoard ? (
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
          <Button variant='outlined' sx={{ marginTop: 5 }} onClick={startGame}>
            Iniciar partida
          </Button>
        </>
      ) : table ? (
        <Table table={table} numbers={numbers} />
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

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          padding={5}
          sx={{
            backgroundColor: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <Typography variant='h6' component='h6'>
            Cartón asignado
          </Typography>
          {table && <Table table={table} />}
          <Stack direction='row' spacing={2} marginTop={5}>
            <Button
              variant='outlined'
              endIcon={<SentimentVeryDissatisfiedIcon />}
              onClick={() => handleModalButtonClick(false)}
            >
              Rechazar
            </Button>
            <Button
              variant='contained'
              endIcon={<InsertEmoticonIcon />}
              onClick={() => {
                handleModalButtonClick(true)
                setOpen(false)
              }}
            >
              Aceptar
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  )
}

export default App
