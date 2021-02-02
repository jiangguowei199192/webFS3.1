// 经度验证
export function lonValidate () {
  const rules = []
  rules.push({
    validator: (rule, value, callback) => {
      // eslint-disable-next-line
      const lonreg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,14})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,14}|180)$/
      if (lonreg.test(value)) { callback() } else callback(new Error('请输入正确的经度'))
    },
    message: '',
    trigger: 'blur'
  })
  return rules
}

// 纬度验证
export function latValidate () {
  const rules = []
  rules.push({
    validator: (rule, value, callback) => {
      // eslint-disable-next-line
      const latreg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,14}|90\.0{0,14}|[0-8]?\d{1}|90)$/
      if (latreg.test(value)) { callback() } else callback(new Error('请输入正确的纬度'))
    },
    message: '',
    trigger: 'blur'
  })
  return rules
}

// 数字验证（是否是数字）
export function numberValidate (msg) {
  const rules = []
  rules.push({
    validator: (rule, value, callback) => {
      if (!value) callback()
      else if (!isNaN(value)) { callback() } else { callback(new Error(msg)) }
    },
    message: '',
    trigger: 'blur'
  })
  return rules
}

// 字符串不能为空
export function isNotNull (msg) {
  const rules = []
  rules.push({ required: true, message: msg, trigger: 'blur' })
  return rules
}

// 校验手机号，用法见addPeopleDialog
export function checkPhone () {
  const checkPhone = (rule, value, callback) => {
    if (value) {
      const reg = /^1[345789]\d{9}$/
      if (!reg.test(value)) {
        callback(new Error('请输入11位手机号'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  }
  return { type: 'number', validator: checkPhone, message: '请输入11位有效手机号', trigger: ['blur', 'change'] }
}

// 校验身份证号码，用法见addPeopleDialog
export function checkIdcard () {
  return { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入有效身份证号' }
}
