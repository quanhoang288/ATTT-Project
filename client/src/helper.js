import {RSAKey} from 'cryptico';

export const RSAParse = (rsaString) => {
    var json = JSON.parse(rsaString);
    var rsa = new RSAKey();

    rsa.setPrivateEx(json.n, json.e, json.d, json.p, json.q, json.dmp1, json.dmq1, json.coeff);

    return rsa;
}