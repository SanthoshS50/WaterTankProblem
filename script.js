document.getElementById('calculateBtn').addEventListener('click', function () {
    const input = document.getElementById('inputBlocks').value;
    const blocks = JSON.parse(input);
    
    const waterUnits = calculateWater(blocks);
    document.getElementById('waterUnits').innerText = waterUnits;
    drawBlocks(blocks, waterUnits);
});

function calculateWater(blocks) {
    let leftMax = [];
    let rightMax = [];
    let waterTrapped = 0;
    const n = blocks.length;

    // Calculate left max for each block
    leftMax[0] = blocks[0];
    for (let i = 1; i < n; i++) {
        leftMax[i] = Math.max(leftMax[i - 1], blocks[i]);
    }

    // Calculate right max for each block
    rightMax[n - 1] = blocks[n - 1];
    for (let i = n - 2; i >= 0; i--) {
        rightMax[i] = Math.max(rightMax[i + 1], blocks[i]);
    }

    // Calculate water trapped
    for (let i = 0; i < n; i++) {
        waterTrapped += Math.min(leftMax[i], rightMax[i]) - blocks[i];
    }

    return waterTrapped;
}

function drawBlocks(blocks, waterUnits) {
    const svg = document.getElementById('waterSvg');
    svg.innerHTML = ''; // Clear previous blocks

    const blockWidth = 40;
    const blockHeightScale = 20;

    // Draw blocks
    for (let i = 0; i < blocks.length; i++) {
        const height = blocks[i] * blockHeightScale;
        const x = i * blockWidth;
        const y = svg.height.baseVal.value - height;

        // Create a rectangle for the block
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', blockWidth);
        rect.setAttribute('height', height);
        rect.setAttribute('fill', '#8B4513'); // Brown color for blocks
        svg.appendChild(rect);
    }

    // Draw water
    for (let i = 0; i < blocks.length; i++) {
        const leftMax = Math.max(...blocks.slice(0, i + 1));
        const rightMax = Math.max(...blocks.slice(i));
        const waterHeight = Math.min(leftMax, rightMax) * blockHeightScale - blocks[i] * blockHeightScale;

        if (waterHeight > 0) {
            const x = i * blockWidth;
            const y = svg.height.baseVal.value - waterHeight;

            // Create a rectangle for the water
            const waterRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            waterRect.setAttribute('x', x);
            waterRect.setAttribute('y', y);
            waterRect.setAttribute('width', blockWidth);
            waterRect.setAttribute('height', waterHeight);
            waterRect.setAttribute('fill', 'blue'); // Blue color for water
            svg.appendChild(waterRect);
        }
    }
}
