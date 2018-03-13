<template>
  <nav id="tabs" class="opend-tab" v-if="mytabs.length > 0">
    <Button class="prev" @click="tabScroll('prev')" icon="ios-arrow-left"></Button>
    <div id="tabs-bar" ref="elemTabar" class="tabs-bar">
      <ul ref="elemScroll" class="utab">
        <li v-for="(item, index) in mytabs" :key="index" class="scr-menu-item" ref="tabsList"
            v-bind:class="{ 'router-link-exact-active': item.selected }" @click="select(item)">
          {{ item.title}}
          <span v-if="item.closeable" class="tab-close" @click.stop="close(item)"><Icon type="close-circled"></Icon></span>
        </li>
      </ul>
    </div>
    <div class="menu-tab-right">
      <Button class="next" @click="tabScroll('next')" icon="ios-arrow-right"></Button>
      <Dropdown trigger="click" placement="bottom-end" @on-click="dropCloseTabs">
        <Button icon="arrow-down-b">
        </Button>
        <Dropdown-menu slot="list">
          <Dropdown-item name='close'>
            <Icon type="ios-minus-outline"></Icon>
            关闭当前
          </Dropdown-item>
          <Dropdown-item name='closeOther'>
            <Icon type="close"></Icon>
            关闭其他
          </Dropdown-item>
          <Dropdown-item name='closeAll'>
            <Icon type="power"></Icon>
            关闭所有
          </Dropdown-item>
        </Dropdown-menu>
      </Dropdown>
    </div>
  </nav>
</template>

<script type="text/ecmascript-6">
  import tabs from '../../utils/tabs';
  export default {
    name: 'tabs',
    data() {
      return {
        tabsWidth: null
      };
    },
    computed: {
      mytabs() {
        return this.$store.state.app.tabs;
      },
      selectedIndex() {
        return this.$store.state.app.tabSelectedIndex;
      }
    },
    methods: {
      init: function () {
        // 本地存储加载至vuex中,使tabs可跨组件使用
        this.$store.dispatch('tabInit', tabs('getTabs'));
        this.$nextTick(() => {
          this.tabsWidth = this.$refs.elemTabar.offsetWidth;
        });
      },
      select: function (tab) {
        this.$store.dispatch('tabInit', tabs('select', tab));
        this.moveEvent();
      },
      close: function (tab) {
        this.$store.dispatch('tabInit', tabs('close', tab));
        this.moveEvent();
      },
      dropCloseTabs(dropIndex) {
        // 当前页
        let currTab = tabs('getSelected');

        if (dropIndex === 'close' && currTab.closeable) {
          // 关闭当前
          this.$store.dispatch('tabInit', tabs('close', currTab));
        } else {
          // 关闭所有未选中的
          this.mytabs.forEach((tab) => {
            if (tab.title !== currTab.title && tab.closeable) {
              this.$store.dispatch('tabInit', tabs('close', tab));
            }
          });

          if (dropIndex === 'closeAll' && currTab.closeable) {
            // 关闭选中的
            this.$store.dispatch('tabInit', tabs('close', currTab));
          }
        }
        this.moveEvent();
      },
      tabScroll(dir) {
        let scrollIncrement = 300;
        let curLeft = parseInt(getComputedStyle(this.$refs.elemScroll, null)['left']);
        let curRight = parseInt(getComputedStyle(this.$refs.elemScroll, null)['right']);

        if (dir === 'prev') {
          if (curLeft >= 0) {
            return;
          }
          let newLeft = curLeft + scrollIncrement; // 向后移动 scrollIncrement
          if (newLeft > 0) {
            newLeft = 0; // left = 0
          }
          this.$refs.elemScroll.style.left = newLeft + 'px';
        }

        if (dir === 'next') {
          let maxWidth = this.tabsWidth; // 可视区宽度
          let curWidth = parseInt(getComputedStyle(this.$refs.elemScroll, null)['width']); // 当前tab总宽度

          if (curRight >= 0) {
            return;
          }

          let newLeft = curLeft - scrollIncrement; // 向前移动 scrollIncrement

          if (curRight + scrollIncrement > 0) {
            newLeft = maxWidth - curWidth; // right = 0
          }

          this.$refs.elemScroll.style.left = newLeft + 'px';
        }
      },
      moveEvent() {
        let self = this;
        setTimeout(() => {
          self.$store.dispatch('tabSelectedIndex', tabs('getSelectedTabIndex'));
        }, 100);
      },
      moveToView(tab) {
        debugger;
        let curWidth = parseInt(getComputedStyle(this.$refs.elemScroll, null)['width']);
//        let curLeft = parseInt(getComputedStyle(this.$refs.elemScroll, null)['left']);
        let maxWidth = this.tabsWidth; // 可视区宽度
        let offsetLeft = tab.offsetLeft; // tab左偏移

        if (curWidth < maxWidth) { // tab总宽度 < 可视区宽度
          this.$refs.elemScroll.style.left = '0px';
          return;
        }
        let tabWidth = tab.offsetWidth; // tab的宽度
        let centerLeft = (maxWidth - tabWidth) / 2;  // 可视区中间位置

        let newLeft = centerLeft - offsetLeft; // 计算在可视区中间位置的左偏移
        if (newLeft > 0) { // 如果左偏移量 > 0
          newLeft = 0; // 左偏移 = 0
        } else if ((curWidth - maxWidth + newLeft) <= 0) { // 如果右偏移量 > 0
          newLeft = maxWidth - curWidth; // 右偏移 = 0
        }
        this.$refs.elemScroll.style.left = newLeft + 'px';
      }
    },
    mounted() {
      this.init();
    },
    watch: {
      'selectedIndex'(newValue) {
        // 激活当前tab Menu
        let tabs = this.$refs.tabsList;
        if (!tabs[newValue]) {
          return;
        }
        this.moveToView(tabs[newValue]);
      }
    }
  };
</script>

<style>
</style>
