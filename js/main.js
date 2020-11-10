
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

async function getData(url) {
    const request = await fetch(url)
    const data = await request.json()
    return data
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
    nextPage = await getData(url + '&page=' + counter + search)
    if(nextPage.length > 0) {
        renderSearchList(nextPage)
    }
}

async function prev() {
    counter--
    prevPage = await getData(url + '&page=' + counter + search)
    if(prevPage.length > 0) {
        renderSearchList(prevPage)
    } 
}

async function advancedSearch () {
    search = ''
    const form = document.forms['advancedSearch']
    for(let i = 0; i < form.length; i++) {
        if(form[i].value.length > 0) {
            search += form[i].name + form[i].value
        }
    }
    result = await getData(url + search)
    renderSearchList(result)
}

function renderDetails (beer) {
    const beerImg = document.querySelector('.beer-img')
    const beerInfo = document.querySelector('.beer-info')
    beerImg.src = beer.image_url
    let beerMalt = ''
    for(let i = 0; i < beer.ingredients.malt.length; i++) {
        if(i == beer.ingredients.malt.length -1) {
            beerMalt += beer.ingredients.malt[i].name
        } else {
            beerMalt += beer.ingredients.malt[i].name  + ', '
        }
    }
    let beerHops = ''
    for(let i= 0; i < beer.ingredients.hops.length; i++) {
        if(i == beer.ingredients.hops.length -1) {
            beerHops += beer.ingredients.hops[i].name
        } else {
            beerHops += beer.ingredients.hops[i].name + ', '
        }
        
    }
    beerInfo.innerHTML = `
    <h2>${beer.name}</h2>
    <p>Alcohol by volume: ${beer.abv}, Volume: ${beer.volume.value} ${beer.volume.unit} </p> 
    <p class="description">${beer.description}</p>
    <ul>
    <p>Ingredients: </p>
    <li>Hops: ${beerHops}</li>
    <li>Malt: ${beerMalt}</li>
    <li>Yeast: ${beer.ingredients.yeast}</li>
    </ul>
    <img src="assets/fork.png"> <p class="food"> Food pairing: <br> ${beer.food_pairing}</p><br>
    <img src="assets/beer.png"> <p class="tips"> Brewers tips: <br>${beer.brewers_tips}</p>
    `
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
    advancedSearch()
})
document.querySelector('.get-random').addEventListener('click', randomBeer)
randomBeer()