#!/usr/bin/env node

const aws = require('aws-sdk');
const optionDefinitions = [
  { name: 'region', type: String, defaultValue: 'ap-northeast-1' },
]
const commandLineArgs = require('command-line-args');
const options = commandLineArgs(optionDefinitions);

const secretsManager = new aws.SecretsManager({region: options.region});

const params = {
  RequireEachIncludedType: true, // 大小数字記号を必ず含む
  ExcludeCharacters: "/@\"\'\\", // 特定の文字を除外
  // ExcludePunctuation: true, // 記号を除外
  IncludeSpace: false,
  PasswordLength: 32,
};


 secretsManager.getRandomPassword(params, (err, data) => {
   if (err) console.log(err, err.stack);
   else     console.log(data.RandomPassword);
 });

