module.exports = {
  apps : [{
    name   : "MARKETING BOT",
    script : "./index.js",
    watch: true,
    instances: 1,
    exec_mode: "fork",
    log_file: "/home/sellmiss/logs/MARKETING_BOT.log",
    interpreter: "/home/sellmiss/nodevenv/repositories/marketing_bot/18/bin/node"
  }]
}
