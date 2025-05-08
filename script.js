
function handleQRCodeScan(decodedText) {
  const productData = JSON.parse(decodedText);
  const pH = productData.pH;
  const temperature = productData.temperature;
  const qualityElement = document.getElementById("quality");
  const statusElement = document.getElementById("product-status");

  let color = 'yellow';
  let status = 'Produk sangat layak untuk dikonsumsi';

  if (pH >= 6 && pH < 6.5) {
    color = 'orange';
    status = 'Produk masih layak, tetapi mulai mendekati batas.';
  } else if (pH >= 6.5 && pH < 7.0) {
    color = 'red';
    status = 'Produk sudah tidak layak untuk dikonsumsi.';
  } else if (pH >= 7.0) {
    color = 'brown';
    status = 'Produk sudah tidak layak, pembusukan oleh mikroba pembusuk.';
  }
  qualityElement.style.backgroundColor = color;
  statusElement.innerHTML = status;

  if (temperature > 25) {
    statusElement.innerHTML += "<br>Perhatian: Suhu penyimpanan terlalu tinggi.";
  } else {
    statusElement.innerHTML += "<br>Suhu penyimpanan aman.";
  }

  updateChart(pH, temperature);
}

let phChart;
function updateChart(pH, temperature) {
  const ctx = document.getElementById('phChart').getContext('2d');
  if (!phChart) {
    phChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['pH', 'Suhu'],
        datasets: [{
          label: 'pH & Suhu',
          data: [pH, temperature],
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          tension: 0.1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  } else {
    phChart.data.datasets[0].data = [pH, temperature];
    phChart.update();
  }
}

function startScanning() {
  const html5QrcodeScanner = new Html5QrcodeScanner("reader", {
    fps: 10,
    qrbox: 250
  });
  html5QrcodeScanner.render(handleQRCodeScan);
}

function generateQR() {
  const r = document.getElementById("r").value;
  const g = document.getElementById("g").value;
  const b = document.getElementById("b").value;
  const qr = new QRious({
    element: document.getElementById("qrCanvas"),
    size: 250,
    value: JSON.stringify({
      pH: (parseInt(r) + parseInt(g) + parseInt(b)) / 3,
      temperature: 20
    })
  });
}

startScanning();
