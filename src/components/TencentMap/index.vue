<template>
  <div class="ssss">
    <mapselect :address-object="address" @formSubmit="formSubmit" />
  </div>
</template>

<script>
import qqMapSelectPoint from './selectPoint'
export default {
  components: {
    mapselect: qqMapSelectPoint
  },
  props: {
    addressObject: {
      type: Object,
      default: () => ({})
    }
  },
  data: function() {
    return {
      qqmap: null,
      centerLatLng: '',
      oldMarker: '',
      newMarker: null,
      currentAddress: '',
      address: {}
    }
  },
  computed: {
  },
  created() {
    this.address = this.$props.addressObject
  },
  methods: {
    formSubmit(loc, province, city, address) {
      this.$emit('setFormData', loc, province, city, address)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.qqmap{
  width: 700px;
  height: 600px;
  }

</style>
