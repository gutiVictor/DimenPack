let boxes = [];

function addBox() {
    const boxWidth = parseFloat(document.getElementById('box-width').value);
    const boxHeight = parseFloat(document.getElementById('box-height').value);
    const boxLength = parseFloat(document.getElementById('box-length').value);
    const quantity = parseInt(document.getElementById('quantity').value);

    if (boxWidth > 0 && boxHeight > 0 && boxLength > 0 && quantity > 0) {
        boxes.push({
            width: boxWidth,
            height: boxHeight,
            length: boxLength,
            quantity: quantity
        });

        // Clear input fields
        document.getElementById('box-width').value = '';
        document.getElementById('box-height').value = '';
        document.getElementById('box-length').value = '';
        document.getElementById('quantity').value = '';

        displayBoxes();
    } else {
        alert('Por favor, ingresa dimensiones y cantidad válidas.');
    }
}

function displayBoxes() {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    let totalVolume = 0;
    boxes.forEach((box, index) => {
        const boxVolume = box.width * box.height * box.length;
        const totalBoxVolume = boxVolume * box.quantity;
        totalVolume += totalBoxVolume;

        resultDiv.innerHTML += `<p>Caja ${index + 1}: ${box.quantity} cajas (${box.width}x${box.height}x${box.length} cm) - Volumen Total: ${totalBoxVolume} cm³</p>`;
    });
}

function calculate() {
    let containerWidth = parseFloat(document.getElementById('container-width').value);
    let containerHeight = parseFloat(document.getElementById('container-height').value);
    let containerLength = parseFloat(document.getElementById('container-length').value);

    if (containerWidth <= 0 || containerHeight <= 0 || containerLength <= 0) {
        alert('Por favor, ingrese dimensiones válidas para el contenedor.');
        return;
    }

    containerWidth -= 0.5; // Restar 0.5 cm por lado
    containerHeight -= 0.5;
    containerLength -= 0.5;

    if (containerWidth <= 0 || containerHeight <= 0 || containerLength <= 0) {
        alert('Las dimensiones interiores del contenedor deben ser mayores a cero después del ajuste.');
        return;
    }

    const containerVolumeInterior = containerWidth * containerHeight * containerLength;

    let totalBoxVolume = 0;
    boxes.forEach(box => {
        const boxVolume = box.width * box.height * box.length;
        totalBoxVolume += boxVolume * box.quantity;
    });

    const containersNeeded = Math.ceil(totalBoxVolume / containerVolumeInterior);
    const volumeUsed = containersNeeded * containerVolumeInterior;
    const volumeUnused = volumeUsed - totalBoxVolume;

    const percentageUsed = (totalBoxVolume / volumeUsed) * 100;

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML += `
        <h2>Resultado del Cálculo</h2>
        <p>Dimensiones Interiores del Contenedor: ${containerWidth}x${containerHeight}x${containerLength} cm</p>
        <p>Volumen del Contenedor (Interior): ${containerVolumeInterior} cm³</p>
        <p>Cantidad Total de Cajas: ${boxes.reduce((total, box) => total + box.quantity, 0)}</p>
        <p>Cantidad de Contenedores Necesarios: ${containersNeeded}</p>
        <p>Volumen Total Utilizado: ${totalBoxVolume} cm³</p>
        <p>Volumen No Utilizado: ${volumeUnused} cm³</p>
        <p>Porcentaje de Uso del Contenedor: ${percentageUsed.toFixed(2)}%</p>
    `;

    drawContainerChart(containerWidth, containerHeight, containerLength, totalBoxVolume);
}

function drawContainerChart(containerWidth, containerHeight, containerLength, totalBoxVolume) {
    const ctx = document.getElementById('containerChart').getContext('2d');
    
    // Reiniciar contexto para evitar superposición de gráficos
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const containerVolume = containerWidth * containerHeight * containerLength;
    const percentageUsed = (totalBoxVolume / containerVolume) * 100;
    const percentageUnused = 100 - percentageUsed;

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Usado', 'No Usado'],
            datasets: [{
                data: [percentageUsed.toFixed(2), percentageUnused.toFixed(2)],
                backgroundColor: ['#36A2EB', '#FF6384'],
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Porcentaje de Uso del Contenedor'
            }
        }
    });
}
