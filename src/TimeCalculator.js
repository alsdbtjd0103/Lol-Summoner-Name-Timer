
function calculateNeedTime(lastGameTime, level) {
    const nowTime = new Date().getTime();
    var dateDiff = Math.ceil((nowTime - lastGameTime) / (1000 * 3600 * 24));
    const passDay = Math.floor(dateDiff / (1000 * 3600 * 24));
    let needDay = 0;
    if (level <= 6) {
        needDay = 180;
    }
    else {
        needDay = level * 30;
    }
    const needTime = needDay - passDay;
    return needTime;
}


exports.calculateNeedTime = calculateNeedTime;