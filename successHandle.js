function successHandler (res, headers, message, todos) {
  res.writeHead(200, headers);
  res.write(JSON.stringify({
    status: true,
    data: todos,
    message,
  }))
  res.end();
}

module.exports = successHandler;