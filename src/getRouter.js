const getContentType = require('./getContentType')
const getZipStream = require('./getZipStream')
const bodyParser = require('body-parser')
const Router = require('router')
const store = require('./store')

function getRouter() {
  const router = Router()

  router.use(bodyParser.json())

  router.post('/create', (req, res) => {
    if (!Array.isArray(req.body))
      res.status(500).send('Cannot parse JSON data')
    const key = store.set(req.body)

    res.setHeader('Content-Length', JSON.stringify({ key }).length+'')
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ key }))
  })

  router.get('/stream', async (req, res) => {
    const file = await getZipStream(req)

    const contentLength = file.uncompressedSize

    if (req.method === 'HEAD') {
      res.statusCode = 204
      res.setHeader('Content-Length', contentLength+'')
      res.setHeader('Content-Type', getContentType({ name: file.path }))
      res.end()
      return
    }

    let start = 0
    let end = contentLength-1

    res.statusCode = 200
    res.setHeader('Content-Type', getContentType({ name: file.path }))
    res.setHeader('Content-Length', contentLength)

    file.stream().pipe(res)
  })

  return router
}

module.exports = getRouter
