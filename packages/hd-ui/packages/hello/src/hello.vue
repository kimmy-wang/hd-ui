<template>
  <div class="hd-ui-hello__title">
    {{ title }}
  </div>
</template>

<script type="text/babel">
export default {
  name: 'Hello',

  props: {
    title: {
      type: String,
      default: '',
    },
  },
}
</script>
