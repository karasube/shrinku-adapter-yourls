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
      port: 3306,
    }, opts);

    this.connection = mysql.createConnection({
      host: this.opts.host,
      user: this.opts.user,
      password: this.opts.password,
      database: this.opts.database,
      port: this.opts.port,
    });

    this.connection.connect();
  }

  findByUrl(opts = {}) {
    super.findByUrl(opts);

    const query = `SELECT keyword AS hash, url FROM ${this.opts.prefix}url `
      + ` WHERE url = '${opts.url}'`;


    this.log.debug('debug', 'findByUrl generated query', {
      opts,
      query,
    });

    return new Promise((resolve) => this.connection.query(query, (err, rows) => resolve(rows)));
  }

  findByHash(opts = {}) {
    super.findByHash(opts);

    const query = `SELECT keyword AS hash, url FROM ${this.opts.prefix}url `
      + ` WHERE keyword = '${opts.hash}'`;

    this.log.debug('debug', 'findByHash generated query', {
      opts,
      query,
    });

    return new Promise((resolve) => this.connection.query(query, (err, rows) => {
      const selectedResult = (rows.length && rows.push ? rows[0] : rows);
      return resolve(selectedResult);
    }));
  }

  find(opts = {}) {
    return super.find(opts, true);
  }

  save(opts = {}) {
    super.save(opts);
    const query = 'INSERT INTO yourls_url SET ?';

    return new Promise((resolve, reject) => {
      const data = {
        url: opts.url,
        keyword: opts.hash,
        ip: '1.1.1.1',
        clicks: 0,
      };

      return this.connection.query(query, data, (err) => {
        if (err) return reject(err);

        return this.findByUrl(opts).then((result) => resolve(result));
      });
    });
  }
}

module.exports = YourlsAdapter;
