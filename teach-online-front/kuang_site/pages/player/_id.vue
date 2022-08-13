<template>
  <div>

    <div id="J_prismPlayer"/>
    <link rel="stylesheet" href="https://g.alicdn.com/de/prismplayer/2.10.0/skins/default/aliplayer-min.css" >
    <script charset="utf-8" type="text/javascript" src="https://g.alicdn.com/de/prismplayer/2.10.0/aliplayer-h5-min.js">{}</script>

  </div>
</template>
<script>
import courseApi from '~/api/course'
export default{

  async asyncData(page) {
    const vid = page.route.params.id

    const response = await courseApi.getPlayAuth(vid)
    return {
      vid: vid,
      playAuth: response.data.playAuth
    }
  },
  mounted() {
    /* eslint-disable no-undef */
    new Aliplayer({
      id: 'J_prismPlayer',
      width: '100%',
      vid: this.vid,
      playauth: this.playAuth

    }, function(player) {
      console.log('The player is created.')
    })
  }
}
</script>

