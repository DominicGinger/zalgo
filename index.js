let defaultLevel = 20
let showFront = true
let showColours = false
let displayMode = 'all'

const limitMap = {
  all: { min: 768, max: 98 },
  above: { min: 768, max: 21 },
  below: { min: 796, max: 23 }
}

function getNoise(level) {
  const amount = Math.floor(Math.random() * level) + Math.floor(level/4)
  let str = ''

  const { min, max } = limitMap[displayMode]
  console.log(min, max)
  for (let i = 0; i < amount + 1; i++) {
    str += `&#${Math.floor(Math.random() * max) + min};`
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
  return /^[a-zA-Z0-9 `~!@£$%^&*()-=_+\[\]\{\}:;"'|\\,<.>//?]{1}$/.test(char) ? `${getNoise(level)}${char}${getNoise(level)}` : char
}

function insertTextAtCursor(text) {
  startShake()
  let sel = window.getSelection()
  let range = sel.getRangeAt(0)
  let textNode = document.createElement('span')
  textNode.style.color = showColours ? '#'+(Math.random()*0xFFFFFF<<0).toString(16) : 'default'
  textNode.innerHTML = text
  range.insertNode(textNode)
  range.setStart(textNode, 1)
  range.setEnd(textNode, 1)
  sel.removeAllRanges()
  sel.addRange(range)
}

document.querySelector('.output').addEventListener('keypress', event => {
  event.target.setAttribute('data-placeholder', '');
  if (event.which === 13) { // Enter
    return
  }
  event.preventDefault()
  const charStr = String.fromCharCode(event.which)
  insertTextAtCursor(transformChar(charStr))
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
  }, 600)

  const hideSide = showFront ? '.front' : '.back'
  const showSide = showFront ? '.back' : '.front'
  showFront = !showFront

  document.querySelector(hideSide).classList.add('disappear')
  setTimeout(() => {
    document.querySelector(hideSide).classList.add('hidden')
    document.querySelector(showSide).classList.remove('disappear')
    document.querySelector(showSide).classList.remove('hidden')
  }, 600)
})

document.querySelector('.colours').addEventListener('click', () => showColours = !showColours)

document.querySelectorAll('input[name=mode]').forEach(e => e.addEventListener('click', changeMode))
function changeMode(event) {
  displayMode = event.target.value
}
