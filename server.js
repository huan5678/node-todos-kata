const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errorHandle = require('./errorHandle');
const successHandle = require('./successHandle');

const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
}
  
const todos = [];

function httpRequestListener (req, res) {
  // console.log(req.url);
  // console.log(req.method);

  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  })

  if (req.url === '/todos') {
    switch (req.method) {
      case 'GET':
        successHandle(
          res,
          headers,
          '取得全部代辦',
          todos
        )
        break;
      case 'POST':
        req.on('end', () => {
          try {
            const title = JSON.parse(body).title;
            if (title !== undefined) {
              let todo = {
                id: uuidv4(),
                title,
              }
              todos.push(todo);
              successHandle(
                res,
                headers,
                '成功新增一筆代辦',
                todos
              )
            } else {
              return false;
            }
          } catch {
            errorHandle(res, headers)
          }
        })
        break;
      case 'DELETE':
        todos.length = 0;
        successHandle(res, headers, '已成功刪除全部代辦', todos)
        break;
    }
  } else if (req.url.startsWith('/todos/')) {
    switch (req.method) {
      case 'DELETE':
        req.on('end', () => {
          try {
            const id = req.url.split('/').pop();
            const idx = todos.findIndex(todo => todo.id = id);
            todos.map(todo => {
              if (todo.id === id) {
                todos.splice(idx, 1);
              }
            })
            successHandle(res, headers, '已成功刪除一筆代辦', todos);
          } catch {
            errorHandle(res, headers);
          }
        })
        break;
      case 'PATCH':
        req.on('end', () => {
          try {
          const id = req.url.split('/').pop();
            const title = JSON.parse(body).title;
            if (title !== undefined) {
              todos.map(todo => {
                if (todo.id === id) {
                  todo.title = title;
                }
              })
              successHandle(res, headers, '已成功修改一筆代辦', todos);
            } else {
              return false;
            }
          } catch {
            errorHandle(res, headers);
          }
        })
        break;
    }
  } else {
    res.writeHead(400, headers);
    res.write(JSON.stringify({
      status: false,
      message: '請檢查 API Patch 是否正確'
    }));
    res.end();
  }
}



const server = http.createServer(httpRequestListener);
server.listen(process.env.PORT || 3000);