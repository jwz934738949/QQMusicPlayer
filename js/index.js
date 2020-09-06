$(function () {
  // 导入滚动条样式
  $(".content_list").mCustomScrollbar()

  // 加载音乐播放相关属性
  let $audio = $("audio")
  let player = new Player($audio)
  let progress
  let voiceProgress
  let lyric


  // 加载歌曲列表
  getPlayerList()

  function getPlayerList() {
    $.ajax({
      url: './source/musiclist.json',
      dataType: 'json',
      success: function (data) {
        player.musicList = data
        // 遍历获取到的数据，创建音乐列表
        let $musicList = $(".content_list ul")
        $.each(data, function (index, ele) {
          let $item = createMusicItem(index, ele)
          $musicList.append($item)
        })
        // 初始化歌曲信息
        initMusicInfo(data[0])
        // 初始化歌词信息
        initMusicLyric(data[0])
      },
      error: function (e) {
        console.log(e)
      }
    })
  }

  function initMusicInfo(ele) {
    // 获取对应的元素
    const $musicImage = $(".song_info_pic img")
    const $musicName = $(".song_info_name a")
    const $musicSinger = $(".song_info_singer a")
    const $musicAlbum = $(".song_info_album a")
    const $musicProgressName = $(".music_progress_name")
    const $musicProgressTime = $(".music_progress_time")
    const $maskBg = $(".mask_bg")
    // 为获取到的元素赋值
    $musicImage.attr("src", ele.cover)
    $musicName.text(ele.name)
    $musicSinger.text(ele.singer)
    $musicAlbum.text(ele.album)
    $musicProgressName.text(ele.name + " / " + ele.singer)
    $musicProgressTime.text("00:00 / " + ele.time)
    $maskBg.css({
      background: "url(" + ele.cover + ")",
      backgroundSize: "100% 100%"
    })

  }

  function initMusicLyric(ele) {
    lyric = new Lyric(ele.link_lrc)
    let $songLyric = $(".song_lyric")
    // 清空页面中的歌词信息
    $songLyric.html("")
    lyric.loadLyric(function () {
      $.each(lyric.lyrics, function (index, ele) {
        let $item = $("<li>" + ele + "</li>")
        $songLyric.append($item)
      })
    })
  }

  // 初始化进度条
  initProgressBar()

  function initProgressBar() {
    // 加载进度条相关属性
    let $musicProgressBar = $(".music_progress_bar")
    let $musicProgressLine = $(".music_progress_line")
    let $musicProgressDot = $(".music_progress_dot")
    progress = new Progress($musicProgressBar, $musicProgressLine, $musicProgressDot)
    progress.progressClick(function (value) {
      player.musicSeekTo(value)
    })
    progress.progressMove(function (value) {
      player.musicSeekTo(value)
    })

    // 加载声音进度条相关属性
    let $musicVoiceBar = $(".music_voice_bar")
    let $musicVoiceLine = $(".music_voice_line")
    let $musicVoiceDot = $(".music_voice_dot")
    voiceProgress = new Progress($musicVoiceBar, $musicVoiceLine, $musicVoiceDot)
    voiceProgress.progressClick(function (value) {
        player.musicVoiceSeekTo(value)
    })
    voiceProgress.progressMove(function (value) {
        player.musicVoiceSeekTo(value)
    })
  }


  // 初始化事件监听
  initEvents()

  function initEvents() {
    // 监听歌曲的移入移出事件
    $(".content_list").delegate(".list_music", "mouseenter", function () {
      // 显示子菜单
      // 使用find方法来获取后代元素（子元素的子元素）
      $(this).find(".list_menu").stop().fadeIn(100)
      $(this).find(".list_time a").stop().fadeIn(100)
      // 隐藏时长
      $(this).find(".list_time span").stop().fadeOut(100)
    })
    $(".content_list").delegate(".list_music", "mouseleave", function () {
      // 隐藏子菜单
      $(this).find(".list_menu").stop().fadeOut(100)
      $(this).find(".list_time a").stop().fadeOut(100)
      // 显示时长
      $(this).find(".list_time span").stop().fadeIn(100)
    })

    // 监听复选框的点击事件
    $(".content_list").delegate(".list_check", "click", function () {
      // 使用切换,存在该类则删除，不存在就添加
      $(this).toggleClass("list_checked")
    })

    // 监听播放按钮的点击事件
    // 获取底部播放按钮
    let $musicPlay = $(".music_play")
    $(".content_list").delegate(".list_menu_play", "click", function () {
      // 获取音乐列表
      let $listMusic = $(this).parents(".list_music")
      // 切换播放按钮
      $(this).toggleClass("list_menu_play2")
      // 获取到其他音乐列表的播放按钮，使其他播放按钮还原
      $listMusic.siblings().find(".list_menu_play").removeClass("list_menu_play2")
      // 同步切换底部播放按钮
      if ($(this).attr("class").indexOf("list_menu_play2") !== -1) {
        // 当前状态为播放状态，将底部播放按钮设置为播放状态
        $musicPlay.addClass("music_play2")
        // 设置文字为高亮状态
        $listMusic.find("div").css({
          color: "#fff"
        })
        // 将其他文字变为不高亮
        $listMusic.siblings().find("div").css({
          color: "rgba(255, 255, 255, 0.5)"
        })
        // 将序号变为图片，代表正在播放
        $listMusic.find(".list_number").addClass("list_number2")
        // 将其他序号恢复
        $listMusic.siblings().find(".list_number").removeClass("list_number2")
      } else {
        // 当前状态为暂停状态
        $musicPlay.removeClass("music_play2")
        // 设置文字为不高亮状态
        $listMusic.find("div").css({
          color: "rgba(255, 255, 255, 0.5)"
        })
        // 将序号还原为数字
        $listMusic.find(".list_number").removeClass("list_number2")
      }
      // 播放音乐
      player.playMusic($listMusic.get(0).index, $listMusic.get(0).ele)
      // 播放音乐时，切换歌曲信息
      initMusicInfo($listMusic.get(0).ele)
      // 播放音乐，切换歌词信息
      initMusicLyric($listMusic.get(0).ele)
    })

    // 监听底部按钮播放点击事件
    $musicPlay.click(function () {
      // 判断是否播放过音乐
      if (player.currentIndex === -1) {
        // 没有播放过音乐
        $(".list_music").eq(0).find(".list_menu_play").trigger("click")
      } else {
        // 已经播放过音乐
        $(".list_music").eq(player.currentIndex).find(".list_menu_play").trigger("click")
      }
    })

    // 监听底部按钮上一首点击事件
    $(".music_pre").click(function () {
      $(".list_music").eq(player.preIndex()).find(".list_menu_play").trigger("click")
    })

    // 监听底部按钮下一首点击事件
    $(".music_next").click(function () {
      $(".list_music").eq(player.nextIndex()).find(".list_menu_play").trigger("click")
    })

    // 监听删除按钮点击事件
    $(".content_list").delegate(".list_menu_del", "click", function () {
      // 找到删除按钮那一列音乐信息，删除该信息
      let $item = $(this).parents(".list_music")
      // 判断删除的音乐是否为正在播放的音乐
      if ($item.get(0).index === player.currentIndex) {
        $(".music_next").trigger("click")
      }
      $item.remove()
      player.changeMusic($item.get(0).index)
      // 重新对音乐列表中所有的序号以及索引值进行排序
      $(".list_music").each(function (index, ele) {
        ele.index = index
        $(ele).find(".list_number").text(index + 1)
      })
    })

    // 监听播放的进度
    player.musicTimeUpdated(function (currentTime, duration, timeStr) {
      // 同步歌曲播放时间
      $(".music_progress_time").text(timeStr)
      // 同步进度条
      // 获取歌曲播放比例
      let value = currentTime / duration * 100
      progress.setProgress(value)
      // 当播放完毕之后自动跳到下一首歌曲播放
      if (currentTime === duration) {
        $(".music_next").trigger("click")
      }
      let index = lyric.currentIndex(currentTime)
      let $item = $(".song_lyric li").eq(index)
      $item.addClass("cur")
      $item.siblings().removeClass("cur")

      if (index <= 2) {
        return
      }
      $(".song_lyric").css({
        marginTop: (-index + 2) * 30
      })
    })

    // 监听声音按钮的点击
    $(".music_voice_icon").click(function () {
      // 声音图标的切换
      $(this).toggleClass("music_voice_icon2")
      if ($(this).attr("class").indexOf("music_voice_icon2") !== -1) {
        // 当前为静音状态
        player.musicVoiceSeekTo(0)
        // 设置进度条在最左边
        $(".music_voice_line").css({
          width: "0"
        })
        // 设置圆点在最左边
        $(".music_voice_dot").css({
          left: "0"
        })
      } else {
        // 当前为正常状态
        player.musicVoiceSeekTo(1)
        // 设置进度条在最右边
        $(".music_voice_line").css({
          width: "70px"
        })
        // 设置圆点在最右边
        $(".music_voice_dot").css({
          left: "70px"
        })
      }
    })
  }

  function createMusicItem(index, ele) {
    let $item = $(`
          <li class="list_music">
            <div class="list_check"><i></i></div>
            <div class="list_number">` + (index + 1) + `</div>
            <div class="list_name">` + ele.name + `
              <div class="list_menu">
                <a href="javascript:;" title="播放" class="list_menu_play"></a>
                <a href="javascript:;" title="添加"></a>
                <a href="javascript:;" title="下载"></a>
                <a href="javascript:;" title="分享"></a>
              </div>
            </div>
            <div class="list_singer">` + ele.singer + `</div>
            <div class="list_time">
              <span>` + ele.time + `</span>
              <a href="javascript:;" title="删除" class="list_menu_del"></a>
            </div>
          </li>
    `)
    $item.get(0).index = index
    $item.get(0).ele = ele
    return $item
  }

});