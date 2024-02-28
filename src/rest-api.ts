import NinjaConfig from './ninjaConfig';

import { getCategories } from './api/categories';
import { getSocialCategories } from './api/socialcategories';
import { getConfig } from './api/config';
import { getLocations } from './api/locations';
import { getMessages } from './api/messages';
import { getPosts } from './api/posts';
import { getSocials } from './api/socials';
import { getSubcategories } from './api/subcategories';
import { getSublocations } from './api/sublocations';
import { getUser } from './api/users';

async function fetchConfig() {
  const data = await getConfig();
  return data;
}

async function fetchUser(username: string) {
  console.log("fetching user")
  console.log(username)
  const data = await getUser(username);
  return data;
}

async function fetchUserByStakeAddr(stakeAddress: string) {
  const data = await getUser(undefined, stakeAddress);
  return data;
}

async function fetchPosts(query: string|null) {
  const data = await getPosts();
  return data;
}

async function fetchSocials(query: string|null) {
  const data = await getSocials();
  return data;
}

async function fetchMessages(user: string) {
  const data = await getMessages(user);
  console.log('Messages: ' + data);
  return data;
}

async function fetchCategories() {
  const data = await getCategories();
  return data;
}

async function fetchSocialCategories() {
  const data = await getSocialCategories();
  return data;
}

async function fetchSubcategories() {
  const data = await getSubcategories();
  return data;
}

async function fetchLocations() {
  const data = await getLocations();
  return data;
}

async function fetchSublocations() {
  const data = await getSublocations();
  return data;
}

export { fetchConfig, fetchUserByStakeAddr, fetchUser, fetchPosts, fetchSocials, fetchMessages, fetchCategories, fetchSocialCategories, fetchSubcategories, fetchLocations, fetchSublocations }
