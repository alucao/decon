// var PouchDB = require('pouchdb');
var PouchDB = require('pouchdb-browser').default;
// import pouchFind from 'pouchdb-find';
// PouchDB.plugin(pouchFind);
PouchDB.plugin(require('pouchdb-find').default);

let posts, socials, users, messages, guids, transactions, categories, subcategories, locations, sublocations, socialcategories, settings;

function initDatabase() {
  posts = new PouchDB('.pouchdb/posts');
  socials = new PouchDB('.pouchdb/socials');
  users = new PouchDB('.pouchdb/users');
  messages = new PouchDB('.pouchdb/messages');
  guids = new PouchDB('.pouchdb/guids');
  transactions = new PouchDB('.pouchdb/transactions');
  categories = new PouchDB('.pouchdb/categories');
  socialcategories = new PouchDB('.pouchdb/socialcategories');
  subcategories = new PouchDB('.pouchdb/subcategories');
  locations = new PouchDB('.pouchdb/locations');
  sublocations = new PouchDB('.pouchdb/sublocations');
  settings = new PouchDB('.pouchdb/settings');
}
initDatabase();

let database = {
  insertPost: function(postObj) {
    postObj._id = postObj.guid;
    return posts.put(postObj);
  },
  insertSocial: function(socialObj) {
    socialObj._id = socialObj.guid;
    return socials.put(socialObj);
  },

  insertUser: function(userObj) {
    userObj._id = userObj.user;
    return users.put(userObj);
  },
  findUserByName: async function(name) {
    let result = await users.find({
      selector: { user: name }
    });
    return result.docs[0];
  },
  findUserByStakeAddr: async function(addr) {
    let result = await users.find({
      selector: { stakeAddress: addr }
    });
    return result.docs[0];
  },

  insertMessage: function(obj) {
    obj._id = obj.guid;
    return messages.put(obj);
  },
 
  insertGuid: function(obj) {
    obj._id = obj.guid;
    return guids.put(obj);
  },
  findGuid: function(id) {
    return guids.get(id).catch(function (err) { });
  },

  insertTransaction: function(obj) {
    obj._id = obj.transactionId;
    return transactions.put(obj);
  },
  findTransaction: function(id) {
    return transactions.get(id).catch(function (err) { });
  },

  incrementCategory: async function(obj) {
    obj._id = obj.category;
    let oldObj = await categories.get(obj._id).catch(function (err) { });
    if (oldObj) {
      obj._rev = oldObj._rev;
      obj.count = oldObj.count + 1;
    }
    else obj.count = 1;
    return categories.put(obj);
  },
  incrementSocialCategory: async function(obj) {
    obj._id = obj.category;
    let oldObj = await socialcategories.get(obj._id).catch(function (err) { });
    if (oldObj) {
      obj._rev = oldObj._rev;
      obj.count = oldObj.count + 1;
    }
    else obj.count = 1;
    return socialcategories.put(obj);
  },
  incrementSubcategory: async function(obj) {
    obj._id = obj.subcategory;
    let oldObj = await subcategories.get(obj._id).catch(function (err) { });
    if (oldObj) {
      obj._rev = oldObj._rev;
      obj.count = oldObj.count + 1;
    }
    else obj.count = 1;
    return subcategories.put(obj);
  },
  incrementLocation: async function(obj) {
    obj._id = obj.location;
    let oldObj = await locations.get(obj._id).catch(function (err) { });
    if (oldObj) {
      obj._rev = oldObj._rev;
      obj.count = oldObj.count + 1;
    }
    else obj.count = 1;
    return locations.put(obj);
  },
  incrementSublocation: async function(obj) {
    obj._id = obj.sublocation;
    let oldObj = await sublocations.get(obj._id).catch(function (err) { });
    if (oldObj) {
      obj._rev = oldObj._rev;
      obj.count = oldObj.count + 1;
    }
    else obj.count = 1;
    return sublocations.put(obj);
  },

  listPosts: async function(category) {
    await posts.createIndex({
      index: {fields: ['ts']}
    });
    let result = await posts.find({
      selector: category ? { ts: {$gte: null}, category: category } : { ts: {$gte: null} },
      sort: ['ts'],
      limit: 100 
    });
    return result.docs;
  },

  listSocials: async function(category) {
    await socials.createIndex({
      index: {fields: ['ts']}
    });
    let result = await socials.find({
      selector: category ? { ts: {$gte: null}, category: category } : { ts: {$gte: null} },
      sort: ['ts'],
      limit: 100 
    });
    return result.docs;
  },

  listMessages: async function(user) {
    await messages.createIndex({
      index: {fields: ['ts']}
    });
    let result = await messages.find({
      selector: { ts: {$gte: null}, to: user },
      sort: ['ts'],
      limit: 100 
    });
    return result.docs;
  },

  listCategories: async function() {
    await categories.createIndex({
      index: {fields: ['count']}
    });
    let result = await categories.find({
      selector: { count: {$gte: null} },
      sort: ['count'],
      limit: 20
    });
    return result.docs;
  },

  listSocialCategories: async function() {
    await socialcategories.createIndex({
      index: {fields: ['count']}
    });
    let result = await socialcategories.find({
      selector: { count: {$gte: null} },
      sort: ['count'],
      limit: 20
    });
    return result.docs;
  },

  listSubcategories: async function() {
    await subcategories.createIndex({
      index: {fields: ['count']}
    });
    let result = await subcategories.find({
      selector: { count: {$gte: null} },
      sort: ['count'],
      limit: 20
    });
    return result.docs;
  },

  listLocations: async function() {
    await locations.createIndex({
      index: {fields: ['count']}
    });
    let result = await locations.find({
      selector: { count: {$gte: null} },
      sort: ['count'],
      limit: 20
    });
    return result.docs;
  },

  listSublocations: async function() {
    await sublocations.createIndex({
      index: {fields: ['count']}
    });
    let result = await sublocations.find({
      selector: { count: {$gte: null} },
      sort: ['count'],
      limit: 20
    });
    return result.docs;
  },

  insertSettings: async function(settingsObj) {
    settingsObj._id = "settings";

    let oldObj = await settings.get(settingsObj._id).catch(function (err) { });
    if (oldObj) {
      settingsObj._rev = oldObj._rev;
    }
    return settings.put(settingsObj, {force: true});
  },

  findSettings: async function() {
    let dbSettings = await settings.get("settings").catch(function (err) { });
    return dbSettings;
  },

  clearDatabase: async function() {
    const savedSettings = await this.findSettings()
    console.log(savedSettings)
    console.log("Deleting db...")
    Promise.all([
      posts.destroy(),
      socials.destroy(),
      users.destroy(),
      messages.destroy(),
      guids.destroy(),
      transactions.destroy(),
      categories.destroy(),
      socialcategories.destroy(),
      subcategories.destroy(),
      locations.destroy(),
      sublocations.destroy(),
      settings.destroy(),
    ]).then(() => {
      console.log("Starting db...")
      initDatabase()
      database.insertSettings(savedSettings)
    });
  }
};

module.exports = {
  getDb: function () {
    return database;
  },
};
