

const cache = {}
const errorMsg = document.querySelector('.error-msg')
let search = ''
let counter = 1
const url = 'https://api.punkapi.com/v2/beers?per_page=10'
const links = document.querySelectorAll('nav > a')


for(let link of links) {
    link.addEventListener('click', () => {
        document.querySelectorAll('main > section').forEach(
            section => section.classList.remove('active')
        )
        const section = document.querySelector(('.' + link.innerText.toLowerCase()))
        section.classList.add('active')
    })
}

function validate() {
    let string = ''
    const inputs = document.querySelectorAll('input')
    const invalidInputs = document.querySelectorAll('input:invalid')
    const invalidSpan = document.querySelectorAll('.invalid')
    for(let span of invalidSpan) {
        span.classList.add('display-none')
    }
    for(let input of inputs) {
        string += input.value
    }
    if(invalidInputs.length > 0) {
        for(let i = 0; i < invalidInputs.length; i++) {
            let x = invalidInputs[i].previousElementSibling
            x.classList.remove('display-none')
        }
        return false
    } else if (string === '') {
        alert('You left all the fields empty, try again!')
        return false
    }
    return true
} 

async function getData(url) {
    if(cache[url]) {
        return cache[url]
    } else if(url === 'https://api.punkapi.com/v2/beers/random') {
        const request = await fetch(url)
        const data = await request.json()
        return data
    }else {
        const request = await fetch(url)
        const data = await request.json()
        cache[url] = data
        return data
    }
}

function renderSearchList(result) {
    if(document.querySelector('.prev').classList.contains('hidden')) {
        document.querySelector('.prev').classList.add('hidden')
    }
    if(document.querySelector('.next').classList.contains('hidden')) {
        document.querySelector('.next').classList.add('hidden')
    }
    const list = document.querySelectorAll('.result-list li')
    errorMsg.innerText = ''
    for(item of list) {
        item.innerText = ''
        item.style.background = 'none'
        item.removeEventListener('click', () => {
            renderDetails(result[i])
            document.querySelectorAll('main > section').forEach(
                section => section.classList.remove('active')
            )
            document.querySelector('.info').classList.add('active')
        })
        item.style.cursor = 'auto'         
    }
    if(result.length == 0 || result == null) {
        document.querySelector('.next').classList.add('hidden')
        document.querySelector('.prev').classList.add('hidden')
        document.querySelector('.search > .wrapper-form ul').classList.add('hidden')
        errorMsg.innerText = 'No results'
    } else if (result.length > 0) {
        errorMsg.innerText = ''
        document.querySelector('.search > .wrapper-form ul').classList.remove('hidden')
        if(result.length == list.length) {
            document.querySelector('.next').classList.remove('hidden')
            document.querySelector('.next').addEventListener('click', next)
            document.querySelector('.next').style.cursor = 'pointer'
            if(counter > 1) {
                document.querySelector('.prev').classList.remove('hidden')
                document.querySelector('.prev').addEventListener('click', prev)
                document.querySelector('.prev').style.cursor = 'pointer'
            } else if (counter == 1) {
        document.querySelector('.prev').classList.add('hidden')
    }
            for(let i = 0; i < result.length; i++) {
                list[i].innerText = result[i].name
                list[i].style.background = 'rgba(255, 255, 255, 0.63)'
                list[i].addEventListener('click', () => {
                    renderDetails(result[i])
                    document.querySelectorAll('main > section').forEach(
                        section => section.classList.remove('active')
                    )
                    document.querySelector('.info').classList.add('active')
                })
                list[i].style.cursor = 'pointer'
            } 
        } else if (result.length < list.length) {
            document.querySelector('.next').classList.add('hidden')
            for(let i = 0; i < result.length; i++) {
                list[i].innerText = result[i].name
                list[i].style.background = 'rgba(255, 255, 255, 0.63)'
                list[i].addEventListener('click', () => {
                    renderDetails(result[i])
                    document.querySelectorAll('main > section').forEach(
                        section => section.classList.remove('active')
                    )
                    document.querySelector('.info').classList.add('active')
                })
                list[i].style.cursor = 'pointer'
            } 
        }
    }
}

