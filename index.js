const express = require("express");
const http = require("http");
const { WebSocketServer, OPEN } = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({
	server,
	path: '/orders-ws',
	perMessageDeflate: {
		zlibDeflateOptions: {
			// See zlib defaults.
			chunkSize: 1024,
			memLevel: 7,
			level: 3
		},
		zlibInflateOptions: {
			chunkSize: 10 * 1024
		},
		// Other options settable:
		clientNoContextTakeover: true, // Defaults to negotiated value.
		serverNoContextTakeover: true, // Defaults to negotiated value.
		serverMaxWindowBits: 10, // Defaults to negotiated value.
		// Below options specified as default values.
		concurrencyLimit: 10, // Limits zlib concurrency for perf.
		threshold: 1024 // Size (in bytes) below which messages
		// should not be compressed if context takeover is disabled.
	}
})

wss.on('connection', (socket) => {
	console.log('WS Connection attempt');
	socket.on('disconnect', () => {
		console.log('disconnect ', id);
	})
})

app.get('/:id', (req, res) => {
	const id = req.params.id;
	console.log('accessing id ', id)
	wss.clients.forEach(function each(client) {
		if (client.readyState === OPEN) {
			client.send(
				JSON.stringify({
					darkstoreId: id,
					items: [{
						id: '1',
						name: 'Node item 1',
						price: 100, //pln cents
						amount: 25, // amount * 10 with 1 decimal point
						tax: 1, // from 1 to 7 (internal stuff, ask Pavel)
						measure: 'szt.', // up to 4 chars
					}]
				}));
		}
	});

	res.status(200).send(id)
})

app.get('/', (_, res) => {
	res.status(200).send('OK')
})



server.listen(3000, () => {
	console.log("server is running on port 3000");
});
