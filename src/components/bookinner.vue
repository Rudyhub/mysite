<template>
  <div class="bookinner">
    <div ref="right" class="bookinner-page bookinner-page-right" @click="pageClick" @transitionend="transEnd">
      <div ref="rightFront" class="bookinner-page-front"></div>
      <div ref="rightBack" class="bookinner-page-back"></div>
    </div>
    <div ref="left" class="bookinner-page bookinner-page-left" @click="pageClick" @transitionend="transEnd">
      <div ref="leftFront" class="bookinner-page-front"></div>
      <div ref="leftBack" class="bookinner-page-back"></div>
    </div>
    <div ref="under" class="bookinner-page bookinner-page-under" @click="pageClick" @transitionend="transEnd">
      <div ref="underFront" class="bookinner-page-front"></div>
      <div ref="underBack" class="bookinner-page-back"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'bookinner',
  props: ['pages'],
  data () {
    let items, len
    items = [['', '']]
    len = this.pages.length
    for (let i = 0; i < len; i += 2) {
      items.push([this.pages[i], this.pages[i + 1]])
    }
    items.push(['', ''])
    return {
      items,
      total: items.length - 1,
      paperIndex: 1,
      isTransEnd: true
    }
  },
  mounted () {
    this.$refs.leftFront.innerHTML = this.items[this.paperIndex][0]
    this.$refs.leftBack.innerHTML = this.items[this.paperIndex][1]
    this.$refs.underFront.innerHTML = this.items[this.paperIndex][0]
  },
  methods: {
    next () {
      if (!this.isTransEnd) return
      if (this.paperIndex < this.items.length - 1) {
        this.isTransEnd = false
        this.paperIndex++
        this.$emit('beforeTurn', this.paperIndex)
        this.$refs.under.classList.add('bookinner-page-under')
        this.$refs.under.classList.remove('bookinner-page-under-right')
        this.$refs.underFront.innerHTML = this.items[this.paperIndex][0]
        this.$refs.left.classList.add('bookinner-page-transition', 'bookinner-page-over-left')
      } else {
        this.$emit('toEnd')
      }
    },
    prev () {
      if (!this.isTransEnd) return
      if (this.paperIndex > 1) {
        this.isTransEnd = false
        this.paperIndex--
        this.$emit('beforeTurn', this.paperIndex)
        this.$refs.under.classList.add('bookinner-page-under-right')
        this.$refs.under.classList.remove('bookinner-page-under')
        this.$refs.underBack.innerHTML = this.items[this.paperIndex - 1][1]
        this.$refs.right.classList.add('bookinner-page-transition', 'bookinner-page-over')
      } else {
        this.$emit('toStart')
      }
    },
    pageClick (e) {
      this.$turn = e.currentTarget === this.$refs.left ? 'next' : 'prev'
      this.$emit('pageClick', e)
    },
    transEnd (e) {
      let target = e.currentTarget
      if (target === this.$refs.left) {
        this.$refs.leftFront.innerHTML = this.items[this.paperIndex][0]
        this.$refs.leftBack.innerHTML = this.items[this.paperIndex][1]
        this.$refs.rightFront.innerHTML = this.items[this.paperIndex - 1][0]
        this.$refs.rightBack.innerHTML = this.items[this.paperIndex - 1][1]
        target.classList = 'bookinner-page bookinner-page-left'
        this.$emit('afterTurn', e, this.paperIndex, 'next')
      } else {
        this.$refs.rightFront.innerHTML = this.items[this.paperIndex - 1][0]
        this.$refs.rightBack.innerHTML = this.items[this.paperIndex - 1][1]
        this.$refs.leftFront.innerHTML = this.items[this.paperIndex][0]
        this.$refs.leftBack.innerHTML = this.items[this.paperIndex][1]
        target.classList = 'bookinner-page bookinner-page-right'
        this.$emit('afterTurn', e, this.paperIndex, 'prev')
      }
      this.isTransEnd = true
    }
  }
}
</script>

<style>
  .bookinner{
    transform-style: preserve-3d;
    width: 100%;
    height: 100%;
  }
  .bookinner-page{
    transform-style: preserve-3d;
    width: 50%;
    height: 100%;
    transform-origin: left top;
    position: absolute;
    left: 50%;
    top: 0;
    box-sizing: border-box;
  }
  .bookinner-page-front,
  .bookinner-page-back{
    background: linear-gradient(45deg, #dbdbdb, #ffffff);
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    transform-style: preserve-3d;
  }
  .bookinner-page-front{
    text-align: left;
  }
  .bookinner-page-back{
    transform: scaleX(-1) translateZ(-1px);
    text-align: right;
  }
  .bookinner-page-left{
    transform: translateZ(0) rotateY(0);
  }
  .bookinner-page-right{
    transform: translateZ(0) rotateY(-179.99deg);
  }
  .bookinner-page-under{
    transform: translateZ(-1px) rotateY(0);
  }
  .bookinner-page-under-right{
    transform: translateZ(-1px) rotateY(-179.99deg);
  }
  .bookinner-page-over{
    transform: translateZ(1px) rotateY(0);
  }
  .bookinner-page-over-left{
    transform: translateZ(1px) rotateY(-179.99deg);
  }
  .bookinner-page-transition{
    transition: transform .6s;
  }
</style>
