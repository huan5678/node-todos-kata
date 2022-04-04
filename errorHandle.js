function errorHandler (res, headers) {
  res.writeHead(400, headers);
  res.write(JSON.stringify({
    status: false,
    message: '請檢查 title 欄位，或是確認 id 是否正確'
  }))
  res.end();
}

module.exports = errorHandler;
