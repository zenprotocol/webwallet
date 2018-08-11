This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

# Developing
```bash
$ git clone git@github.com:zenprotocol/webwallet.git
$ cd webwallet
$ yarn install
$ yarn start
```

# Updating zenjs
It's best to update the zen node and commit ONLY that change, to make it easy to trace in the repo's graph
```bash
$ npm install --save @zen/zenjs
$ git commit -am "update zenjs x.xx.xx"
$ git push # after QA!
```

# Releasing a new Version