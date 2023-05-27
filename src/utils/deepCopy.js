export default function deepCopy(obj) {
  // 1.判断是否为null 或undefined
  if (obj == null) return obj;
  // 2.判断是否为日期Date
  if (obj instanceof Date) return new Date(obj);
  // 3.判断是否为正则 typeof /\d+/ === 'object'
  if (obj instanceof RegExp) return new RegExp(obj);
  // 4.如果不是数组或对象，返回该值
  if (typeof obj !== 'object') return obj;
  // 接下来，要么是对象，要么是数组 可以用 new obj.constructor得到它类型的空值
  let cloneObj = new obj.constructor;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // 递归深拷贝
      cloneObj[key] = deepCopy(obj[key]);
    }
  }
  return cloneObj;
}