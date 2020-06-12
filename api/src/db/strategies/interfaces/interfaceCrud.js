class ICrud {
  connect() {
    throw new NotImplementendException();
  }
  
  isConnected() {
    throw new NotImplementendException();
  }

  create(item) {
    throw new NotImplementendException();
  }

  read(query) {
    throw new NotImplementendException();
  }

  update(id, item) {
    throw new NotImplementendException();
  }

  delete(id) {
    throw new NotImplementendException();
  }
}

module.exports = ICrud;
