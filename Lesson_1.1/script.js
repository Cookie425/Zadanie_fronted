document.addEventListener('DOMContentLoaded', function() {
    const pointsData = {
        1: { x: 25, y: 30 },
        2: { x: 70, y: 20 },
        3: { x: 45, y: 50 },
        4: { x: 60, y: 60 },
        5: { x: 35, y: 70 },
        6: { x: 75, y: 40 },
        7: { x: 50, y: 80 },
        8: { x: 20, y: 60 },
        9: { x: 80, y: 75 },
        10: { x: 40, y: 25 }
    };

    const listItems = document.querySelectorAll('.infrastructure-list li');
    const pointsContainer = document.querySelector('.points-container');
    const infrastructureImage = document.querySelector('.infrastructure-image');

    listItems.forEach(item => {
        const pointId = item.getAttribute('data-point');
        const pointData = pointsData[pointId];

        const point = document.createElement('div');
        point.className = 'point';
        point.style.left = pointData.x + '%';
        point.style.top = pointData.y + '%';
        point.style.opacity = '0';

        const line = document.createElement('div');
        line.className = 'point-line';
        line.style.opacity = '0';

        pointsContainer.appendChild(point);
        pointsContainer.appendChild(line);

        item.addEventListener('mouseenter', function() {
            point.style.opacity = '1';

            const itemRect = item.getBoundingClientRect();
            const imageRect = infrastructureImage.getBoundingClientRect();

            const itemX = itemRect.left + itemRect.width;
            const itemY = itemRect.top + itemRect.height / 2;
            const pointX = imageRect.left + imageRect.width * pointData.x / 100;
            const pointY = imageRect.top + imageRect.height * pointData.y / 100;

            const distance = Math.sqrt(Math.pow(pointX - itemX, 2) + Math.pow(pointY - itemY, 2));
            const angle = Math.atan2(pointY - itemY, pointX - itemX) * 180 / Math.PI;

            line.style.width = distance + 'px';
            line.style.left = itemX + 'px';
            line.style.top = itemY + 'px';
            line.style.transform = `rotate(${angle}deg)`;
            line.style.opacity = '1';
        });

        item.addEventListener('mouseleave', function() {
            point.style.opacity = '0';
            line.style.opacity = '0';
        });
    });
});
