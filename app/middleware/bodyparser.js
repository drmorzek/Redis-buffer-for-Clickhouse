module.exports = (req) => new Promise((resolve) => {
	let buffer = ''
	req.on('data', (chunk) => buffer += chunk)
	req.on('end', () => {
		try {
			req.body = JSON.parse(buffer)
		} catch(e) {
			req.body = {}
		}
		resolve()
	})
})