/**
 * Mock Service Worker.
 * @see https://github.com/mswjs/msw
 * - Please do NOT modify this file.
 * - Please do NOT serve this file on production.
 */
const INTEGRITY_CHECKSUM = '3d6b9f06410d179a7f7404d4bf5c3e70'
const bypassHeaderName = 'x-msw-bypass'

const clients = {}

// Callable when a new client is registered.
self.addEventListener('message', async (event) => {
  const { clientId, type } = event.data

  switch (type) {
    case 'MOCK_ACTIVATE': {
      await activateClient(clientId)
      break
    }

    case 'MOCK_DEACTIVATE': {
      deactivateClient(clientId)
      break
    }

    case 'MOCK_GET_INTEGRITY_CHECKSUM': {
      sendToClient(clientId, {
        type: 'MOCK_RESPONSE',
        payload: INTEGRITY_CHECKSUM,
      })
      break
    }
  }
})

// Listen for requests from each page client.
self.addEventListener('fetch', async (event) => {
  const { request } = event
  const accept = request.headers.get('accept') || ''

  const clientId = getClientId(request)

  // Bypass requests from the page when page is not a valid MSW client.
  if (!clientId || !clients[clientId]) {
    return
  }

  // Bypass requests with a custom bypass header
  if (request.headers.get(bypassHeaderName) === 'true') {
    const cleanRequestHeaders = serializeHeaders(request.headers)
    // remove the bypass header to propagate the request properly
    delete cleanRequestHeaders[bypassHeaderName]

    const originalRequest = new Request(request, {
      headers: cleanRequestHeaders,
    })

    return fetch(originalRequest)
  }

  // Opening the DevTools triggers the "only-if-cached" request
  // that cannot be handled by the worker. Bypass such requests.
  if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') {
    return
  }

  // Bypass all requests when there are no active clients.
  // Prevents the self-unregistered worked from handling requests
  // after it's been terminated (still remains active until the next reload).
  if (Object.keys(clients).length === 0) {
    return
  }

  const requestId = Math.random().toString(36).substring(1)

  return event.respondWith(
    handleRequest(event, requestId).catch((error) => {
      if (error.name === 'NetworkError') {
        console.warn(
          '[MSW] Successfully intercepted a request for "%s %s" but it resulted in a network error. This is likely an issue with the request handler.',
          request.method,
          request.url,
        )
      }

      // Re-throwing the error makes it available to the global error handler,
      // as well as to the fetch event's promise chain.
      throw error
    }),
  )
})

async function handleRequest(event, requestId) {
  const { request } = event
  const requestClone = request.clone()
  const getOriginalResponse = () => fetch(requestClone)

  // Bypass mocking for user requests.
  // @note: this should be changed to a more sophisticated logic.
  if (request.credentials === 'include') {
    return getOriginalResponse()
  }

  // Bypass requests with the explicit bypass header
  if (request.headers.get(bypassHeaderName) === 'true') {
    const cleanRequestHeaders = serializeHeaders(request.headers)
    // remove the bypass header to propagate the request properly
    delete cleanRequestHeaders[bypassHeaderName]

    const originalRequest = new Request(request, {
      headers: cleanRequestHeaders,
    })

    return fetch(originalRequest)
  }

  // Send the request to the client-side MSW.
  const reqHeaders = serializeHeaders(request.headers)
  const body = await request.text()

  const client = await event.target.clients.get(clientId)
  const clientChannel = new MessageChannel()

  const requestBuffer = await request.arrayBuffer()
  const responseChannel = new MessageChannel()

  let error = null

  Promise.race([
    new Promise((resolve, reject) => {
      clientChannel.port1.onmessage = (event) => {
        if (event.data && event.data.error) {
          reject(new Error(event.data.error))
          return
        }

        resolve(event.data)
      }
    }),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Virtual request timeout')), 5000),
    ),
  ])
    .then((interceptedResponse) => {
      if (!interceptedResponse) {
        throw new Error('Expected response but received none')
      }

      const response = new Response(interceptedResponse.body, {
        status: interceptedResponse.status,
        statusText: interceptedResponse.statusText,
        headers: interceptedResponse.headers,
      })

      responseChannel.port1.postMessage({
        type: 'MOCK_RESPONSE',
        payload: interceptedResponse,
        requestId,
      })

      return response
    })
    .catch((cause) => {
      error = cause
    })
    .finally(() => {
      client.postMessage(
        {
          type: 'MOCK_RESPONSE',
          payload: error ? error.message : null,
          requestId,
        },
        [clientChannel.port2, responseChannel.port2],
      )
    })

  return getOriginalResponse()
}

function serializeHeaders(headers) {
  const reqHeaders = {}
  headers.forEach((value, name) => {
    reqHeaders[name] = reqHeaders[name]
      ? [].concat(reqHeaders[name]).concat(value)
      : value
  })
  return reqHeaders
}

function getClientId(request) {
  const clientUrl = new URL(request.url)

  for (const [clientId, client] of Object.entries(clients)) {
    const url = new URL(client.url)
    if (url.origin === clientUrl.origin) {
      return clientId
    }
  }

  return undefined
}

async function activateClient(clientId) {
  const client = await self.clients.get(clientId)

  if (!client) {
    throw new Error(`Client "${clientId}" does not exist.`)
  }

  // Store the client reference, so it can be accessed
  // from the fetch event handler.
  clients[clientId] = client

  // Notify the client that MSW has been activated.
  client.postMessage({
    type: 'MOCK_ACTIVATED',
    clientId,
  })
}

function deactivateClient(clientId) {
  const client = clients[clientId]

  if (!client) {
    throw new Error(`Client "${clientId}" does not exist.`)
  }

  // Clear the client reference.
  delete clients[clientId]

  // Notify the client that MSW has been deactivated.
  client.postMessage({
    type: 'MOCK_DEACTIVATED',
    clientId,
  })
}

function sendToClient(clientId, message) {
  const client = clients[clientId]

  if (!client) {
    throw new Error(`Client "${clientId}" does not exist.`)
  }

  client.postMessage(message)
}

// Self-unregister on unload
self.addEventListener('unload', function () {
  self.registration.unregister()
})
