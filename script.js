let boxes = [];
let productos = [];

// Cargar productos desde el archivo JSON
fetch('productos.json')
    .then(response => response.json())
    .then(data => productos = data)
    .catch(error => console.error('Error al cargar productos.json:', error));

// Buscar dimensiones de la caja con el código
function fetchBoxDimensions() {
    const inputElement = document.getElementById('box-code');
    const boxCode = inputElement.value.toUpperCase();  // Convertir a mayúsculas
    
    inputElement.value = boxCode;  // Actualizar el input con mayúsculas
    
    // Buscar el producto en el archivo JSON
    const boxData = productos.find(product => product.codigo === boxCode);
    
    if (boxData) {
        document.getElementById('box-length').value = boxData.largo;
        document.getElementById('box-height').value = boxData.alto;
        document.getElementById('box-width').value = boxData.ancho;
        document.getElementById('box-package-type').value = boxData.tipo_empaque;
    } else {
        // Limpiar los campos si no se encuentra el código
        document.getElementById('box-length').value = '';
        document.getElementById('box-height').value = '';
        document.getElementById('box-width').value = '';
        document.getElementById('box-package-type').value = '';
    }
}

// Añadir una caja al arreglo 'boxes'
function addBox() {
    const boxLength = parseFloat(document.getElementById('box-length').value);
    const boxHeight = parseFloat(document.getElementById('box-height').value);
    const boxWidth = parseFloat(document.getElementById('box-width').value);
    const quantity = parseInt(document.getElementById('quantity').value);

    if (boxWidth > 0 && boxHeight > 0 && boxLength > 0 && quantity > 0) {
        boxes.push({ width: boxWidth, height: boxHeight, length: boxLength, quantity: quantity });

        // Limpiar campos después de añadir
        document.getElementById('box-length').value = '';
        document.getElementById('box-height').value = '';
        document.getElementById('box-width').value = '';
        document.getElementById('quantity').value = '';

        displayBoxes();  // Mostrar cajas añadidas
    } else {
        alert('Por favor, ingresa dimensiones y cantidad válidas.');
    }
}

// Eliminar caja por índice
function removeBox(index) {
    boxes.splice(index, 1);
    displayBoxes();
}

// Mostrar cajas añadidas
function displayBoxes() {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    let totalVolume = 0;
    boxes.forEach((box, index) => {
        const boxVolume = box.width * box.height * box.length;
        const totalBoxVolume = boxVolume * box.quantity;
        totalVolume += totalBoxVolume;

        resultDiv.innerHTML += `
            <p>
                Caja ${index + 1}: ${box.quantity} cajas (${box.length}x${box.height}x${box.width} cm) - Volumen Total: ${totalBoxVolume} cm³
                <button type="button" onclick="removeBox(${index})">Eliminar</button>
            </p>
        `;
    });
}

// Seleccionar dimensiones de contenedor predefinido
function selectPredefinedContainer() {
    const containerSelect = document.getElementById('predefined-container');
    const containerLengthInput = document.getElementById('container-length');
    const containerHeightInput = document.getElementById('container-height');
    const containerWidthInput = document.getElementById('container-width');
    const manualInputSection = document.getElementById('manual-dimensions');

    if (containerSelect.value === "") {
        containerLengthInput.value = '';
        containerHeightInput.value = '';
        containerWidthInput.value = '';
        manualInputSection.style.display = 'block';  // Mostrar sección manual
        return;
    }

    // Dimensiones predefinidas
    let containerDimensions;
    switch (containerSelect.value) {
        case '1':
            containerDimensions = { length: 40, height: 30, width: 55 };
            break;
        case '2':
            containerDimensions = { length: 45, height: 87, width: 120 };
            break;
        case '3':
            containerDimensions = { length: 67, height: 87, width: 99 };
            break;
    }

    if (containerDimensions) {
        containerLengthInput.value = containerDimensions.length;
        containerHeightInput.value = containerDimensions.height;
        containerWidthInput.value = containerDimensions.width;
        manualInputSection.style.display = 'none';  // Ocultar entrada manual
    }
}

// Aplicar dimensiones manuales
function applyManualDimensions() {
    const containerLengthInput = document.getElementById('container-length');
    const containerHeightInput = document.getElementById('container-height');
    const containerWidthInput = document.getElementById('container-width');
    
    containerLengthInput.value = document.getElementById('manual-length').value;
    containerHeightInput.value = document.getElementById('manual-height').value;
    containerWidthInput.value = document.getElementById('manual-width').value;
    
    document.getElementById('manual-dimensions').style.display = 'none';  // Ocultar sección manual
}

// Calcular cantidad de contenedores necesarios
function calculate() {
    let containerLength = parseFloat(document.getElementById('container-length').value);
    let containerHeight = parseFloat(document.getElementById('container-height').value);
    let containerWidth = parseFloat(document.getElementById('container-width').value);

    if (containerWidth <= 0 || containerHeight <= 0 || containerLength <= 0) {
        alert('Por favor, ingrese dimensiones válidas para el contenedor.');
        return;
    }

    // Ajustar dimensiones interiores
    containerWidth -= 0.5; 
    containerHeight -= 0.5;
    containerLength -= 0.5;

    if (containerWidth <= 0 || containerHeight <= 0 || containerLength <= 0) {
        alert('Las dimensiones interiores del contenedor deben ser mayores a cero después del ajuste.');
        return;
    }

    const containerVolumeInterior = containerLength * containerHeight * containerWidth;
    let totalBoxVolume = 0;

    boxes.forEach(box => {
        const boxVolume = box.length * box.height * box.width;
        totalBoxVolume += boxVolume * box.quantity;
    });

    const containersNeeded = Math.ceil(totalBoxVolume / containerVolumeInterior);
    const volumeUsed = containersNeeded * containerVolumeInterior;
    const volumeUnused = volumeUsed - totalBoxVolume;
    const percentageUsed = (totalBoxVolume / volumeUsed) * 100;

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <h2>Resultado del Cálculo</h2>
        <p>Dimensiones Interiores del Contenedor: ${containerLength}x${containerHeight}x${containerWidth} cm</p>
        <p>Volumen del Contenedor (Interior): ${containerVolumeInterior} cm³</p>
        <p>Cantidad Total de Cajas: ${boxes.reduce((total, box) => total + box.quantity, 0)}</p>
        <p>Cantidad de Contenedores Necesarios: ${containersNeeded}</p>
        <p>Volumen Total Utilizado: ${totalBoxVolume} cm³</p>
        <p>Volumen No Utilizado: ${volumeUnused} cm³</p>
        <p>Porcentaje de Uso del Contenedor: ${percentageUsed.toFixed(2)}%</p>
    `;

    drawContainerChart(percentageUsed);  // Dibujar gráfico
}

// Dibujar gráfico de uso del contenedor
function drawContainerChart(percentageUsed) {
    const ctx = document.getElementById('containerChart').getContext('2d');
    
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);  // Limpiar canvas

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Usado', 'No Usado'],
            datasets: [{
                data: [percentageUsed, 100 - percentageUsed],
                backgroundColor: ['#36A2EB', '#FF6384'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.label + ': ' + tooltipItem.raw.toFixed(2) + '%';
                        }
                    }
                }
            }
        }
    });
}
