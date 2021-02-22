<template>
  <div class="condition">
    <div v-if="hasSearch" class="search">
      <el-input
        v-model.trim="condition"
        class="input"
        style="width: 250px;"
        :placeholder="toolBarAttr.placeholder || searchPlaceholder"
        clearable
        @clear="handleClear"
        @input="conditionChange('name', $event)"
        @keyup.enter.native="search"
      >
        <i slot="suffix" class="el-input__icon el-icon-search pointer" @click="search" />
      </el-input>
      <el-button class="search-btn" @click="search">搜索</el-button>
    </div>
    <slot name="toolbarSlot" />
    <div v-if="hasActionArea" class="toolbar__action-area">
      <div class="toolbar__action-area-relative">
        <el-button
          v-for="(item, index) in actionBtnList"
          :key="index"
          :loading="item instanceof Object ? item.loading : false"
          style="width: auto;"
          type="primary"
          @click="handleClick(index, item)"
        >{{ item instanceof Object ? item.name : item }}
        </el-button>

        <el-button v-if="toolBarAttr.addBtn" style="width: auto;" class="addBtn" type="primary" @click="addItem">{{ toolBarAttr.addName }}</el-button>
        <el-button v-if="toolBarAttr.batchAdd" style="width: auto;" class="batchAdd" type="primary" @click="batchAdd">{{ toolBarAttr.batchAddName }}</el-button>
        <el-button v-if="toolBarAttr.redeemBtn" style="width: auto;" class="redeem" type="primary" @click="redeem">{{ toolBarAttr.redeemName }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    toolBarAttr: {
      type: Object,
      default: function() {
        return { placeholder: '', inputWidth: 'width: 200px;', addBtn: false, addName: '添加', batchAdd: false, batchAddName: '批量创建房间' }
      }
    },
    searchPlaceholder: {
      type: String,
      default: '请输入搜索内容'
    },
    actionBtnList: {
      type: Array,
      default: () => ([])
    },
    hasSearch: {
      type: Boolean,
      default: true
    },
    hasActionArea: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      condition: ''
    }
  },
  created() {
  },
  methods: {
    conditionChange(key, value) {
      this.$emit('input', value)
    },
    search() {
      this.$emit('onSearch')
    },
    addItem() {
      this.$emit('addItem')
    },
    batchAdd() {
      this.$emit('batchAdd')
    },
    redeem() {
      this.$emit('redeem')
    },
    handleClick(index, value) {
      this.$emit('toolbarAction', index, value)
    },
    handleClear() {
      this.$emit('clear', '')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.condition {
  // padding: 20px 0 20px 25px;
  position: relative;
  height: 80px;
  display: flex;
  align-items: center;
  width: 100%;
  background-color: #fff;
  margin-bottom: 20px;
  .toolbar__action-area {
    .el-button--primary {
      background:#F76262;
      border: 2px solid #F76262;
    }
    position: absolute;
    right: 24px;
    &-relative {
      position: relative;
    }
  }
  .search {
    // margin-top: 20px;
    margin-left: 24px;
    border: 2px solid #F76262;
    border-radius: 3px;

  .el-input__inner {
    border: 0px solid #F76262;
  }
    .input {
    margin-right: -4px;
    border: none;
  }

  .search-btn {
    color: white;
    border: none;
    height: 40px;
    background:#F76262;
    border-radius: 0px;
    width: 70px;
  }
  }
  .search-btn:hover {
    background-color: #F76262;
    color: #ffffff;
    border-color: #F76262;
  }
  .toolbar__right-area {
    position: absolute;
    right: 150px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
