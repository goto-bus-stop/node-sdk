const reqr = global.GENTLY ? GENTLY.hijack(require) : require
// const TransloaditClient = reqr('./TransloaditClient')
const stream = reqr('stream')

class PaginationStream extends stream.Readable {
  constructor (_fetchPage) {
    super({ objectMode: true })
    this._fetchPage = _fetchPage
    this._pageno = 0
    this._items = []
    this._itemsRead = 0
  }

  _read () {
    if (this._items.length > 0) {
      this._itemsRead++
      return process.nextTick(() => this.push(this._items.pop()))
    }

    if (this._nitems != null && this._itemsRead >= this._nitems) {
      return process.nextTick(() => this.push(null))
    }

    return this._fetchPage((++this._pageno), (err, { count, items }) => {
      if (err != null) {
        return this.emit('error', err)
      }

      this._nitems = count

      this._items = __range__(items.length - 1, 0, true).map(i => items[i])

      return this._read()
    })
  }
}

module.exports = PaginationStream

function __range__ (left, right, inclusive) {
  let range = []
  let ascending = left < right
  let end = !inclusive ? right : ascending ? right + 1 : right - 1
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i)
  }
  return range
}
