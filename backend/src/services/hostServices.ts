const arp1 = require('arp-a');
const cfg = require('config');
const equal = require('deep-equal');
const fs = require('fs');
import { Utilities } from '../shared/utilities';
import _ = require('lodash');
const os = require('os');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const delay = require('delay');
const hostile = require('hostile')
//const Hosts1 = require('hosts-so-easy').Hosts;
import Hosts1 from 'hosts-so-easy';
//import Hosts from 'hosts-so-easy';
const party = require('hostparty');
const hosts1 = new Hosts1();
import { IHostDevice, ILeases } from "../interfaces/interfaces";

import LeasesService from '../services/leasesServices';
const leasesService = new LeasesService();

export default class DnsService {

  async NewRulesForHostFile(data: any) {

    let device: IHostDevice
    let flag1: boolean = false;


    let leases_file: ILeases[] = await leasesService.leasesServices(false)

    for (let i = 0; i < leases_file.length; i++) {
      console.log("1 --> " + leases_file[i].mac, " 2 --> " + data.Mac)
      if (leases_file[i].mac === data.Mac) {
        device = { ip: leases_file[i].ip, mac: data.Mac, host: data.HostName }
        flag1 = true;
      }
    }

    if (flag1) {

      try {
        const tempfilehost: any = await this.GetHostsFile()
        await this.FindIpInToHostsFile(tempfilehost, device)
        await this.createOrUpdateHostFile(device);
      } catch (error) {
        console.log("Error HostServices", error);
      }
    }

    else {
      console.log("Mac non trovato nel file leases")
      return 0;
    }
  }


  async GetHostsFile() {
    try {
      const promise: any = new Promise((resolve, reject) => {
        const preserveFormatting = false

        let hosts: IHostDevice[] = new Array();
        let temp: IHostDevice
        hostile.get(preserveFormatting, function (err: any, lines: any) {
          if (err) {
            console.error(err.message)
          }
          for (let i = 0; i < lines.length; i++) {
            console.log(lines[i][0], lines[i][1])
            temp = { ip: lines[i][0], host: lines[i][1], mac: "" }
            //console.log(temp.ip, temp.host)
            hosts.push(temp)
            resolve(hosts)
          }
        })
      })
      return promise
    } catch (error) {
      console.log("ERRR", error);
    }
  }


  async createOrUpdateHostFile(device: IHostDevice) {
    try {
      const ip_hostname = `${device.ip} ${device.host}.${process.env.TENANT_ID}\n${device.ip} ${device.host}`
      fs.writeFileSync(`${cfg.general.hostsFolder}/${device.ip}`, ip_hostname);
      const { stdout2, stderr2 } = await exec(` /bin/ash -c 'kill -SIGHUP $(pidof dnsmasq)' `);
      console.log('createOrUpdateHostFile: stdout:', stdout2);
      console.log('createOrUpdateHostFile: stderr:', stderr2);
    } catch (err) {
      console.log("Error in createOrUpdateHostFile: ", err);
    }
  }

  // async FindIpInToHostsFile(hostsfile: any, device: IHostDevice) {

  //   let flag: boolean = false
  //   for (let i = 0; i < hostsfile.length; i++) {
  //     //console.log(i + " -> " + hostsfile[i])
  //     if (device.ip == hostsfile[i].ip) {
  //       flag = true;
  //       if (device.host != hostsfile[i].host) {
  //         await this.UpdateRecordHostsFile(device, hostsfile[i].host)
  //       }
  //     }
  //   }
  //   if (flag == false) await this.InsertRecordHostsFile(device)
  // }

  async FindIpInToHostsFile(hostsfile: any, device: IHostDevice) {

    let flag: boolean = false
    for (let i = 0; i < hostsfile.length; i++) {
      //console.log(i + " -> " + hostsfile[i])
      if (device.ip == hostsfile[i].ip) {

        await this.UpdateRecordHostsFile(device, hostsfile[i].host)


        //await party.purge(hostsfile[0].host);
        //await party.remove([device.ip]);
        // await hostile.remove(device.ip, hostsfile[i].host, function (err: any) {
        //   if (err) {
        //     console.error(err)
        //   } else {
        //     console.log('set /etc/hosts successfully! 1')
        //   }
        // })
      }
    }
    await this.InsertRecordHostsFile(device)
  }

  async RawDataToArrayDevices(raw: any) {
    let temp: IHostDevice[] = raw
    return temp
  }

  async UpdateRecordHostsFile(device: IHostDevice, oldhostname: string) {
    await party.remove([device.ip]);
    // await hostile.remove(device.ip, oldhostname, function (err: any) {
    //   if (err) {
    //     console.error(err)
    //   } else {
    //     console.log('set /etc/hosts successfully!')
    //   }
    // })
    await this.InsertRecordHostsFile(device)
  }

  async InsertRecordHostsFile(device: IHostDevice) {
    await hostile.set(device.ip, device.host, function (err: any) {
      if (err) {
        console.error(err)
      } else {
        console.log('set /etc/hosts successfully!')
      }
    })



    // const { stdout, stderr } = await exec(` sudo //bin/ash -c 'ps axf | grep dnsmasq - 2.8 | grep - v grep | awk '{print $1}' '`);
    // const { stdout, stderr } = await exec(` //bin/ash -c 'export TEST=$(echo $(ps axf | grep dnsmasq-2.8 | grep -v grep | awk '{print $1}'))'`);
    // const { stdout, stderr } = await exec(`//bin/ash -c "TEST=$(echo $(ps axf | grep dnsmasq-2.8 | grep -v grep | awk '{print $1}'))" `);
    // console.log('RESOLV: stdout:', stdout);
    // console.log('RESOLV: stderr:', stderr);
    // const temp = await delay(1000);
    const { stdout2, stderr2 } = await exec(` /bin/ash -c 'kill -SIGHUP $(pidof dnsmasq)' `);
    console.log('RESOLV: stdout:', stdout2);
    console.log('RESOLV: stderr:', stderr2);
    // const { stdout1, stderr1 } = await exec(` //bin/ash -c "kill -SIGHUP $TEST" `);
    // console.log('RESOLV: stdout:', stdout1);
    // console.log('RESOLV: stderr:', stderr1);

  }

}


