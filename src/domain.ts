enum MetadataType {
  POST = "post",
  SOCIAL = "social",
  MESSAGE = "msg",
}

interface Post {
  from: string;
  title: string;
  price: string;
  description: string;
  category: string;
  subcategory: string;
  location: string;
  sublocation: string;
  guid: string;
  ts?: number;
}

interface Social {
  from: string;
  parent: string;
  title: string;
  content: string;
  category: string;
  guid: string;
  ts?: number;
}

interface User {
  user: string;
  userinfo: string;
  stakeAddress: string;
  publicKey: string;
  ts?: number;
}

interface Message {
  guid: string;
  from: string;
  to: string;
  srcKey: string;
  dstKey: string;
  iv: string;
  message: string;
  ts?: number;
}

interface KeyPair {
  publicKey: string;
  privateKey: string;
}

interface EncryptedMessage {
  srcKey: string;
  dstKey: string;
  iv: string;
  message: string;
}

interface DbObject {
  _id: any;
  _rev: any;
}

interface DbPost extends DbObject {
  guid: string;
  from: string;
  message: string;
  category: string;
  ts: number;
}

interface DbSocial extends DbObject {
  guid: string;
  from: string;
  message: string;
  category: string;
  ts: number;
}

interface DbUser extends DbObject {
  user: string;
  stakeAddress: string;
  publicKey: string;
  privateKey: string;
}

interface DbMessage extends DbObject {
  guid: string;
  from: string;
  to: string;
  srcKey: string;
  dstKey: string;
  iv: string;
  message: string;
  ts: number;
}

interface DbSocialCategory extends DbObject {
  category: string;
  count: number;
}

interface DbCategory extends DbObject {
  category: string;
  count: number;
}

interface DbSubcategory extends DbObject {
  subcategory: string;
  count: number;
}

interface DbLocation extends DbObject {
  location: string;
  count: number;
}

interface DbSublocation extends DbObject {
  sublocation: string;
  count: number;
}
