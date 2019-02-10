const loadItems = (page) => {
    fetch(`https://newsapi.org/v2/everything?q=bitcoin&sortBy=publishedAt&apiKey=571925c356d84cb3bc40ea6fef38bbc7&page=${page}`)
    .then(res => res.json())
    .then(data => {
        let content = '';
        for(const article of data.articles) {
            content += `<div class="card">
                            <img src="${article.urlToImage}" onerror="this.src = 'https://www.placecage.com/640/360';" class="card-img-top" alt="...">
                            <div class="card-body">
                            <h5 class="card-title">${article.title}</h5>
                            <p class="card-text">${article.description}</p>
                            <a href="javascript:void(0);" class="btn btn-primary addToCart">Add to cart</a>
                            </div>
                        </div>` 
        }
        document.querySelector('#items #marker').insertAdjacentHTML('beforebegin', content);
        jQuery(window).lazyLoadXT();
        jQuery('#marker').lazyLoadXT({visibleOnly: false, checkDuplicates: false});
    })
}


let cartItems = []

/**
 * 
 * @param {element} el Reference to clicked button
 * @param {string} obj Title of item (idealy this should be whole object or only id so it could be reference to item and it's data)
 */
function addToCart(el, obj) {
    const button = document.createElement('button')
    button.innerHTML = 'Item added'
    button.className = 'btn btn-outline-success';

    jQuery(el).parent().find('.addToCart').replaceWith(button)

    cartItems = [...cartItems, obj]
    const notif = document.querySelector('.notif')
    cartItems.length > 0 ? notif.style.display = 'flex' : notif.style.display = 'none'
    displayInCart()
}

/**
 * display data inside modal (idealy this should be fetched via API or filled dynamically in modal from view)
 * instead i immediately add them to view because there is no backend or database actions involved
 */
function displayInCart() {
    document.querySelector('.addedItem').innerHTML = ''
    let items = ''
    cartItems.map((item, i) => {
        items += `<div class="each-item"><p>${i+1}. ${item}</p>
                    <label for"item-${i}">Quantity:</label>
                    <input type="number" id="item-${i}" class="form-control" value="1">
                    <button class="btn btn-danger" onclick="removeItem(this, '${item}')">Remove</button>
                </div>`
    })
    document.querySelector('.addedItem').insertAdjacentHTML('beforeend', items);
}

/**
 * 
 * @param {element} el Reference to clicked button
 * @param {string} text  Title of item (idealy this should be whole object or only id so it could be reference to item and it's data)
 * instead i will filter cartItems and remove it from array also remove it from modal
 */
function removeItem(el, text) {
    el.parentNode.remove()

    cartItems = cartItems.filter(item => item !== text)
    const actionButton = document.createElement('a')
    actionButton.className = 'btn btn-primary addToCart'
    actionButton.href = 'javascript:void(0);'
    actionButton.innerHTML = 'Add to cart'

    document.querySelectorAll('.card-title').forEach(elem => {
        if(elem.innerText === text) {
           elem.parentNode.replaceChild(actionButton, elem.parentNode.childNodes[5])
        }
    })

    if(cartItems.length === 0) {
        document.querySelector('.addedItem').insertAdjacentHTML('beforeend', '<p>Please add some items!</p>');
        document.querySelector('.notif').style.display = 'none';
    }
}

let page = 1
jQuery('#marker').on('lazyshow', function () {
    loadItems(page)
    page++;
}).lazyLoadXT({visibleOnly: false});

jQuery(document).on('click', '.addToCart', function() {
    addToCart(jQuery(this), jQuery(this).parent().find('.card-title').text())
})

