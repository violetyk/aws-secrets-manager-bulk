#!/usr/bin/env node

const aws = require('aws-sdk');
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const sprintf = require('sprintf-js').sprintf;
const optionDefinitions = [
  { name: 'path', type: String },
  { name: 'force', type: Boolean },
  { name: 'region', type: String, defaultValue: 'ap-northeast-1' },
]
const commandLineArgs = require('command-line-args');
const options = commandLineArgs(optionDefinitions);

const secretsManager = new aws.SecretsManager({region: options.region});

glob(options.path, (er, files) => {
  files.forEach(file => {
    const full_path = path.resolve(file);
    const secrets_path = path.resolve('./secrets/');
    const name = full_path.substring(
      secrets_path.length + 1,
      full_path.length - path.extname(full_path).length
    );

    secretsManager.getSecretValue({SecretId: name}, (err, data) => {
      if (err) {
        if (err.code === 'ResourceNotFoundException') {
          secretsManager.createSecret({
              Name: name,
              SecretString: fs.readFileSync(file).toString(),
          }, (err, data) => {
            if (err) console.log(err, err.stack);
            else console.log(data);
          });
        }
      } else {
        if (!options.force) {
          console.log(sprintf('%s : already exists.', name));
        } else {
          secretsManager.putSecretValue({
              SecretId: name,
              SecretString: fs.readFileSync(file).toString(),
          }, (err, data) => {
            if (err) console.log(err, err.stack);
            else console.log(data);
          });
        }
      }
    });
  });
});
