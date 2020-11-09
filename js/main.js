const endpointUrl = 'https://api.punkapi.com/v2/'
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
    const errorMsg = document.querySelector('.error-msg')
    const list = document.querySelectorAll('.result-list li')
    errorMsg.innerText = ''
    
    for(item of list) {
        item.innerText = ''
        item.style.background = 'none'
    }
    if(result.length == 0 || result == null) {
        document.querySelector('.search > .wrapper-form ul').classList.add('hidden')
        errorMsg.innerText = 'No results'
    } else if (result.length > 0) {
        errorMsg.innerText = ''
        document.querySelector('.search > .wrapper-form ul').classList.remove('hidden')
        for(let i = 0; i < list.length; i++) {
            //console.log(result[i].name)
            list[i].innerText = result[i].name
            list[i].style.background = 'rgba(255, 255, 255, 0.63)'
            list[i].addEventListener('click', () => {
                    renderDetails(result[i])
                    document.querySelectorAll('main > section').forEach(
                        section => section.classList.remove('active')
                    )
                    document.querySelector('.info').classList.add('active')
            })
        }
    }
}

async function search() {
    let result
    const url = 'https://api.punkapi.com/v2/beers?beer_name='
    const input = document.querySelector('.search-name')
    input.addEventListener('keyup', async () => {
        result = await getData(url + input.value)
        //console.log(result)
        renderSearchList(result)
    })
}


function renderDetails (beer) {
    console.log(beer)
    const beerImg = document.querySelector('.beer-img')
    const beerInfo = document.querySelector('.beer-info')
    const heading = document.querySelector('.info h2')
    const volume = document.querySelector('.info .volume')
    const description = document.querySelector('.info .description')
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
    heading.innerText = beer.name
    volume.innerText = `Alcohol by volume: ${beer.abv}, Volume: ${beer.volume.value} ${beer.volume.unit}`
    description.innerText = beer.description

    beerInfo.innerHTML = `
        <ul>
        <p>Ingredients: </p>
        <li>Hops: ${beerHops}</li>
        <li>Malt: ${beerMalt}</li>
        <li>Yeast: ${beer.ingredients.yeast}</li>
        </ul>
        <p class="food"> <img src="assets/fork.png"> <br> Food pairing: <br> ${beer.food_pairing}</p><br>
        <p class="tips"> <img src="assets/beer.png"> <br> Brewers tips: <br>${beer.brewers_tips}</p>
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
    //console.log(data[0])
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

// if page classlist containts 'active' => 
document.querySelector('.form-search > span').addEventListener('click', () => {
    //document.querySelector('.advanced').classList.remove('display-none')
    document.querySelector('.advanced').style.display = 'grid'
})
document.querySelector('.get-random').addEventListener('click', randomBeer)
randomBeer()
search()
