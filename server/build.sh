#!/usr/bin/env bash -ue
source ~/.bash_profile

find_in_conda_env(){
    conda env list | grep ".*${@}.*" >/dev/null 2>/dev/null
}

if find_in_conda_env $(git rev-parse --show-toplevel) ; then
    #  conda activate $(conda env list | grep ".*RUN_ENV.*" | awk '{print $1}')
    echo "found"
else
    echo "not found"
    # conda create python=3.10 --prefix ../.conda -y
    # conda activate $(conda env list | grep ".*RUN_ENV.*" | awk '{print $1}')
fi

cd $(git rev-parse --show-toplevel)
rm -rf app/server
mkdir -p app/server
cd server
poetry install
poetry export -f requirements.txt --without-hashes -o requirements.txt
pyoxidizer build --release
cp -r build/*/release/install/* ../app/server/
