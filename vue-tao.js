class Vue {
  constructor(options) {
    //缓存配置项
    this.$el = options.el || document.body;
    this.$options = options;
    const data = this.$data = options.data;
    //劫持数据
    console.log(data,1111)
    this.hijackData(data);
  }
  hijackData(data) {
    //拿到data中所有可枚举的属性
    if (!data || typeof data !== 'object') {
      return;
    }
    Object.keys(data).forEach(key => {
      console.log(1)
      //递归遍历所有层次
      this.hijackData(data[key]);
      //代理数据
      this.proxyData(key);
    });
  }
  proxyData(key) {
    //数据代理
    Object.defineProperty(this, key, {
      enumerable: true, //可枚举
      configurable: false, //不能再配置
      //添加getter
      get() {
        return this.$data[key]; //通过之前缓存的$data访问到data对象
        //以后通过vue实例就可以直接访问到data中的数据了--> console.log(vm.name);
      },
      //添加setter
      set(newVal) {
        this.$data[key] = newVal;
        //以后就可以监视到属性值的变化并更新其中的值--> vm.name = 'nice vue'
      }
    });
  }
}
