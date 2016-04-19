#!/bin/sh

rm  ${1}_*

cd ${1}-1.0
dch -i
dpkg-buildpackage -uc -tc
