//防抖函数的作用就是控制函数在一定时间内的执行次数。防抖意味着 N 秒内函数只会被执行一次（最后一次），如果 N 秒内再次被触发，则重新计算延迟时间。
export default function debounce(fn, wait) {
  let timer;
  return function () {
    let th = this;
    let args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      timer = null;
      fn.apply(th, args);
    }, wait);
  };
}