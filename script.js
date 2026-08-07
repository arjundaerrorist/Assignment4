const EMAILJS_PUBLIC_KEY = "YCQ7lZUmZ8Iiv-Lyc";
const EMAILJS_SERVICE_ID = "service_absokgp";
const EMAILJS_TEMPLATE_ID = "template_nmb6rqn";

if (window.emailjs && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
    emailjs.init(EMAILJS_PUBLIC_KEY);
}

const services = [
    { id: 1, name: "Dry Cleaning", price: 200, icon: "dry-cleaning.png" },
    { id: 2, name: "Wash & Fold", price: 100, icon: "wash.png" },
    { id: 3, name: "Ironing", price: 30, icon: "iron.png" },
    { id: 4, name: "Stain Removal", price: 500, icon: "stain.png" },
    { id: 5, name: "Leather & Suede Cleaning", price: 999, icon: "leather.png" },
    { id: 6, name: "Wedding Dress Cleaning", price: 2800, icon: "wedding.png" },
];

let cart = [];

const serviceListEl = document.getElementById("serviceList");

function renderServiceList() {
    serviceListEl.innerHTML = services.map(s => {
        const inCart = cart.some(c => c.id === s.id);
        return `
            <div class="service-row">
                <div class="service-info">
                      <img src="${s.icon}" alt="${s.name}"
                      class="service-icon" />
                      <div class="service-text">
                         <span class="name">${s.name}</span>
                         <span class="price">&#8377;${s.price.toFixed(2)}</span>
                      </div>
                </div>
                <button class="${inCart ? 'btn-remove' : 'btn-add'}"
                data-id="${s.id}">
                  ${inCart ? 'Remove &#8854;' : 'Add &#8853;'}
                </button>
            </div>
        `;
    }).join("");

    serviceListEl.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => toggleService(Number(btn.dataset.id)));
    });
}

function toggleService(id) { 
    const exists = cart.some(c => c.id === id);
    if(exists){
        cart = cart.filter(c => c.id !== id);
    } else{
        const svc = services.find(s => s.id === id);
        cart.push(svc);
    }
    renderServiceList();
    renderCart();


}

const itemsTable = document.getElementById("itemsTable");
const itemsTableBody = document.getElementById("itemsTableBody");
const emptyCartMsg = document.getElementById("emptyCartMsg");
const totalAmountEl = document.getElementById("totalAmount");

function renderCart(){
    if(cart.length === 0){
        itemsTable.style.display = "none";
        emptyCartMsg.style.display = "block";
    } else{
        itemsTable.style.display = "table";
        emptyCartMsg.style.display ="none";
        itemsTableBody.innerHTML = cart.map((item, idx) =>`
         <tr>
             <td>${idx + 1}</td>  
             <td>${item.name}</td>
             <td class="price">&#8377;${item.price.toFixed(2)}</td>
        </tr>  
        `).join("");
    }
    const total= cart.reduce((sum, item) => sum+ item.price,0);
    totalAmountEl.textContent = total.toFixed(2);
}

// BOOKING

const bookingForm = document.getElementById("bookingForm");
const bookNowBtn = document.getElementById("bookNowBtn");
const thankYouMsg = document.getElementById("thankYouMsg");
const navUsername = document.getElementById("navUsername");

bookingForm.addEventListener("submit", function(e){e.preventDefault();
    
    if(cart.length === 0){
        alert("Please add at least one service before booking.");
        return;
    }

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("emailId").value.trim();
    const phone = document.getElementById("phoneNumber").value.trim();
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const serviceList = cart.map(c => `${c.name} (₹${c.price.toFixed(2)})`).join(",");

    const templateParams = {
        full_name: fullName,
        email: email,
        phone: phone,
        services: serviceList,
        total: `₹${total.toFixed(2)}`
    };

    bookNowBtn.disabled = true;
    bookNowBtn.textContent = "Booking..";

    const finish = () => {
        navUsername.textContent = fullName|| "Guest";
        thankYouMsg.classList.add("show");
        bookingForm.reset();
        cart = []
        renderServiceList();
        renderCart();
        bookNowBtn.disabled = false;
        bookNowBtn.textContent = "Book now";

    };

    if (window.emailjs && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
        emailjs.send(EMAILJS_SERVICE_ID,EMAILJS_TEMPLATE_ID,templateParams)
          .then(finish)
          .catch(err =>{
             console.error("EmailJS error:", err);
             alert("Booking saved, but the confirmation email could not be sent. Please check your EmailJS configuration.");
             finish();
          });
    }  else {


        console.warn("EmailJS is not configured. Fill in EMAILJS_PUBLIC_KEY / SERVICE_ID / TEMPLATE_ID at the top of the <script> to enable real emails.");
        setTimeout(finish,500);
    }
});


document.getElementById("newsletterForm").addEventListener("submit",function(e){
    e.preventDefault();
    const name = document.getElementById("nlName").value.trim();
    alert(`Thanks for subscribing,${name || "friend"}`);
    this.reset();
});

document.getElementById("bookServiceBtn").addEventListener("click",() => {
    document.getElementById("booking").scrollIntoView({behavior:"smooth"});
});

const navToggle = document.getElementById("navToggle");
const navlinks = document.getElementById("navlinks");
navToggle.addEventListener("click" , () => navlinks.classList.toggle     ("open"));
navlinks.querySelectorAll("a").forEach(a =>
     a.addEventListener("click", () => navlinks.classList.remove("open"))
);

renderServiceList();
renderCart();