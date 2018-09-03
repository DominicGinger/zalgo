let defaultLevel = 20
let showFront = true
let showColours = true
let displayMode = 'all'
let strikeThrough = false

const limitMap = {
  all: { min: 768, max: 51 },
  above: { min: 768, max: 21 },
  below: { min: 796, max: 23 }
}

const shareLinks = {
  facebook: (text, url) => `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
  twitter: text => `https://twitter.com/intent/tweet?text=${text}`,
  whatsapp: text => `whatsapp://send?text=${text}`,
  google: text => `https://plus.google.com/share?text=${text}`,
  email: text => `mailto:?body=${text}`
}

window.share = platform => {
  const url = document.location.href
  const text = document.querySelector('.output').innerText
  if (platform === 'copy') {
    return copyToClipboard(text)
  }
  window.open(shareLinks[platform](encodeURI(text), url))
}

function copyToClipboard(str) {
  const el = document.createElement('textarea')
  el.value = str
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}

function getRandomNumber(min, max) {
  number = Math.floor(Math.random() * max) + min

  if (number >= 820 && number <= 824) {
    return getRandomNumber(min, max)
  }
  return number
}

function getNoise(level) {
  level = level > 1000 ? 1000 : level
  const amount = Math.floor(Math.random() * level) + Math.floor(level/4)
  let str = ''

  const { min, max } = limitMap[displayMode]
  for (let i = 0; i < amount + 1; i++) {
    str += `&#${getRandomNumber(min, max)};`
  }

  if (strikeThrough) {
    str += '&#820;&#821;&#822;&#823;&#824;'
  }

  return str
}

document.querySelector('body').addEventListener('paste', event => {
  event.preventDefault()
  const str = event.clipboardData.getData("text/plain")

  str.split('').forEach(c => insertTextAtCursor(transformChar(c)))
})

function startShake() {
  const h1 = document.querySelector('h1')
  if (Math.random() > 0.95) {
    h1.innerHTML = transformChar('Z', 5) +
      transformChar('a', 5) +
      transformChar('l', 5) +
      transformChar('g', 5) +
      transformChar('o', 5)
  }

  h1.classList.add('shake')
  setTimeout(() => {
    h1.classList.remove('shake')
  }, 500)
}

function transformChar(char, level = defaultLevel) {
  return /^[a-zA-Z0-9`~!@£$%^&*()-=_+\[\]\{\}:;"'|\\,<.>//?]{1}$/.test(char) ? `${char}${getNoise(level)}` : char
}

function insertTextAtCursor(text, key) {
  startShake()
  let sel = window.getSelection()
  let range = sel.getRangeAt(0)
  let textNode = document.createElement('span')
  textNode.style.color = showColours ? '#'+(Math.random()*0xFFFFFF<<0).toString(16) : '#2d3436'
  textNode.innerHTML = text
  range.insertNode(textNode)
  range.setStart(textNode, 1)
  range.setEnd(textNode, 1)
  sel.removeAllRanges()
  sel.addRange(range)
}

const ignoreKeys = [13, 16, 17, 18, 91, 27, 8, 46, 86] // Enter, alt, shift, control, cmd, esc, backspace, delete, paste

function getKey(event) {
  if (event.which === 9) { //Tab
    return ' '
  }
  if (![undefined, null, '', 'Unidentified'].includes(event.key)) {
    return event.key
  }
  let kCd = event.which || event.keyCode
  if (kCd === 0 || kCd === 229) { //for android chrome keycode fix
    const innerText = event.target.innerText
    kCd = innerText.charCodeAt(innerText.length - 1)
  }
  return String.fromCharCode(kCd)
}

document.querySelector('.output').addEventListener('keydown', event => [...ignoreKeys].includes(event.which) || event.preventDefault())
document.querySelector('.output').addEventListener('keyup', event => {
  event.target.setAttribute('data-placeholder', '');
  if (ignoreKeys.includes(event.which)) {
    return
  }
  event.preventDefault()
  const key = getKey(event)
  insertTextAtCursor(transformChar(key), key)
})

document.querySelector('.range').addEventListener('keyup', event => {
  defaultLevel = parseInt(event.target.value)
})

document.querySelector('.clear').addEventListener('click', event => {
  document.querySelector('.output').innerHTML = ''
})

document.querySelector('.plus').addEventListener('click', event => {
  const newValue = parseInt(document.querySelector('.range').value) + 1
  document.querySelector('.range').value = newValue
  defaultLevel = newValue
})

document.querySelector('.minus').addEventListener('click', event => {
  const newValue = parseInt(document.querySelector('.range').value) - 1
  document.querySelector('.range').value = newValue
  defaultLevel = newValue
})

document.querySelector('.settings').addEventListener('click', event => {
  document.querySelector('.settings').classList.add('spin')
  setTimeout(() => {
    document.querySelector('.settings').classList.remove('spin')
  }, 200)

  const hideSide = showFront ? '.front' : '.back'
  const showSide = showFront ? '.back' : '.front'
  showFront = !showFront

  document.querySelector(hideSide).classList.add('disappear')
  setTimeout(() => {
    document.querySelector(hideSide).classList.add('hidden')
    document.querySelector(showSide).classList.remove('disappear')
    document.querySelector(showSide).classList.remove('hidden')
  }, 200)
})

document.querySelector('.colours').addEventListener('click', () => {
  showColours = !showColours
  if (showColours) {
    document.querySelector('.colours .checkbox').classList.add('checked')
  } else {
    document.querySelector('.colours .checkbox').classList.remove('checked')
  }
})
document.querySelector('.strike').addEventListener('click', () => {
  strikeThrough = !strikeThrough
  if (strikeThrough) {
    document.querySelector('.strike .checkbox').classList.add('checked')
  } else {
    document.querySelector('.strike .checkbox').classList.remove('checked')
  }

})

document.querySelector('.all').addEventListener('click', () => changeMode('all'))
document.querySelector('.above').addEventListener('click', () => changeMode('above'))
document.querySelector('.below').addEventListener('click', () => changeMode('below'))
function changeMode(mode) {
  displayMode = mode
  document.querySelectorAll('.radio').forEach(e => e.classList.remove('checked'))
  document.querySelector(`.${mode} .radio`).classList.add('checked')
}
