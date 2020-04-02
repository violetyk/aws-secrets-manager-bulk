#!/usr/bin/env node

const aws = require('aws-sdk');
const optionDefinitions = [
  { name: 'region', type: String, defaultValue: 'ap-northeast-1' },
]
const commandLineArgs = require('command-line-args');
const options = commandLineArgs(optionDefinitions);

const secretsManager = new aws.SecretsManager({region: options.region});

const params = {
  // ExcludeLowercase: true,
  // ExcludeNumbers: true,
  // ExcludePunctuation: true,
  // ExcludeUppercase: true,
  IncludeSpace: false,
  PasswordLength: 32,
  // RequireEachIncludedType: true
};

 secretsManager.getRandomPassword(params, (err, data) => {
   if (err) console.log(err, err.stack);
   else     console.log(data.RandomPassword);
 });

