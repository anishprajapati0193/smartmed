function showPrescription() {
  document.getElementById("prescription-section").classList.remove("hidden");
  document.getElementById("otc-section").classList.add("hidden");
}

function showOTC() {
  document.getElementById("otc-section").classList.remove("hidden");
  document.getElementById("prescription-section").classList.add("hidden");
}

// Dummy prescription upload
function uploadPrescription() {
  const file = document.getElementById("prescriptionUpload").files[0];
  if (file) {
    document.getElementById("prescriptionResult").innerHTML =
      "Detected Medicine: Paracetamol<br>Price: ₹50<br><button onclick='selectMedicine(\"Paracetamol\",50)'>Buy</button>";
  }
}

function loadMedicines() {
  const problem = document.getElementById("problemSelect").value;
  let medicines = [];
  if (problem === "fever") {
    medicines = [{name: "Sanjivani Vati", price: 50}, {name: "Sudarsana Tablet", price: 40},{name:"Febrifit Capsule" , price: 55} , {name:"Pyrexofly Capsule" , price: 55} , {name:"Amrutanjan Pain Balm Extra Power" , price: 55}, {name:"Zandu Balm" , price: 55} , {name:"Hetha Panchagavya Rollon Balm" , price: 55} ,{name:"Quik Relif Herbal Roll On" , price: 55} ];
  } else if (problem === "cold") {
    medicines = [{name: "Sanjivani Vati", price: 40}, {name: "Saina Tablet", price: 40} , {name:"Febrifit Capsule", price: 55} , {name:"Herbadiet Herbal Blend Capsule" , price: 55} , { name:"Himalaya Cold Balm" , price: 55},{name:"Zandu Balm" , price: 55}, {name:"Natural Cold Relief Roll-On (BabyOrgano, Mother Sparsh)" , price: 55}, {name:"Amrutanjan Headache Faster Relaxation Roll-On", price: 55}];
  } else if (problem === "headache") {
    medicines = [{name: "Shir Shool Har Vati (Jeena Sikho)", price: 70}, {name: "Mygrane Tablets (Pankajakasthuri)", price: 45},{name:"Hashmi Migrokill Capsule" ,price:70},{name:"Axantrin Capsule (Nisargaherbs)",prise: 70},{name:"Amrutanjan Pain Balm", price: 45} ,{name:"Zandu Balm",price: 45}, {name:"Amrutanjan Headache Roll-On",price: 45} , {name:"Herbtantra Migraine Go Roll-On",price: 45} , {name:"Zandu Roll-On for Headache",price: 45}  ];
  }
  displayMedicines(medicines, "medicineList");
}

function searchMedicine() {
  const query = document.getElementById("searchBox").value.toLowerCase();
  if (query.includes("para")) {
    displayMedicines([{name: "Paracetamol", price: 50}], "searchResult");
  } else {
    document.getElementById("searchResult").innerHTML = "No medicine found.";
  }
}

function displayMedicines(medicines, target) {
  let html = "";
  medicines.forEach(med => {
    html += `<div class="medicine-card">
      <strong>${med.name}</strong><br>Price: ₹${med.price}<br>
      <button onclick="selectMedicine('${med.name}',${med.price})">Buy</button>
    </div>`;
  });
  document.getElementById(target).innerHTML = html;
}

let selectedMedicine = null;
let selectedPrice = 0;

function selectMedicine(name, price) {
  selectedMedicine = name;
  selectedPrice = price;
  document.getElementById("payment-section").classList.remove("hidden");
  document.getElementById("paymentDetails").innerText =
    `You selected ${name}. Total Amount: ₹${price}`;
}

function makePayment() {
  document.getElementById("popupMessage").innerText =
    `Payment Successful ✅\nPlease collect your ${selectedMedicine}`;
  document.getElementById("popup").classList.remove("hidden");
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
  location.reload();
}
