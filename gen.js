function random(min, max) {  
    return Math.random() * (max - min) + min; 
}

function intToIP(int) {
    const D = int & 255;
    const C = ((int >> 8) & 255);
    const B = ((int >> 16) & 255);
    const A = ((int >> 24) & 255);

    return `${A}.${B}.${C}.${D}`;
}

module.exports = function(){
    while(true) {
        let intip = random(0x01000000, 0xffffffff);
        if(
            (intip >= 0xe0000000 && intip <= 0xefffffff) // 224.0.0.0 - 239.255.255.255
            || (intip >= 0xf0000000 && intip <= 0xfffffffe) // 240.0.0.0 - 255.255.255.254
            || (intip >= 0xA000000 && intip <= 0xAFFFFFF) // 10.0.0.0 - 10.255.255.255
            || (intip >= 0x7F000000 && intip <= 0x7FFFFFFF) // 127.0.0.0 - 127.255.255.255
            || (intip >= 0x64400000 && intip <= 0x647FFFFF) // 100.64.0.0 - 100.127.255.255
            || (intip >= 0xAC100000 && intip <= 0xAC1FFFFF) // 172.16.0.0 - 172.31.255.255
            || (intip >= 0xC6120000 && intip <= 0xC613FFFF) // 198.18.0.0 - 198.19.255.255
            || (intip >= 0xA9FE0000 && intip <= 0xA9FEFFFF) // 169.254.0.0 - 169.254.255.255
            || (intip >= 0xC0A80000 && intip <= 0xC0A8FFFF) // 192.168.0.0 - 192.168.255.255
            || (intip >= 0xC0000000 && intip <= 0xC00000FF) // 192.0.0.0 - 192.0.0.255
            || (intip >= 0xC0000200 && intip <= 0xC00002FF) // 192.0.2.0 - 192.0.2.255
            || (intip >= 0xc0586300 && intip <= 0xc05863ff) // 192.88.99.0 - 192.88.99.255
            || (intip >= 0xC6336400 && intip <= 0xC63364FF) // 198.51.100.0 - 198.51.100.255
            || (intip >= 0xCB007100 && intip <= 0xCB0071FF) // 203.0.113.0 - 203.0.113.255
            || (intip >= 0xe9fc0000 && intip <= 0xe9fc00ff) // 233.252.0.0 - 233.252.0.255
        ) continue;
        return intToIP(intip);
    }

};
