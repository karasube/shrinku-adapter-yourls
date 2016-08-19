const Shrinku = require('shrinku');
const mysql = require('mysql');

class YourlsAdapter extends Shrinku.Adapters.BaseAdapter {
  constructor(opts = {}) {
    super();
    this.opts = Object.assign({}, {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'yourls',
      prefix: 'yourls_',
      port: 3306
    }, opts);

    this.connection = mysql.createConnection({
      host: this.opts.host,
      user: this.opts.user,
      password: this.opts.password,
      database: this.opts.database,
      port: this.opts.port
    });

    this.connection.connect();
  }

  findByUrl(opts = {}) {
    super.findByUrl(opts);

    const query = `SELECT keyword AS hash, url FROM ${this.opts.prefix}url WHERE url = '${opts.url}'`;

    return new Promise((resolve, reject) => {
      return this.connection.query(query, (err, rows) => {
        return resolve(rows);
      });
    });
  }

  findByHash(opts = {}) {
    super.findByHash(opts);

    const query = `SELECT keyword AS hash, url FROM ${this.opts.prefix}url WHERE keyword = '${opts.hash}'`;
    return new Promise((resolve, reject) => {
      return this.connection.query(query, (err, rows) => {
        return resolve(rows);
      });
    });
  }

  find(opts = {}) {
    return super.find(opts, true);
  }

  save(opts = {}) {
    super.save(opts);
    throw new Error('Not implemented.');
  }
}

module.exports = YourlsAdapter;
