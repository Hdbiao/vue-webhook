const http = require('http')
const crypto = require('crypto')
const { spawn } = require('child_process')
const SECRET = '123456'
function sign(body) {
    return `sha1=${crypto.createHmac('sha1', SECRET).update(body).digest('hex')}`
}

const server = http.createServer((req, res) => {
    console.log(req.method, req.url);
    if (req.method == 'POST' && req.url == '/webhook') {
        let buffers = []
        req.on('data', (buffer) => {
            buffers.push(buffer)
        })
        req.on('end', () => {
            let body = Buffer.concat(buffers)
            let event = req.headers['x-gitHub-event']
            // github请求过来的时候要传递body和一个signature，需要验证签名
            let signature = req.headers['x-hub-signature']
            if (signature !== sign(body)) {
                console.log('伪造的请求，中断');
                return res.end('Not ALLOW')
            }
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true }))
            if (event == 'push') {
                // 开始部署
                const deployParams = JSON.parse(body)
                let child = spawn('sh', [`./${deployParams.repository.name}.sh`]);
                let buffers = []
                child.stdout.on('data', (buffer) => {
                    buffers.push(buffer)
                })
                child.stdout.on('end', (buffer) => {
                    let log = Buffer.concat(buffers)
                    console.log(log);
                })
            }
        })

    } else {
        res.end('Not Found')
    }
})

server.listen(4000, () => {
    console.log('webhook服务运行在4000端口');
})