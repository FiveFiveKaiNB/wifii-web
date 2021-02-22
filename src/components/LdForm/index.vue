<template>
  <div>
    <el-form :ref="refName" :model="form" :rules="rules" :label-width="labelWidth" :style="{ width: width }">
      <template v-for="(item, index) in formItems">
        <el-form-item v-if="item.isShow === undefined || Boolean(item.isShow)" :key="item.prop" :prop="item.prop" :label="item.label" :label-width="item.labelWidth" :class="{ 'inline-block': item.inline }">
          <template>{{ item.prefix }}</template>
          <el-input
            v-if="item.type === 'input'"
            v-model="form[item.prop]"
            :placeholder="item.placeholder || ''"
            :style="{ width: item.width || itemWidth || 'auto' }"
            :size="item.size || 'medium'"
            :maxlength="item.maxLength"
            :show-word-limit="item.showWordLimit || Boolean(item.maxLength)"
            :disabled="item.disabled !== undefined ? item.disabled : disabled"
            @input="item.onInput"
          >
            <template v-if="item.hasSlot || item.slotType" :slot="item.slotType || 'append'">{{ item.slotName || '元' }}</template>
          </el-input>
          <el-input-number
            v-if="item.type === 'inputNumber'"
            v-model="form[item.prop]"
            :placeholder="item.placeholder || ''"
            :style="{ width: item.width || itemWidth || 'auto' }"
            :controls-position="item.position || 'right'"
            :min="item.min || 1"
            :max="item.max || Infinity"
            :disabled="item.disabled !== undefined ? item.disabled : disabled"
            @change="() => item.onChange && item.onChange() || onInputNumberChange"
          />
          <!-- 下拉选择 -->
          <el-select
            v-if="item.type === 'select'"
            v-model="form[item.prop]"
            :multiple="item.multiple"
            :placeholder="item.placeholder || ''"
            :style="{ width: item.width || itemWidth || 'auto' }"
            :disabled="item.disabled !== undefined ? item.disabled : disabled"
            @change="(v) => (item.onChange && item.onChange(v) || '')"
          >
            <template v-if="item.isGroup">
              <el-option-group
                v-for="group in item.options"
                :key="group.label"
                :label="group.label"
              >
                <el-option
                  v-for="option in group.options"
                  :key="option.label"
                  :label="option.label"
                  :value="option.value"
                />
              </el-option-group>
            </template>
            <template v-else>
              <el-option
                v-for="option in item.options"
                :key="option.value"
                :label="option.label || option"
                :value="option.value || option"
              />
            </template>

          </el-select>
          <!-- 文本域 -->
          <el-input
            v-if="item.type === 'textarea'"
            v-model="form[item.prop]"
            type="textarea"
            :rows="item.rows || 6"
            :maxlength="item.maxLength"
            :resize=" 'none'"
            :placeholder="item.placeholder || '请输入'"
            :style="{ width: item.width || itemWidth || 'auto' }"
            :show-word-limit="item.showWordLimit || Boolean(item.maxLength)"
            :disabled="item.disabled !== undefined ? item.disabled : disabled"
            @input="item.onInput"
          />
          <!-- 单选框 -->
          <template v-if="item.type === 'radio'">
            <el-radio
              v-for="(radioItem, radioIndex) in item.radios"
              :key="radioIndex"
              v-model="form[item.prop]"
              :disabled="item.disabled !== undefined ? item.disabled : disabled"
              :label="radioItem.label"
            >
              {{ radioItem.text }}
            </el-radio>
          </template>
          <!-- 单选框组 -->
          <el-radio-group v-if="item.type === 'radioGroup'" v-model="form[item.prop]" class="radio-group__coupon-type">
            <el-radio
              v-for="(radioItem, radioIndex) in item.radioItems"
              :key="radioIndex"
              :label="radioItem.label"
              :disabled="item.disabled !== undefined ? item.disabled : disabled"
            >
              {{ radioItem.text || radioItem.label }}
            </el-radio>
          </el-radio-group>
          <template>
            <!-- 多张图片上传 -->
            <ld-qiniu-upload
              v-if="item.type === 'uploadList'"
              :class="item.className"
              :width="item.width || itemWidth"
              :height="item.height"
              :limit="item.limit || 20"
              :path="item.path || 'defaultPath'"
              :list.sync="form[item.prop]"
              :disabled="item.disabled !== undefined ? item.disabled : disabled"
              @handleSuccess="(url, file, fileList) => { handleSuccessList(url, item.prop, fileList) }"
              @handleRemove="(newList) => { handleRemove(newList, item.prop) }"
            />
            <!-- 单张图片上传 -->
            <ld-qiniu-upload
              v-if="item.type === 'uploadSingle'"
              :width="item.width"
              :height="item.height"
              :path="item.path || 'defaultPath'"
              :url.sync="form[item.prop]"
              :disabled="item.disabled !== undefined ? item.disabled : disabled"
              @handleSuccess="handleSuccess($event, item.prop)"
            />
            <span v-if="item.tip" class="upload__tip">{{ item.tip }}</span>
          </template>
          <!-- 时间选择器 -->
          <template v-if="item.type === 'timePicker'">
            <el-col v-if="item.prefix" class="col-width">{{ item.prefix }}</el-col>
            <el-col class="col-width">
              <el-form-item :prop="item.timePickerProp">
                <el-time-select
                  v-model="form[item.timePickerProp]"
                  :style="{ width: item.width || 'auto', margin: '0 5px' }"
                  :placeholder="item.placeholder || '请选择时间'"
                  :disabled="item.disabled !== undefined ? item.disabled : disabled"
                  :picker-options="{
                    start: item.start || '00:00',
                    step: item.step || '01:00',
                    end: item.end || '23:00'
                  }"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="item.suffix" class="col-width">{{ item.suffix }}</el-col>
          </template>
          <!-- 时间范围选择器 -->
          <template v-if="item.type === 'timeRange'">
            <el-col class="col-width">
              <el-form-item :prop="item.startTime">
                <el-time-select
                  v-model="form[item.startTime]"
                  :style="{ width: item.width || 'auto' }"
                  :placeholder="item.startTimePlaceholder || '请选择时间'"
                  :disabled="item.disabled !== undefined ? item.disabled : disabled"
                  :picker-options="{
                    start: item.start || '00:00',
                    step: item.step || '01:00',
                    end: item.end || '23:00'
                  }"
                />
              </el-form-item>
            </el-col>
            <el-col class="col-width" style="margin: 0 5px">-</el-col>
            <el-col class="col-width">
              <el-form-item :prop="item.endTime">
                <el-time-select
                  v-model="form[item.endTime]"
                  :placeholder="item.endTimePlaceholder || '请选择时间'"
                  :disabled="item.disabled !== undefined ? item.disabled : disabled"
                  :style="{ width: item.width || 'auto' }"
                  :picker-options="{
                    start: item.start || '00:00',
                    step: item.step || '01:00',
                    end: item.end || '23:00'
                  }"
                />
              </el-form-item>

            </el-col>

          </template>
          <!-- 日期选择器 -->
          <el-date-picker
            v-if="item.type === 'datePicker'"
            v-model="form[item.prop]"
            :type="item.datePickerType || 'date'"
            :disabled="item.disabled || disabled"
            :placeholder="item.placeholder || '请选择日期'"
            :picker-options="item.pickerOptions || {}"
            :value-format="item.valueFormat"
          />
          <el-switch
            v-if="item.type === 'switch'"
            v-model="form[item.prop]"
            :disabled="item.disabled !== undefined ? item.disabled : disabled"
            :active-text="item.activeText || ''"
            :active-value="item.activeValue || true"
            :inactive-value="item.inactiveValue || false"
          />
          <tinymce
            v-if="item.type === 'richText'"
            v-model="form[item.prop]"
          />
          <!-- TODO 地址选择 -->
          <el-input
            v-if="item.type === 'address'"
            v-model="form[item.prop]"
            :title="item.title || '点击右侧图标选择地址'"
            :style="{ width: item.width || itemWidth || 'auto' }"
            disabled
            placeholder="点击右侧图标选择定位"
            class="address"
          >
            <i v-if="location" slot="suffix" class="location-active" @click="showMap">
              <img :src="locationActiveIcon" class="location">
            </i>
            <!-- <i v-else slot="suffix" class="location-btn" @click="mapVisible = true">
              <img :src="locationIcon" class="location">
            </i> -->
          </el-input>
          <!-- 给个插槽 -->
          <template v-if="item.type === 'slot'">
            <slot :name="item.name" />
          </template>
          <template>{{ item.suffix }}</template>
        </el-form-item>
      </template>

    </el-form>
    <!-- TODO 地图弹窗 -->
    <el-dialog
      v-if="mapVisible"
      custom-class="dialog"
      title="地图"
      :visible.sync="mapVisible"
      width="65%"
      top="10vh"
      center
      append-to-body
    >
      <Tencent-map :address-object="addressObject" @setFormData="setFormData" />
    </el-dialog>
  </div>

