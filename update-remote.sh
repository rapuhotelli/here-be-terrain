#!/bin/bash

tar -zcvf bundle.tgz hbt-server
scp bundle.tgz pi@192.168.1.111
