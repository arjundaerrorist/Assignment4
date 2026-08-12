let cart = []
const inbox = document.querySelector('#inbox')
const total = document.querySelector('.total')
const inboxitem = document.querySelectorAll(".inbox-item")
let update = document.querySelector("#update")

updateTable()

setupbutton()

// add remove button
async function setupbutton() {

    inboxitem.forEach((e) => {

        e.clickcount = 0;
        const addbtn = e.querySelector('.addbtn')
        if (!addbtn) return false
        
        addbtn.addEventListener('click', () => {
            
            update.innerHTML = "";
            e.clickcount += 1

            const name = e.querySelector('.name').textContent
            let price = e.querySelector('.price').textContent

            if (e.clickcount % 2 === 1) {
                cart.push({ name, price })
                addbtn.textContent = "Remove item"
                addbtn.classList.add('removebtn')
                addbtn.classList.remove('addbtn')
            }

            else {
                const idx = cart.findIndex(i => i.name === name);
                if (idx !== -1) cart.splice(idx, 1);

                addbtn.textContent = "Add item"
                addbtn.classList.remove('removebtn')
                addbtn.classList.add('addbtn')
            }
            updateTable();

        })
    })

}



// clear price 
function cleanPrice(p) {
    return parseFloat(p.replace(/[^0-9.]/g, ''));
}


// making item table
async function updateTable() {

    total.innerText = 0;

    inbox.innerHTML = `<tr id="empty-row">
                                <td id="inboxitem" colspan="3">
                                    <div class="empty-box">
                                        <div class="icon">i</div>
                                        <h3>No Items Added</h3>
                                        <p>Add items to the cart from the services bar</p>
                                    </div>
                                </td>
                            </tr>`


    if (cart.length > 0) {
        let count = 0;

        inbox.innerHTML = ``
        cart.forEach((item, index) => {

            let tr = document.createElement('tr')
            tr.innerHTML = `
        <tr>
        <th>${index + 1}</th>
        <td>${item.name}</td>
        <td>${item.price}</td>
        </tr>  `

            inbox.appendChild(tr)
            count += cleanPrice(item.price)

        })

        total.innerText = `₹${count}`
    }
}

function resetbuttons() {

    document.querySelectorAll('.inbox-item').forEach(i => {
        i.clickcount = 0

        const addbtn = i.querySelector('button')
        if (addbtn) {
            addbtn.textContent = "Add item"
            addbtn.classList.remove('removebtn')
            addbtn.classList.add('addbtn')
        }
    })

      if (cart.length !== 0) {
        update.innerHTML = ``
    }

    else{
         update.innerHTML = `<p class = "confirmation"> Your Services is Book </p>`
    }
}


function formatOrder(cart) {
    return cart.map((item, i) =>
        `${i + 1}. ${item.name} - ${item.price}`
    ).join('\n');
}


// book the service
async function booknow() {
    let mail = document.querySelector("#email").value
    let phone = document.querySelector("#phone").value
    let name = document.querySelector("#name").value

    let myform = document.querySelector("#myform")


    if (cart.length == 0) {
        alert('add item')
        update.innerHTML = ``
    }

    else {

        myform.addEventListener('submit', function (e) {
            e.preventDefault();

            const orderDetails = formatOrder(cart);
            const totalAmount = total.innerText;
            
            sendMail(name , mail , orderDetails, totalAmount)
            cart = []
            updateTable()

            clearinput(mail, phone, name)

            resetbuttons()

        })
    }

}


// clear input values
async function clearinput(m, p, n) {
    let mail = document.querySelector("#email").value = '';
    let phone = document.querySelector("#phone").value = '';
    let name = document.querySelector("#name").value = '';
}

// send confirmation mail
function sendMail(name , email , orderDetails, totalAmount) {

    const serviceID = "service_absokgp";     
    const templateID = "template_nmb6rqn";   

    const params = {
        user_name: name,
        user_email: email,
        order_details: orderDetails,
        total_amount: totalAmount
    };

    return emailjs.send(serviceID, templateID, params)
        .then(() => {
            alert("Email sent successfully");
        })
        .catch((err) => {
            console.error("Email error:", err);
        });
}


