const store = require('./store')
const getRouter = require('./getRouter')
const getZipStream = require('./getZipStream')

module.exports = {
	router: getRouter,
	create: zipUrls => {
		if (!zipUrls || !Array.isArray(zipUrls))
			throw Error('"zipUrls" is undefined or not an array')
		return store.set(zipUrls)
	},
	file: async (key, opts) => {
		if (!key)
			throw Error('Missing "key"')
		const file = await getZipStream({
			// we use the key for the url as this
			// is only used as an ID for the stream
			url: key,
			query: {
				o: JSON.stringify(opts || {}),
				key,
			}
		})
		file.createReadStream = () => { return file.stream() }
		return file
	}
}
