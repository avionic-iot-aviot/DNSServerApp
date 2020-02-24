import ArpService from '../services/arpService';
const arpService = new ArpService();
const assert = require('assert');
// arpService.execute();
const valuee = JSON.stringify({
    mac_addresses:
    {
        'bc:fe:d9:16:da:e7': ['169.254.101.55'],
        '54:04:a6:f3:59:1e': ['169.254.209.167'],
        'b8:69:f4:06:b4:00': ['192.168.55.1'],
        '00:0c:29:7a:c3:11': ['192.168.55.100'],
        '00:0c:29:84:0d:da': ['192.168.55.112'],
        '00:e0:4c:a7:cf:c6': ['192.168.55.120'],
        '20:32:33:c5:d6:49': ['192.168.55.202'],
        'dc:a6:32:78:c8:d2': ['192.168.55.204'],
        '48:3b:38:5f:b4:74': ['192.168.55.206'],
        '54:48:10:df:e8:3c': ['192.168.55.207'],
        'f0:1e:34:1f:83:02': ['192.168.55.215'],
        '00:00:10:01:bf:49': ['192.168.55.224'],
        '08:f6:9c:98:75:a0': ['192.168.55.226'],
        '00:e0:4c:68:0d:4a': ['192.168.55.228'],
        '58:40:4e:c2:44:94': ['192.168.55.234'],
        'dc:a6:32:78:c8:67': ['192.168.55.239'],
        '18:65:90:92:c5:4d': ['192.168.55.245'],
        '01:00:5e:00:00:fb': ['224.0.0.251']
    }
});
arpService.getObjectFromFile().then((res: any) => {
    if (res) {
        const parsee = JSON.parse(res);

        console.log(parsee);
        console.log(Object.is(res, valuee));
    }
})
// arpService.getElementsFromArpTable();