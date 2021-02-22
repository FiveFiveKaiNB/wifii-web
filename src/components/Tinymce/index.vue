<template>
  <div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
    <textarea :id="tinymceId" ref="tinyText" class="tinymce-textarea" />
  </div>
</template>
<script>
/**
 * docs:
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
// import editorImage from './components/EditorImage'
import plugins from './plugins'
import toolbar from './toolbar'
import load from './dynamicLoadScript'
import { getToken } from '@/api/qiniu'
import { qiniuConfig } from '@/api/qiniu'
import * as gfun from '@/gfun'
import axios from 'axios'

// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js'

export default {
  name: 'Tinymce',
  // components: { editorImage },
  props: {
    showTip: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: function() {
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    menubar: {
      type: String,
      default: 'file edit insert view format table'
    },
    height: {
      type: [Number, String],
      required: false,
      default: 600
    },
    width: {
      type: [Number, String],
      required: false,
      default: 750
    }
  },
  data() {
    return {
      uploadUrl: '',
      host: '',
      qiniuData: {
        token: '',
        key: ''
      },
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      languageTypeList: {
        'en': 'en',
        'zh': 'zh_CN',
        'es': 'es_MX',
        'ja': 'ja'
      }
    }
  },
  computed: {
    containerWidth() {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
        return `${width}px`
      }
      return width
    }
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val || ''))
      }
    }
  },
  async created() {
    const { data: { clientUrl, host }} = await qiniuConfig()
    this.uploadUrl = clientUrl + '/'
    this.host = host
  },
  mounted() {
    this.init()
  },
  activated() {
    if (window.tinymce) {
      this.initTinymce()
    }
  },
  deactivated() {
    this.destroyTinymce()
  },
  destroyed() {
    this.destroyTinymce()
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    save() {
      this.$emit('saveValue', this.value)
    },
    init() {
      // dynamic load tinymce from cdn
      load(tinymceCDN, (err) => {
        if (err) {
          this.$message.error(err.message)
          return
        }
        this.initTinymce()
      })
    },
    ltrim(key) {
      return key.replace('/', '', 1)
    },
    initTinymce() {
      const _this = this
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        placeholder: 'Ask a question or post an update...',
        language: this.languageTypeList['zh'],
        height: this.height,
        // body_class: 'panel-body ',
        automatic_uploads: false,
        image_dimensions: false,
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,

        // 这里是上传图片代码
        images_upload_url: this.uploadUrl,
        images_upload_handler: async(blobInfo, success, fail, progress) => {
          progress(0)
          const file = blobInfo.blob()
          const { data: { uptoken }} = await getToken()
          this.qiniuData.token = uptoken
          this.qiniuData.key = `${process.env.VUE_APP_QINIU_BASE_PATH}/${gfun.generateUid()}.${gfun.pickImgSuffix(file)}`
          const fd = new FormData()
          fd.append('token', uptoken)
          fd.append('key', this.qiniuData.key)
          fd.append('file', file)
          await axios.post(this.uploadUrl, fd, { })
          // const url = process.env.VUE_APP_QINIU_HOST + '/' + this.qiniuData.key
          const url = this.host + '/' + this.qiniuData.key
          success(url)
          fail(url)
        },
        // menubar: this.menubar,
        plugins: plugins,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
        default_link_target: '_blank',
        link_title: false,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        init_instance_callback: editor => {
          if (_this.value) {
            editor.setContent(_this.value)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent())
          })
        },
        setup(editor) {
          editor.on('FullscreenStateChanged', (e) => {
            _this.fullscreen = e.state
          })
        }
      })
    },
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId)
      if (this.fullscreen) {
        tinymce.execCommand('mceFullScreen')
      }

      if (tinymce) {
        tinymce.destroy()
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent()
    },
    imageSuccessCBK(arr) {
      const _this = this
      arr.forEach(v => {
        window.tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`)
      })
    }
  }
}
</script>

<style rel="stylesheet" lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
  .btn-group {
    margin-top: 10px;
    text-align: right;
    a:first-child {
      color: #8C8C8C;
    }
    a:last-child {
      color: #4D5AAF;
      margin-left: 10px;
    }
  }
}
.tinymce-container >>> .mce-statusbar {
  display: none;
}
.tinymce-container >>> .mce-menubar {
  display: none!important;
}
.tinymce-container >>> .mce-tinymce {
  box-shadow: none;
}
.tinymce-container>>>.mce-fullscreen {
  z-index: 10000;
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}
.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}
.editor-upload-btn {
  display: inline-block;
}
</style>
<style>
/* 模态框背景 */
#mce-modal-block {
  background: #000 !important;
}
/* 上传图片确认按钮 */
.mce-btn {
  border-radius: 4px;
}
.mce-primary {
  background: #009C9C !important;
}
</style>

