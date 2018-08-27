let defaultLevel = 20

function getNoise(level) {
  const amount = Math.floor(Math.random() * level) + Math.floor(level/4)
  let str = ''
  for (let i = 0; i < amount; i++) {
    str += `&#${Math.floor(Math.random() * 98) + 768};`
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
  return /^[a-zA-Z0-9 ]{1}$/.test(char) ? `${getNoise(level)}${char}${getNoise(level)}` : char
}

function insertTextAtCursor(text) {
  startShake()
  let sel = window.getSelection()
  let range = sel.getRangeAt(0)
  let textNode = document.createElement('span')
  textNode.innerHTML = text
  range.insertNode(textNode)
  range.setStart(textNode, 1)
  range.setEnd(textNode, 1)
  sel.removeAllRanges()
  sel.addRange(range)
}

document.querySelector('.output').addEventListener('keypress', event => {
  if (event.which === 13) { // Enter
    return
  }
  event.preventDefault()
  const charStr = String.fromCharCode(event.which)
  insertTextAtCursor(transformChar(charStr))
})

document.querySelector('.range').addEventListener('change', event => {
  level = parseInt(event.target.value)
})

document.querySelector('.clear').addEventListener('click', event => {
  document.querySelector('.output').innerHTML = '';
})
