export default {
  send(...args) {
    let msg = JSON.stringify(args)
    console.log("well", this)
    this.$store.state.ws.send(msg)
  }
}