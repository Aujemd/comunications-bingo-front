import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
export const Table = ({ table, numbers }) => {
  const isMarked = (col) => {
    return numbers?.find((number) => number === col)
  }
  return (
    <>
      <Grid container maxWidth={300} border={1}>
        {table.map((row, rowIndex) =>
          row.map((col, colIndex) => (
            <Grid key={`${rowIndex}-${colIndex}`} item xs={2.4}>
              <Typography>{col === 0 ? '' : isMarked(col) ? '*' : col}</Typography>
            </Grid>
          ))
        )}
      </Grid>
    </>
  )
}
