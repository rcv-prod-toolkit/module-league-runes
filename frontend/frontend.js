let server = ''
const updateUi = async (state) => {
  server = await window.constants.getModuleURL()
  const location = server

  const apiKey = await window.constants.getApiKey()

  document.querySelector('#embed-copy').value = `${location}/gfx.html${
    apiKey !== null ? '?apikey=' + apiKey : ''
  }`
  document.querySelector('#runes-gfx').src = `${location}/gfx.html${
    apiKey !== null ? '?apikey=' + apiKey : ''
  }`

  document.querySelector('#state').innerHTML = JSON.stringify(state, null, 2)

  document.querySelector('#text-state').innerHTML = state.state
  document.querySelector('#data-state').innerHTML = state.dataState
}

const updateState = async () => {
  const response = await LPTE.request({
    meta: {
      namespace: 'module-league-runes',
      type: 'request',
      version: 1
    }
  })

  updateUi(response.state)
}

const nextStep = () => {
  LPTE.emit({
    meta: {
      namespace: 'module-league-runes',
      type: 'next-step',
      version: 1
    }
  })
}

const prevStep = () => {
  LPTE.emit({
    meta: {
      namespace: 'module-league-runes',
      type: 'previous-step',
      version: 1
    }
  })
}

LPTE.onready(async () => {
  updateState()
  LPTE.on('module-league-runes', 'update', (e) => updateUi(e.state))
})