</template>
<script>
import LdQiniuUpload from '@/components/LdQiniuUpload'
import Tinymce from '@/components/Tinymce'
import TencentMap from '@/components/TencentMap'
import locationIcon from '@/components/CreateStore/assets/location.png'
import locationActiveIcon from '@/components/CreateStore/assets/location-active.png'

export default {
  components: {
    LdQiniuUpload,
    Tinymce,
    TencentMap
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: ''
    },
    refName: {
      type: String,
      default: 'ldForm'
    },
    formItems: {
      type: Array,
      default: () => ([])
    },
    form: {
      type: Object,
      default: () => ({})
    },
    rules: {
      type: Object,
      default: () => ({})
    },
    onSelectChange: {
      type: Function,
      default: () => {}
    },
    onInputNumberChange: {
      type: Function,
      default: () => {}
    },
    itemWidth: {
      type: String,
      default: 'auto'
    },
    labelWidth: {
      type: String,
      default: '80px'
    }
  },
  data() {
    return {
      locationIcon,
      locationActiveIcon,
      location: true,
      mapVisible: false,
      addressObject: {
        address: '福建省厦门市思明区市行政服务中心',
        loc: [118.08917178948832, 24.47949910759976]
        // city: '厦门市',
        // province: '福建省'
      }
    }
  },
  created() {
    console.log(this.formItems)
  },
  methods: {
    showMap() {
      this.addressObject.address = this.form.address
      this.addressObject.loc = this.form.loc
      this.mapVisible = true
    },
    handleSuccessList(url, prop, fileList) {
      if (!Array.isArray(this.form[prop])) {
        this.form[prop] = []
      }
      // this.form[prop].push({ url })
      // this.form[prop] = fileList
      // console.log(this.form[prop], 'this.form[prop]')
      console.log(url, 'urlList')
      const urlList = url.map(item => ({ url: item }))
      console.log(urlList, 'urlList...')
      this.form[prop].push(...urlList)
    },
    handleRemove(newList, prop) {
      this.form[prop] = newList
    },
    handleSuccess(url, key) {
      this.$set(this.form, key, Array.isArray(url) ? url[0] : url)
    },
    setFormData(loc, province, city, address) {
      if (loc.length !== 0) {
        this.form.loc = loc
        this.form.address = address
        this.mapVisible = false
        return
      }
      this.$message.error('未选择位置')
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.inline-block {
  display: inline-block;
}
.col-width {
  width: auto;
}
.upload__tip {
    font-size:13px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(0,0,0,0.35);
    line-height:18px;
 }
 .address {
    position: relative;
    .location-active,
    .location-btn {
      position: absolute;
      cursor: pointer;
      width:57px;
      height: 36px;
      right: -5px;
      border-radius:0px 6px 6px 0px;
      border: 1px solid #DCDFE6;
      display: inline-block;
      line-height: 36px;
      .location {
        width: 18px;
        margin-top: 5px;
        height: 21px;
      }
    }
    .location-btn {
      background:rgba(245,247,250,1);
    }
 }
</style>
