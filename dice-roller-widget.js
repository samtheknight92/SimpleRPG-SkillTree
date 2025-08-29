// Dice Roller Widget Logic
// Requires dice-roller-widget.html and styles-dice-roller.css to be included in your main HTML

const diceTypes = [4, 6, 8, 10, 12, 20, 100]
let diceGroups = [{ type: 6, qty: 1 }]

function renderDiceGroups() {
    const diceGroupsDiv = document.getElementById('diceGroups')
    diceGroupsDiv.innerHTML = ''
    diceGroups.forEach((group, idx) => {
        const groupDiv = document.createElement('div')
        groupDiv.className = 'dice-group'
        // Dice type select
        const select = document.createElement('select')
        select.className = 'dice-select'
        diceTypes.forEach(type => {
            const opt = document.createElement('option')
            opt.value = type
            opt.textContent = `d${type}`
            if (type === group.type) opt.selected = true
            select.appendChild(opt)
        })
        select.onchange = e => {
            diceGroups[idx].type = parseInt(e.target.value)
        }
        // Quantity input
        const qty = document.createElement('input')
        qty.type = 'number'
        qty.className = 'dice-qty'
        qty.value = group.qty
        qty.min = 1
        qty.max = 20
        qty.onchange = e => {
            diceGroups[idx].qty = Math.max(1, Math.min(20, parseInt(e.target.value)))
            qty.value = diceGroups[idx].qty
        }
        // Remove button
        const removeBtn = document.createElement('button')
        removeBtn.className = 'remove-btn'
        removeBtn.textContent = 'Remove'
        removeBtn.onclick = () => {
            diceGroups.splice(idx, 1)
            renderDiceGroups()
        }
        groupDiv.appendChild(select)
        groupDiv.appendChild(qty)
        if (diceGroups.length > 1) groupDiv.appendChild(removeBtn)
        diceGroupsDiv.appendChild(groupDiv)
    })
}

document.getElementById('addDiceBtn').onclick = () => {
    if (diceGroups.length < 9) {
        diceGroups.push({ type: 6, qty: 1 })
        renderDiceGroups()
    }
}

document.getElementById('dice-roller-fab').onclick = () => {
    const modal = document.getElementById('dice-roller-modal')
    if (modal.classList.contains('active')) {
        modal.classList.remove('active')
    } else {
        modal.classList.add('active')
    }
}
document.getElementById('dice-roller-close').onclick = () => {
    document.getElementById('dice-roller-modal').classList.remove('active')
}

function rollDie(sides) {
    return Math.floor(Math.random() * sides) + 1
}

document.getElementById('rollBtn').onclick = () => {
    const diceResultsDiv = document.getElementById('diceResults')
    diceResultsDiv.style.display = 'block'
    diceResultsDiv.innerHTML = '<div class="result-label">Rolling...</div>'
    let allResults = []
    let total = 0
    let animRows = []
    // Animate each dice group
    diceGroups.forEach((group, idx) => {
        const rowDiv = document.createElement('div')
        rowDiv.className = 'dice-row'
        rowDiv.innerHTML = `<span>${group.qty} × d${group.type}:</span>`
        let diceSpans = []
        for (let i = 0; i < group.qty; i++) {
            const diceSpan = document.createElement('span')
            diceSpan.className = 'dice-anim'
            diceSpan.textContent = '?'
            rowDiv.appendChild(diceSpan)
            diceSpans.push(diceSpan)
        }
        diceResultsDiv.appendChild(rowDiv)
        animRows.push({ diceSpans, group })
    })
    // Animate dice
    let rollCount = 0
    const animInterval = setInterval(() => {
        animRows.forEach(({ diceSpans, group }) => {
            diceSpans.forEach(span => {
                span.textContent = rollDie(group.type)
            })
        })
        rollCount++
        if (rollCount > 15) {
            clearInterval(animInterval)
            // Show final results
            diceResultsDiv.innerHTML = '<div class="result-label">Results:</div>'
            let grandTotal = 0
            diceGroups.forEach((group, idx) => {
                const rowDiv = document.createElement('div')
                rowDiv.className = 'dice-row'
                rowDiv.innerHTML = `<span>${group.qty} × d${group.type}:</span>`
                let groupTotal = 0
                for (let i = 0; i < group.qty; i++) {
                    const val = rollDie(group.type)
                    groupTotal += val
                    const diceSpan = document.createElement('span')
                    diceSpan.className = 'dice-static'
                    diceSpan.textContent = val
                    rowDiv.appendChild(diceSpan)
                }
                grandTotal += groupTotal
                rowDiv.innerHTML += `<span style="margin-left:12px;color:#ffd700;">Sum: ${groupTotal}</span>`
                diceResultsDiv.appendChild(rowDiv)
            })
            const totalDiv = document.createElement('div')
            totalDiv.className = 'total-row'
            totalDiv.textContent = `Grand Total: ${grandTotal}`
            diceResultsDiv.appendChild(totalDiv)
        }
    }, 50)
}

renderDiceGroups()
