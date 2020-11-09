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
    const url = 'https://api.punkapi.com/v2/beers?'
    const nameSearch = '&beer_name='
    const hopsSearch = '&hops='
    const maltSearch = '&malt='
    let searchString = ''
    const name = document.querySelector('.search-name')
    const hops = document.querySelector('.search-hops')
    const malt = document.querySelector('.search-malt')
    /* const bb = document.querySelector('.bre-bf')
    const ba = document.querySelector('.bre-af')
    const abvG = document.querySelector('.abv-gt')
    const abvL = document.querySelector('.abv-lt') */
    name.addEventListener('keyup', async () => {
        searchString += nameSearch + name.value
    })
    hops.addEventListener('keyup', async () => {
        searchString += hopsSearch + hops.value
        //url += '&hops=' + hops.value
        //result = await getData(url + 'hops=' + hops.value)
        //renderSearchList(result)
    })
    malt.addEventListener('keyup', async () => {
        //url += '&malt=' + malt.value
        //result = await getData(url + 'malt=' + malt.value)
        //renderSearchList(result)
    })
    /* bb.addEventListener('keyup', async () => {
        console.log('bb')
        result = await getData(url + 'brewed_before' + bb.value)
        //renderSearchList(result)
    })
    ba.addEventListener('keyup', async () => {
        console.log('ba')
        result = await getData(url + 'brewed_after=' + ba.value)
        //renderSearchList(result)
    })
    abvG.addEventListener('keyup', async () => {
        console.log('abvG')
        result = await getData(url + 'abv_gt' + abvG.value)
        //renderSearchList(result)
    })
    abvL.addEventListener('keyup', async () => {
        console.log('abvL')
        result = await getData(url + 'abv_lt' + abvL.value)
        //renderSearchList(result)
    }) */
    
}


function renderDetails (beer) {
    console.log(beer)
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
document.querySelector('.get-random').addEventListener('click', randomBeer)
randomBeer()
search()
