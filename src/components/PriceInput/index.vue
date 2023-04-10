<template>
  <el-input
    v-model="priceValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :style="{ width }"
    autocomplete="off"
    @change="onPriceChange"
  >
    <template slot="append">元</template>
  </el-input>
</template>

<script>
export default {
  name: 'PriceInput',
  props: {
    price: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      priceValue: null
    }
  },
  watch: {
    price: {
      handler(newVal, oldVal) {
        this.priceValue = newVal
      },
      immediate: true
    }
  },
  methods: {
    onPriceChange(value) {
      if (!isNaN(value) && value.indexOf('.') === -1) {
        value = parseInt((value.toString() || 0)) + '.00'
      }
      this.$emit('update:price', value)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
