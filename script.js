/**
 * L'Art du Sucre - Moteur JavaScript Global
 * Fonctions: Authentification, Gestion des produits, Drag & Drop, Animations
 */

const ADMIN_PASSWORD = "paris123";

// Veritabanı başlangıcı (LocalStorage)
let products = JSON.parse(localStorage.getItem('patisserie_db')) || [
    { id: 1, name: "Macaron Pistache", price: "4.50", unit: "Pièce", category: "Macarons", img: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600" }
];

// --- 1. AUTHENTIFICATION ---
function checkPassword() {
    const pw = document.getElementById('admin-password').value;
    if(pw === ADMIN_PASSWORD) {
        // Geçiş efekti ile girişi kapat
        const loginOverlay = document.getElementById('admin-login');
        loginOverlay.style.opacity = '0';
        setTimeout(() => {
            loginOverlay.style.display = 'none';
            document.getElementById('panel-content').classList.remove('hidden');
            document.getElementById('panel-content').classList.add('fade-in');
            renderAdminList();
        }, 500);
    } else { 
        alert("Mot de passe incorrect!"); 
    }
}

// --- 2. GESTION DU DRAG & DROP (Sürükle-Bırak) ---
let uploadedImg = "";
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('p-file');
const previewImg = document.getElementById('preview-img');
const previewCont = document.getElementById('preview-container');

if(dropZone) {
    dropZone.onclick = () => fileInput.click();
    
    // Sürükleme efektleri
    dropZone.ondragover = (e) => { 
        e.preventDefault(); 
        dropZone.classList.add('border-amber-700', 'bg-stone-50'); 
    };
    dropZone.ondragleave = () => { 
        dropZone.classList.remove('border-amber-700', 'bg-stone-50'); 
    };
    
    dropZone.ondrop = (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-amber-700', 'bg-stone-50');
        handleFile(e.dataTransfer.files[0]);
    };

    fileInput.onchange = (e) => handleFile(e.target.files[0]);
}

function handleFile(file) {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImg = e.target.result;
            if(previewImg) {
                previewImg.src = uploadedImg;
                previewCont.classList.remove('hidden');
                document.getElementById('drop-text').style.display = 'none';
            }
        };
        reader.readAsDataURL(file);
    }
}

// --- 3. ENREGISTREMENT DU PRODUIT (Ürün Kaydı) ---
const addForm = document.getElementById('add-form');
if(addForm) {
    addForm.onsubmit = (e) => {
        e.preventDefault();
        
        const priceValue = document.getElementById('p-price').value;

        // Sayısal Kontrol
        if (isNaN(priceValue) || priceValue <= 0) {
            alert("Veuillez entrer un prix valide.");
            return;
        }

        const newProduct = {
            id: Date.now(),
            name: document.getElementById('p-name').value,
            price: parseFloat(priceValue).toFixed(2),
            unit: document.getElementById('p-unit').value,
            category: document.getElementById('p-category').value,
            img: uploadedImg || "https://via.placeholder.com/400x500"
        };

        products.push(newProduct);
        localStorage.setItem('patisserie_db', JSON.stringify(products));
        
        alert("Produit ajouté avec succès!");
        window.location.reload(); 
    };
}

// --- 4. AFFICHAGE DU MENU (Müşteri Menüsü & Filtreleme) ---
function renderCustomerMenu(category = 'All') {
    const grid = document.getElementById('product-grid');
    if(!grid) return;

    // Sayfa geçiş animasyonu için grid'i geçici olarak karart
    grid.style.opacity = '0';
    
    setTimeout(() => {
        const filtered = category === 'All' ? products : products.filter(p => p.category === category);

        grid.innerHTML = filtered.map(p => `
            <div class="group fade-in">
                <div class="overflow-hidden bg-stone-100 aspect-[4/5] mb-6 shadow-sm">
                    <img src="${p.img}" class="w-full h-full object-cover group-hover:scale-105 transition duration-1000">
                </div>
                <div class="flex justify-between items-start border-b border-stone-100 pb-4">
                    <div>
                        <h4 class="text-2xl font-serif italic">${p.name}</h4>
                        <span class="text-[9px] uppercase tracking-widest text-stone-400">${p.category}</span>
                    </div>
                    <div class="text-right">
                        <span class="text-amber-800 font-medium">${p.price} TL</span>
                        <span class="text-[9px] text-stone-400 uppercase block mt-1">/ ${p.unit}</span>
                    </div>
                </div>
            </div>
        `).join('');
        
        grid.style.opacity = '1';
    }, 300);
}

// --- 5. ADMINISTRATION DES LISTES (Admin Listesi) ---
function renderAdminList() {
    const container = document.getElementById('admin-table-content');
    if(!container) return;
    
    container.innerHTML = products.map(p => `
        <div class="flex justify-between items-center bg-white p-6 shadow-sm border-l-4 border-amber-600 fade-in">
            <div class="flex items-center space-x-6">
                <img src="${p.img}" class="w-16 h-16 object-cover rounded-sm shadow-inner">
                <div>
                    <p class="font-medium text-stone-800">${p.name}</p>
                    <p class="text-xs text-stone-400 font-light">${p.category} • ${p.price} TL / ${p.unit}</p>
                </div>
            </div>
            <button onclick="deleteP(${p.id})" class="text-[10px] uppercase tracking-tighter text-red-400 hover:text-red-700 hover:font-bold transition-all">Supprimer</button>
        </div>
    `).join('');
}

function deleteP(id) {
    if(confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('patisserie_db', JSON.stringify(products));
        renderAdminList();
    }
}

// --- 6. NAVIGATION DU PANEL (Tab Geçişleri) ---
function showAdminTab(tab) {
    const tabs = ['admin-list', 'admin-add'];
    tabs.forEach(t => {
        const el = document.getElementById(t);
        if(t === `admin-${tab}`) {
            el.classList.remove('hidden');
            el.classList.add('fade-in');
        } else {
            el.classList.add('hidden');
        }
    });
}

// Sayfa ilk yüklendiğinde menüyü hazırla
window.onload = () => {
    renderCustomerMenu();
};
// Izgara yapısını mobilde 1, tablette 2, masaüstünde 3 sütun yapar:
grid.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8";