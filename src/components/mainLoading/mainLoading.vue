<template>
  <div>
    <slot v-if="data.length">

    </slot>
    <loading v-else />
  </div>
</template>

<script>
import Loading from '@/components/loading/loading'
export default {
  props: {
    data: { type: [Array,Object] }
  },
  components: {
    Loading
  }
}
</script>

<style>

</style>