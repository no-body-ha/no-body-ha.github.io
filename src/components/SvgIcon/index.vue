<template>
    <svg :width="width" :height="height" class="svg-icons">
        <use :xlink:href="iconName"/>
    </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      required: true
    },
    width: {
      type: String,
      required: true
    },
    height: {
      type: String,
      required: true
    }
  },
  computed: {
    iconName () {
      return `#icon-${this.name}`
    }

  }
}
</script>

<style scoped>
.svg-icons{
  vertical-align: middle;
}
</style>
