const updateUi = (state) => {
  $('#embed-copy').val(`${location.href}/gfx.html${window.apiKey !== null ? '?apikey' + window.apiKey : ''}`);
  $('#state').text(JSON.stringify(state, null, 2))

  $('#text-state').text(state.state);
  $('#data-state').text(state.dataState);
}

const namespace = 'module-league-runes'

const updateState = async () => {
  const response = await LPTE.request({
    meta: {
      namespace,
      type: 'request',
      version: 1
    }
  });

  updateUi(response.state);
}

const nextStep = () => {
  LPTE.emit({
    meta: {
      namespace,
      type: 'next-step',
      version: 1
    }
  })
}

const prevStep = () => {
  LPTE.emit({
    meta: {
      namespace,
      type: 'previous-step',
      version: 1
    }
  })
}

LPTE.onready(async () => {
  updateState();
  LPTE.on(namespace, 'update', (e) => updateUi(e.state))
})