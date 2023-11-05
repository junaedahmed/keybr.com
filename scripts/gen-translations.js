"use strict";

const { compile, extract } = require("@formatjs/cli-lib");
const { globSync } = require("glob");
const { join } = require("node:path");
const { readJsonSync, writeJsonSync } = require("./lib/fs.js");
const { getHashDigest } = require("./lib/message-id.js");
const { rootDir, findPackages } = require("./root.js");

const packageDir = join(rootDir, "packages/keybr-intl");

const allLocales = ["de", "en", "es", "fr", "pl", "ru", "uk"];

const defaultLocale = "en";

function findSourceFiles() {
  const files = [];
  for (const packageDirectory of findPackages()) {
    for (const file of globSync(["lib/**/*.@(ts|tsx)"], {
      cwd: packageDirectory,
      absolute: true,
      ignore: ["**/*.d.ts", "**/test/*", "**/*.test.*"],
    })) {
      files.push(file);
    }
  }
  files.sort();
  return files;
}

async function extractTranslations() {
  const defaultTranslationsFile = translationsPath(defaultLocale);
  const defaultTranslations = JSON.parse(
    await extract(findSourceFiles(), {
      additionalFunctionNames: [],
      additionalComponentNames: [],
      preserveWhitespace: true,
    }),
  );
  writeJsonSync(
    defaultTranslationsFile,
    remap(defaultTranslations, ([id, { defaultMessage }]) => [
      id,
      defaultMessage,
    ]),
  );
}

async function syncTranslations() {
  const defaultTranslationsFile = translationsPath(defaultLocale);
  const defaultTranslations = readJsonSync(defaultTranslationsFile);
  for (const locale of allLocales) {
    if (locale === defaultLocale) {
      continue;
    }
    const translationsFile = translationsPath(locale);
    const translations = readJsonSync(translationsFile);
    writeJsonSync(
      translationsFile,
      remap(defaultTranslations, ([id, message]) => [
        id,
        translations[id] ?? message,
      ]),
    );
  }
}

async function compileMessages() {
  const format = {
    compile: (translations) => {
      return remap(translations, ([id, message]) => [
        getHashDigest(id),
        message,
      ]);
    },
  };

  for (const locale of allLocales) {
    const translationsFile = translationsPath(locale);
    const messagesFile = messagesPath(locale);
    const messages = JSON.parse(
      await compile([translationsFile], {
        ast: true,
        format,
      }),
    );
    writeJsonSync(messagesFile, messages, null);
  }
}

async function run() {
  await extractTranslations();
  await syncTranslations();
  await compileMessages();
}

function remap(entries, callback) {
  return Object.fromEntries(Object.entries(entries).map(callback));
}

function translationsPath(locale) {
  return join(packageDir, `translations/${locale}.json`);
}

function messagesPath(locale) {
  return join(packageDir, `lib/messages/${locale}.json`);
}

run().catch((err) => {
  console.error(err);
});
