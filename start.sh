#!/bin/bash

(cd hbt-mainscreen && yarn build)
(cd hbt-server && yarn tsc && NODE_ENV=prod node build/index.js)
