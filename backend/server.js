import express from 'express'
import cors from 'cors'

const app = express()
const porta = process.env.PORT || 3000

app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    message : "Server status: Online"
  })
})

// app.use('/', userRoutes)


app.listen(porta, () => {
  console.log(`―――――――――――――――――――――――――――――――――――――――――――――――――――――――
     Servidor Online
     Servidor ClockIn rodando na PORTA ${porta}
    ―――――――――――――――――――――――――――――――――――――――――――――――――――――――
     `)
})
