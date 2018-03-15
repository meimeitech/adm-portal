<template>
  <div>
    <iframe :src="src" width="100%" frameborder="0" :id="'external-frame-' + index" style="min-height: 700px;padding-bottom: 10px;"></iframe>
  </div>
</template>

<script type="text/ecmascript-6">
  import tabs from '../../utils/tabs';

  export default {
    name: 'myIframe',
    data() {
      return {
//        toPath: 'https://www.baidu.com/'
      };
    },
    methods: {
      setIframeHeight(iframe) {
        if (iframe) {
          let iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
          if (iframeWin.document.body) {
            iframe.height = iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight;
          }
        }
      },
      receiveMessageFromIframePage(event) {
        if (!event.data.msg) {
          return;
        }
        let msg = JSON.parse(event.data.msg);
        if (msg.type === 'add') { // 添加新tab页签
          this.$router.push({path: '/portal?name=' + msg.data.name + '&path=' + msg.data.src});
        } else if (msg.type === 'close') {
          this.$store.dispatch('tabInit', tabs('close', msg.data.name));
          this.moveEvent();
        } else if (msg.type === 'refresh') {
          this.$store.dispatch('tabInit', tabs('update', {
            tab: msg.data.name,
            refresh: true
          }));
          this.moveEvent();
        }
      },
      moveEvent() {
        let self = this;
        setTimeout(() => {
          self.$store.dispatch('tabSelectedIndex', tabs('getSelectedTabIndex'));
        }, 100);
      }
    },
    mounted() {
      this.setIframeHeight(document.getElementById('external-frame-' + this.index));
      // 监听message事件
      window.addEventListener('message', this.receiveMessageFromIframePage, false);
    },
    watch: {
      'refresh': function (newValue, oldVale) {
        if (newValue) {
          // 刷新指令
          document.getElementById('external-frame-' + this.index).src = this.src;
          tabs('refreshDone', this.name);
        }
      }
    },
    props: ['src', 'refresh', 'index', 'name']
  };
</script>

<style>
  .container{
    background: #ffffff;
  }
</style>
