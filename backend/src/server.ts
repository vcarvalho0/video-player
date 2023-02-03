import express, { Request, Response } from "express"
import cors from "cors"
import fs from "fs"

const app = express()
const routes = express.Router()

app.use(express.json())
app.use(cors())
app.use(routes)

routes.get("/video", (req: Request, res: Response) => {
  const path = ""

  try {
    const stats = fs.statSync(path)

    const { size } = stats

    const { range } = req.headers

    const start = Number((range || "").replace(/bytes/, "").split("_")[0])
    const end = size - 1
    const chunkSize = end - start + 1

    const stream = fs.createReadStream(path, { start, end })

    const head = {
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4"
    }

    res.writeHead(206, head)

    stream.pipe(res)
  } catch (e) {
    res.status(404).json({
      status: "ERROR",
      message: e
    })
  }
})

const port = 3000
app.listen(port, () => {
  console.log(`Server is running at ${port}`)
})
