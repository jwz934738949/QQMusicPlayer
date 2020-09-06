(function (window) {
  function Player($audio) {
    return new Player.prototype.init($audio)
  }
  Player.prototype = {
    constructor: Player,
    musicList: [],
    init: function ($audio) {
      this.$audio = $audio
      this.audio = $audio.get(0)
    },
    currentIndex: -1,
    playMusic: function (index, ele) {
      // 判断是否是同一首音乐
      if (this.currentIndex === index) {
        // 是同一首音乐时，判断是否暂停
        if (this.audio.paused) {
          // 暂停状态，点击播放
          this.audio.play();
        } else {
          // 播放状态，点击暂停
          this.audio.pause()
        }
      } else {
        // 不是同一首
        this.$audio.attr("src", ele.link_url)
        this.audio.play()
        this.currentIndex = index
      }
    },
    preIndex: function () {
      let index = this.currentIndex - 1
      if (index < 0) {
        index = this.musicList.length - 1
      }
      return index
    },
    nextIndex: function () {
      let index = this.currentIndex + 1
      if (index > this.musicList.length - 1) {
        index = 0
      }
      return index
    },
    changeMusic: function (index) {
      this.musicList.splice(index, 1)
      // 判断删除的歌曲是否为播放歌曲的前面歌曲
      if (index < this.currentIndex) {
        // 如果是前面的歌曲，要将currentIndex-1
        this.currentIndex--
      }
    },
    musicTimeUpdated: function (callBack) {
      let $this = this
      this.$audio.on("timeupdate", function () {
        let duration = $this.audio.duration
        let currentTime = $this.audio.currentTime
        let timeStr = $this.format(currentTime, duration)
        return callBack(currentTime, duration, timeStr)
      })
    },
    format: function (currentTime, duration) {
      let startMin = parseInt(currentTime / 60)
      let startSec = parseInt(currentTime % 60)
      if (startMin < 10) {
        startMin = '0' + startMin
      }
      if (startSec < 10) {
        startSec = '0' + startSec
      }
      let endMin = parseInt(duration / 60)
      let endSec = parseInt(duration % 60)
      if (isNaN(endMin) || isNaN(endSec)) {
        endMin = 0
        endSec = 0
      }
      if (endMin < 10) {
        endMin = '0' + endMin;
      }
      if (endSec < 10) {
        endSec = '0' + endSec
      }
      return startMin + ':' + startSec + ' / ' + endMin + ':' +endSec
    },
    musicSeekTo: function (value) {
      if (isNaN(value)) {
        return
      }
      this.audio.currentTime = this.audio.duration * value
    },
    musicVoiceSeekTo: function (value) {
      // volume的取值为0-1，0为静音，1为最大音量
      if (isNaN(value)) {
        return
      }
      if (value < 0 || value > 1) {
        return
      }
      this.audio.volume = value
    }
  }
  Player.prototype.init.prototype = Player.prototype
  window.Player = Player
})(window)