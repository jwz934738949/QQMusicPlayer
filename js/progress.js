(function (window) {
  function Progress($musicProgressBar, $musicProgressLine, $musicProgressDot) {
    return new Progress.prototype.init($musicProgressBar, $musicProgressLine, $musicProgressDot)
  }

  Progress.prototype = {
    constructor: Progress,
    isMove: false,
    init: function ($musicProgressBar, $musicProgressLine, $musicProgressDot) {
      this.$musicProgressBar = $musicProgressBar
      this.$musicProgressLine = $musicProgressLine
      this.$musicProgressDot = $musicProgressDot
    },
    progressClick: function (callBack) {
      // 这里的this是progress实例，进入点击事件之后，this变为进度条
      let $this = this
      // 监听背景的点击
      this.$musicProgressBar.click(function (event) {
        // 获取背景进度条距离窗口左边的距离
        let normalLeft = $(this).offset().left
        // 获取点击的位置距离窗口左边的距离
        let eventLeft = event.pageX
        // 修改进度条前景的宽度
        $this.$musicProgressLine.css({
          width: eventLeft - normalLeft
        })
        // 修改进度条圆点的位置
        $this.$musicProgressDot.css({
          left: eventLeft - normalLeft
        })
        // 计算进度条的比例
        let value = (eventLeft - normalLeft) / $(this).width()
        callBack(value)
      })
    },
    progressMove: function (callBack) {
      let $this = this
      // 获取进度条宽度
      let progressWidth = $this.$musicProgressBar.width()

      let normalLeft
      let eventLeft
      // 监听鼠标的按下事件
      this.$musicProgressBar.mousedown(function () {
        $this.isMove = true
        // 监听鼠标的移动事件
        // 获取背景进度条距离窗口左边的距离
        normalLeft  = $(this).offset().left
        $(document).mousemove(function (event) {
          // 获取点击的位置距离窗口左边的距离
          eventLeft = event.pageX
          let length = eventLeft - normalLeft
          if (length > progressWidth) {
            length = progressWidth;
          } else if (length < 0) {
            length = 0
          }
          // 修改进度条前景的宽度
          $this.$musicProgressLine.css({
            width: length
          })
          // 修改进度条圆点的位置
          $this.$musicProgressDot.css({
            left: length
          })
        })
      })
      // 监听鼠标的抬起事件
      $(document).mouseup(function () {
        $(document).off("mousemove")
        $this.isMove = false
        // 计算进度条的比例
        let value = (eventLeft - normalLeft) / $this.$musicProgressBar.width()
        callBack(value)
      })
    },
    setProgress: function (value) {
      if (this.isMove) {
        return;
      }
      if (value < 0 || value > 100) {
        return;
      }
      this.$musicProgressLine.css({
        width: value + "%"
      })
      this.$musicProgressDot.css({
        left: value + "%"
      })
    }
  }
  Progress.prototype.init.prototype = Progress.prototype
  window.Progress = Progress
})(window)