async function next() {
    counter++
    let nextUrl = url + '&page=' + counter + search
    nextPage = await getData(nextUrl)
    renderSearchList(nextPage)
}

async function prev() {
    counter--
    let prevUrl = url + '&page=' + counter + search
    prevPage = await getData(prevUrl)
    renderSearchList(prevPage) 
}

async function advancedSearch() {
    search = ''
    const searchParam = ["&beer_name=", "&hops=", "&malt=", "&brewed_before=", "&brewed_after=", "&abv_gt=", "&abv_lt="]
    const form = document.forms['advancedSearch']
    for(let i = 0; i < form.length; i++) {
        if(form[i].value.length > 0) {
            search += searchParam[i] + form[i].value
        }
    }
    result = await getData(url + '&page=' + counter + search)
    renderSearchList(result)
}

function renderDetails (beer) {
    const beerImg = document.querySelector('.beer-img')
    const top = document.querySelector('.beer-info > .top')
    const btmL = document.querySelector('.beer-info > .btm > .left')
    const btmR = document.querySelector('.beer-info > .btm > .right')
    if(beer.image_url != null) {
        beerImg.src = beer.image_url
    } else {
        beerImg.src = ''
    }

    let beerMalt = []
    for(let i = 0; i < beer.ingredients.malt.length; i++) {
        beerMalt.push(beer.ingredients.malt[i])
    }
    let beerHops = []
    for(let i = 0; i < beer.ingredients.hops.length; i++) {
        beerHops.push(beer.ingredients.hops[i])
    }
    
    top.innerHTML = `
    <h2>${beer.name}</h2> 
    <p class="description">${beer.description}</p> `

    btmL.innerHTML = `
    <p>Alcohol by volume: ${beer.abv}, Volume: ${beer.volume.value} ${beer.volume.unit} </p>
    <p>Malt: </p>
    <ul>`
    for(let malt of beerMalt) {
        btmL.innerHTML += `
        <li>${malt.name}, ${malt.amount.value} ${malt.amount.unit}</li>`
    }
    btmL.innerHTML += `
    </ul>
    <p>Hops: </p>
    <ul>`
    for(let hops of beerHops) {
        btmL.innerHTML += `
        <li>${hops.name}, ${hops.amount.value} ${hops.amount.unit}</li>`
    }
    btmL.innerHTML += `
    </ul>
    <p>Yeast: ${beer.ingredients.yeast}</p>`

    btmR.innerHTML = `
    <img src="assets/forkWhite.png"> 
    <p class="food">Food pairing: </p>
    <ul>`
    for(let food of beer.food_pairing) {
        btmR.innerHTML += `<li>${food}</li>`
    }
    btmR.innerHTML += `
    </ul>
    <img src="assets/beerWhite.png"> <p class="tips"> Brewers tips: <br>${beer.brewers_tips}</p>`
}

async function randomBeer() {
    const img = document.querySelector('.card-top img')
    const beerName = document.querySelector('.card-bottom h2')
    const tagline = document.querySelector('.card-bottom p')
    const link = document.querySelector('.card-bottom button')
    const randomUrl = 'https://api.punkapi.com/v2/beers/random'
    let data = await getData(randomUrl)
    if(data[0].image_url == null) {
        img.src = './assets/NoImageSmall.gif'
        img.style.height = '100%'
    } else {
        img.src = data[0].image_url
        img.style.height = '350px'
    }
    beerName.innerText = data[0].name
    tagline.innerText = data[0].tagline
    if(link.classList.contains('hidden')){
        link.classList.remove('hidden')
    }
    link.addEventListener('click', () => {
        document.querySelectorAll('main > section').forEach(
            section => section.classList.remove('active')
        )
        document.querySelector('main .info').classList.add('active')
        renderDetails(data[0])
    })
}

document.querySelector('form button').addEventListener('click', (event) => {
    event.preventDefault()
    if (validate() == true) {
        advancedSearch()
    }
})
document.querySelector('.get-random').addEventListener('click', (event) => {
    event.preventDefault()
    randomBeer()
})

randomBeer()