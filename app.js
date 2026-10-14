const products = [
 {id:1,name:"دفتر نقطه‌ای مینیمال",category:"دفتر و کاغذ",price:185000,oldPrice:220000,emoji:"📓",visual:1,badge:"پرفروش",desc:"دفتر نقطه‌ای با جلد خوش‌رنگ؛ مناسب برنامه‌ریزی و ایده‌پردازی."},
 {id:2,name:"خودکار ژله‌ای رنگی",category:"نوشت‌افزار",price:78000,oldPrice:0,emoji:"🖊️",visual:2,badge:"",desc:"نوشتن روان و رنگ‌های جذاب برای یادداشت‌های روزانه."},
 {id:3,name:"ماژیک هایلایتر پاستلی",category:"نوشت‌افزار",price:145000,oldPrice:165000,emoji:"🖍️",visual:3,badge:"پیشنهاد نارون",desc:"رنگ‌های ملایم برای مشخص‌کردن نکته‌های مهم."},
 {id:4,name:"جامدادی پارچه‌ای",category:"لوازم دانش‌آموزی",price:265000,oldPrice:0,emoji:"👝",visual:4,badge:"",desc:"سبک و جادار؛ همراه روزهای مدرسه و دانشگاه."},
 {id:5,name:"دفتر طراحی آبرنگ",category:"هنر و رنگ",price:198000,oldPrice:0,emoji:"🎨",visual:5,badge:"جدید",desc:"کاغذ مناسب تمرین‌های رنگی و طراحی‌های روزانه."},
 {id:6,name:"مداد مشکی نوشتاری",category:"نوشت‌افزار",price:32000,oldPrice:0,emoji:"✏️",visual:6,badge:"",desc:"مدادی خوش‌دست برای نوشتن و طراحی اولیه."},
 {id:7,name:"استند رومیزی چوبی",category:"میز کار",price:320000,oldPrice:365000,emoji:"🗂️",visual:7,badge:"",desc:"برای مرتب نگه‌داشتن یادداشت‌ها و میز کار."},
 {id:8,name:"ست خط‌کش فانتزی",category:"لوازم دانش‌آموزی",price:95000,oldPrice:0,emoji:"📐",visual:8,badge:"",desc:"ست کاربردی و سبک برای کیف مدرسه."},
 {id:9,name:"چسب واشی طرح‌دار",category:"میز کار",price:115000,oldPrice:135000,emoji:"🎀",visual:9,badge:"محبوب",desc:"جزئیات رنگی برای دفتر، کارت و بسته‌بندی هدیه."},
 {id:10,name:"مداد رنگی ۱۲ رنگ",category:"هنر و رنگ",price:235000,oldPrice:0,emoji:"🖍️",visual:10,badge:"",desc:"رنگ‌های شاد برای نقاشی و سرگرمی خلاقانه."},
 {id:11,name:"پلنر هفتگی رومیزی",category:"دفتر و کاغذ",price:175000,oldPrice:195000,emoji:"🗓️",visual:11,badge:"انتخاب ویژه",desc:"برنامه‌ریزی هفته با فضایی برای اولویت‌ها و یادداشت‌ها."},
 {id:12,name:"گیره کاغذ رنگی",category:"میز کار",price:68000,oldPrice:0,emoji:"📎",visual:12,badge:"",desc:"برای مرتب‌کردن برگه‌ها با کمی رنگ و سلیقه."}
];
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const fa = n => Number(n).toLocaleString("fa-IR");
const money = n => `${fa(n)} تومان`;
let cart = JSON.parse(localStorage.getItem("narvan-cart") || "{}");
let favorites = JSON.parse(localStorage.getItem("narvan-favorites") || "[]");
let currentCategory = "همه", searchTerm = "", showAll = false, favoritesOnly = false, toastTimer;

