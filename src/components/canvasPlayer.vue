<template>
   <video v-show="show" @play="onplay" @pause="onpause" @durationchange="ondurationchange" @canplay="oncanplay" @ended="onended"></video>
</template>

<script>
export default {
  name: 'canvas-player',
  props: {
    canvases: {
      type: [Array],
      default () {
        return []
      }
    }
  },
  data () {
    return {
      show: false,
      width: 0,
      height: 0,
      ctxes: [],
      playing: false
    }
  },
  mounted () {
    for (let attr in this.$attrs) {
      this.$el[attr] = this.$attrs[attr]
    }
  },
  methods: {
    draw () {
      if (this.playing) {
        try {
          this.ctxes.forEach(ctx => {
            ctx.drawImage(this.$el, 0, 0)
          })
          requestAnimationFrame(() => this.draw())
        } catch (e) {}
      }
    },
    ondurationchange (e) {
      this.width = e.target.videoWidth
      this.height = e.target.videoHeight
      this.canvases.forEach((canvas, i) => {
        canvas.width = this.width
        canvas.height = this.height
        this.ctxes[i] = canvas.getContext('2d')
      })
      this.$emit('durationchange', e)
    },
    oncanplay (e) {
      this.$emit('canplay', e)
    },
    onplay (e) {
      this.$emit('play', e)
      this.playing = true
      requestAnimationFrame(() => this.draw())
    },
    onpause () {
      this.playing = false
    },
    play () {
      this.$el.play()
    },
    pause () {
      this.$el.pause()
    },
    onended (e) {
      this.$emit('ended', e)
    }
  }
}
</script>

<style></style>
