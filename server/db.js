const { Pool } = require('pg');

const PG_URI =
  'postgres://jpsxcdfu:JPy2w2qmUcoiP65cORCFCIP6_msHynro@ruby.db.elephantsql.com:5432/jpsxcdfu';
const pool = new Pool({
  connectionString: PG_URI,
});

module.exports = {
  query: (text, params = [], callback = null) => {
    console.log('executed query', text);
    return pool.query(text, params, callback);
  },
};
