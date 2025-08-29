import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const port = 3000

// Serve static files from the current directory
app.use(express.static(__dirname))

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
    console.log('Press Ctrl+C to stop')
})
