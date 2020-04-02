#!/usr/bin/env node

const aws = require('aws-sdk');
const optionDefinitions = [
  { name: 'secret_name', type: String },
  { name: 'region', type: String, defaultValue: 'ap-northeast-1' },
]
const commandLineArgs = require('command-line-args');
const options = commandLineArgs(optionDefinitions);

const secretsManager = new aws.SecretsManager({region: options.region});


let result = secretsManager.getSecretValue({SecretId: options.secret_name}).promise();
result
.then(data =>  {
  return new Promise((resolve, reject) => {
    resolve(JSON.parse(data.SecretString));
    return;
  });
})
.then(secret => {
  return new Promise((resolve, reject) => {
    const params = {
      IncludeSpace: false,
      PasswordLength: 32,
    };
    secretsManager.getRandomPassword(params, (err, data) => {
      if (err) {
        reject(err);
        return;
      } else {
        resolve([secret, data.RandomPassword]);
        return;
      }
    });
  });
})
.then(values => {
  return new Promise((resolve, reject) => {
    const secret = values[0];
    console.log(secret);
    const newPassword = values[1];
    const newSecret = Object.assign({}, secret, {password: newPassword});
    console.log(newSecret);

    const params = {
      SecretId: options.secret_name,
      SecretString: JSON.stringify(newSecret),
    };
    secretsManager.putSecretValue(params, (err, data) => {
      if (err) {
        reject(err);
        return;
      } else {
        resolve(data);
        return;
      }
   });
  });
})
.then(value => {
  console.log('Success: ' + value);
})
.catch(value => {
  console.log('Failure: ' + value);
});
