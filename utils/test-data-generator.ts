import { faker } from '@faker-js/faker';

export function generateArticle() {
  return {
    title: `${faker.lorem.words(3)}-${faker.string.alphanumeric(5)}`, // unique suffix avoids slug collisions
    description: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(2),
    tags: [faker.word.noun(), faker.word.noun()],
  };
}

export function generateUserSettings() {
  return {
    bio: faker.lorem.sentence(),
    image: faker.image.avatarGitHub(), // or faker.image.url() if this method isn't available in your faker version
  };
}

export function generateInvalidUsername() {
  return ''; // matches the confirmed negative-case behavior: empty username, silently rejected
}