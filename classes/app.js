export default class App {
  constructor(config) {
    // apply configuration
    this.ocb = config.ocb
    this.language = config.language
    this.sports = config.sports
    this.sportPriority = config.sportPriority
    this.maxFeaturedMatches = config.maxFeaturedMatches
    this.scids = (groups => {
      let scids = []
      for (let group in groups) {
        scids = scids.concat(groups[group].scids)
      }
      return scids
    })(this.sports)

    this.featuredMatches = []
  }

  getData() {
    const scids = '&subCategoryIds=' + this.scids.join(',')
    const api = `https://bts-api-a.bpsgameserver.com/isa/v2/901/${this.language}/event`
    const url = `${api}?ocb=${this.ocb}&${scids}&EventMarketCount=1&streamTypeIds=1`
    return fetch(url)
  }

  calculateFeaturedMatches(matches) {
    for (let i=0; i<this.sportPriority.length; i++) {
      if (this.featuredMatches.length === this.maxFeaturedMatches) {
        return
      }
      const sport = this.sportPriority[i]
      let currentGroupSize = 0
      matches.forEach(match => {
        if (
          match.cri === sport &&
          this.featuredMatches.length < this.maxFeaturedMatches &&
          currentGroupSize < this.maxFeaturedMatches / 2
        ) {
          this.featuredMatches.push(match)
          currentGroupSize++
        }
      })
    }
    return
  }

  createMatch$(match) {
    const month = match.sd.match(/-\d\d/)[0]
      .replace(/\D/, '')
      .replace(/^0/, '')
    const day = match.sd.match(/\d\d[A-Z]/)[0]
      .replace(/\D/, '')
      .replace(/^0/, '')
    const startTime = match.sd.match(/\d\d:\d\d/)[0]
    const match$ = $(`
      <div class="match-container">
        <div class="match-icon-container">
          <img src="${this.sports[match.cri].logo}" alt="${match.cri}" />
        </div>
        <div class="match-info-container">
          <div class="match-dates-container">
          <span class="match-date">${day}/${month} &mdash; </span><span class="match-time">${startTime}</span>
          </div>
          <div class="match-lineup-container">
          <span class="match-lineup">${match.en}</span>
          </div>
        </div>
      </div>
    `)
    return match$
  }

  renderMatches() {
    const div = $('<div>')
    this.featuredMatches.forEach(match => {
        const match$ = this.createMatch$(match)
        $('#echo-matches-container').append(match$)
    })
  }
}
