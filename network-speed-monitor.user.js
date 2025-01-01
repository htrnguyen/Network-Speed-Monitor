// ==UserScript==
// @name         Network Speed Monitor
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hiển thị tốc độ mạng lên màn hình
// @author       Hà Trọng Nguyễn (htrnguyen)
// @match        *://*/*
// @grant        none
// @icon         https://avatars.githubusercontent.com/u/12345678?v=4 // Thay bằng link avatar GitHub của bạn
// @license      MIT
// ==/UserScript==


(function() {
    'use strict';

    // Tạo div để hiển thị tốc độ mạng
    const speedDiv = document.createElement('div');
    speedDiv.style.position = 'fixed';
    speedDiv.style.bottom = '0';
    speedDiv.style.left = '0';
    speedDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    speedDiv.style.color = 'white';
    speedDiv.style.padding = '5px';
    speedDiv.style.fontSize = '12px';
    speedDiv.style.zIndex = '9999';
    document.body.appendChild(speedDiv);

    let totalReceived = 0;
    let totalSent = 0;

    // Hàm định dạng byte sang KB/MB
    function formatBytes(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }

    // Cập nhật tốc độ mạng
    function updateSpeed() {
        const resources = performance.getEntriesByType('resource');
        const now = performance.now();

        const received = resources.reduce((acc, entry) => {
            if (now - entry.responseEnd < 1000) acc += entry.transferSize;
            return acc;
        }, 0);

        totalReceived += received;

        speedDiv.textContent = `↓ ${formatBytes(received)}/s | ↑ ${formatBytes(totalSent)}`;
    }

    // Theo dõi upload
    document.body.addEventListener('change', (event) => {
        if (event.target.tagName === 'INPUT' && event.target.type === 'file') {
            const files = event.target.files;
            for (let file of files) totalSent += file.size;
        }
    });

    // Cập nhật mỗi giây
    setInterval(updateSpeed, 1000);
})();
