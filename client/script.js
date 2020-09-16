const app = new Vue({
  el: '#app',
  async created() {
    if (location.search) {
      const code = location.search.split('=')[1]
      const url = await fetch(
        '/.netlify/functions/get-link?code=' + code
      ).then(r => r.text())
      window.location.replace(url)
    } else {
      this.createView = true
    }
  },
  data: {
    createView: false,
    campaigns: false,
    passphrase: 'moo',
    form: {
      destination: ''
    },
    newCampaignName: '',
    response: false
  },
  methods: {
    async createLink() {
      const { destination, origin, campaign } = this.form

      if (!destination) {
        return alert('Please provide a URL')
      }

      const payload = { destination }
      if (origin) payload.origin = origin
      if (campaign) payload.campaign = [campaign]

      const resp = await fetch(
        '/.netlify/functions/create-link?passphrase=' + this.passphrase,
        {
          method: 'POST',
          body: JSON.stringify(payload)
        }
      ).then(r => r.json())

      if (resp.error) return alert(resp.error)

      this.response = location.href + '?c=' + resp.url
    },
    async copyLink() {
      navigator.permissions.query({ name: 'clipboard-write' }).then(result => {
        if (result.state == 'granted' || result.state == 'prompt') {
          navigator.clipboard.writeText(this.response).then(
            () => {
              alert('Link copied to clipboard.')
            },
            () => {
              alert(
                'Something went wrong while copying the link to your clipboard.'
              )
            }
          )
        } else {
          alert(
            'Your browser does not allow for us to write to your clipboard.'
          )
        }
      })
    },
    async getCampaigns() {
      const resp = await fetch(
        '/.netlify/functions/get-campaigns?passphrase=' + this.passphrase
      ).then(r => r.json())
      if (resp.error) return alert('Passphrase was wrong')
      this.campaigns = resp
    },
    async createCampaign() {
      if (!this.newCampaignName) {
        return alert('Please provide a campaign name')
      }
      const resp = await fetch(
        '/.netlify/functions/create-campaign?passphrase=' + this.passphrase,
        {
          method: 'POST',
          body: JSON.stringify({ name: this.newCampaignName })
        }
      ).then(r => r.json())
      if (resp.error) return alert(resp.error)
      alert('Campaign created. Please refresh to select it.')
    }
  }
})
