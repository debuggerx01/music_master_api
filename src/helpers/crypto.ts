import * as crypto from "crypto";

export let verify = (
  content: string,
  signature: string,
  pubKey: string,
  algorith: string,
  inputEncoding: crypto.Utf8AsciiLatin1Encoding = "utf8",
  outputEncoding: crypto.HexBase64Latin1Encoding = "hex"
): boolean => {
  const verifier = crypto.createVerify(algorith);
  verifier.update(content, inputEncoding);
  return verifier.verify(pubKey, signature, outputEncoding);
};

export let sign = (
  content: string,
  privKey: string,
  algorith: string = "sha256",
  inputEncoding: crypto.Utf8AsciiLatin1Encoding = "utf8",
  outputEncoding: crypto.HexBase64Latin1Encoding = "hex"
): string => {
  const signer = crypto.createSign(algorith);
  signer.update(content, inputEncoding);
  return signer.sign(privKey, outputEncoding);
};

export let hash = (
  content: string,
  algorith: string = "md5",
  inputEncoding: crypto.Utf8AsciiLatin1Encoding = "utf8",
  outputEncoding: crypto.HexBase64Latin1Encoding = "hex"
): string => {
  const hash = crypto.createHash(algorith);
  hash.update(content, inputEncoding);
  return hash.digest(outputEncoding);
};
