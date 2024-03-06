const unzipper = require('unzipper')
const request = require('request')

const isRegex = /^\/(.*)\/(.*)$/

function parseQuery(req) {
  let opts = {}
  try {
    opts = JSON.parse(req.query.o)
  } catch(e) {}
  if ((opts.fileMustInclude || []).length)
    opts.fileMustInclude = opts.fileMustInclude.map(el => {
      if (isRegex.test(el)) {
        const parts = isRegex.exec(el)
        try {
          return new RegExp(parts[1],parts[2])
        } catch(e) {}
      }
      return el
    })
  return { opts, query: req.query }
}

function getZipUrls(query) {
  let zipUrls = []
  let key = query.key
  if (key && store.get(key)) {
    zipUrls = store.get(key)
  } else {
    // there is an issue here, as there is such a thing as an url that is too long
    // it would be cropped in this case and some rar parts could be missing..
    // using /create-rar to get a token prior to using the /rar endpoint solves this
    zipUrls = query.r || []
    if (typeof zipUrls === 'string')
      zipUrls = [zipUrls]
  }
  return zipUrls
}

async function getZipStream(req) {
  let { opts, query } = parseQuery(req)

  const zipUrls = getZipUrls(query)

  if (!(opts.fileMustInclude || []).length && !opts.hasOwnProperty('fileIdx'))
    opts = { fileMustInclude: [/.mkv$|.mp4$|.avi$/i] }

  const directory = await unzipper.Open.url(request, zipUrls[0])
  let data = {}
  let countFiles = -1
  const file = directory.files.find(d => {
    countFiles++
    if ((opts.fileMustInclude || []).length) {
      return !!opts.fileMustInclude.find(reg => {
        reg = typeof reg === 'string' ? new RegExp(reg) : reg
        return reg.test(d.path || '')
      })
    } else if (opts.hasOwnProperty('fileIdx')) {
      return opts.fileIdx === countFiles
    } else {
      return true
    }
  })

  return file
}

module.exports = getZipStream
