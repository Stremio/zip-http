# Stream Zip Archives

A module to stream the contents of ZIP archives through a HTTP server.

This module is based on `unzipper` by [@ZJONSSON](https://github.com/ZJONSSON), it currently does not support partial zip deflating and multi part zip files.


## Run the Server

```
npm install
npm start
```

HTTP server routes are explained in the [Router](#router) docs


## Programatic Usage


### Router

```javascript
const zipHttp = require('zip-http')
const express = require('express')

const app = express()

app.use(zipHttp.router())

const port = process.env.PORT || 7879

app.listen(port, () => {
  console.log(`http://127.0.0.1:${port}/stream`)
})
```

This adds the following routes:
- `/create` - POST - expects an array of URLs to ZIP files, replies with `{"key":"fiql"}`
- `/stream` - GET - expects a `key=` (key from `/create`), it also supports `o=` for a JSON stringified list of [Options](#options)


### Streams

```javascript
const fs = require('fs')
const zipHttp = require('zip-http')

async function getZipStream() {
	const key = zipHttp.create([
		'http://test.com/file.zip'
	])

	const file = await zipHttp.file(key, {
		fileMustInclude: ['Lorem Ipsum'],
		maxFiles: 1
	})

	file
	.createReadStream()
	.pipe(
		fs.createWriteStream(`./${file.name}`)
	)
}

getRarStream()
```

- `zipHttp.create()` requires an array of strings with HTTP(s) URLs to ZIP files, it return a `key` which is meant to be used with the `.file()` method

- `zipHttp.file(key, opts)` supports the same [Options](#options) as the `/stream` endpoint, `key` is required, but `opts` is optional


### Options

Options:
```JSON
{
	"fileIdx": 1,
	"fileMustInclude": ["/dexter/i", "the hulk"]
}
```

- `fileIdx` - integer - selects the file that matches the index in the ZIP archive
- `fileMustInclude` - array of strings (can also be RegExp string) - selects the first file that includes any of the matches


_built with love and serious coding skills by the Stremio Team_

<img src="https://blog.stremio.com/wp-content/uploads/2023/08/stremio-code-footer.jpg" width="300" />