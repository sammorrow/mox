export default {
  send(...args) {
    let msg = JSON.stringify(args)
    this.$store.state.ws.send(msg)
  }
}