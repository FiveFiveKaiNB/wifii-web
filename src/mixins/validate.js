export default {
  methods: {
    resetFields(refName = 'ldForm') {
      this.$refs[refName].$refs[refName].resetFields()
    },
    validate(refName = 'ldForm') {
      return new Promise((resolve, reject) => {
        this.$refs[refName].$refs[refName].validate(valid => {
          if (valid) {
            resolve('表单数据正确，正在提交...')
          } else {
            reject('表单数据不正确！')
          }
        })
      })
    }
  }
}
