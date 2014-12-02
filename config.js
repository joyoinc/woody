module.exports = {
  connConfig : {
    user: 'ulldcqzkmyglth',
    password: '480S6ABz_YURJ4ZMCPJyG5IBgr',
    database: 'dcu31opgd9pq74',
    port: '5432',
    host: 'ec2-50-17-207-54.compute-1.amazonaws.com',
    ssl: true
  } ,
  connString : process.env.DATABASE_URL || 'postgres://ulldcqzkmyglth:480S6ABz_YURJ4ZMCPJyG5IBgr@ec2-50-17-207-54.compute-1.amazonaws.com:5432/dcu31opgd9pq74'
}