function saveState(){localStorage.setItem("narvan-cart",JSON.stringify(cart));localStorage.setItem("narvan-favorites",JSON.stringify(favorites))}
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2400)}
function productCard(p){return `<article class="product-card"><div class="product-visual visual-${p.visual}"><span class="product-art" aria-hidden="true">${p.emoji}</span>${p.badge?`<span class="product-badge">${p.badge}</span>`:""}<button class="heart-button ${favorites.includes(p.id)?"liked":""}" data-favorite="${p.id}" aria-label="افزودن به علاقه‌مندی‌ها">${favorites.includes(p.id)?"♥":"♡"}</button><button class="quick-add" data-add="${p.id}">افزودن به سبد خرید +</button></div><div class="product-info"><span class="product-category">${p.category}</span><h3 class="product-title" title="${p.name}">${p.name}</h3><div class="product-bottom"><div>${p.oldPrice?`<div class="old-price" style="font-size:9px;color:#9a9d92;text-decoration:line-through;margin-bottom:2px">${money(p.oldPrice)}</div>`:""}<span class="price">${fa(p.price)} <small>تومان</small></span></div><button class="add-button" data-add="${p.id}" aria-label="افزودن ${p.name} به سبد خرید">+</button></div></div></article>`}
function visibleProducts(){let list=products.filter(p=>(currentCategory==="همه"||p.category===currentCategory)&&(!favoritesOnly||favorites.includes(p.id))&&(p.name+" "+p.category+" "+p.desc).toLowerCase().includes(searchTerm.toLowerCase()));const sort=$("#sortSelect").value;if(sort==="price-low")list.sort((a,b)=>a.price-b.price);if(sort==="price-high")list.sort((a,b)=>b.price-a.price);if(sort==="name")list.sort((a,b)=>a.name.localeCompare(b.name,"fa"));return list}
function renderProducts(){const list=visibleProducts();$("#productGrid").innerHTML=(showAll?list:list.slice(0,8)).map(productCard).join("");$("#emptyState").classList.toggle("hidden",list.length>0);$("#productGrid").classList.toggle("hidden",list.length===0);$("#showAllButton").classList.toggle("hidden",list.length<=8);$("#showAllButton").innerHTML=showAll?"نمایش کمتر <span>↑</span>":"دیدن همه محصولات <span>↓</span>";$$(".filter-chip").forEach(b=>b.classList.toggle("active",b.dataset.category===currentCategory));}
function cartQty(){return Object.values(cart).reduce((a,b)=>a+b,0)}
function cartTotal(){return Object.entries(cart).reduce((sum,[id,q])=>sum+(products.find(p=>p.id===Number(id))?.price||0)*q,0)}
function renderCart(){const qty=cartQty();$("#cartCount").textContent=fa(qty);$("#drawerCount").textContent=`(${fa(qty)})`;$("#favoriteCount").textContent=fa(favorites.length);$("#cartEmpty").classList.toggle("hidden",qty>0);$("#cartFooter").classList.toggle("hidden",qty===0);$("#cartItems").innerHTML=Object.entries(cart).filter(([,q])=>q>0).map(([id,q])=>{const p=products.find(x=>x.id===Number(id));if(!p)return"";return `<div class="cart-line"><div class="cart-thumb visual-${p.visual}">${p.emoji}</div><div><h4>${p.name}</h4><div class="line-price">${money(p.price*q)}</div><div class="quantity-control"><button data-qty="${p.id}" data-delta="-1" aria-label="کم کردن">−</button><span>${fa(q)}</span><button data-qty="${p.id}" data-delta="1" aria-label="زیاد کردن">+</button></div></div><button class="remove-item" data-remove="${p.id}">حذف</button></div>`}).join("");$("#subtotal").textContent=money(cartTotal());$("#checkoutTotal").textContent=money(cartTotal())}
function addToCart(id){cart[id]=(cart[id]||0)+1;saveState();renderCart();toast("به سبد خرید اضافه شد ✦")}
function setCategory(cat){currentCategory=cat;favoritesOnly=false;showAll=false;renderProducts();$("#products").scrollIntoView({behavior:"smooth"})}
function openCart(){renderCart();$("#overlay").classList.add("show");$("#cartDrawer").classList.add("open");$("#cartDrawer").setAttribute("aria-hidden","false");document.body.style.overflow="hidden"}
function closeCart(){ $("#overlay").classList.remove("show");$("#cartDrawer").classList.remove("open");$("#cartDrawer").setAttribute("aria-hidden","true");document.body.style.overflow=""}
function openModal(id){$(id).classList.remove("hidden");$("#overlay").classList.add("show");document.body.style.overflow="hidden"}
function closeModal(id){$(id).classList.add("hidden");if($("#cartDrawer").classList.contains("open"))return;$("#overlay").classList.remove("show");document.body.style.overflow=""}
document.addEventListener("click",e=>{
 const add=e.target.closest("[data-add]");if(add)addToCart(Number(add.dataset.add));
 const fav=e.target.closest("[data-favorite]");if(fav){const id=Number(fav.dataset.favorite);favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];saveState();renderProducts();renderCart();toast(favorites.includes(id)?"به علاقه‌مندی‌ها اضافه شد":"از علاقه‌مندی‌ها حذف شد")}
 const cat=e.target.closest("[data-category]");if(cat){e.preventDefault();setCategory(cat.dataset.category)}
 const qty=e.target.closest("[data-qty]");if(qty){const id=qty.dataset.qty;cart[id]=(cart[id]||0)+Number(qty.dataset.delta);if(cart[id]<=0)delete cart[id];saveState();renderCart()}
 const rem=e.target.closest("[data-remove]");if(rem){delete cart[rem.dataset.remove];saveState();renderCart();toast("محصول از سبد حذف شد")}
});
$("#searchForm").addEventListener("submit",e=>{e.preventDefault();searchTerm=$("#searchInput").value.trim();favoritesOnly=false;showAll=true;renderProducts();$("#products").scrollIntoView({behavior:"smooth"})});
$("#searchInput").addEventListener("input",()=>{searchTerm=$("#searchInput").value.trim();showAll=true;renderProducts()});
$("#sortSelect").addEventListener("change",renderProducts);
$("#showAllButton").addEventListener("click",()=>{showAll=!showAll;renderProducts()});
$("#resetFilters").addEventListener("click",()=>{currentCategory="همه";searchTerm="";favoritesOnly=false;$("#searchInput").value="";showAll=false;renderProducts()});
$("#openCart").addEventListener("click",openCart);$("#closeCart").addEventListener("click",closeCart);$("#overlay").addEventListener("click",()=>{closeCart();["#checkoutModal","#successModal"].forEach(closeModal)});
$("#continueShopping").addEventListener("click",()=>{closeCart();$("#products").scrollIntoView({behavior:"smooth"})});
$("#favoritesButton").addEventListener("click",()=>{favoritesOnly=!favoritesOnly;currentCategory="همه";showAll=true;renderProducts();$("#products").scrollIntoView({behavior:"smooth"});toast(favoritesOnly?"محصولات موردعلاقه‌ات":"همه محصولات")});
$("#accountButton").addEventListener("click",()=>toast("ورود کاربران در نسخه نمایشی فعال نیست."));
$("#checkoutButton").addEventListener("click",()=>{closeCart();if(cartQty()===0){toast("سبد خریدت خالیه");return}$("#checkoutTotal").textContent=money(cartTotal());openModal("#checkoutModal")});
$("#closeCheckout").addEventListener("click",()=>closeModal("#checkoutModal"));
$("#checkoutForm").addEventListener("submit",e=>{e.preventDefault();const data=new FormData(e.target);const order={number:"NV-"+Date.now().toString().slice(-6),date:new Date().toISOString(),items:cart,total:cartTotal(),customer:{name:data.get("name"),phone:data.get("phone"),postal:data.get("postal"),address:data.get("address"),notes:data.get("notes")}};let orders=JSON.parse(localStorage.getItem("narvan-demo-orders")||"[]");orders.push(order);localStorage.setItem("narvan-demo-orders",JSON.stringify(orders));cart={};saveState();renderCart();closeModal("#checkoutModal");$("#orderNumber").textContent=order.number;openModal("#successModal");e.target.reset()});
$("#finishOrder").addEventListener("click",()=>{closeModal("#successModal");$("#products").scrollIntoView({behavior:"smooth"})});
$("#newsletterForm").addEventListener("submit",e=>{e.preventDefault();toast("ممنون از همراهی‌ات! عضویت در این نسخه نمایشی ذخیره نمی‌شود.");e.target.reset()});
$("#privacyLink").addEventListener("click",e=>{e.preventDefault();toast("این نسخه آزمایشی است و داده‌ها فقط در مرورگر خودت ذخیره می‌شوند.")});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeCart();closeModal("#checkoutModal");closeModal("#successModal")}});
renderProducts();renderCart();
