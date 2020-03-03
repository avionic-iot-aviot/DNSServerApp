// import ArpService from '../services/arpService';
// const arpService = new ArpService();
// arpService.getObjectFromFile();
// arpService.getElementsFromArpTable();
// arpService.contactGW();
import DNSService from '../services/dnsService';
const dnsService = new DNSService();
console.log("HERE");
dnsService.searchAndSaveNewLeases();