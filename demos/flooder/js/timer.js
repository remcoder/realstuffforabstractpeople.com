var Timer = new Class({
  startTime: null,
  times: [], 
  
  start: function() {
    this.startTime = new Date().getTime();
  },
  
  stop: function() {
    this.times.push(new Date().getTime() - this.startTime);
  }
});