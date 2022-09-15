let previousState = 'HIDDEN'
const namespace = 'module-league-runes'

const updateUi = (data) => {
  if (data.state === 'HIDDEN') {
    document.querySelector('.blue-box').classList.add('hidden')
    document.querySelector('.red-box').classList.add('hidden')
  } else {
    if (previousState !== data.state) {
      document.querySelector('.red-box').classList.add('hidden')
      document.querySelector('.blue-box').classList.add('hidden')
      previousState = data.state
      return
    }

    const num = parseInt(data.state)

    const championMapping = {
      1: [1, 6],
      2: [2, 7],
      3: [3, 8],
      4: [4, 9],
      5: [5, 10]
    }

    const getDDragonPath = (clientPath) =>
      `/serve/module-league-static/img/${clientPath}`

    const getDDragonPathsFromRunes = (runes) => ({
      primary: getDDragonPath(runes[0].icon),
      primary1: getDDragonPath(runes[1].icon),
      primary2: getDDragonPath(runes[2].icon),
      primary3: getDDragonPath(runes[3].icon),
      secondary1: getDDragonPath(runes[4].icon),
      secondary2: getDDragonPath(runes[5].icon)
    })

    const championLeft = data.participants[championMapping[num][0] - 1].champion
    const championRight =
      data.participants[championMapping[num][1] - 1].champion
    const runesLeft =
      data.participants[championMapping[num][0] - 1].perks.perkConstants
    const runesRight =
      data.participants[championMapping[num][1] - 1].perks.perkConstants
    const splashLinkLeft = `/serve/module-league-static/img/champion/centered/${championLeft.key}.jpg`
    const splashLinkRight = `/serve/module-league-static/img/champion/centered/${championRight.key}.jpg`

    const runesLeftFull = getDDragonPathsFromRunes(runesLeft)
    const runesRightFull = getDDragonPathsFromRunes(runesRight)

    const applyImages = (prefix, runes) => {
      document.querySelector(`#${prefix}-rune-primary`).src = runes.primary
      document.querySelector(`#${prefix}-rune-primary-1`).src = runes.primary1
      document.querySelector(`#${prefix}-rune-primary-2`).src = runes.primary2
      document.querySelector(`#${prefix}-rune-primary-3`).src = runes.primary3
      document.querySelector(`#${prefix}-rune-secondary-1`).src = runes.secondary1
      document.querySelector(`#${prefix}-rune-secondary-2`).src = runes.secondary2
    }

    document.querySelector('.red-box').classList.remove('hidden')
    document.querySelector('.blue-box').classList.remove('hidden')

    document.querySelector('.blue-box').style.backgroundImage = `url(${splashLinkLeft})`
    
    document.querySelector('.red-box').style.backgroundImage = `url(${splashLinkRight})`

    applyImages('blue', runesLeftFull)
    applyImages('red', runesRightFull)
  }

  previousState = data.state
}

const tick = async () => {
  const data = await this.LPTE.request({
    meta: {
      namespace,
      type: 'request',
      version: 1
    }
  })
  updateUi(data.state)
}

window.LPTE.onready(() => {
  tick()
  setTimeout(tick, 100)
  // setInterval(tick, 1000)

  window.LPTE.on(namespace, 'update', (data) => {
    const timeout = previousState === 'HIDDEN' ? 1 : 1000
    updateUi(data.state)
    setTimeout(() => updateUi(data.state), timeout)
  })
})
