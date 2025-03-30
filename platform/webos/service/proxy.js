const pkgInfo = require('./package.json')
const Service = require('webos-service')
const fetch = require('node-fetch')

// init service
const service = new Service(pkgInfo.name)
service.activityManager.idleTimeout = 300

// register request service
service.register('request', handleRequest)

// handle request
async function handleRequest(message) {
  try {
    if (!message.payload.input) {
      throw new Error("Argument 'input' is required")
    }
    var url = message.payload.input
    var body = message.payload.init
    if (body.headers && body.headers['Content-Type'] === 'application/octet-stream' && body.body) {
      body.body = Buffer.from(body.body, 'base64')
    }
    var res = await fetch(url, body)
    var data = await res.arrayBuffer()
    var headers = getHeaders(res.headers)
    message.respond({
      status: res.status,
      statusText: res.statusText,
      headers: headers,
      content: Buffer.from(data).toString('base64'),
      resUrl: res.url,
    })
    console.log(res)
  } catch (err) {
    var out = { returnValue: false }
    if (err instanceof Error) {
      out.error = `${err.name} - ${err.message}`
      out.stack = err.stack
    } else {
      out.error = JSON.stringify(err)
    }
    message.respond(out)
    console.error(out.error)
  }
}

// get headers
function getHeaders(headers) {
  const result = {}
  headers.forEach((value, key) => {
    result[key] = value
  })
  return result
}
