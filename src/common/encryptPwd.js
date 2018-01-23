import {setMaxDigits, RSAKeyPair, encryptedString} from 'common/rsaUtils.js'
let rsaEncrypt = function (exponent, modulus) {
    return function (password) {
        setMaxDigits(130);
        let key = new RSAKeyPair(exponent, '', modulus);
        return encryptedString(key, password);
    };
};
let encryptedPwd = rsaEncrypt('10001', '9d183e5918a188d09ead235a4c2dc54e5216281d4a72fa57d21cf736d445d60591ba794c201efcf3f98bb3553a314f84d6b4af92dd400da34c2d9ad65baca2e7b329bf5320fa2e5790f91ab79a492d0b75ce1a6fa60dc8ab5399dd7e61632284e42aee9b33596b06ee2c256d0ef819e6f64378d33d0d9cfd5fa4462880e1ebd9');
export default encryptedPwd;