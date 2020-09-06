(function (window) {
  function Lyric(path) {
    return new Lyric.prototype.init(path)
  }
  Lyric.prototype = {
    constructor: Lyric,
    times: [],
    lyrics: [],
    index: -1,
    init: function (path) {
      this.path = path
    },
    loadLyric: function (callBack) {
      let $this = this
      $.ajax({
        url: $this.path,
        dataType: 'text',
        success: function (data) {
          $this.parseLyric(data)
          callBack()
        },
        error: function (e) {
          console.log(e)
        }
      })
    },
    parseLyric: function (data) {
      let $this = this
      // 清空数组
      $this.times = []
      $this.lyrics = []
      let arrLyric = data.split("\n")
      // 使用正则表达式匹配歌词中的时间
      const timeReg = /\[(\d*:\d*\.\d*)\]/
      $.each(arrLyric, function (index, ele) {
        // 处理歌词内容
        let lrc = ele.split(']')[1]
        console.log(lrc)
        // 排除没有歌词的内容
        if (lrc.length === 1) {
          return true
        }
        $this.lyrics.push(lrc);
        let res = timeReg.exec(ele)
        if (res === null) {
          return true
        }
        // 处理时间
        let timeStr = res[1].split(":")
        let min = parseInt(timeStr[0] * 60)
        let sec = parseFloat(timeStr[1])
        let time = parseFloat(Number(min + sec).toFixed(2))
        $this.times.push(time)
      })
    },
    currentIndex: function (currentTime) {
      if (currentTime >= this.times[0]) {
        this.index++
        // 删除times数组中首个数据
        this.times.shift()
      }
      return this.index
    }
  }
  Lyric.prototype.init.prototype = Lyric.prototype
  window.Lyric = Lyric
})(window)